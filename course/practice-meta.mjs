/**
 * 练习元数据：为 30 节提供考点标签与「不泄露答案」的改错题干。
 *
 * 背景：v5.1 的改错题干有 27/30 直接把答案写出来（如「请改成 math.pi」），
 * 学习者无需理解即可照抄，考查失效。这里改为只描述程序意图与现象，
 * 不指出错误位置、不给出正确写法；具体引导交给分级提示与解析。
 *
 * concept 同时用于：练习区的考点标签、预测/配对题干的具体化、成功反馈的陈述式改写。
 */
export const defaultList = [
  { id: 1,  concept: 'print() 输出与字符串字面量', primaryMode: 'run', debug: '下面这段程序想依次输出两句话，但运行时报错。请定位并修正错误，使其输出预期内容。' },
  { id: 2,  concept: '变量赋值与字符串拼接', primaryMode: 'debug', debug: '下面这段程序想把数值与文字拼接后输出，但运行时报错。请定位并修正错误，使其输出预期内容。' },
  { id: 3,  concept: '整除 // 与普通除法 /', primaryMode: 'run', debug: '下面这段程序想输出整除商，但输出与预期不符。请定位并修正错误。' },
  { id: 4,  concept: 'f-string 与格式说明符', primaryMode: 'predict', debug: '下面这段程序想输出一段带空格的短语及其长度，但输出与预期不符。请定位并修正错误。' },
  { id: 5,  concept: '综合：变量、运算与格式化输出', primaryMode: 'run', debug: '下面这段程序想用格式化字符串输出信息卡，但输出与预期不符。请定位并修正错误。' },
  { id: 6,  concept: 'input() 返回值恒为字符串', primaryMode: 'debug', debug: '下面这段程序想读入一行内容后拼接输出，但运行时报错。请定位并修正错误。' },
  { id: 7,  concept: 'int()/float() 显式类型转换', primaryMode: 'debug', debug: '下面这段程序想读入一个整数再做加法，但运行时报错。请定位并修正错误。' },
  { id: 8,  concept: '比较运算符与 if 语句', primaryMode: 'predict', debug: '下面这段程序想按阈值判断并输出结论，但运行时报错。请定位并修正错误。' },
  { id: 9,  concept: 'if / elif / else 语法结构', primaryMode: 'predict', debug: '下面这段程序想按分数划分等级，但存在语法错误。请定位并修正，使其输出预期内容。' },
  { id: 10, concept: '综合：输入、转换与分支', primaryMode: 'run', debug: '下面这段程序想按运算符选择不同的计算，但存在语法错误。请定位并修正。' },
  { id: 11, concept: 'while 循环边界与终止条件', primaryMode: 'predict', debug: '下面这段程序想输出 1 到 5，但实际输出少了一行。请定位并修正错误。' },
  { id: 12, concept: '列表索引从 0 开始', primaryMode: 'match', debug: '下面这段程序想输出列表的第一个元素，但输出了别的内容。请定位并修正错误。' },
  { id: 13, concept: 'for 循环与 range()', primaryMode: 'predict', debug: '下面这段程序想遍历一组数据并逐行输出，但存在语法错误。请定位并修正。' },
  { id: 14, concept: '切片左闭右开与排序', primaryMode: 'debug', debug: '下面这段程序想输出列表的前两个元素，但多输出了一个。请定位并修正错误。' },
  { id: 15, concept: '字典按键取值与键名', primaryMode: 'match', debug: '下面这段程序想读取字典中某个字段的值，但运行时报错。请定位并修正错误。' },
  { id: 16, concept: 'def 定义与 return 返回', primaryMode: 'debug', debug: '下面这段程序想定义并调用一个函数，但存在语法错误。请定位并修正。' },
  { id: 17, concept: '乘方 ** 与参数形式', primaryMode: 'run', debug: '下面这段程序想计算乘方，但运算结果与预期不符。请定位并修正错误。' },
  { id: 18, concept: '作用域与 global 声明', primaryMode: 'match', debug: '下面这段程序想在函数内累加计数，但运行时报错。请定位并修正错误。' },
  { id: 19, concept: '字符串方法返回新对象', primaryMode: 'predict', debug: '下面这段程序想把文本转为大写输出，但输出与预期不符。请定位并修正错误。' },
  { id: 20, concept: '综合：函数返回值驱动分支', primaryMode: 'run', debug: '下面这段程序想按数值大小给出提示，但某个分支的判断方向不对。请定位并修正错误。' },
  { id: 21, concept: 'with 读写文件与 read()', primaryMode: 'match', debug: '下面这段程序想输出文件里的文字，但屏幕上显示的是别的内容。请定位并修正错误。' },
  { id: 22, concept: 'try / except 异常分支', primaryMode: 'debug', debug: '下面这段程序想捕获转换失败的情况，但存在语法错误。请定位并修正。' },
  { id: 23, concept: '列表推导式与表达式', primaryMode: 'match', debug: '下面这段程序想生成一组平方数，但运算结果与预期不符。请定位并修正错误。' },
  { id: 24, concept: 'items() 遍历键值对', primaryMode: 'run', debug: '下面这段程序想遍历字典的键值对，但运行时报错。请定位并修正错误。' },
  { id: 25, concept: 'import 与标准库成员名', primaryMode: 'debug', debug: '下面这段程序想输出圆周率，但运行时报错。请定位并修正错误。' },
  { id: 26, concept: '实例属性与 self', primaryMode: 'match', debug: '下面这段程序想输出对象的名称，但运行时报错。请定位并修正错误。' },
  { id: 27, concept: 'class 继承与 super()', primaryMode: 'debug', debug: '下面这段程序想定义一个子类，但存在语法错误。请定位并修正。' },
  { id: 28, concept: '装饰器包装函数', primaryMode: 'predict', debug: '下面这段程序想把返回值转成大写输出，但输出与预期不符。请定位并修正错误。' },
  { id: 29, concept: 'yield 与生成器', primaryMode: 'match', debug: '下面这段程序想依次产出多个值，但实际只产出了一个。请定位并修正错误。' },
  { id: 30, concept: '综合：类、列表与异常', primaryMode: 'run', debug: '下面这段程序想统计一组记录的平均分，但运行时报错。请定位并修正错误。' },
];

/**
 * 第 5 节题目原本沿用「英雄 / 亚瑟 / 战士 / 战力」的游戏设定，与 v6 教程
 * 「学生信息卡」的语境完全脱节。这里整体替换为与教程一致的数据，
 * 且保持「改错代码确实有缺陷」「预测代码输出等于正确选项」两条校验成立。
 */
export const overrides = {
  5: {
    run: {
      prompt: '定义 name = "林晓"、age = 16、city = "杭州"，用 f-string 逐行输出：姓名：林晓 / 年龄：16 / 城市：杭州。',
      expectedOutput: '姓名：林晓\n年龄：16\n城市：杭州',
      errorFeedback: '请分别定义三个变量，再用三个 f-string 各输出一行。',
    },
    predict: {
      code: 'name = "林晓"\nprint(f"你好，{name}")',
      options: [
        { text: '你好，林晓', correct: true, feedback: '正确。{name} 会被替换成变量的值。' },
        { text: '你好，name', correct: false, feedback: '不正确。花括号里是变量名，会替换成它的值。' },
        { text: '你好，{name}', correct: false, feedback: '不正确。花括号内的表达式会被求值。' },
        { text: '林晓 你好', correct: false, feedback: '不正确。输出顺序与代码中的文字顺序一致。' },
      ],
    },
    debug: {
      buggyCode: 'name = "林晓"\nage = 16\ncity = "杭州"\nprint(f"姓名：name")\nprint(f"年龄：{age}")\nprint(f"城市：{city}")',
      expectedOutput: '姓名：林晓\n年龄：16\n城市：杭州',
    },
    match: {
      pairs: [
        { left: 'f-string', right: '用 {变量} 把值嵌入字符串' },
        { left: '变量', right: '给数据起名字并保存值' },
        { left: 'print()', right: '把内容输出到屏幕' },
      ],
    },
  },
};

export default defaultList;
