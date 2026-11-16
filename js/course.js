/**
 * 课程大纲页：加载 data/course.json，按章渲染课时，管理学习进度。
 * 脚本不可用时，静态页眉与说明仍完整可读（渐进增强）。
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'pycourse:completed';

  var state = { data: null, activeChapter: 1, completed: {} };

  function readCompleted() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var obj = raw ? JSON.parse(raw) : {};
      return obj && typeof obj === 'object' ? obj : {};
    } catch (e) { return {}; }
  }

  function writeCompleted(obj) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch (e) {}
  }


  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = String(s == null ? '' : s);
    return d.innerHTML;
  }

  function el(id) { return document.getElementById(id); }

  function countChars(lesson) {
    var n = 0;
    lesson.blocks.forEach(function (b) {
      var parts = [];
      if (b.text) parts.push(b.text);
      if (b.title) parts.push(b.title);
      if (b.paras) parts = parts.concat(b.paras);
      if (b.explain) parts = parts.concat(b.explain);
      if (b.items) parts = parts.concat(b.items.map(function (x) {
        return typeof x === 'string' ? x : Object.values(x).join('');
      }));
      if (b.head) parts = parts.concat(b.head);
      if (b.rows) parts = parts.concat([].concat.apply([], b.rows));
      n += parts.join('').length;
    });
    return n;
  }

  function renderStats() {
    var d = state.data;
    var total = d.lessons.length;
    var done = Object.keys(state.completed).filter(function (k) { return state.completed[k]; }).length;
    var percent = total ? Math.round((done / total) * 100) : 0;

    el('totalLessons').textContent = total;
    el('totalChapters').textContent = d.chapters.length;
    el('completedCount').textContent = done;
    el('progressPercentage').textContent = percent + '%';
    el('progressText').textContent = '已学完 ' + done + ' / ' + total + ' 节';

    var bar = document.querySelector('.progress-bar');
    bar.setAttribute('aria-valuenow', String(percent));
    el('progressFill').style.transform = 'scaleX(' + (percent / 100) + ')';
    if (done === total && total > 0) bar.classList.add('completed');
    else bar.classList.remove('completed');

    el('contentChars').textContent = (d.metadata.contentChars / 10000).toFixed(1) + ' 万字';
    var codeCount = 0;
    d.lessons.forEach(function (l) {
      l.blocks.forEach(function (b) { if (b.type === 'code') codeCount += 1; });
    });
    el('codeExamples').textContent = codeCount + ' 个';
    el('estimatedHours').textContent = d.metadata.estimatedHours + ' 小时';
  }

  function renderChapterTabs() {
    var host = el('chapterTabs');
    host.innerHTML = state.data.chapters.map(function (c) {
      return '<button class="chapter-tab' + (c.id === state.activeChapter ? ' active' : '') +
        '" data-chapter="' + c.id + '" role="tab" aria-selected="' +
        (c.id === state.activeChapter ? 'true' : 'false') + '" type="button">' +
        '<span class="chapter-tab__no">第 ' + c.id + ' 章</span>' +
        '<span class="chapter-tab__name">' + escapeHtml(c.title) + '</span>' +
        '</button>';
    }).join('');

    Array.prototype.forEach.call(host.querySelectorAll('.chapter-tab'), function (btn) {
      btn.addEventListener('click', function () {
        state.activeChapter = parseInt(btn.dataset.chapter, 10);
        renderChapterTabs();
        renderChapterDetail();
        renderLessonList();
      });
      btn.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        var ids = state.data.chapters.map(function (c) { return c.id; });
        var i = ids.indexOf(state.activeChapter);
        var next = e.key === 'ArrowRight' ? Math.min(ids.length - 1, i + 1) : Math.max(0, i - 1);
        state.activeChapter = ids[next];
        renderChapterTabs();
        renderChapterDetail();
        renderLessonList();
        var t = host.querySelector('.chapter-tab[data-chapter="' + state.activeChapter + '"]');
        if (t) t.focus();
      });
    });
  }

  function renderChapterDetail() {
    var c = state.data.chapters.find(function (x) { return x.id === state.activeChapter; });
    if (!c) return;
    el('chapterDetail').innerHTML =
      '<h3 class="chapter-detail__title">' + escapeHtml(c.title) + '</h3>' +
      '<p class="chapter-detail__subtitle">' + escapeHtml(c.subtitle) + '</p>' +
      '<p class="chapter-detail__intro">' + escapeHtml(c.intro) + '</p>';
  }

  function renderLessonList() {
    var host = el('lessonList');
    var lessons = state.data.lessons.filter(function (l) { return l.chapterId === state.activeChapter; });

    host.innerHTML = lessons.map(function (l) {
      var done = !!state.completed[l.id];
      var chars = countChars(l);
      return '<article class="lesson-card' + (done ? ' completed' : '') + '" role="listitem">' +
        '<a class="lesson-card__link" href="level.html?lesson=' + l.id + '">' +
          '<div class="lesson-card__no">第 ' + l.id + ' 节</div>' +
          '<h4 class="lesson-card__title">' + escapeHtml(l.title) + '</h4>' +
          '<p class="lesson-card__objectives">' + escapeHtml(l.objectives.slice(0, 2).join(' · ')) + '</p>' +
          '<div class="lesson-card__meta">' +
            '<span>' + l.minutes + ' 分钟</span>' +
            '<span>' + (chars / 1000).toFixed(1) + ' 千字教程</span>' +
            '<span>' + l.blocks.filter(function (b) { return b.type === 'code'; }).length + ' 个示例</span>' +
            (done ? '<span class="lesson-card__done">已学完</span>' : '') +
          '</div>' +
        '</a>' +
      '</article>';
    }).join('');
  }

  function showError(msg) {
    var host = el('lessonList');
    if (host) host.innerHTML = '<p class="course-error">课程数据加载失败：' + escapeHtml(msg) + '。请通过本地 HTTP 服务访问本页面。</p>';
  }

  function init() {
    state.completed = readCompleted();
    fetch('data/course.json')
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (d) {
        if (!d || !d.lessons || !d.chapters) throw new Error('数据格式不正确');
        state.data = d;
        // 每次打开都从第一章开始，不按上次学习位置自动跳转
        state.activeChapter = 1;
        renderStats();
        renderChapterTabs();
        renderChapterDetail();
        renderLessonList();
      })
      .catch(function (e) { showError(e.message); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
