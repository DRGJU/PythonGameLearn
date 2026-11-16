/**
 * 课时页引擎：渲染系统化教程 + 文末巩固练习。
 *
 * 答题方式优化要点：
 *  - 改错题干不泄露答案，答案讲解移入「解析」区
 *  - 每类练习提供 3 级渐进提示（方向 → 要点 → 原理）
 *  - 运行/改错显示「期望输出 vs 实际输出」逐行差异，定位首个不同行
 *  - 预测选项随机排列；配对项改为可聚焦按钮，支持键盘与错误项标注
 *  - 练习只给诊断反馈，不自动跳课、不弹胜利提示
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'pycourse:completed';

  var state = {
    data: null, lesson: null, id: 1,
    predictAnswered: false, predictOrder: [],
    matchPairs: [], matchLeft: [], matchRight: [], matchMapping: {}, matchSelectedLeft: null,
    hintLevel: { run: 0, predict: 0, debug: 0, match: 0 },
  };

  function el(id) { return document.getElementById(id); }

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = String(s == null ? '' : s);
    return d.innerHTML;
  }

  function norm(s) {
    return String(s)
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map(function (l) { return l.replace(/\s+$/, ''); })
      .join('\n')
      .replace(/\n+$/, '');
  }

  function setFeedback(node, kind, text) {
    if (!node) return;
    node.className = 'feedback' + (kind ? ' ' + kind : '');
    node.textContent = text || '';
  }

  function readCompleted() {
    try {
      var obj = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return obj && typeof obj === 'object' ? obj : {};
    } catch (e) { return {}; }
  }

  function writeCompleted(obj) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch (e) {}
  }


  function getLessonId() {
    var m = new URLSearchParams(window.location.search).get('lesson');
    var n = parseInt(m, 10);
    return Number.isFinite(n) && n >= 1 ? n : 1;
  }

  /* ===================== 教程渲染 ===================== */

  function renderHeader() {
    var l = state.lesson;
    document.title = '第 ' + l.id + ' 节 · ' + l.title + ' | Python 系统化课程';
    el('lesson-heading').textContent = l.title;
    el('lesson-subtitle').textContent = '第 ' + l.chapterId + ' 章 · ' + l.chapterTitle;
    el('stat-minutes').textContent = l.minutes;
    el('stat-examples').textContent = l.blocks.filter(function (b) { return b.type === 'code'; }).length;
    el('stat-chapter').textContent = l.chapterId;
    el('level-nav-current').textContent = '第 ' + l.id + ' 节 / 共 ' + state.data.lessons.length + ' 节';

    var prev = el('level-nav-prev');
    var next = el('level-nav-next');
    prev.href = l.id > 1 ? 'level.html?lesson=' + (l.id - 1) : 'index.html';
    next.href = l.id < state.data.lessons.length ? 'level.html?lesson=' + (l.id + 1) : 'index.html';
    prev.setAttribute('aria-label', l.id > 1 ? '上一节' : '返回课程大纲');
    next.setAttribute('aria-label', l.id < state.data.lessons.length ? '下一节' : '返回课程大纲');

    el('lesson-header').innerHTML =
      '<div class="lesson-hero">' +
        '<span class="level-phase-badge">第 ' + l.chapterId + ' 章 · ' + escapeHtml(l.chapterTitle) + '</span>' +
        '<h2 class="lesson-title">' + escapeHtml(l.title) + '</h2>' +
        '<div class="lesson-meta"><span>' + l.minutes + ' 分钟</span><span>' + escapeHtml(l.category) + '</span></div>' +
        '<div class="learning-objectives"><h3>本节目标</h3><ul>' +
          l.objectives.map(function (o) { return '<li>' + escapeHtml(o) + '</li>'; }).join('') +
        '</ul></div>' +
      '</div>';
  }

  function renderLead(b) {
    return '<p class="lesson-lead">' + escapeHtml(b.text) + '</p>';
  }

  function renderProse(b) {
    return '<section class="lesson-section">' +
      '<h3 class="lesson-section__title">' + escapeHtml(b.title) + '</h3>' +
      b.paras.map(function (p) { return '<p class="lesson-p">' + escapeHtml(p) + '</p>'; }).join('') +
      '</section>';
  }

  function renderCode(b) {
    var out = '';
    if (b.output != null) {
      out = '<div class="code-output"><span class="code-output__label">运行结果</span><pre>' + escapeHtml(b.output) + '</pre></div>';
    }
    var notes = (b.explain || []).map(function (n) { return '<li>' + escapeHtml(n) + '</li>'; }).join('');
    return '<figure class="lesson-figure">' +
      '<figcaption class="lesson-figure__title">' + escapeHtml(b.title) + '</figcaption>' +
      '<pre class="code-example"><code>' + escapeHtml(b.code) + '</code></pre>' +
      out +
      (notes ? '<ol class="code-notes">' + notes + '</ol>' : '') +
      '</figure>';
  }

  function renderTable(b) {
    return '<section class="lesson-section">' +
      '<h3 class="lesson-section__title">' + escapeHtml(b.title) + '</h3>' +
      '<div class="table-scroll"><table class="lesson-table"><thead><tr>' +
        b.head.map(function (h) { return '<th>' + escapeHtml(h) + '</th>'; }).join('') +
      '</tr></thead><tbody>' +
        b.rows.map(function (r) {
          return '<tr>' + r.map(function (c) { return '<td>' + escapeHtml(c) + '</td>'; }).join('') + '</tr>';
        }).join('') +
      '</tbody></table></div></section>';
  }

  function renderPitfalls(b) {
    return '<section class="lesson-section pitfalls">' +
      '<h3 class="lesson-section__title">' + escapeHtml(b.title) + '</h3>' +
      '<div class="pitfall-list">' + b.items.map(function (it) {
        return '<div class="pitfall">' +
          '<p class="pitfall__wrong"><span>错误写法</span><code>' + escapeHtml(it.wrong) + '</code></p>' +
          '<p class="pitfall__why"><span>原因</span>' + escapeHtml(it.why) + '</p>' +
          '<p class="pitfall__right"><span>正确做法</span>' + escapeHtml(it.right) + '</p>' +
        '</div>';
      }).join('') + '</div></section>';
  }

  function renderSummary(b) {
    return '<section class="lesson-section summary">' +
      '<h3 class="lesson-section__title">' + escapeHtml(b.title) + '</h3>' +
      '<ul class="summary-list">' + b.items.map(function (i) { return '<li>' + escapeHtml(i) + '</li>'; }).join('') + '</ul>' +
      '</section>';
  }

  function renderReview(b) {
    return '<section class="lesson-section review">' +
      '<h3 class="lesson-section__title">' + escapeHtml(b.title) + '</h3>' +
      b.paras.map(function (p) { return '<p class="lesson-p">' + escapeHtml(p) + '</p>'; }).join('') +
      '</section>';
  }

  var RENDERERS = {
    lead: renderLead, prose: renderProse, code: renderCode, table: renderTable,
    pitfalls: renderPitfalls, summary: renderSummary, review: renderReview,
  };

  function renderBody() {
    el('lesson-body').innerHTML = state.lesson.blocks.map(function (b) {
      var fn = RENDERERS[b.type];
      return fn ? fn(b) : '';
    }).join('');
  }

  function renderToc() {
    var l = state.lesson;
    var list = state.data.lessons.filter(function (x) { return x.chapterId === l.chapterId; });
    el('toc-list').innerHTML = list.map(function (x) {
      return '<a class="toc-item' + (x.id === l.id ? ' active' : '') + '" href="level.html?lesson=' + x.id + '">' +
        '<span class="toc-item__no">' + x.id + '</span>' +
        '<span class="toc-item__title">' + escapeHtml(x.title) + '</span></a>';
    }).join('');
  }

  /* ===================== 差异诊断 ===================== */

  /** 逐行对比期望与实际，标出首个不同行；纯展示，不泄露修改方法 */
  function renderDiff(node, expected, actual, hasError) {
    if (!node) return;
    if (hasError) {
      node.hidden = false;
      node.className = 'diff-panel is-error';
      node.innerHTML = '<p class="diff-panel__note">程序未正常结束，无法比对输出。请先看运行错误。</p>';
      return;
    }
    if (norm(expected) === norm(actual)) {
      node.hidden = true;
      node.innerHTML = '';
      return;
    }
    var e = norm(expected).split('\n');
    var a = norm(actual).split('\n');
    var rows = [];
    var first = -1;
    var n = Math.max(e.length, a.length);
    for (var i = 0; i < n; i += 1) {
      var ok = e[i] === a[i];
      if (!ok && first < 0) first = i + 1;
      rows.push(
        '<li class="diff-row' + (ok ? '' : ' is-diff') + '">' +
          '<span class="diff-row__no">' + (i + 1) + '</span>' +
          '<span class="diff-row__exp">' + escapeHtml(e[i] == null ? '（无此行）' : e[i]) + '</span>' +
          '<span class="diff-row__act">' + escapeHtml(a[i] == null ? '（无此行）' : a[i]) + '</span>' +
        '</li>'
      );
    }
    node.hidden = false;
    node.className = 'diff-panel';
    node.innerHTML =
      '<p class="diff-panel__note">首个不一致在第 <strong>' + first + '</strong> 行。逐行检查字符、空格与标点。</p>' +
      '<div class="diff-head"><span>行</span><span>期望输出</span><span>实际输出</span></div>' +
      '<ul class="diff-rows">' + rows.join('') + '</ul>';
  }

  function clearDiff(node) {
    if (!node) return;
    node.hidden = true;
    node.className = 'diff-panel';
    node.innerHTML = '';
  }

  /* ===================== 提示与解析 ===================== */

  function renderPracticeTools(mode) {
    var host = document.querySelector('[data-mode-tools="' + mode + '"]');
    if (!host) return;
    var meta = state.lesson.practice.meta;
    var hints = meta.hints || [];
    var exp = (meta.explanations || {})[mode] || '';
    state.hintLevel[mode] = 0;

    host.innerHTML =
      '<div class="practice-tools__row">' +
        '<button class="tool-button" type="button" data-tool="hint" data-mode="' + mode + '">查看提示</button>' +
        '<button class="tool-button" type="button" data-tool="solution" data-mode="' + mode + '">查看解析</button>' +
        '<span class="tool-status" data-tool-status="' + mode + '"></span>' +
      '</div>' +
      '<div class="hint-box" data-hint-box="' + mode + '" hidden></div>' +
      '<div class="solution-box" data-solution-box="' + mode + '" hidden>' +
        '<p>' + escapeHtml(exp) + '</p>' +
        (meta.review && meta.review[mode === 'match' ? 3 : mode === 'predict' ? 1 : mode === 'debug' ? 2 : 0]
          ? '<p class="solution-box__extra">' + escapeHtml(meta.review[mode === 'match' ? 3 : mode === 'predict' ? 1 : mode === 'debug' ? 2 : 0]) + '</p>'
          : '') +
      '</div>';

    host.querySelector('[data-tool="hint"]').addEventListener('click', function () {
      var box = host.querySelector('[data-hint-box="' + mode + '"]');
      if (state.hintLevel[mode] >= hints.length) {
        box.hidden = true;
        state.hintLevel[mode] = 0;
        host.querySelector('[data-tool-status="' + mode + '"]').textContent = '';
        return;
      }
      state.hintLevel[mode] += 1;
      box.hidden = false;
      box.innerHTML = hints.slice(0, state.hintLevel[mode]).map(function (h, i) {
        return '<p class="hint-box__item"><span>第 ' + (i + 1) + ' 级</span>' + escapeHtml(h) + '</p>';
      }).join('');
      var status = host.querySelector('[data-tool-status="' + mode + '"]');
      status.textContent = state.hintLevel[mode] >= hints.length ? '提示已全部展开' : '';
      host.querySelector('[data-tool="hint"]').textContent =
        state.hintLevel[mode] >= hints.length ? '收起提示' : '下一级提示';
    });

    host.querySelector('[data-tool="solution"]').addEventListener('click', function (e) {
      var box = host.querySelector('[data-solution-box="' + mode + '"]');
      box.hidden = !box.hidden;
      e.currentTarget.setAttribute('aria-expanded', String(!box.hidden));
    });
    host.querySelector('[data-tool="solution"]').setAttribute('aria-expanded', 'false');
  }

  function markToolDone(mode) {
    var status = document.querySelector('[data-tool-status="' + mode + '"]');
    if (status) status.textContent = '已验证通过';
  }

  /* ===================== 练习：Pyodide 与四类模式 ===================== */

  function showRunOutput(node, stdout, error) {
    if (error) {
      node.className = 'run-output error';
      node.textContent = '⚠️ ' + error;
    } else if (stdout && stdout.trim() !== '') {
      node.className = 'run-output show';
      node.textContent = stdout;
    } else {
      node.className = 'run-output show';
      node.textContent = '（程序没有输出）';
    }
  }

  function warmupPy() {
    var status = el('py-status');
    if (!window.PyRunner) return;
    status.hidden = false;
    status.className = 'py-status loading';
    status.textContent = '正在加载 Python 运行环境（首次稍慢）…';
    window.PyRunner.ensureReady()
      .then(function () { status.hidden = true; })
      .catch(function () {
        status.hidden = false;
        status.className = 'py-status error';
        status.textContent = '⚠️ Python 运行环境加载失败，运行/改错类练习需联网；预测与配对不受影响，可刷新重试。';
      });
  }

  function runWithPy(code, stdin) {
    if (!window.PyRunner) return Promise.reject(new Error('运行环境不可用'));
    return window.PyRunner.run(code, { stdin: stdin || [] });
  }

  function renderPractice() {
    var p = state.lesson.practice;

    el('run-prompt').textContent = p.run.prompt;
    el('run-input').value = p.run.starterCode || '';
    el('run-output').className = 'run-output';
    el('run-output').textContent = '';
    clearDiff(el('run-diff'));
    setFeedback(el('run-feedback'), '', '');

    el('predict-prompt').textContent = p.predict.prompt;
    el('predict-code').textContent = p.predict.code;
    renderPredictOptions();

    el('debug-prompt').textContent = p.debug.prompt;
    el('debug-input').value = p.debug.buggyCode || '';
    el('debug-output').className = 'run-output';
    el('debug-output').textContent = '';
    clearDiff(el('debug-diff'));
    setFeedback(el('debug-feedback'), '', '');

    el('match-prompt').textContent = p.match.prompt;
    renderMatch();

    // 先只保留一种模式的 DOM 与工具，再渲染其内容
    activatePrimaryMode();
    renderPracticeTools(state.lesson.practice.meta.primaryMode || 'run');
  }

  /** 每节只显示一种答题方式：由 course.json 的 primaryMode 决定，其余模式不渲染工具与状态。 */
  function activatePrimaryMode() {
    var mode = state.lesson.practice.meta.primaryMode || 'run';
    document.querySelectorAll('.mode-content').forEach(function (c) { c.classList.remove('active'); });
    var target = el('mode-' + mode);
    if (target) target.classList.add('active');

    var labels = { run: '运行验证', predict: '预测输出', debug: '找错改错', match: '配对分类' };
    var badge = el('practice-badge');
    badge.hidden = false;
    badge.textContent = '本节练习方式：' + labels[mode] + ' · 考点：' + state.lesson.practice.meta.concept;

    // 其余三种模式不渲染工具区，避免无内容空壳出现在 DOM 中
    Object.keys(labels).forEach(function (m) {
      if (m === mode) return;
      var tools = document.querySelector('[data-mode-tools="' + m + '"]');
      if (tools) tools.remove();
    });
  }

  async function submitRun() {
    var m = state.lesson.practice.run;
    var code = el('run-input').value;
    var feedback = el('run-feedback');
    var output = el('run-output');
    if (!code || code.trim() === '') { setFeedback(feedback, 'error', '请先编写代码再运行。'); return; }
    var btn = el('run-code');
    btn.disabled = true;
    output.className = 'run-output loading';
    output.textContent = '运行中…';
    try {
      var res = await runWithPy(code, m.stdin);
      showRunOutput(output, res.stdout, res.error);
      renderDiff(el('run-diff'), m.expectedOutput, res.stdout, !!res.error);
      if (res.error) setFeedback(feedback, 'error', m.errorFeedback);
      else if (norm(res.stdout) === norm(m.expectedOutput)) {
        setFeedback(feedback, 'success', m.successFeedback);
        markToolDone('run');
      } else setFeedback(feedback, 'error', m.errorFeedback);
    } catch (e) {
      output.className = 'run-output error';
      output.textContent = '⚠️ ' + e.message;
      renderDiff(el('run-diff'), m.expectedOutput, '', true);
      setFeedback(feedback, 'error', m.errorFeedback);
    } finally { btn.disabled = false; }
  }

  async function submitDebug() {
    var m = state.lesson.practice.debug;
    var code = el('debug-input').value;
    var feedback = el('debug-feedback');
    var output = el('debug-output');
    if (!code || code.trim() === '') { setFeedback(feedback, 'error', '请先修复代码再运行。'); return; }
    var btn = el('run-debug');
    btn.disabled = true;
    output.className = 'run-output loading';
    output.textContent = '运行中…';
    try {
      var res = await runWithPy(code, m.stdin);
      showRunOutput(output, res.stdout, res.error);
      renderDiff(el('debug-diff'), m.expectedOutput, res.stdout, !!res.error);
      if (res.error) setFeedback(feedback, 'error', m.errorFeedback);
      else if (norm(res.stdout) === norm(m.expectedOutput)) {
        setFeedback(feedback, 'success', m.successFeedback);
        markToolDone('debug');
      } else setFeedback(feedback, 'error', m.errorFeedback);
    } catch (e) {
      output.className = 'run-output error';
      output.textContent = '⚠️ ' + e.message;
      renderDiff(el('debug-diff'), m.expectedOutput, '', true);
      setFeedback(feedback, 'error', m.errorFeedback);
    } finally { btn.disabled = false; }
  }

  function renderPredictOptions() {
    var m = state.lesson.practice.predict;
    var host = el('predict-options');
    host.innerHTML = '';
    state.predictAnswered = false;
    // 选项随机排列，避免靠位置记忆答案
    state.predictOrder = m.options.map(function (_, i) { return i; });
    for (var i = state.predictOrder.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = state.predictOrder[i]; state.predictOrder[i] = state.predictOrder[j]; state.predictOrder[j] = t;
    }
    state.predictOrder.forEach(function (orig) {
      var opt = m.options[orig];
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'predict-option';
      b.dataset.index = orig;
      b.textContent = opt.text;
      b.addEventListener('click', function () { selectPredict(orig); });
      host.appendChild(b);
    });
    setFeedback(el('predict-feedback'), '', '');
  }

  function selectPredict(index) {
    var m = state.lesson.practice.predict;
    var opt = m.options[index];
    var node = el('predict-options').querySelector('.predict-option[data-index="' + index + '"]');
    var feedback = el('predict-feedback');
    if (state.predictAnswered) return;
    if (opt.correct) {
      node.classList.add('correct');
      state.predictAnswered = true;
      el('predict-options').querySelectorAll('.predict-option').forEach(function (o) { o.disabled = true; });
      setFeedback(feedback, 'success', opt.feedback);
      markToolDone('predict');
    } else {
      node.classList.add('incorrect');
      node.disabled = true;
      setFeedback(feedback, 'error', opt.feedback);
    }
  }

  function renderMatch() {
    var m = state.lesson.practice.match;
    state.matchPairs = m.pairs;
    state.matchLeft = m.pairs.map(function (p, i) { return { text: p.left, pairIndex: i }; });
    state.matchRight = m.pairs.map(function (p, i) { return { text: p.right, pairIndex: i }; });
    for (var i = state.matchRight.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = state.matchRight[i]; state.matchRight[i] = state.matchRight[j]; state.matchRight[j] = t;
    }
    state.matchMapping = {};
    state.matchSelectedLeft = null;
    renderMatchColumns();
    setFeedback(el('match-feedback'), '', '');
  }

  /** 配对项用 button，天然可聚焦；Enter / Space 触发，方向键在列内移动 */
  function makeMatchButton(item, side, idx, onClick) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'match-item ' + side;
    b.dataset.side = side;
    b.dataset.index = idx;
    b.textContent = item.text;
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', onClick);
    b.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        var sibs = Array.prototype.slice.call(b.parentElement.querySelectorAll('.match-item'));
        var cur = sibs.indexOf(b);
        var step = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : -1;
        var next = sibs[cur + step];
        if (next) next.focus();
      }
    });
    return b;
  }

  function renderMatchColumns() {
    var left = el('match-left');
    var right = el('match-right');
    left.innerHTML = '';
    right.innerHTML = '';
    state.matchLeft.forEach(function (item, i) {
      var paired = state.matchMapping[i] != null;
      var b = makeMatchButton(item, 'left', i, function () { clickMatchLeft(i); });
      if (paired) { b.classList.add('paired'); b.setAttribute('aria-pressed', 'true'); }
      if (state.matchSelectedLeft === i) b.classList.add('selected');
      left.appendChild(b);
    });
    state.matchRight.forEach(function (item, i) {
      var pairedLeft = Object.keys(state.matchMapping).find(function (k) { return state.matchMapping[k] === i; });
      var b = makeMatchButton(item, 'right', i, function () { clickMatchRight(i); });
      if (pairedLeft != null) { b.classList.add('paired'); b.setAttribute('aria-pressed', 'true'); }
      right.appendChild(b);
    });
  }

  function clickMatchLeft(i) {
    if (state.matchMapping[i] != null) {
      delete state.matchMapping[i];
      state.matchSelectedLeft = null;
      renderMatchColumns();
      return;
    }
    state.matchSelectedLeft = i;
    renderMatchColumns();
  }

  function clickMatchRight(i) {
    var pairedLeft = Object.keys(state.matchMapping).find(function (k) { return state.matchMapping[k] === i; });
    if (pairedLeft != null) {
      delete state.matchMapping[pairedLeft];
      renderMatchColumns();
      return;
    }
    if (state.matchSelectedLeft == null) return;
    state.matchMapping[state.matchSelectedLeft] = i;
    state.matchSelectedLeft = null;
    renderMatchColumns();
  }

  function submitMatch() {
    var feedback = el('match-feedback');
    if (Object.keys(state.matchMapping).length < state.matchPairs.length) {
      setFeedback(feedback, 'error', '请完成所有配对后再验证。');
      return;
    }
    var wrong = [];
    for (var leftIdx = 0; leftIdx < state.matchPairs.length; leftIdx += 1) {
      var rightIdx = state.matchMapping[leftIdx];
      if (state.matchRight[rightIdx].pairIndex !== leftIdx) wrong.push(leftIdx + 1);
    }
    // 只标注错误项，不直接给出正确配对；解析区承担讲解
    el('match-left').querySelectorAll('.match-item').forEach(function (b) {
      var idx = parseInt(b.dataset.index, 10);
      b.classList.toggle('incorrect', wrong.indexOf(idx + 1) >= 0);
    });
    if (wrong.length === 0) {
      setFeedback(feedback, 'success', '全部配对正确，本节概念已厘清。');
      markToolDone('match');
    } else {
      setFeedback(feedback, 'error', '第 ' + wrong.join('、') + ' 项配对不成立，已标出。可查看提示或解析后重试。');
    }
  }

  /* ===================== 进度标记 ===================== */

  function setupComplete() {
    var btn = el('mark-complete');
    var done = readCompleted();
    if (done[state.id]) {
      btn.textContent = '已学完 ✓';
      btn.classList.add('is-done');
      el('complete-hint').textContent = '本节已标记为学完，可在课程大纲查看进度。';
    }
    btn.addEventListener('click', function () {
      var c = readCompleted();
      c[state.id] = true;
      writeCompleted(c);
      btn.textContent = '已学完 ✓';
      btn.classList.add('is-done');
      el('complete-hint').textContent = '进度已保存。可点上方箭头进入下一节。';
    });
  }

  function setupPracticeEvents() {
    el('run-code').addEventListener('click', submitRun);
    el('run-debug').addEventListener('click', submitDebug);
    el('submit-match').addEventListener('click', submitMatch);
    el('reset-run').addEventListener('click', function () {
      el('run-input').value = state.lesson.practice.run.starterCode || '';
      el('run-output').className = 'run-output';
      el('run-output').textContent = '';
      clearDiff(el('run-diff'));
      setFeedback(el('run-feedback'), '', '');
    });
    el('reset-debug').addEventListener('click', function () {
      el('debug-input').value = state.lesson.practice.debug.buggyCode || '';
      el('debug-output').className = 'run-output';
      el('debug-output').textContent = '';
      clearDiff(el('debug-diff'));
      setFeedback(el('debug-feedback'), '', '');
    });
    el('reset-match').addEventListener('click', renderMatch);
  }

  function showError(msg) {
    el('lesson-body').innerHTML = '<div class="global-error"><div class="error-content">' +
      '<h3>课程数据加载失败</h3><p>' + escapeHtml(msg) + '。请通过本地 HTTP 服务访问。</p>' +
      '<a href="index.html" class="back-button">返回课程大纲</a></div></div>';
  }

  function init() {
    fetch('data/course.json')
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) {
        if (!d || !d.lessons) throw new Error('数据格式不正确');
        state.data = d;
        state.id = Math.min(getLessonId(), d.lessons.length);
        state.lesson = d.lessons.find(function (l) { return l.id === state.id; });
        if (!state.lesson) throw new Error('未找到该课时');
        renderHeader();
        renderBody();
        renderToc();
        renderPractice();
        setupPracticeEvents();
        setupComplete();
        warmupPy();
      })
      .catch(function (e) { showError(e.message); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
