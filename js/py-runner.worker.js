// js/py-runner.worker.js
// 在与主线程隔离的 Web Worker 中加载 Pyodide，真实运行用户 Python 代码。
// 通过自定义 input() 支持 stdin；通过 setStdout 捕获 stdout。
import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.mjs';

const INDEX_URL = 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/';

let pyodide = null;
let busy = false;
let captured = '';

async function init() {
  if (pyodide) return;
  pyodide = await loadPyodide({ indexURL: INDEX_URL });
  pyodide.setStdout({
    batched: (s) => {
      captured += s;
    },
  });
  self.postMessage({ type: 'ready' });
}

// 每次运行前注入自定义 input()，从 __stdin_lines 队列里取行
const INPUT_SETUP = `
import builtins
def __custom_input(prompt=''):
    if __stdin_lines:
        return __stdin_lines.pop(0)
    raise EOFError('没有更多输入')
builtins.input = __custom_input
`;

self.onmessage = async (e) => {
  const msg = e.data;

  if (msg.type === 'init') {
    try {
      await init();
    } catch (err) {
      self.postMessage({ type: 'load-error', error: String((err && err.message) || err) });
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
      pyodide.globals.set('__stdin_lines', stdin);
      await pyodide.runPythonAsync(INPUT_SETUP);
      const ns = pyodide.toPy({});
      await pyodide.runPythonAsync(code, { globals: ns });
      self.postMessage({ type: 'result', ok: true, stdout: captured, error: '' });
    } catch (err) {
      const error = String((err && err.message) ? err.message : err);
      self.postMessage({ type: 'result', ok: false, stdout: captured, error });
    } finally {
      busy = false;
    }
  }
};
