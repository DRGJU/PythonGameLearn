/**
 * 课程构建器 v6：把 course/ch1..ch6.mjs 的系统化教程，与 data/levels.json（v5.1）
 * 中已用 python3 校验过的 4 类巩固练习数据合并，生成 data/course.json。
 *
 * 校验：
 *  1. 每个教程 code 块（output != null）用系统 python3 实跑，输出归一化后比对；
 *  2. 每个练习的 run/debug 参考解、predict 正确选项、assemble 等历史数据沿用 v5.1
 *     已校验结果，并再次核对 predict 唯一正确项与非空配对；
 *  3. 结构完整性：6 章、30 节、课号连续、无游戏化措辞。
 *
 * 运行：node build-course-v6.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const P = (...p) => path.join(ROOT, ...p);
const norm = (s) => String(s)
  .replace(/\r\n/g, '\n')
  .split('\n')
  .map((l) => l.replace(/\s+$/, ''))
  .join('\n')
  .replace(/\n+$/, '');

const errors = [];
const tmpPy = path.join(tmpdir(), '_course_verify.py');

function runPython(code, stdin = []) {
  writeFileSync(tmpPy, code, 'utf8');
  const input = stdin.length ? stdin.join('\n') + '\n' : '';
  return execFileSync('python3', [tmpPy], { input, encoding: 'utf8', timeout: 10000, stdio: ['pipe', 'pipe', 'pipe'] });
}

/** 只捕获 stdout 与执行状态，不因非零退出码抛错（用于校验「错误代码确实有缺陷」） */
function tryRunPython(code, stdin = []) {
  try {
    return { ok: true, stdout: norm(runPython(code, stdin)) };
  } catch (e) {
    return { ok: false, stdout: norm(e.stdout || ''), error: String(e.message || e).slice(0, 120) };
  }
}

const BANNED = /关卡|通关|冒险|挑战大师|新手村|大师之路|升级|打怪|庆祝|金币|成就/;

/** 答案泄露措辞：改错题干不得出现 */
const LEAK = /请改成|请修复成|应为|误写成|拼错成|漏了|错写成|请补上|而非|把 .{0,12} 写成/;

/**
 * 从本节教程已有内容派生「分级提示」，不额外编造、不直接给出答案。
 * 第 1 级给方向（本节目标），第 2 级给知识要点（小结），第 3 级给原理（常见错误的原因）。
 */
function buildHints(lesson, concept) {
  const summary = lesson.blocks.find((b) => b.type === 'summary');
  const pitfalls = lesson.blocks.find((b) => b.type === 'pitfalls');
  const h1 = '先回到本节目标：' + (lesson.objectives[0] || concept) + '。';
  const h2 = summary && summary.items[0] ? '再看知识要点：' + summary.items[0] : '逐行检查代码，确认每个名字与符号的作用。';
  const h3 = pitfalls && pitfalls.items[0]
    ? '最后对照常见错误的原因：' + pitfalls.items[0].why
    : '把期望输出与实际输出逐行比对，定位第一个不同的位置。';
  return [h1, h2, h3];
}

/** 剥离鼓励式前缀，保留其中真正有教学价值的原理说明，供「解析」区使用 */
function stripCheer(text) {
  return String(text || '')
    .replace(/^(太棒了！|恭喜！?|真棒！?|厉害！?|修复成功！|修好了！|[^！]{0,14}成功！|[^！]{0,14}完成！)\s*/u, '')
    .replace(/^你已经成功[^，。！]*[，！]\s*/u, '')
    .replace(/^你已具备[^，。！]*[，。]\s*/u, '')
    .replace(/^正式开始[^，。！]*[，！]\s*/u, '')
    .replace(/^正确！/, '正确。')
    .replace(/^不对，/, '不正确。')
    .trim();
}

/** 练习增强：中性题干、答案讲解移入解析、分级提示、考点标签、L5 语境对齐 */
function enhancePractice(practice, lesson, meta, override) {
  const concept = meta.concept;
  const reviewBlock = lesson.blocks.find((b) => b.type === 'review');
  const hints = buildHints(lesson, concept);

  const out = JSON.parse(JSON.stringify(practice));
  const ov = override || {};

  // 0) 第 5 节：替换与教程脱节的游戏语境数据
  for (const mode of ['run', 'predict', 'debug', 'match']) {
    if (ov[mode]) Object.assign(out[mode], JSON.parse(JSON.stringify(ov[mode])));
  }

  // 1) 收集「答案讲解」：原反馈里含原理的部分，移入解析区而非在答错时直给
  const explanations = {
    run: stripCheer(practice.run.successFeedback),
    debug: stripCheer(practice.debug.successFeedback),
    predict: stripCheer(practice.predict.options.find((o) => o.correct).feedback),
    match: (reviewBlock ? reviewBlock.paras : [])[3] || '对照本节教程中的定义，逐个确认左右两侧的含义。',
  };

  // 2) 题干：只描述意图与现象，不指出错误位置、不给出正确写法
  out.debug.prompt = meta.debug;
  out.predict.prompt = '本题考查「' + concept + '」。阅读代码，选出它运行后的实际输出。';
  out.match.prompt = '本题考查「' + concept + '」。将左侧术语与右侧含义一一对应。';
  out.run.prompt = '围绕本节考点「' + concept + '」：' + out.run.prompt;

  // 3) 反馈：成功为陈述式；失败只给诊断方向，绝不给出正确代码
  for (const mode of ['run', 'debug']) {
    out[mode].successFeedback = '输出与预期一致。「' + concept + '」的用法正确。';
    out[mode].errorFeedback = mode === 'run'
      ? '输出与预期不一致。请查看下方的期望输出与实际输出，逐行比对后重试。'
      : '程序仍未得到预期输出。先查看运行结果定位问题，可使用下方分级提示。';
  }
  out.predict.options = out.predict.options.map((o) => ({
    ...o,
    feedback: stripCheer(o.feedback) || (o.correct ? '判断正确。' : '判断不正确，再按执行顺序推算一次。'),
  }));

  // 4) 提示与解析（解析复用教程已写好的「巩固练习解析」，不重复创作）
  out.meta = {
    concept,
    hints,
    review: reviewBlock ? reviewBlock.paras : [],
    explanations,
  };
  return out;
}

async function main() {
  // --- 载入历史练习数据（v5.1，已校验）与考点元数据 ---
  const legacy = JSON.parse(readFileSync(P('data', 'levels.json'), 'utf8'));
  const practiceById = new Map(legacy.levels.map((l) => [l.id, l]));
  const metaMod = await import('file://' + P('course', 'practice-meta.mjs').replace(/\\/g, '/'));
  const metaById = new Map(metaMod.default.map((m) => [m.id, m]));
  const overrides = metaMod.overrides || {};
  if (metaById.size !== 30) errors.push(`考点元数据应为 30 条，实际 ${metaById.size}`);

  // --- 载入 6 章教程 ---
  const chapters = [];
  for (let i = 1; i <= 6; i += 1) {
    const f = P('course', `ch${i}.mjs`);
    if (!existsSync(f)) { errors.push(`缺少章节文件 ${f}`); continue; }
    const mod = await import('file://' + f.replace(/\\/g, '/'));
    chapters.push(mod.default);
  }
  if (chapters.length !== 6) {
    console.error('❌ 构建校验失败：章节数不为 6');
    process.exit(1);
  }

  // --- 逐节校验与组装 ---
  const lessons = [];
  let codeChecked = 0;
  let totalChars = 0;

  for (const ch of chapters) {
    for (const lesson of ch.lessons) {
      const id = lesson.id;

      // 1) 章节归属
      if (Math.floor((id - 1) / 5) + 1 !== ch.id) {
        errors.push(`课 ${id} 不属于第 ${ch.id} 章`);
      }
      // 2) 游戏化措辞
      const text = JSON.stringify(lesson);
      if (BANNED.test(text)) errors.push(`课 ${id} 含游戏化措辞`);

      // 3) 代码块实跑校验
      for (const [bi, b] of lesson.blocks.entries()) {
        if (b.type !== 'code' || b.output == null) continue;
        codeChecked += 1;
        let out;
        try {
          out = runPython(b.code, b.stdin || []);
        } catch (e) {
          errors.push(`课 ${id} 代码块 ${bi} 执行失败: ${e.message}`);
          continue;
        }
        if (norm(out) !== norm(b.output)) {
          errors.push(`课 ${id} 代码块 ${bi} 输出不符。期望:\n«${norm(b.output)}»\n实际:\n«${norm(out)}»`);
        }
      }

      // 4) 复用练习、增强并复验
      const old = practiceById.get(id);
      if (!old) { errors.push(`课 ${id} 在 v5.1 中缺失练习数据`); continue; }
      const meta = metaById.get(id);
      if (!meta) { errors.push(`课 ${id} 缺少考点元数据`); continue; }

      const rawPractice = {
        run: old.run, predict: old.predict, debug: old.debug, match: old.match,
      };
      if (!rawPractice.run || !rawPractice.predict || !rawPractice.debug || !rawPractice.match) {
        errors.push(`课 ${id} 练习模式不完整`);
        continue;
      }
      const correct = rawPractice.predict.options.filter((o) => o.correct);
      if (correct.length !== 1) errors.push(`课 ${id} predict 正确选项不唯一`);
      if (!rawPractice.match.pairs || rawPractice.match.pairs.length < 2) errors.push(`课 ${id} match 配对不足`);
      if (!rawPractice.run.expectedOutput) errors.push(`课 ${id} run 缺 expectedOutput`);

      // 4a) 改错代码必须「确实有缺陷」：运行失败或输出与期望不符，否则题目无效
      const bugResult = tryRunPython(rawPractice.debug.buggyCode, rawPractice.debug.stdin || []);
      if (bugResult.ok && bugResult.stdout === norm(rawPractice.debug.expectedOutput)) {
        errors.push(`课 ${id} debug 的 buggyCode 已能输出期望结果，题目无效`);
      }
      // 4b) 中性题干不得泄露答案
      if (LEAK.test(meta.debug)) errors.push(`课 ${id} 改错题干泄露答案：${meta.debug}`);

      // 4c) 预测题的正确选项必须等于代码真实输出（应用 override 后仍成立）
      const predictCandidate = (overrides[id] && overrides[id].predict
        ? overrides[id].predict : rawPractice.predict);
      const predictOut = tryRunPython(predictCandidate.code, predictCandidate.stdin || []);
      const predictCorrect = (predictCandidate.options || []).filter((o) => o.correct);
      if (!predictOut.ok || predictCorrect.length !== 1 || predictOut.stdout !== norm(predictCorrect[0].text)) {
        errors.push(`课 ${id} predict 正确选项与代码真实输出不符：选项«${norm(predictCorrect[0]?.text || '')}» 实际«${predictOut.stdout}»`);
      }

      const practice = enhancePractice(rawPractice, lesson, meta, overrides[id]);
      if (!practice.meta.review.length) errors.push(`课 ${id} 缺练习解析（review 块）`);
      if (practice.meta.hints.length !== 3) errors.push(`课 ${id} 分级提示不足 3 级`);

      // 4d) 增强后复验：题干、反馈均不得泄露答案或残留鼓励式/游戏化措辞
      // 只检查练习自身的题干与反馈字段，不含教程解析（解析允许出现「挑战」等中性词）
      const surface = JSON.stringify({
        p: practice.run.prompt, r: practice.predict.prompt,
        d: practice.debug.prompt, m: practice.match.prompt,
        f: [practice.run.successFeedback, practice.run.errorFeedback,
            practice.debug.successFeedback, practice.debug.errorFeedback],
        pairs: practice.match.pairs,
      });
      if (BANNED.test(surface)) errors.push(`课 ${id} 练习残留游戏化措辞`);
      // 讲解区同样不得残留鼓励式措辞（它应是知识说明，不是情绪反馈）
      const teaching = JSON.stringify({
        exp: practice.meta.explanations, review: practice.meta.review, hints: practice.meta.hints,
      });
      if (/太棒了|恭喜|真棒|厉害|修复成功|完成！|正式开始|你已具备/.test(surface + teaching)) {
        errors.push(`课 ${id} 练习残留鼓励式措辞`);
      }
      for (const mode of ['run', 'debug']) {
        if (LEAK.test(practice[mode].errorFeedback) || /把 .{0,18} 改成|应写成/.test(practice[mode].errorFeedback)) {
          errors.push(`课 ${id} ${mode} 错误反馈泄露答案：${practice[mode].errorFeedback}`);
        }
      }

      // 5) 正文体量
      let chars = 0;
      for (const b of lesson.blocks) {
        const parts = [];
        if (b.text) parts.push(b.text);
        if (b.title) parts.push(b.title);
        if (b.paras) parts.push(...b.paras);
        if (b.explain) parts.push(...b.explain);
        if (b.items) parts.push(...b.items.map((x) => (typeof x === 'string' ? x : Object.values(x).join(''))));
        if (b.head) parts.push(...b.head);
        if (b.rows) parts.push(...b.rows.flat());
        chars += parts.join('').length;
      }
      totalChars += chars;
      if (chars < 1500) errors.push(`课 ${id} 正文仅 ${chars} 字，低于 1500 字下限`);

      lessons.push({
        id,
        chapterId: ch.id,
        chapterTitle: ch.title,
        title: lesson.title,
        minutes: lesson.minutes,
        objectives: lesson.objectives,
        blocks: lesson.blocks,
        practice,
        tags: old.tags || [],
        difficulty: old.difficulty,
        category: old.category,
      });
    }
  }

  lessons.sort((a, b) => a.id - b.id);
  for (let i = 0; i < lessons.length; i += 1) {
    if (lessons[i].id !== i + 1) errors.push(`课号不连续，位置 ${i} 为 ${lessons[i].id}`);
  }
  if (lessons.length !== 30) errors.push(`课数不为 30（实际 ${lessons.length}）`);

  if (errors.length) {
    console.error('❌ 构建校验失败：');
    for (const e of errors) console.error(' - ' + e);
    process.exit(1);
  }

  const out = {
    metadata: {
      version: '6.1.0',
      title: 'Python 系统化课程',
      subtitle: '从零基础到面向对象：30 节可自学的完整教程',
      totalLessons: 30,
      totalChapters: 6,
      contentChars: totalChars,
      practiceModes: ['run', 'predict', 'debug', 'match'],
      estimatedHours: Math.round(lessons.reduce((s, l) => s + l.minutes, 0) / 60),
      lastUpdated: '2026-11-15',
      redesignedBy: '定位重构：以学习为核心，教程为主体、练习置于文末；内容由 306 字/节扩充至 2000+ 字/节',
      practiceVersion: '答题方式优化：中性改错题干、分级提示、练习解析、考点标签、逐行差异诊断',
      builtWith: 'build-course-v6.mjs（教程示例与改错代码均经系统 python3 实跑校验）',
    },
    chapters: chapters.map((c) => ({
      id: c.id, title: c.title, subtitle: c.subtitle, intro: c.intro,
      lessonIds: c.lessons.map((l) => l.id),
    })),
    lessons,
  };

  writeFileSync(P('data', 'course.json'), JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`✅ 已生成 data/course.json（v6.1.0）`);
  console.log(`   6 章 / ${lessons.length} 节 / 正文 ${totalChars} 字 / 平均 ${Math.round(totalChars / lessons.length)} 字每节`);
  console.log(`   ${codeChecked} 个教程代码块经 python3 实跑通过；4 类练习复用 v5.1 已校验数据`);
}

main().catch((e) => { console.error('构建异常:', e); process.exit(1); });
