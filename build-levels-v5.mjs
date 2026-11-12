// build-levels-v5.mjs
// 生成 data/levels.json (v5.0.0)：用 5 种全新答题模式替换旧的 5 种模式。
// 新模式：run(运行验证) / predict(预测输出) / debug(找错改错) / match(配对分类)（拖拽组装 assemble 已移除）
// 关键严谨性：每个 runnable 模式的参考解会在构建时用系统 python3 真正执行，
// 其 stdout 必须严格等于声明的 expectedOutput；predict 的正确选项也必须等于真实运行输出。
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SRC = 'build/v4-levels.json';
const OUT = 'data/levels.json';

// ---------- 输出归一化（与浏览器端引擎保持一致） ----------
function norm(s) {
  return String(s)
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/\s+$/, ''))
    .join('\n')
    .replace(/\n+$/, '');
}

// ---------- 用系统 python3 运行代码，返回 stdout ----------
let _seq = 0;
function pyRun(code, stdin = []) {
  const file = join(tmpdir(), `lvlbuild_${process.pid}_${_seq++}.py`);
  writeFileSync(file, code);
  const input = stdin.length ? stdin.join('\n') + '\n' : '';
  const out = execSync(`python3 "${file}"`, { input, encoding: 'utf8', timeout: 8000 });
  return out;
}

// =====================================================================
// 30 关的新模式定义。_ref / _sol 仅用于构建期校验，不会写入最终 JSON。
// =====================================================================
const MODES = {
  // ---------------- 关卡 1 ----------------
  1: {
    run: {
      prompt: '编写程序，依次输出两句话："你好，Python！" 和 "我准备好了！"（各占一行）。',
      starterCode: '',
      stdin: [],
      _ref: 'print("你好，Python！")\nprint("我准备好了！")',
      expectedOutput: '你好，Python！\n我准备好了！',
      successFeedback: '太棒了！你已经成功把内容输出到屏幕，正式开始编程之旅！',
      errorFeedback: '请使用 print() 分别输出这两句用引号包裹的话，注意每行一个 print。',
    },
    predict: {
      prompt: '下面这段代码会输出什么？',
      code: 'print("Hello")\nprint("World")',
      stdin: [],
      options: [
        { text: 'Hello\nWorld', correct: true, feedback: '正确！两个 print 各输出一行，依次为 Hello、World。' },
        { text: 'HelloWorld', correct: false, feedback: '不对，print 默认会换行，不会把两行连在一起。' },
        { text: 'World\nHello', correct: false, feedback: '不对，输出顺序和代码顺序一致。' },
        { text: 'Hello World', correct: false, feedback: '不对，两个 print 之间不会自动加空格。' },
      ],
    },
    debug: {
      prompt: '下面代码想输出两句话，但第二句漏了引号导致报错，请修复它。',
      buggyCode: 'print("你好，Python！")\nprint(我准备好了！)',
      stdin: [],
      _ref: 'print("你好，Python！")\nprint("我准备好了！")',
      expectedOutput: '你好，Python！\n我准备好了！',
      successFeedback: '修好了！字符串必须用引号包裹，否则 Python 会当成变量名。',
      errorFeedback: '注意第二句的文字也要用引号包裹起来。',
    },
    match: {
      prompt: '将左侧概念与右侧正确的解释配对。',
      pairs: [
        { left: 'print()', right: '把内容输出到屏幕' },
        { left: '字符串', right: '用引号包裹的文字' },
        { left: '变量', right: '用来给数据起名字并保存' },
      ],
    },
  },

  // ---------------- 关卡 2 ----------------
  2: {
    run: {
      prompt: '创建变量 name = "小明"、age = 12，再用一行 print 输出：我是小明，今年12岁。',
      starterCode: '',
      stdin: [],
      _ref: 'name = "小明"\nage = 12\nprint(f"我是{name}，今年{age}岁")',
      expectedOutput: '我是小明，今年12岁',
      successFeedback: '漂亮！你已经学会用变量保存数据，并用 f-string 把它们嵌进文字。',
      errorFeedback: '请先用 = 给 name、age 赋值，再用 f"…{变量}…" 输出。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'x = 5\ny = 3\nprint(x + y)',
      stdin: [],
      options: [
        { text: '8', correct: true, feedback: '正确！5 + 3 = 8。' },
        { text: '53', correct: false, feedback: '不对，+ 对数字做的是加法，不是拼接。' },
        { text: 'x + y', correct: false, feedback: '不对，print 会输出计算结果，而不是公式。' },
        { text: '2', correct: false, feedback: '不对，结果是 8。' },
      ],
    },
    debug: {
      prompt: '下面代码想拼接输出，但把整数直接拼进字符串会报错，请修复。',
      buggyCode: 'name = "小明"\nage = 12\nprint("我是" + name + "，今年" + age + "岁")',
      stdin: [],
      _ref: 'name = "小明"\nage = 12\nprint(f"我是{name}，今年{age}岁")',
      expectedOutput: '我是小明，今年12岁',
      successFeedback: '修复成功！字符串和数字不能直接用 + 拼接，用 f-string 最稳妥。',
      errorFeedback: '数字和字符串不能直接 +，改用 f-string（或 str(age)）来拼接。',
    },
    match: {
      prompt: '将左侧概念与右侧正确的解释配对。',
      pairs: [
        { left: '赋值语句', right: '变量名 = 值' },
        { left: '=', right: '把右边的值存进左边的变量' },
        { left: '字符串', right: '需要用引号包裹' },
      ],
    },
  },

  // ---------------- 关卡 3 ----------------
  3: {
    run: {
      prompt: '计算并输出：100 除以 7 的商（用 //）、100 除以 7 的余数（用 %）、以及 2 的 10 次方（用 **）。三个结果各占一行。',
      starterCode: '',
      stdin: [],
      _ref: 'print(100 // 7)\nprint(100 % 7)\nprint(2 ** 10)',
      expectedOutput: '14\n2\n1024',
      successFeedback: '计算无误！你已经掌握了 Python 的算术运算符。',
      errorFeedback: '请分别使用 //（整除）、%（取余）、**（乘方）。',
    },
    predict: {
      prompt: '表达式 17 % 5 的结果是？',
      code: 'print(17 % 5)',
      stdin: [],
      options: [
        { text: '2', correct: true, feedback: '正确！17 ÷ 5 = 3 余 2，% 取到的就是余数 2。' },
        { text: '3', correct: false, feedback: '不对，3 是整除的商（17 // 5）。' },
        { text: '3.4', correct: false, feedback: '不对，% 取余得到整数 2。' },
        { text: '85', correct: false, feedback: '不对，85 是 17 × 5。' },
      ],
    },
    debug: {
      prompt: '下面代码想求整除商，但误用了普通除法 /，请修复成 //。',
      buggyCode: 'print(100 / 7)\nprint(100 % 7)\nprint(2 ** 10)',
      stdin: [],
      _ref: 'print(100 // 7)\nprint(100 % 7)\nprint(2 ** 10)',
      expectedOutput: '14\n2\n1024',
      successFeedback: '修复成功！整除要用 //，否则会得到带小数点的结果。',
      errorFeedback: '第一行应是 100 // 7（整除），不是 100 / 7。',
    },
    match: {
      prompt: '将左侧运算符与右侧含义配对。',
      pairs: [
        { left: '//', right: '整除，丢弃小数部分' },
        { left: '%', right: '取余数' },
        { left: '**', right: '乘方' },
      ],
    },
  },

  // ---------------- 关卡 4 ----------------
  4: {
    run: {
      prompt: '给定 first = "Hello"、last = "World"，用 f-string 输出 "Hello World"（中间一个空格），并输出该字符串的长度。',
      starterCode: '',
      stdin: [],
      _ref: 'first = "Hello"\nlast = "World"\ns = f"{first} {last}"\nprint(s)\nprint(len(s))',
      expectedOutput: 'Hello World\n11',
      successFeedback: '字符串玩得不错！f-string 会是你最常用的技巧之一。',
      errorFeedback: '请用 f"{first} {last}" 拼出带空格的句子，再用 len() 求长度。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 's = "abc"\nprint(s * 3)',
      stdin: [],
      options: [
        { text: 'abcabcabc', correct: true, feedback: '正确！* 让字符串重复指定次数。' },
        { text: 'abc 3', correct: false, feedback: '不对，重复不会产生空格和数字。' },
        { text: 'abcabc', correct: false, feedback: '不对，重复 3 次应是 abcabcabc。' },
        { text: '3abc', correct: false, feedback: '不对，顺序反了。' },
      ],
    },
    debug: {
      prompt: '下面代码想输出 "Hello World" 及其长度，但漏了空格，请修复成用 f-string 拼接（带空格）。',
      buggyCode: 'first = "Hello"\nlast = "World"\nprint(first + last)',
      stdin: [],
      _ref: 'first = "Hello"\nlast = "World"\ns = f"{first} {last}"\nprint(s)\nprint(len(s))',
      expectedOutput: 'Hello World\n11',
      successFeedback: '修复成功！两个变量之间要显式加上一个空格。',
      errorFeedback: 'first 和 last 之间要有一个空格，用 f-string 最方便。',
    },
    match: {
      prompt: '将左侧字符串操作与右侧含义配对。',
      pairs: [
        { left: '+', right: '字符串拼接' },
        { left: '*', right: '字符串重复指定次数' },
        { left: 'len()', right: '返回字符串长度' },
      ],
    },
  },

  // ---------------- 关卡 5 ----------------
  5: {
    run: {
      prompt: '定义 hero = "亚瑟"、job = "战士"、power = 88，用 f-string 输出三行：英雄：亚瑟 / 职业：战士 / 战力：88。',
      starterCode: '',
      stdin: [],
      _ref: 'hero = "亚瑟"\njob = "战士"\npower = 88\nprint(f"英雄：{hero}")\nprint(f"职业：{job}")\nprint(f"战力：{power}")',
      expectedOutput: '英雄：亚瑟\n职业：战士\n战力：88',
      successFeedback: '项目完成！你已能综合运用变量与 f-string 生成结构化输出。',
      errorFeedback: '请定义三个变量，并用三个 f-string 分别输出。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'name = "Lucy"\nprint(f"你好，{name}")',
      stdin: [],
      options: [
        { text: '你好，Lucy', correct: true, feedback: '正确！{name} 会被替换成变量的值 Lucy。' },
        { text: '你好，name', correct: false, feedback: '不对，花括号里写的是变量名，会替换成它的值。' },
        { text: '你好，{name}', correct: false, feedback: '不对，花括号会被求值替换。' },
        { text: 'Lucy 你好', correct: false, feedback: '不对，文字顺序和代码一致。' },
      ],
    },
    debug: {
      prompt: '下面代码第一行的 f-string 漏了花括号，请修复成 {hero}。',
      buggyCode: 'hero = "亚瑟"\njob = "战士"\npower = 88\nprint(f"英雄：hero")\nprint(f"职业：{job}")\nprint(f"战力：{power}")',
      stdin: [],
      _ref: 'hero = "亚瑟"\njob = "战士"\npower = 88\nprint(f"英雄：{hero}")\nprint(f"职业：{job}")\nprint(f"战力：{power}")',
      expectedOutput: '英雄：亚瑟\n职业：战士\n战力：88',
      successFeedback: '修复成功！f-string 里要用 {变量} 才能嵌入值。',
      errorFeedback: '第一行应写成 f"英雄：{hero}"。',
    },
    match: {
      prompt: '将左侧概念与右侧含义配对。',
      pairs: [
        { left: 'f-string', right: '用 {变量} 把值嵌入字符串' },
        { left: '变量', right: '保存数据的容器' },
        { left: 'print()', right: '把内容输出到屏幕' },
      ],
    },
  },

  // ---------------- 关卡 6 ----------------
  6: {
    run: {
      prompt: '用 input() 读取一行输入存入 city，再输出 "欢迎来到<城市>！"。运行时输入：北京',
      starterCode: '',
      stdin: ['北京'],
      _ref: 'city = input()\nprint("欢迎来到" + city + "！")',
      expectedOutput: '欢迎来到北京！',
      successFeedback: '很好！你的程序已经能和用户对话了。',
      errorFeedback: '请用 input() 获取输入并存到变量，再用 print 拼接输出欢迎语。',
    },
    predict: {
      prompt: '下面代码运行时若输入"小红"，会输出什么？（input 会读取"小红"）',
      code: 'name = input()\nprint("你好，" + name)',
      stdin: ['小红'],
      options: [
        { text: '你好，小红', correct: true, feedback: '正确！input() 读取到的内容会拼进字符串。' },
        { text: '你好，name', correct: false, feedback: '不对，变量 name 的值被用上了。' },
        { text: '你好，', correct: false, feedback: '不对，输入内容也被输出了。' },
        { text: 'name 你好', correct: false, feedback: '不对，顺序反了。' },
      ],
    },
    debug: {
      prompt: '下面代码在拼接处漏了加号 +，导致语法错误，请修复。',
      buggyCode: 'city = input()\nprint("欢迎来到" city "！")',
      stdin: ['上海'],
      _ref: 'city = input()\nprint("欢迎来到" + city + "！")',
      expectedOutput: '欢迎来到上海！',
      successFeedback: '修复成功！字符串拼接必须用 +，不能直接并列。',
      errorFeedback: '在 "欢迎来到" 和 city 之间要加上 +。',
    },
    match: {
      prompt: '将左侧概念与右侧含义配对。',
      pairs: [
        { left: 'input()', right: '从键盘读取一行输入' },
        { left: 'input() 的返回类型', right: '字符串 str' },
        { left: '变量', right: '用来保存输入的数据' },
      ],
    },
  },

  // ---------------- 关卡 7 ----------------
  7: {
    run: {
      prompt: '用 input() 读取一个整数，先用 int() 转换成数字，再加 10 后输出。运行时输入：5',
      starterCode: '',
      stdin: ['5'],
      _ref: 'n = int(input())\nprint(n + 10)',
      expectedOutput: '15',
      successFeedback: '类型转换到位！这是处理用户输入的关键一步。',
      errorFeedback: '请先用 int(input()) 把输入转成整数，再加 10 输出。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 's = "3.5"\nprint(float(s))',
      stdin: [],
      options: [
        { text: '3.5', correct: true, feedback: '正确！float() 把字符串转成小数 3.5。' },
        { text: '3', correct: false, feedback: '不对，3 是 int 的结果，这里用的是 float。' },
        { text: '3.5.0', correct: false, feedback: '不对，不会出现这种写法。' },
        { text: '报错', correct: false, feedback: '不会报错，"3.5" 可以被 float 解析。' },
      ],
    },
    debug: {
      prompt: '下面代码忘记把 input 转成整数，导致字符串和数字相加报错，请修复。',
      buggyCode: 'n = input()\nprint(n + 10)',
      stdin: ['7'],
      _ref: 'n = int(input())\nprint(n + 10)',
      expectedOutput: '17',
      successFeedback: '修复成功！input() 返回字符串，要先 int() 才能做加法。',
      errorFeedback: '把 n = input() 改成 n = int(input())。',
    },
    match: {
      prompt: '将左侧类型转换函数与右侧作用配对。',
      pairs: [
        { left: 'int()', right: '把字符串转为整数' },
        { left: 'float()', right: '把字符串转为小数' },
        { left: 'str()', right: '把数字转为字符串' },
      ],
    },
  },

  // ---------------- 关卡 8 ----------------
  8: {
    run: {
      prompt: '定义 age = 20，若 age >= 18 则输出"已成年"。',
      starterCode: '',
      stdin: [],
      _ref: 'age = 20\nif age >= 18:\n    print("已成年")',
      expectedOutput: '已成年',
      successFeedback: '判断成立！你的程序已经会"思考"了。',
      errorFeedback: '请使用 if 与 >= 判断 age 是否 >=18，成立时 print。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'x = 5\nif x > 3:\n    print("大")\nelse:\n    print("小")',
      stdin: [],
      options: [
        { text: '大', correct: true, feedback: '正确！5 > 3 成立，走 if 分支输出"大"。' },
        { text: '小', correct: false, feedback: '不对，条件成立，不会走 else。' },
        { text: '大\n小', correct: false, feedback: '不对，只会执行其中一个分支。' },
        { text: '什么都不输出', correct: false, feedback: '不对，条件成立有输出。' },
      ],
    },
    debug: {
      prompt: '下面代码把 >= 误写成了 =>，请修复。',
      buggyCode: 'age = 20\nif age => 18:\n    print("已成年")',
      stdin: [],
      _ref: 'age = 20\nif age >= 18:\n    print("已成年")',
      expectedOutput: '已成年',
      successFeedback: '修复成功！"大于等于"的写法是 >=，不是 =>。',
      errorFeedback: '把 => 改成 >=。',
    },
    match: {
      prompt: '将左侧语法与右侧含义配对。',
      pairs: [
        { left: 'if', right: '当条件成立时执行' },
        { left: '>=', right: '大于等于' },
        { left: '缩进', right: '表示 if 内部要执行的代码块' },
      ],
    },
  },

  // ---------------- 关卡 9 ----------------
  9: {
    run: {
      prompt: '定义 score = 75，若 score >= 60 输出"及格"，否则输出"不及格"。',
      starterCode: '',
      stdin: [],
      _ref: 'score = 75\nif score >= 60:\n    print("及格")\nelse:\n    print("不及格")',
      expectedOutput: '及格',
      successFeedback: '分支清晰！程序现在能应对两种情况了。',
      errorFeedback: '请使用 if ... else ...，成立输出"及格"，否则输出"不及格"。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'n = 4\nif n % 2 == 0:\n    print("偶数")\nelse:\n    print("奇数")',
      stdin: [],
      options: [
        { text: '偶数', correct: true, feedback: '正确！4 能被 2 整除，是偶数。' },
        { text: '奇数', correct: false, feedback: '不对，4 是偶数。' },
        { text: '4', correct: false, feedback: '不对，输出的是文字。' },
        { text: '无输出', correct: false, feedback: '不对，必有分支被执行。' },
      ],
    },
    debug: {
      prompt: '下面代码的 else 后漏了冒号，请修复。',
      buggyCode: 'score = 50\nif score >= 60:\n    print("及格")\nelse\n    print("不及格")',
      stdin: [],
      _ref: 'score = 50\nif score >= 60:\n    print("及格")\nelse:\n    print("不及格")',
      expectedOutput: '不及格',
      successFeedback: '修复成功！else 后面也要加冒号。',
      errorFeedback: '在 else 后面补上冒号 :。',
    },
    match: {
      prompt: '将左侧语法与右侧含义配对。',
      pairs: [
        { left: 'else', right: '处理条件不成立的情况' },
        { left: '==', right: '判断是否相等' },
        { left: 'if', right: '条件判断' },
      ],
    },
  },

  // ---------------- 关卡 10 ----------------
  10: {
    run: {
      prompt: '依次读取两个整数 a、b 和一个运算符 op（+ 或 -）。若 op 为 "+" 输出 a+b，否则输出 a-b。运行时输入：10、5、+',
      starterCode: '',
      stdin: ['10', '5', '+'],
      _ref: 'a = int(input())\nb = int(input())\nop = input()\nif op == "+":\n    print(a + b)\nelse:\n    print(a - b)',
      expectedOutput: '15',
      successFeedback: '计算器完成！你已能把多个知识点串成完整程序。',
      errorFeedback: '请用 int(input()) 读数字，用 op == "+" 判断，并分别处理加减。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'a = 8\nb = 3\nop = "-" \nif op == "+":\n    print(a + b)\nelse:\n    print(a - b)',
      stdin: [],
      options: [
        { text: '5', correct: true, feedback: '正确！op 是 "-"，走 else 输出 8 - 3 = 5。' },
        { text: '11', correct: false, feedback: '不对，op 是减号。' },
        { text: '8-3', correct: false, feedback: '不对，输出的是计算结果。' },
        { text: '83', correct: false, feedback: '不对。' },
      ],
    },
    debug: {
      prompt: '下面代码把比较 == 误写成赋值 =，请修复。',
      buggyCode: 'a = int(input())\nb = int(input())\nop = input()\nif op = "+":\n    print(a + b)\nelse:\n    print(a - b)',
      stdin: ['10', '5', '+'],
      _ref: 'a = int(input())\nb = int(input())\nop = input()\nif op == "+":\n    print(a + b)\nelse:\n    print(a - b)',
      expectedOutput: '15',
      successFeedback: '修复成功！判断相等用 ==，单个 = 是赋值。',
      errorFeedback: '把 if op = "+" 改成 if op == "+"。',
    },
    match: {
      prompt: '将左侧写法与右侧含义配对。',
      pairs: [
        { left: 'int(input())', right: '读取并转为整数' },
        { left: 'op == "+"', right: '判断运算符是否为加号' },
        { left: 'else', right: '运算符不是加号时执行减法' },
      ],
    },
  },

  // ---------------- 关卡 11 ----------------
  11: {
    run: {
      prompt: '用 while 循环输出 1 到 5，每行一个数字。',
      starterCode: '',
      stdin: [],
      _ref: 'i = 1\nwhile i <= 5:\n    print(i)\n    i = i + 1',
      expectedOutput: '1\n2\n3\n4\n5',
      successFeedback: '循环跑起来了！记得让计数器前进，循环才会结束。',
      errorFeedback: '请使用 while 循环，并在循环内让计数器 i 递增，输出 1 到 5。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'i = 1\nwhile i <= 3:\n    print(i)\n    i = i + 1',
      stdin: [],
      options: [
        { text: '1\n2\n3', correct: true, feedback: '正确！循环到 i=3 后 i 变成 4，条件不成立退出。' },
        { text: '1\n2\n3\n4', correct: false, feedback: '不对，i=4 时条件 i<=3 已不成立。' },
        { text: '3\n2\n1', correct: false, feedback: '不对，顺序是递增的。' },
        { text: '1 2 3', correct: false, feedback: '不对，每个 print 单独占一行。' },
      ],
    },
    debug: {
      prompt: '下面循环条件写成了 i < 5，导致少输出一个 5，请改成 i <= 5。',
      buggyCode: 'i = 1\nwhile i < 5:\n    print(i)\n    i = i + 1',
      stdin: [],
      _ref: 'i = 1\nwhile i <= 5:\n    print(i)\n    i = i + 1',
      expectedOutput: '1\n2\n3\n4\n5',
      successFeedback: '修复成功！要包含 5，条件应是 i <= 5。',
      errorFeedback: '把 while i < 5 改成 while i <= 5。',
    },
    match: {
      prompt: '将左侧概念与右侧含义配对。',
      pairs: [
        { left: 'while', right: '条件为真时重复执行' },
        { left: '计数器', right: '控制循环次数并使其结束' },
        { left: '死循环', right: '条件永远为真、无法退出' },
      ],
    },
  },

  // ---------------- 关卡 12 ----------------
  12: {
    run: {
      prompt: '创建列表 nums = [10, 20, 30, 40]，输出它的第一个元素和长度。',
      starterCode: '',
      stdin: [],
      _ref: 'nums = [10, 20, 30, 40]\nprint(nums[0])\nprint(len(nums))',
      expectedOutput: '10\n4',
      successFeedback: '列表入门成功！它是 Python 最常用的数据结构。',
      errorFeedback: '请创建列表 nums，并用索引 [0] 和 len() 分别输出首元素与长度。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'pets = ["猫", "狗", "鱼"]\nprint(pets[2])',
      stdin: [],
      options: [
        { text: '鱼', correct: true, feedback: '正确！索引 2 是第三个元素（从 0 开始）。' },
        { text: '猫', correct: false, feedback: '不对，"猫" 是 pets[0]。' },
        { text: '狗', correct: false, feedback: '不对，"狗" 是 pets[1]。' },
        { text: '报错', correct: false, feedback: '不会报错，索引 2 在范围内。' },
      ],
    },
    debug: {
      prompt: '下面代码想输出第一个元素，但用了索引 [1]（第二个），请改成 [0]。',
      buggyCode: 'nums = [10, 20, 30, 40]\nprint(nums[1])\nprint(len(nums))',
      stdin: [],
      _ref: 'nums = [10, 20, 30, 40]\nprint(nums[0])\nprint(len(nums))',
      expectedOutput: '10\n4',
      successFeedback: '修复成功！列表索引从 0 开始，第一个元素是 [0]。',
      errorFeedback: '把 nums[1] 改成 nums[0]。',
    },
    match: {
      prompt: '将左侧语法与右侧含义配对。',
      pairs: [
        { left: '[]', right: '创建列表' },
        { left: '索引', right: '从 0 开始访问元素' },
        { left: 'len()', right: '获取列表长度' },
      ],
    },
  },

  // ---------------- 关卡 13 ----------------
  13: {
    run: {
      prompt: '用 for 循环遍历列表 [1, 2, 3, 4, 5]，把每个数字原样输出（每行一个）。',
      starterCode: '',
      stdin: [],
      _ref: 'for x in [1, 2, 3, 4, 5]:\n    print(x)',
      expectedOutput: '1\n2\n3\n4\n5',
      successFeedback: '遍历自如！for 是处理集合的利器。',
      errorFeedback: '请使用 for x in [1, 2, 3, 4, 5]: 遍历列表，并在循环体内 print 每个元素。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'for i in range(3):\n    print(i)',
      stdin: [],
      options: [
        { text: '0\n1\n2', correct: true, feedback: '正确！range(3) 生成 0、1、2。' },
        { text: '1\n2\n3', correct: false, feedback: '不对，range 从 0 开始。' },
        { text: '0 1 2', correct: false, feedback: '不对，每个值各占一行。' },
        { text: '3', correct: false, feedback: '不对，共循环 3 次。' },
      ],
    },
    debug: {
      prompt: '下面 for 语句末尾漏了冒号，请补上。',
      buggyCode: 'for x in [1, 2, 3, 4, 5]\n    print(x)',
      stdin: [],
      _ref: 'for x in [1, 2, 3, 4, 5]:\n    print(x)',
      expectedOutput: '1\n2\n3\n4\n5',
      successFeedback: '修复成功！for / if / while 后面都要加冒号。',
      errorFeedback: '在 for 那一行末尾加上冒号 :。',
    },
    match: {
      prompt: '将左侧语法与右侧含义配对。',
      pairs: [
        { left: 'for', right: '逐个取出序列中的元素' },
        { left: 'in', right: '表示遍历的对象' },
        { left: 'range(3)', right: '生成 0、1、2 三个数' },
      ],
    },
  },

  // ---------------- 关卡 14 ----------------
  14: {
    run: {
      prompt: '从列表 [1, 2, 3] 出发，先 append(4)，再 remove(2)，最后输出从开头到索引 1（不含）的子列表。',
      starterCode: '',
      stdin: [],
      _ref: 'lst = [1, 2, 3]\nlst.append(4)\nlst.remove(2)\nprint(lst[0:2])',
      expectedOutput: '[1, 3]',
      successFeedback: '列表操作熟练！增删与切片是日常高频操作。',
      errorFeedback: '请对列表使用 append(4)、remove(2)，并输出切片 lst[0:2]。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'a = [10, 20, 30]\na.append(40)\nprint(a)',
      stdin: [],
      options: [
        { text: '[10, 20, 30, 40]', correct: true, feedback: '正确！append 在末尾加入 40。' },
        { text: '[40, 10, 20, 30]', correct: false, feedback: '不对，append 加在末尾。' },
        { text: '[10, 20, 30]', correct: false, feedback: '不对，列表已被修改。' },
        { text: '[10, 20, 30, 40, 40]', correct: false, feedback: '不对，只追加了一次。' },
      ],
    },
    debug: {
      prompt: '下面代码想输出前两个元素，但切片写成了 [0:3]，请改成 [0:2]。',
      buggyCode: 'lst = [1, 2, 3]\nlst.append(4)\nlst.remove(2)\nprint(lst[0:3])',
      stdin: [],
      _ref: 'lst = [1, 2, 3]\nlst.append(4)\nlst.remove(2)\nprint(lst[0:2])',
      expectedOutput: '[1, 3]',
      successFeedback: '修复成功！切片 [0:2] 取前两个元素。',
      errorFeedback: '把 lst[0:3] 改成 lst[0:2]。',
    },
    match: {
      prompt: '将左侧列表操作与右侧含义配对。',
      pairs: [
        { left: 'append()', right: '在末尾追加元素' },
        { left: 'remove()', right: '删除第一个匹配的值' },
        { left: '切片 [a:b]', right: '截取部分元素' },
      ],
    },
  },

  // ---------------- 关卡 15 ----------------
  15: {
    run: {
      prompt: '创建字典 stu = {"name": "Tom", "score": 88}，输出 name 对应的值，并把 score 改成 95 后输出 score。',
      starterCode: '',
      stdin: [],
      _ref: 'stu = {"name": "Tom", "score": 88}\nprint(stu["name"])\nstu["score"] = 95\nprint(stu["score"])',
      expectedOutput: 'Tom\n95',
      successFeedback: '字典入门成功！它适合表达"有名字的属性"。',
      errorFeedback: '请创建字典 stu，用 stu["name"] 取值，并修改 stu["score"] 后输出。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'd = {"a": 1}\nprint(d["a"])',
      stdin: [],
      options: [
        { text: '1', correct: true, feedback: '正确！用键 "a" 取到值 1。' },
        { text: 'a', correct: false, feedback: '不对，输出的是值，不是键。' },
        { text: '{"a": 1}', correct: false, feedback: '不对，只取出了值。' },
        { text: '报错', correct: false, feedback: '不会报错，键 "a" 存在。' },
      ],
    },
    debug: {
      prompt: '下面代码取 score 时把键名拼错成 "scoree"，导致找不到键报错，请改成 "score"。',
      buggyCode: 'stu = {"name": "Tom", "score": 88}\nprint(stu["name"])\nstu["score"] = 95\nprint(stu["scoree"])',
      stdin: [],
      _ref: 'stu = {"name": "Tom", "score": 88}\nprint(stu["name"])\nstu["score"] = 95\nprint(stu["score"])',
      expectedOutput: 'Tom\n95',
      successFeedback: '修复成功！字典的键要和定义时完全一致。',
      errorFeedback: '把 stu["scoree"] 改成 stu["score"]。',
    },
    match: {
      prompt: '将左侧字典语法与右侧含义配对。',
      pairs: [
        { left: '{}', right: '创建字典' },
        { left: '字典[键]', right: '取出对应的值' },
        { left: ':', right: '分隔键与值' },
      ],
    },
  },

  // ---------------- 关卡 16 ----------------
  16: {
    run: {
      prompt: '定义函数 say_hi()，函数体内输出 "Hi there!"，然后在函数外调用它两次。',
      starterCode: '',
      stdin: [],
      _ref: 'def say_hi():\n    print("Hi there!")\nsay_hi()\nsay_hi()',
      expectedOutput: 'Hi there!\nHi there!',
      successFeedback: '函数定义成功！复用从此开始。',
      errorFeedback: '请用 def 定义 say_hi() 并在其中 print，再调用两次。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'def f():\n    print("A")\nf()',
      stdin: [],
      options: [
        { text: 'A', correct: true, feedback: '正确！定义不会执行，调用 f() 才输出 A。' },
        { text: '无输出', correct: false, feedback: '不对，最后调用了 f()。' },
        { text: 'A\nA', correct: false, feedback: '不对，只调用了一次。' },
        { text: 'f', correct: false, feedback: '不对，输出的是函数体内的内容。' },
      ],
    },
    debug: {
      prompt: '下面 def 语句末尾漏了冒号，请补上。',
      buggyCode: 'def say_hi()\n    print("Hi there!")\nsay_hi()\nsay_hi()',
      stdin: [],
      _ref: 'def say_hi():\n    print("Hi there!")\nsay_hi()\nsay_hi()',
      expectedOutput: 'Hi there!\nHi there!',
      successFeedback: '修复成功！def 定义后面要加冒号。',
      errorFeedback: '在 def say_hi() 后面加上冒号 :。',
    },
    match: {
      prompt: '将左侧函数概念与右侧含义配对。',
      pairs: [
        { left: 'def', right: '定义函数' },
        { left: '函数名()', right: '调用函数' },
        { left: '函数体缩进', right: '表示函数内部的代码' },
      ],
    },
  },

  // ---------------- 关卡 17 ----------------
  17: {
    run: {
      prompt: '定义函数 square(n)，输出 n 的平方（n ** 2）。调用 square(5) 与 square(9)。',
      starterCode: '',
      stdin: [],
      _ref: 'def square(n):\n    print(n ** 2)\nsquare(5)\nsquare(9)',
      expectedOutput: '25\n81',
      successFeedback: '参数运用自如！函数现在能处理不同输入了。',
      errorFeedback: '请用 def square(n): 定义带参函数，输出 n**2，并调用两次。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'def add(a, b):\n    print(a + b)\nadd(2, 3)',
      stdin: [],
      options: [
        { text: '5', correct: true, feedback: '正确！2 + 3 = 5。' },
        { text: '23', correct: false, feedback: '不对，+ 对数字是加法。' },
        { text: '2 3', correct: false, feedback: '不对。' },
        { text: '无输出', correct: false, feedback: '不对，调用了 add(2,3)。' },
      ],
    },
    debug: {
      prompt: '下面代码用 ^ 当乘方（其实 ^ 是异或），请改成 **。',
      buggyCode: 'def square(n):\n    print(n ^ 2)\nsquare(5)\nsquare(9)',
      stdin: [],
      _ref: 'def square(n):\n    print(n ** 2)\nsquare(5)\nsquare(9)',
      expectedOutput: '25\n81',
      successFeedback: '修复成功！Python 里乘方是 **，不是 ^。',
      errorFeedback: '把 n ^ 2 改成 n ** 2。',
    },
    match: {
      prompt: '将左侧概念与右侧含义配对。',
      pairs: [
        { left: '形参', right: '函数定义时的参数名' },
        { left: '实参', right: '调用时传入的具体值' },
        { left: '**', right: '乘方运算' },
      ],
    },
  },

  // ---------------- 关卡 18 ----------------
  18: {
    run: {
      prompt: '定义全局变量 count = 0；写函数 add()，函数内用 global count 把它加 1 并输出。调用 add() 两次。',
      starterCode: '',
      stdin: [],
      _ref: 'count = 0\ndef add():\n    global count\n    count = count + 1\n    print(count)\nadd()\nadd()',
      expectedOutput: '1\n2',
      successFeedback: '作用域搞清楚了！这是很多 Bug 的根源，你已跨过。',
      errorFeedback: '请在函数内用 global count 声明全局变量，再 count += 1 并输出。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'x = 10\ndef f():\n    x = 99\n    print(x)\nf()\nprint(x)',
      stdin: [],
      options: [
        { text: '99\n10', correct: true, feedback: '正确！函数内 x 是局部变量 99，函数外 x 仍是全局 10。' },
        { text: '99\n99', correct: false, feedback: '不对，函数外的 x 没被改。' },
        { text: '10\n10', correct: false, feedback: '不对，函数内重新赋值了。' },
        { text: '报错', correct: false, feedback: '不会报错。' },
      ],
    },
    debug: {
      prompt: '下面函数内修改 count 却忘了 global 声明，会报错，请补上 global count。',
      buggyCode: 'count = 0\ndef add():\n    count = count + 1\n    print(count)\nadd()\nadd()',
      stdin: [],
      _ref: 'count = 0\ndef add():\n    global count\n    count = count + 1\n    print(count)\nadd()\nadd()',
      expectedOutput: '1\n2',
      successFeedback: '修复成功！函数内要改全局变量，必须先 global 声明。',
      errorFeedback: '在函数体第一行加上 global count。',
    },
    match: {
      prompt: '将左侧概念与右侧含义配对。',
      pairs: [
        { left: 'global', right: '声明使用全局变量' },
        { left: '局部变量', right: '函数内定义的变量' },
        { left: '全局变量', right: '函数外定义的变量' },
      ],
    },
  },

  // ---------------- 关卡 19 ----------------
  19: {
    run: {
      prompt: '给定 text = "  Python  "，先 strip() 去掉两端空格，再 upper() 转大写后输出。',
      starterCode: '',
      stdin: [],
      _ref: 'text = "  Python  "\nprint(text.strip().upper())',
      expectedOutput: 'PYTHON',
      successFeedback: '字符串方法掌握！文本清洗全靠它们。',
      errorFeedback: '请对 text 调用 .strip() 后再 .upper()，然后输出。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 's = "  hi  "\nprint(s.strip())',
      stdin: [],
      options: [
        { text: 'hi', correct: true, feedback: '正确！strip() 去掉了两端空格。' },
        { text: '  hi  ', correct: false, feedback: '不对，strip 会去除两端空白。' },
        { text: 'HI', correct: false, feedback: '不对，这里没用 upper。' },
        { text: 'hi  ', correct: false, feedback: '不对，结尾空格也被去掉了。' },
      ],
    },
    debug: {
      prompt: '下面代码用 .lower() 而非 .upper()，请改成 .upper()。',
      buggyCode: 'text = "  Python  "\nprint(text.strip().lower())',
      stdin: [],
      _ref: 'text = "  Python  "\nprint(text.strip().upper())',
      expectedOutput: 'PYTHON',
      successFeedback: '修复成功！转大写要用 upper()。',
      errorFeedback: '把 .lower() 改成 .upper()。',
    },
    match: {
      prompt: '将左侧字符串方法与右侧作用配对。',
      pairs: [
        { left: '.strip()', right: '去掉两端空白' },
        { left: '.upper()', right: '转为大写' },
        { left: '.split()', right: '按空白拆成列表' },
      ],
    },
  },

  // ---------------- 关卡 20 ----------------
  20: {
    run: {
      prompt: '写一个函数 check(guess, secret)：若 guess == secret 返回"猜对了"，guess < secret 返回"小了"，否则返回"大了"。然后调用并输出 check(3, 7) 与 check(9, 7)。',
      starterCode: '',
      stdin: [],
      _ref: 'def check(guess, secret):\n    if guess == secret:\n        return "猜对了"\n    elif guess < secret:\n        return "小了"\n    else:\n        return "大了"\nprint(check(3, 7))\nprint(check(9, 7))',
      expectedOutput: '小了\n大了',
      successFeedback: '游戏逻辑完成！你已能用条件比较组织交互式判断。',
      errorFeedback: '请用 if/elif/else 比较 guess 与 secret，并分别返回对应文字；最后调用两次并打印。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'secret = 7\nguess = 5\nif guess == secret:\n    print("中")\nelif guess < secret:\n    print("小")\nelse:\n    print("大")',
      stdin: [],
      options: [
        { text: '小', correct: true, feedback: '正确！5 < 7，走 elif 分支。' },
        { text: '中', correct: false, feedback: '不对，5 不等于 7。' },
        { text: '大', correct: false, feedback: '不对，5 比 7 小。' },
        { text: '无', correct: false, feedback: '不对，必有分支执行。' },
      ],
    },
    debug: {
      prompt: '下面代码把"小了"的判断写成了 guess > secret（应为 <），请修复。',
      buggyCode: 'def check(guess, secret):\n    if guess == secret:\n        return "猜对了"\n    elif guess > secret:\n        return "小了"\n    else:\n        return "大了"\nprint(check(3, 7))\nprint(check(9, 7))',
      stdin: [],
      _ref: 'def check(guess, secret):\n    if guess == secret:\n        return "猜对了"\n    elif guess < secret:\n        return "小了"\n    else:\n        return "大了"\nprint(check(3, 7))\nprint(check(9, 7))',
      expectedOutput: '小了\n大了',
      successFeedback: '修复成功！比秘密数小应当用 guess < secret。',
      errorFeedback: '把 elif guess > secret 改成 elif guess < secret。',
    },
    match: {
      prompt: '将左侧写法与右侧作用配对。',
      pairs: [
        { left: 'import random', right: '导入随机数模块' },
        { left: 'while True', right: '持续循环直到 break' },
        { left: 'break', right: '跳出循环' },
      ],
    },
  },

  // ---------------- 关卡 21 ----------------
  21: {
    run: {
      prompt: '用 with open 以写模式创建 "hello.txt" 写入 "Hello File"，再以读模式打开并输出其内容。',
      starterCode: '',
      stdin: [],
      _ref: 'with open("hello.txt", "w", encoding="utf-8") as f:\n    f.write("Hello File")\nwith open("hello.txt", "r", encoding="utf-8") as f:\n    print(f.read())',
      expectedOutput: 'Hello File',
      successFeedback: '文件读写掌握！持久化是真实项目的基础。',
      errorFeedback: '请用 with open(..., "w") 写文件，再用 "r" 读并用 print 输出 f.read()。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'with open("a.txt", "w", encoding="utf-8") as f:\n    f.write("x")\nwith open("a.txt", "r", encoding="utf-8") as f:\n    print(f.read())',
      stdin: [],
      options: [
        { text: 'x', correct: true, feedback: '正确！写入 "x" 后读出也是 "x"。' },
        { text: '无输出', correct: false, feedback: '不对，读到了内容并打印。' },
        { text: 'None', correct: false, feedback: '不对，read 返回文件内容。' },
        { text: 'xa.txt', correct: false, feedback: '不对。' },
      ],
    },
    debug: {
      prompt: '下面代码读取时直接 print(f) 打印了文件对象而非内容，请改成 print(f.read())。',
      buggyCode: 'with open("hello.txt", "w", encoding="utf-8") as f:\n    f.write("Hello File")\nwith open("hello.txt", "r", encoding="utf-8") as f:\n    print(f)',
      stdin: [],
      _ref: 'with open("hello.txt", "w", encoding="utf-8") as f:\n    f.write("Hello File")\nwith open("hello.txt", "r", encoding="utf-8") as f:\n    print(f.read())',
      expectedOutput: 'Hello File',
      successFeedback: '修复成功！要读取内容应使用 f.read()。',
      errorFeedback: '把 print(f) 改成 print(f.read())。',
    },
    match: {
      prompt: '将左侧文件模式与右侧含义配对。',
      pairs: [
        { left: '"w"', right: '写模式' },
        { left: '"r"', right: '读模式' },
        { left: 'with', right: '自动关闭文件' },
      ],
    },
  },

  // ---------------- 关卡 22 ----------------
  22: {
    run: {
      prompt: '用 try 读取整数 n，输出 100 除以 n 的结果；用 except 捕获异常，出错时输出"输入有误"。运行时输入：5',
      starterCode: '',
      stdin: ['5'],
      _ref: 'try:\n    n = int(input())\n    print(100 / n)\nexcept:\n    print("输入有误")',
      expectedOutput: '20.0',
      successFeedback: '异常处理到位！健壮的程序都懂得"兜底"。',
      errorFeedback: '请用 try 包裹可能出错的计算，except 中输出"输入有误"。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'try:\n    print(10 / 0)\nexcept:\n    print("错")',
      stdin: [],
      options: [
        { text: '错', correct: true, feedback: '正确！10/0 会抛异常，被 except 捕获并输出"错"。' },
        { text: '无穷大', correct: false, feedback: '不对，Python 会直接抛异常。' },
        { text: '10/0', correct: false, feedback: '不对。' },
        { text: '无输出', correct: false, feedback: '不对，except 分支有输出。' },
      ],
    },
    debug: {
      prompt: '下面 except 后漏了冒号，请补上。',
      buggyCode: 'try:\n    n = int(input())\n    print(100 / n)\nexcept\n    print("输入有误")',
      stdin: ['5'],
      _ref: 'try:\n    n = int(input())\n    print(100 / n)\nexcept:\n    print("输入有误")',
      expectedOutput: '20.0',
      successFeedback: '修复成功！except 后面也要加冒号。',
      errorFeedback: '在 except 后面补上冒号 :。',
    },
    match: {
      prompt: '将左侧异常处理概念与右侧含义配对。',
      pairs: [
        { left: 'try', right: '包裹可能出错的代码' },
        { left: 'except', right: '捕获并处理异常' },
        { left: '异常', right: '程序运行时的错误' },
      ],
    },
  },

  // ---------------- 关卡 23 ----------------
  23: {
    run: {
      prompt: '用列表推导式生成 1~5 每个数的立方，存进列表 cubes 并输出。',
      starterCode: '',
      stdin: [],
      _ref: 'cubes = [x ** 3 for x in range(1, 6)]\nprint(cubes)',
      expectedOutput: '[1, 8, 27, 64, 125]',
      successFeedback: '推导式上手！这是 Python 最优雅的语法之一。',
      errorFeedback: '请用 [x**3 for x in range(1, 6)] 形式生成立方列表并输出。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'evens = [x for x in range(6) if x % 2 == 0]\nprint(evens)',
      stdin: [],
      options: [
        { text: '[0, 2, 4]', correct: true, feedback: '正确！range(6) 为 0~5，其中偶数是 0、2、4。' },
        { text: '[1, 3, 5]', correct: false, feedback: '不对，那是奇数。' },
        { text: '[0, 1, 2, 3, 4, 5]', correct: false, feedback: '不对，加了 if 过滤。' },
        { text: '[2, 4]', correct: false, feedback: '不对，0 也是偶数且被包含。' },
      ],
    },
    debug: {
      prompt: '下面推导式用 ^ 当乘方（实际是异或），请改成 **。',
      buggyCode: 'cubes = [x ^ 3 for x in range(1, 6)]\nprint(cubes)',
      stdin: [],
      _ref: 'cubes = [x ** 3 for x in range(1, 6)]\nprint(cubes)',
      expectedOutput: '[1, 8, 27, 64, 125]',
      successFeedback: '修复成功！乘方用 **，不是 ^。',
      errorFeedback: '把 x ^ 3 改成 x ** 3。',
    },
    match: {
      prompt: '将左侧推导式语法与右侧含义配对。',
      pairs: [
        { left: '[... for ...]', right: '列表推导式' },
        { left: 'range(1, 6)', right: '生成 1 到 5' },
        { left: '推导式中的 if', right: '用于过滤元素' },
      ],
    },
  },

  // ---------------- 关卡 24 ----------------
  24: {
    run: {
      prompt: '定义 scores = {"math": 90, "english": 85}，用 .get("pe", 0) 取一门不存在的课（默认 0）并输出；再遍历 items 打印每科成绩（每行"科目 分数"）。',
      starterCode: '',
      stdin: [],
      _ref: 'scores = {"math": 90, "english": 85}\nprint(scores.get("pe", 0))\nfor k, v in scores.items():\n    print(k, v)',
      expectedOutput: '0\nmath 90\nenglish 85',
      successFeedback: '字典进阶！.get 与 items 是实战高频用法。',
      errorFeedback: '请用 .get("pe", 0) 取值，并用 for k, v in scores.items() 遍历输出。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'd = {"a": 1, "b": 2}\nprint(d.get("c", 0))',
      stdin: [],
      options: [
        { text: '0', correct: true, feedback: '正确！键 "c" 不存在，返回默认值 0。' },
        { text: 'None', correct: false, feedback: '不对，给了默认值 0 就不会返回 None。' },
        { text: '报错', correct: false, feedback: '不会报错，get 遇到缺键会返回默认值。' },
        { text: '1', correct: false, feedback: '不对，1 是键 "a" 的值。' },
      ],
    },
    debug: {
      prompt: '下面遍历写成了 scores.item()（少了 s），请改成 scores.items()。',
      buggyCode: 'scores = {"math": 90, "english": 85}\nprint(scores.get("pe", 0))\nfor k, v in scores.item():\n    print(k, v)',
      stdin: [],
      _ref: 'scores = {"math": 90, "english": 85}\nprint(scores.get("pe", 0))\nfor k, v in scores.items():\n    print(k, v)',
      expectedOutput: '0\nmath 90\nenglish 85',
      successFeedback: '修复成功！遍历键值对要用 .items()。',
      errorFeedback: '把 scores.item() 改成 scores.items()。',
    },
    match: {
      prompt: '将左侧字典方法与右侧作用配对。',
      pairs: [
        { left: '.get(k, d)', right: '键不存在时返回默认值' },
        { left: '.items()', right: '遍历键和值' },
        { left: '.keys()', right: '遍历所有键' },
      ],
    },
  },

  // ---------------- 关卡 25 ----------------
  25: {
    run: {
      prompt: '导入 math 模块，输出 2 的 10 次方（用 math.pow）与圆周率 math.pi。',
      starterCode: '',
      stdin: [],
      _ref: 'import math\nprint(math.pow(2, 10))\nprint(math.pi)',
      expectedOutput: '1024.0\n3.141592653589793',
      successFeedback: '模块导入掌握！标准库是你的工具箱。',
      errorFeedback: '请 import math，并用 math.pow(2, 10) 与 math.pi 做输出。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'import math\nprint(math.sqrt(16))',
      stdin: [],
      options: [
        { text: '4.0', correct: true, feedback: '正确！math.sqrt(16) 返回 4.0。' },
        { text: '4', correct: false, feedback: '接近，但 sqrt 返回浮点数 4.0。' },
        { text: '2', correct: false, feedback: '不对，2 是 16 的平方根的另一种理解错误。' },
        { text: '16', correct: false, feedback: '不对。' },
      ],
    },
    debug: {
      prompt: '下面代码把 math.pi 拼错成 math.pie，请改成 math.pi。',
      buggyCode: 'import math\nprint(math.pow(2, 10))\nprint(math.pie)',
      stdin: [],
      _ref: 'import math\nprint(math.pow(2, 10))\nprint(math.pi)',
      expectedOutput: '1024.0\n3.141592653589793',
      successFeedback: '修复成功！圆周率常量名为 math.pi。',
      errorFeedback: '把 math.pie 改成 math.pi。',
    },
    match: {
      prompt: '将左侧模块写法与右侧作用配对。',
      pairs: [
        { left: 'import', right: '导入模块' },
        { left: 'math.pow', right: '计算乘方' },
        { left: 'math.pi', right: '圆周率常量' },
      ],
    },
  },

  // ---------------- 关卡 26 ----------------
  26: {
    run: {
      prompt: '定义类 Cat，__init__ 接收 name，并定义一个方法 meow() 输出 "<名字>：喵~"。创建实例 c = Cat("咪咪") 并调用 meow()。',
      starterCode: '',
      stdin: [],
      _ref: 'class Cat:\n    def __init__(self, name):\n        self.name = name\n    def meow(self):\n        print(self.name + "：喵~")\nc = Cat("咪咪")\nc.meow()',
      expectedOutput: '咪咪：喵~',
      successFeedback: '面向对象入门！类让复杂程序更有序。',
      errorFeedback: '请用 class 定义 Cat，__init__ 初始化 name，并定义 meow 方法输出 self.name。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'class Dog:\n    def __init__(self, name):\n        self.name = name\nd = Dog("小白")\nprint(d.name)',
      stdin: [],
      options: [
        { text: '小白', correct: true, feedback: '正确！实例属性 name 的值是"小白"。' },
        { text: 'Dog', correct: false, feedback: '不对，输出的是属性值。' },
        { text: '无输出', correct: false, feedback: '不对，print 了 d.name。' },
        { text: '小白：喵~', correct: false, feedback: '不对，这里没有 meow 方法。' },
      ],
    },
    debug: {
      prompt: '下面 meow 里把 self.name 误写成 name（未定义），请改成 self.name。',
      buggyCode: 'class Cat:\n    def __init__(self, name):\n        self.name = name\n    def meow(self):\n        print(name + "：喵~")\nc = Cat("咪咪")\nc.meow()',
      stdin: [],
      _ref: 'class Cat:\n    def __init__(self, name):\n        self.name = name\n    def meow(self):\n        print(self.name + "：喵~")\nc = Cat("咪咪")\nc.meow()',
      expectedOutput: '咪咪：喵~',
      successFeedback: '修复成功！方法内部访问实例属性要用 self.name。',
      errorFeedback: '把 print(name + ...) 改成 print(self.name + ...)。',
    },
    match: {
      prompt: '将左侧面向对象概念与右侧含义配对。',
      pairs: [
        { left: 'class', right: '定义类' },
        { left: '__init__', right: '初始化对象属性' },
        { left: 'self', right: '指代当前实例' },
      ],
    },
  },

  // ---------------- 关卡 27 ----------------
  27: {
    run: {
      prompt: '定义父类 Animal（含方法 eat() 输出"进食"），子类 Bird(Animal)（新增方法 fly() 输出"飞翔"）。创建 Bird 实例并调用 eat() 与 fly()。',
      starterCode: '',
      stdin: [],
      _ref: 'class Animal:\n    def eat(self):\n        print("进食")\nclass Bird(Animal):\n    def fly(self):\n        print("飞翔")\nb = Bird()\nb.eat()\nb.fly()',
      expectedOutput: '进食\n飞翔',
      successFeedback: '继承理解到位！这是构建大型系统的基石。',
      errorFeedback: '请定义父类 Animal 含 eat()，子类 Bird(Animal) 含 fly()，并调用两者。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'class A:\n    def hi(self):\n        print("A")\nclass B(A):\n    pass\nB().hi()',
      stdin: [],
      options: [
        { text: 'A', correct: true, feedback: '正确！子类 B 继承了父类的 hi()，输出 A。' },
        { text: 'B', correct: false, feedback: '不对，输出的是方法内部内容。' },
        { text: '无输出', correct: false, feedback: '不对，调用了 hi()。' },
        { text: '报错', correct: false, feedback: '不会报错。' },
      ],
    },
    debug: {
      prompt: '下面子类定义 class Bird(Animal) 末尾漏了冒号，请补上。',
      buggyCode: 'class Animal:\n    def eat(self):\n        print("进食")\nclass Bird(Animal)\n    def fly(self):\n        print("飞翔")\nb = Bird()\nb.eat()\nb.fly()',
      stdin: [],
      _ref: 'class Animal:\n    def eat(self):\n        print("进食")\nclass Bird(Animal):\n    def fly(self):\n        print("飞翔")\nb = Bird()\nb.eat()\nb.fly()',
      expectedOutput: '进食\n飞翔',
      successFeedback: '修复成功！class 定义后面也要加冒号。',
      errorFeedback: '在 class Bird(Animal) 后面加上冒号 :。',
    },
    match: {
      prompt: '将左侧继承概念与右侧含义配对。',
      pairs: [
        { left: '子类(父类)', right: '表示继承' },
        { left: '继承', right: '复用父类的方法' },
        { left: '方法重写', right: '子类中重新定义父类方法' },
      ],
    },
  },

  // ---------------- 关卡 28 ----------------
  28: {
    run: {
      prompt: '定义装饰器 shout，它包裹的函数返回值会被转成大写（用 .upper()）。用 @shout 装饰函数 greet() 返回 "hello"，输出结果。',
      starterCode: '',
      stdin: [],
      _ref: 'def shout(func):\n    def wrapper():\n        return func().upper()\n    return wrapper\n@shout\ndef greet():\n    return "hello"\nprint(greet())',
      expectedOutput: 'HELLO',
      successFeedback: '装饰器入门！它是框架与日志的常用手段。',
      errorFeedback: '请定义装饰器 shout，用 .upper() 加工返回值，并 @shout 装饰 greet 再输出。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'def shout(func):\n    def wrapper():\n        return func().upper()\n    return wrapper\n@shout\ndef greet():\n    return "hello"\nprint(greet())',
      stdin: [],
      options: [
        { text: 'HELLO', correct: true, feedback: '正确！装饰器把返回值转成了大写。' },
        { text: 'hello', correct: false, feedback: '不对，装饰器会加工返回值。' },
        { text: 'HELLO()', correct: false, feedback: '不对，输出的是返回值本身。' },
        { text: '无输出', correct: false, feedback: '不对，print 了 greet()。' },
      ],
    },
    debug: {
      prompt: '下面装饰器把 .upper() 误写成 .lower()，请改成 .upper()。',
      buggyCode: 'def shout(func):\n    def wrapper():\n        return func().lower()\n    return wrapper\n@shout\ndef greet():\n    return "hello"\nprint(greet())',
      stdin: [],
      _ref: 'def shout(func):\n    def wrapper():\n        return func().upper()\n    return wrapper\n@shout\ndef greet():\n    return "hello"\nprint(greet())',
      expectedOutput: 'HELLO',
      successFeedback: '修复成功！转大写要用 upper()。',
      errorFeedback: '把 .lower() 改成 .upper()。',
    },
    match: {
      prompt: '将左侧装饰器概念与右侧含义配对。',
      pairs: [
        { left: '@装饰器', right: '应用装饰器到函数' },
        { left: 'wrapper', right: '装饰器内部包装函数' },
        { left: 'return func()', right: '调用原函数的返回值' },
      ],
    },
  },

  // ---------------- 关卡 29 ----------------
  29: {
    run: {
      prompt: '写生成器 gen_squares(n)，依次 yield 1~n 每个数的平方。用 for 遍历 gen_squares(4) 输出。',
      starterCode: '',
      stdin: [],
      _ref: 'def gen_squares(n):\n    i = 1\n    while i <= n:\n        yield i ** 2\n        i = i + 1\nfor x in gen_squares(4):\n    print(x)',
      expectedOutput: '1\n4\n9\n16',
      successFeedback: '生成器掌握！处理大数据流时它极其高效。',
      errorFeedback: '请用 def + yield 定义生成器，依次 yield 平方值，并用 for 遍历输出。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'def gen():\n    yield 1\n    yield 2\nfor x in gen():\n    print(x)',
      stdin: [],
      options: [
        { text: '1\n2', correct: true, feedback: '正确！生成器依次产出 1、2。' },
        { text: '1 2', correct: false, feedback: '不对，每个值各占一行。' },
        { text: '[1, 2]', correct: false, feedback: '不对，不是列表。' },
        { text: '无输出', correct: false, feedback: '不对，for 会遍历产出。' },
      ],
    },
    debug: {
      prompt: '下面生成器误用 return 而非 yield（只会返回一次就结束），请改成 yield。',
      buggyCode: 'def gen_squares(n):\n    i = 1\n    while i <= n:\n        return i ** 2\n        i = i + 1\nfor x in gen_squares(4):\n    print(x)',
      stdin: [],
      _ref: 'def gen_squares(n):\n    i = 1\n    while i <= n:\n        yield i ** 2\n        i = i + 1\nfor x in gen_squares(4):\n    print(x)',
      expectedOutput: '1\n4\n9\n16',
      successFeedback: '修复成功！生成器要用 yield 才能逐个产出。',
      errorFeedback: '把 return i ** 2 改成 yield i ** 2。',
    },
    match: {
      prompt: '将左侧生成器概念与右侧含义配对。',
      pairs: [
        { left: 'yield', right: '暂停并产出一个值' },
        { left: '生成器', right: '按需产出值的函数' },
        { left: 'next()', right: '取下一个值' },
      ],
    },
  },

  // ---------------- 关卡 30 ----------------
  30: {
    run: {
      prompt: '定义 Student 类（name, score），用列表存 3 名学生；写函数 average(students) 返回平均分；遍历输出每位姓名与成绩，并输出平均分。',
      starterCode: '',
      stdin: [],
      _ref: 'class Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\nstudents = [Student("A", 90), Student("B", 80), Student("C", 70)]\ndef average(students):\n    return sum(s.score for s in students) / len(students)\nfor s in students:\n    print(s.name, s.score)\nprint("平均分：", average(students))',
      expectedOutput: 'A 90\nB 80\nC 70\n平均分： 80.0',
      successFeedback: '毕业项目完成！你已具备用 Python 组织真实问题的能力。',
      errorFeedback: '请定义 Student 类、用列表管理、写 average 函数，并遍历输出与打印平均分。',
    },
    predict: {
      prompt: '下面代码的输出是？',
      code: 'class Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\nst = Student("A", 90)\nprint(st.name, st.score)',
      stdin: [],
      options: [
        { text: 'A 90', correct: true, feedback: '正确！实例属性被打印出来。' },
        { text: '90 A', correct: false, feedback: '不对，顺序是 name 在前。' },
        { text: 'Student', correct: false, feedback: '不对。' },
        { text: '无输出', correct: false, feedback: '不对，print 了属性。' },
      ],
    },
    debug: {
      prompt: '下面 average 函数里把 len(students) 误写成 len(student)（未定义），请改成 len(students)。',
      buggyCode: 'class Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\nstudents = [Student("A", 90), Student("B", 80), Student("C", 70)]\ndef average(students):\n    return sum(s.score for s in students) / len(student)\nfor s in students:\n    print(s.name, s.score)\nprint("平均分：", average(students))',
      stdin: [],
      _ref: 'class Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\nstudents = [Student("A", 90), Student("B", 80), Student("C", 70)]\ndef average(students):\n    return sum(s.score for s in students) / len(students)\nfor s in students:\n    print(s.name, s.score)\nprint("平均分：", average(students))',
      expectedOutput: 'A 90\nB 80\nC 70\n平均分： 80.0',
      successFeedback: '修复成功！变量名要前后一致。',
      errorFeedback: '把 len(student) 改成 len(students)。',
    },
    match: {
      prompt: '将左侧综合概念与右侧含义配对。',
      pairs: [
        { left: '类', right: '封装数据与行为' },
        { left: '列表', right: '管理多个对象' },
        { left: '函数', right: '封装可复用的计算' },
      ],
    },
  },
};

// =====================================================================
// 主流程
// =====================================================================
const v4 = JSON.parse(readFileSync(SRC, 'utf8'));
const v4ById = new Map(v4.levels.map((l) => [l.id, l]));
const errors = [];

function stripInternal(obj) {
  // 去掉构建期内部字段
  const { _ref, _sol, ...rest } = obj;
  return rest;
}

const levels = [];
for (const id of Object.keys(MODES).map(Number).sort((a, b) => a - b)) {
  const m = MODES[id];
  const meta = v4ById.get(id);
  if (!meta) {
    errors.push(`关卡 ${id} 在 v4 源中缺失`);
    continue;
  }

  // --- 校验 runnable 模式的参考解（运行验证 / 找错改错，均使用 _ref） ---
  const INTERNAL_KEY = { run: '_ref', debug: '_ref' };
  for (const modeName of ['run', 'debug']) {
    const mode = m[modeName];
    if (!mode) continue;
    const internalKey = INTERNAL_KEY[modeName];
    if (mode[internalKey] == null) {
      errors.push(`关卡 ${id} 的 ${modeName} 缺少 ${internalKey} 参考解`);
      continue;
    }
    let out;
    const code = mode[internalKey];
    try {
      out = pyRun(code, mode.stdin || []);
    } catch (e) {
      errors.push(`关卡 ${id} 的 ${modeName} 参考解执行失败: ${e.message}`);
      continue;
    }
    const got = norm(out);
    if (got !== norm(mode.expectedOutput)) {
      errors.push(
        `关卡 ${id} 的 ${modeName} 输出不符。期望:\n«${mode.expectedOutput}»\n实际:\n«${got}»`
      );
    }
  }

  // --- 校验 predict 的正确选项 ---
  const pred = m.predict;
  if (pred) {
    const correct = pred.options.filter((o) => o.correct);
    if (correct.length !== 1) {
      errors.push(`关卡 ${id} 的 predict 必须有且仅有一个正确选项（当前 ${correct.length} 个）`);
    }
    let out;
    try {
      out = pyRun(pred.code, pred.stdin || []);
    } catch (e) {
      errors.push(`关卡 ${id} 的 predict 代码执行失败: ${e.message}`);
      continue;
    }
    const got = norm(out);
    if (correct.length === 1 && norm(correct[0].text) !== got) {
      errors.push(`关卡 ${id} 的 predict 正确选项文本与实际运行输出不符。选项:\n«${correct[0].text}»\n实际:\n«${got}»`);
    }
  }

  // --- 校验 match ---
  const mat = m.match;
  if (mat) {
    if (!mat.pairs || mat.pairs.length < 2) {
      errors.push(`关卡 ${id} 的 match 至少需要 2 对配对`);
    }
  }

  // --- 组装新关卡对象（剔除内部字段） ---
  const level = {
    id: meta.id,
    title: meta.title,
    description: meta.description,
    objectives: meta.objectives,
    example: meta.example,
    challenge: meta.challenge,
    hints: meta.hints,
    difficulty: meta.difficulty,
    category: meta.category,
    tags: meta.tags,
    phase: meta.phase,
    phaseName: meta.phaseName,
    isMiniProject: meta.isMiniProject,
    questionTypes: ['run', 'predict', 'debug', 'match'],
    defaultType: 'run',
    run: stripInternal(m.run),
    predict: stripInternal(m.predict),
    debug: stripInternal(m.debug),
    match: stripInternal(m.match),
  };
  levels.push(level);
}

if (levels.length !== 30) {
  errors.push(`生成关卡数不为 30（实际 ${levels.length}）`);
}

if (errors.length) {
  console.error('❌ 构建校验失败：');
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}

const out = {
  metadata: {
    version: '5.1.0',
    totalLevels: 30,
    difficulty: '入门到大师',
    estimatedTime: '10-20小时',
    lastUpdated: '2026-11-12',
    redesignedBy: '答题模式重构 v5：运行验证 / 预测输出 / 找错改错 / 配对分类（拖拽组装已移除，Pyodide 真实运行）',
  },
  levels,
};

writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(`✅ 已生成 ${OUT}（v5.1.0，${levels.length} 关，全部参考解经 python3 校验通过）`);
