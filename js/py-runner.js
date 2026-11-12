// js/py-runner.js
// 主线程对 Pyodide Worker 的封装：负责加载、运行、超时保护（死循环时终止并重建）。
(function () {
  'use strict';

  const WORKER_URL = 'js/py-runner.worker.js';

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
    }

    _spawn() {
      this.worker = new Worker(WORKER_URL, { type: 'module' });
      this.worker.onmessage = (e) => this._onMessage(e);
      this.worker.onerror = (e) => this._onError(e);
      this.worker.postMessage({ type: 'init' });
    }

    ensureReady() {
      if (this.ready) return Promise.resolve();
      if (this.initPromise) return this.initPromise;
      this.initPromise = new Promise((resolve, reject) => {
        this._readyResolve = resolve;
        this._readyReject = reject;
        try {
          this._spawn();
        } catch (e) {
          reject(e);
        }
      });
      return this.initPromise;
    }

    _onMessage(e) {
      const msg = e.data;
      if (msg.type === 'ready') {
        this.ready = true;
        if (this._readyResolve) this._readyResolve();
        return;
      }
      if (msg.type === 'load-error') {
        this.loadError = msg.error;
        if (this._readyReject && !this.ready) this._readyReject(new Error(msg.error));
        if (this.pending) {
          const p = this.pending;
          this.pending = null;
          p.reject(new Error(msg.error));
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

    _onError(e) {
      const message =
        (e && (e.message || e.filename)) ? e.message : 'Pyodide 运行环境加载失败（可能是网络问题）';
      this.loadError = message;
      if (this._readyReject && !this.ready) this._readyReject(new Error(message));
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
      const err = new Error('运行超时：可能存在死循环');
      if (this.pending) {
        const p = this.pending;
        this.pending = null;
        p.reject(err);
      }
      this._destroyWorker();
      this.ready = false;
      this.initPromise = null;
    }

    _destroyWorker() {
      if (this._timeout) {
        clearTimeout(this._timeout);
        this._timeout = null;
      }
      if (this.worker) {
        this.worker.terminate();
        this.worker = null;
      }
    }

    isAvailable() {
      return !this.loadError;
    }
  }

  window.PyRunner = new PyRunner();
})();
