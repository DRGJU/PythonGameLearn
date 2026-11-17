// js/py-runner.worker.js
// 在与主线程隔离的 Web Worker 中加载 Pyodide，真实运行用户 Python 代码。
// 通过自定义 input() 支持 stdin；通过 setStdout 捕获 stdout。
//
// 注意：jsDelivr 主站在部分网络（尤其国内）不可达，默认用 fastly.jsdelivr.net 同源镜像；
// 若该镜像失败，自动回退到官方 cdn.jsdelivr.net。二者内容一致。
const CDN_SOURCES = [
  'https://fastly.jsdelivr.net/pyodide/v0.27.2/full/',
  'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/',
];

let pyodide = null;
let busy = false;
let captured = '';

async function init() {
  if (pyodide) return;
  let lastError = null;
  for (const base of CDN_SOURCES) {
    try {
      const { loadPyodide } = await import(/* @vite-ignore */ base + 'pyodide.mjs');
      pyodide = await loadPyodide({ indexURL: base });
      break;
    } catch (err) {
      lastError = err;
      console.warn('Pyodide 源加载失败，尝试备用源：' + base, err);
    }
  }
  if (!pyodide) throw lastError || new Error('所有 Pyodide 源均不可用');
  pyodide.setStdout({
    batched: (s) => {
      captured += s;
    },
  });
  self.postMessage({ type: 'ready' });
}

// 每次运行前注入自定义 input()：从 __stdin_lines 队列取行。
// 用户代码与 input() 共用同一 globals，否则 __stdin_lines 不可见。
const INPUT_SETUP = `
import builtins
def __custom_input(prompt=''):
    if '__stdin_lines' in globals() and globals()['__stdin_lines']:
        return globals()['__stdin_lines'].pop(0)
    raise EOFError('没有更多输入')
builtins.input = __custom_input
`;

self.onmessage = async (e) => {
  const msg = e.data;

  if (msg.type === 'init') {
    try {
      await init();
    } catch (err) {
      self.postMessage({
        type: 'load-error',
        error: String((err && err.message) || err),
      });
    }
    return;
  }

  if (msg.type === 'run') {
    if (!pyodide) {
      self.postMessage({ type: 'result', ok: false, stdout: '', error: 'Pyodide 尚未就绪' });
      return;
    }
    if (busy) {
      self.postMessage({ type: 'result', ok: false, stdout: '', error: '上一次运行尚未结束' });
      return;
    }
    busy = true;
    captured = '';
    const code = msg.code || '';
    const stdin = Array.isArray(msg.stdin) ? msg.stdin.slice() : [];
    try {
      const g = pyodide.globals;
      g.set('__stdin_lines', stdin);
      await pyodide.runPythonAsync(INPUT_SETUP, { globals: g });
      await pyodide.runPythonAsync(code, { globals: g });
      self.postMessage({ type: 'result', ok: true, stdout: captured, error: '' });
    } catch (err) {
      const error = String(err && err.message ? err.message : err);
      self.postMessage({ type: 'result', ok: false, stdout: captured, error });
    } finally {
      busy = false;
    }
  }
};
