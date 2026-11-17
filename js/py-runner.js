// js/py-runner.js
// 主线程对 Pyodide Worker 的封装：负责加载、运行、超时保护（死循环时终止并重建）。
(function () {
  'use strict';

  // 本文件以普通 script 加载，不能用 import.meta.url；用 document.currentScript 解析自身位置
  var scriptSrc = document.currentScript && document.currentScript.src
    ? document.currentScript.src
    : new URL('js/py-runner.js', document.baseURI).href;
  var WORKER_URL = new URL('py-runner.worker.js', scriptSrc).href;
  const LOAD_TIMEOUT_MS = 60000; // 首次加载约 9MB（wasm + stdlib），弱网放宽到 60 秒

  class PyRunner {
    constructor() {
      this.worker = null;
      this.ready = false;
      this.loadError = null;
      this.pending = null; // 当前进行中的运行 {resolve, reject}
      this.initPromise = null;
      this._readyResolve = null;
      this._readyReject = null;
      this._timeout = null;
      this._loadTimeout = null;
    }

    _spawn() {
      this.worker = new Worker(WORKER_URL, { type: 'module' });
      this.worker.onmessage = (e) => this._onMessage(e);
      this.worker.onerror = (e) => this._onError(e);
      this.worker.postMessage({ type: 'init' });

      // 加载超时保护：超时后销毁 worker 并给出可操作的提示
      this._loadTimeout = setTimeout(() => {
        if (!this.ready) {
          this._destroyWorker();
          const msg =
            'Python 运行环境加载超时。请检查网络能否访问 fastly.jsdelivr.net，或稍后刷新重试。';
          this.loadError = msg;
          if (this._readyReject && !this.ready) this._readyReject(new Error(msg));
          this.initPromise = null;
        }
      }, LOAD_TIMEOUT_MS);
    }

    ensureReady() {
      if (this.ready) return Promise.resolve();
      if (this.loadError) return Promise.reject(new Error(this.loadError));
      if (this.initPromise) return this.initPromise;
      this.initPromise = new Promise((resolve, reject) => {
        this._readyResolve = resolve;
        this._readyReject = reject;
        try {
          this._spawn();
        } catch (e) {
          reject(new Error('无法启动 Python 运行环境：' + (e.message || e)));
        }
      });
      return this.initPromise;
    }

    _onMessage(e) {
      const msg = e.data;
      if (msg.type === 'ready') {
        this.ready = true;
        if (this._loadTimeout) {
          clearTimeout(this._loadTimeout);
          this._loadTimeout = null;
        }
        if (this._readyResolve) this._readyResolve();
        return;
      }
      if (msg.type === 'load-error') {
        this.loadError = this._friendlyError(msg.error);
        if (this._loadTimeout) {
          clearTimeout(this._loadTimeout);
          this._loadTimeout = null;
        }
        if (this._readyReject && !this.ready) this._readyReject(new Error(this.loadError));
        this.initPromise = null;
        if (this.pending) {
          const p = this.pending;
          this.pending = null;
          p.reject(new Error(this.loadError));
        }
        return;
      }
      if (msg.type === 'result') {
        if (this.pending) {
          const p = this.pending;
          this.pending = null;
          if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
          }
          if (msg.ok) {
            p.resolve({ stdout: msg.stdout || '', error: msg.error || '' });
          } else {
            p.reject(new Error(msg.error || '运行出错'));
          }
        }
      }
    }

    _friendlyError(raw) {
      const s = String(raw || '');
      if (/fetch|network|Failed to load|import|module/i.test(s)) {
        return 'Python 运行环境下载失败。请确认能访问 fastly.jsdelivr.net，并检查浏览器控制台的网络错误。';
      }
      return 'Python 运行环境加载失败：' + s;
    }

    _onError(e) {
      const message = this._friendlyError(
        e && (e.message || e.filename) ? e.message : 'Worker 脚本加载失败'
      );
      this.loadError = message;
      if (this._loadTimeout) {
        clearTimeout(this._loadTimeout);
        this._loadTimeout = null;
      }
      if (this._readyReject && !this.ready) this._readyReject(new Error(message));
      this.initPromise = null;
      if (this.pending) {
        const p = this.pending;
        this.pending = null;
        p.reject(new Error(message));
      }
    }

    run(code, opts) {
      opts = opts || {};
      const stdin = opts.stdin || [];
      const timeoutMs = opts.timeoutMs || 8000;
      return this.ensureReady().then(
        () =>
          new Promise((resolve, reject) => {
            if (!this.worker || this.loadError) {
              reject(new Error(this.loadError || '运行环境不可用'));
              return;
            }
            this.pending = { resolve, reject };
            this.worker.postMessage({ type: 'run', code, stdin });
            this._timeout = setTimeout(() => this._onTimeout(), timeoutMs);
          })
      );
    }

    _onTimeout() {
      const err = new Error('运行超时：可能存在死循环，运行环境已重置，请重试。');
      if (this.pending) {
        const p = this.pending;
        this.pending = null;
        p.reject(err);
      }
      // 只重置运行状态，不销毁整个 worker（Pyodide 实例仍然可用）
      if (this._timeout) {
        clearTimeout(this._timeout);
        this._timeout = null;
      }
    }

    _destroyWorker() {
      if (this._timeout) {
        clearTimeout(this._timeout);
        this._timeout = null;
      }
      if (this._loadTimeout) {
        clearTimeout(this._loadTimeout);
        this._loadTimeout = null;
      }
      if (this.worker) {
        this.worker.terminate();
        this.worker = null;
      }
      this.ready = false;
    }

    isAvailable() {
      return !this.loadError;
    }
  }

  window.PyRunner = new PyRunner();
})();
