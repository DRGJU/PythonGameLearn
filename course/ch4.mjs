export default {
  id: 4,
  title: '函数与文本处理',
  subtitle: '把可复用的逻辑封装成函数，并掌握字符串的常用处理手段',
  intro: '当同一段逻辑需要在多处使用时，复制粘贴会迅速让程序难以维护。函数（function）解决这个问题：给一段代码起名字、声明它需要的输入、明确它返回的结果。本章还会系统整理字符串方法，因为文本处理是函数最常见的应用场景。学完本章，你应能把一个较复杂的需求拆成若干职责单一的函数。',
  lessons: [
    {
      id: 16,
      title: '定义并调用函数',
      minutes: 30,
      objectives: [
        '能说明 def、参数、return 三部分的作用',
        '能区分「返回值」与「打印输出」',
        '能解释函数被调用时才执行',
        '能为函数写出清晰的命名与文档字符串'
      ],
      blocks: [
        {
          type: 'lead',
          text: '此前写的代码都是从上到下顺序执行，且只执行一次。函数让你可以把一段逻辑「存起来」，在需要时按名字调用多次。理解函数的关键不在语法，而在两个概念：参数是你交给它的数据，返回值是它交还给你的结果。'
        },
        {
          type: 'prose',
          title: '定义、调用与执行时机',
          paras: [
            '函数用 def 关键字定义，形式是 def 函数名(参数列表):，其后缩进的语句是函数体。定义语句本身**不执行**函数体，只是把这段逻辑绑定到函数名上；只有写出函数名() 这样的调用表达式，函数体才会执行。这一区别解释了为什么把定义放在文件末尾会导致 NameError——调用发生时名字尚未绑定。',
            '参数（parameter）写在括号内，调用时传入的具体值叫实参（argument）。函数体内部通过参数名访问这些值。一个函数可以没有参数，但括号不能省略；调用时同样必须写括号，否则只是引用函数对象本身，并不会执行它。',
            'return 语句把结果交还调用者并立即结束函数。若函数没有 return，或 return 后不带值，则返回 None。要特别区分 print() 与 return：print() 把内容显示到屏幕，是给人看的副作用；return 把值交给调用方，可以继续参与运算。混淆二者，是初学者写函数时最常见的困惑。'
          ]
        },
        {
          type: 'code',
          title: '定义、调用与返回值',
          code: String.raw`def greet(name):
    return '你好，' + name

message = greet('林晓')
print(message)
print(greet('陈默'))
result = greet('王同学')
print('返回值类型', type(result))
print('长度', len(result))`,
          output: String.raw`你好，林晓
你好，陈默
返回值类型 <class 'str'>
长度 6`,
          explain: [
            'def greet(name): 定义函数，函数体只有一行 return，把拼接结果交还调用者。',
            '第 1 次调用把返回值绑定到 message，再由 print() 输出；函数本身没有打印任何内容。',
            '第 2 次调用直接把返回值交给 print()，说明返回值可以像普通值一样使用。',
            '最后两行验证返回的是字符串类型，且「你好，王同学」共 6 个字符（含中文逗号）。'
          ]
        },
        {
          type: 'prose',
          title: '职责单一与命名',
          paras: [
            '一个函数最好只做一件事。判断标准很简单：如果你需要用「并且」来描述它做什么，通常就该拆成两个函数。例如「读取数据并计算平均分」应拆为读取与计算两部分，这样每部分都能单独测试，也更容易复用。',
            '函数名用动词短语描述行为，例如 calculate_average、is_valid、format_card；返回布尔值的函数常用 is_ / has_ 前缀，让调用处的 if is_valid(x): 读起来接近自然语言。参数名应说明数据含义，而不是简单写 a、b。',
            '可以在函数体第一行写三引号字符串作为文档字符串（docstring），说明用途、参数与返回值。它会被保存到函数的 __doc__ 属性，也会被 IDE 与文档工具读取。对于超过十几行的函数，这几行说明能显著降低后续维护成本。'
          ]
        },
        {
          type: 'code',
          title: '拆分职责与文档字符串',
          code: String.raw`def total(scores):
    """返回分数列表的总和。"""
    sum_value = 0
    for s in scores:
        sum_value += s
    return sum_value

def average(scores):
    """返回平均分，空列表返回 0。"""
    if len(scores) == 0:
        return 0
    return total(scores) / len(scores)

data = [88, 95, 91]
print('总和', total(data))
print('平均', round(average(data), 2))
print('空表', average([]))
print('说明', total.__doc__)`,
          output: String.raw`总和 274
平均 91.33
空表 0
说明 返回分数列表的总和。`,
          explain: [
            'total 只负责求和，average 复用 total 再除以个数，体现「一个函数一件事」。',
            'average 对空列表做了保护，避免除零；这类边界处理应在函数内部完成。',
            '文档字符串通过 __doc__ 读取，最后一行输出了 total 的说明文本。',
            '注意 total 内部用局部变量 sum_value 累加，避免与内置函数名 sum 冲突。'
          ]
        },
        {
          type: 'table',
          title: '函数要素速查',
          head: ['要素', '写法', '作用'],
          rows: [
            ['定义', 'def f(x):', '绑定函数对象，不执行函数体'],
            ['参数', 'def f(a, b):', '声明调用时需提供的数据'],
            ['返回', 'return value', '交还结果并结束函数'],
            ['调用', 'f(1, 2)', '执行函数体，得到返回值'],
            ['无返回', '省略 return', '隐式返回 None'],
            ['文档字符串', '"""说明"""', '写入 __doc__ 供工具读取']
          ]
        },
        {
          type: 'pitfalls',
          title: '常见错误与排查',
          items: [
            {
              wrong: '定义函数后没有写括号调用，写成 greet',
              why: '这只是引用函数对象，函数体不会执行。',
              right: '写成 greet(\'林晓\')。'
            },
            {
              wrong: '在函数内 print(result) 却期望外部能拿到值',
              why: '打印是副作用，不会把值交还调用者；外部得到的是 None。',
              right: '改用 return result。'
            },
            {
              wrong: '把调用写在 def 之前',
              why: '调用时函数名尚未绑定，抛出 NameError。',
              right: '确保定义语句在调用之前执行，或统一放到 main 结构里。'
            },
            {
              wrong: '无参函数定义时漏写括号 def f:',
              why: '语法错误，def 后必须跟参数列表括号。',
              right: '写成 def f():，调用时同样写 f()。'
            }
          ]
        },
        {
          type: 'summary',
          title: '知识小结',
          items: [
            'def 只定义不执行；函数名加括号才触发调用。',
            '参数接收外部数据，return 交还结果并结束函数。',
            '无 return 的函数返回 None；print() 不等于 return。',
            '函数应职责单一，命名用动词短语，布尔函数常用 is_ 前缀。',
            '文档字符串写在函数体首行，可通过 __doc__ 访问。'
          ]
        },
        {
          type: 'review',
          title: '巩固练习解析',
          paras: [
            '「运行验证」通常要求定义函数并调用两次，注意输出来自调用处的 print()，而不是函数内部的打印；若函数内部也 print，输出行数会翻倍。',
            '「预测输出」常把返回值继续参与运算，考查你是否理解 return 与 print 的区别。遇到 f(g(x)) 形式，先算内层返回值再代入外层。',
            '「找错改错」高频错误是漏写 return、调用时漏括号、以及定义在调用之后。若输出多出 None，通常说明把无返回值的函数调用直接交给了 print()。',
            '「配对分类」把 def、参数、return、调用与职责对应，检验你能否准确描述一次函数调用中数据的流向。'
          ]
        }
      ]
    },
    {
      id: 17,
      title: '参数：默认值、关键字与可变参数',
      minutes: 30,
      objectives: [
        '能区分位置参数与关键字参数',
        '能正确使用默认参数并说明其约束',
        '能说明 *args 与 **kwargs 的用途',
        '能解释「默认参数不使用可变对象」的原因'
      ],
      blocks: [
        {
          type: 'lead',
          text: '函数调用的真正灵活性来自参数机制。除了最基础的位置传参，Python 还支持默认值、按名传参以及接收任意数量参数。这些机制让同一个函数能适应不同复杂度的调用场景，但也带来了几条必须遵守的约束。'
        },
        {
          type: 'prose',
          title: '位置参数、默认值与关键字参数',
          paras: [
            '按位置传参是最基本形式：f(1, 2) 中 1 对应第一个参数、2 对应第二个。也可以按名传参写成 f(b=2, a=1)，此时顺序不再重要，可读性更好，尤其当参数较多或含义不直观时。两种方式可以混用，但位置参数必须出现在关键字参数之前。',
            '默认参数在定义时写成 def f(x, unit=\'分\'):，调用时省略该参数就使用默认值。约束有两条：有默认值的参数必须放在无默认值参数之后；默认值在函数**定义时**求值一次，而不是每次调用重新创建。因此把列表或字典作为默认值是危险的——多次调用会共享同一个可变对象，出现「上一次的修改残留到下一次」的现象。正确做法是用 None 作默认值，在函数体内按需创建新对象。',
            '*args 把多余的**位置**实参收集为元组，**kwargs 把多余的**关键字**实参收集为字典。它们常用于编写包装函数或把参数原样转发给另一个函数。命名并非强制，但 args / kwargs 是广泛遵循的约定。'
          ]
        },
        {
          type: 'code',
          title: '位置、关键字与默认参数',
          code: String.raw`def describe(name, score, unit='分'):
    return f'{name}：{score}{unit}'

print(describe('林晓', 92))
print(describe('陈默', 88, '分'))
print(describe(score=95, name='王同学'))
print(describe('赵敏', 90, unit='分'))`,
          output: String.raw`林晓：92分
陈默：88分
王同学：95分
赵敏：90分`,
          explain: [
            '第 1 次调用省略 unit，使用默认值「分」。',
            '第 2 次调用按位置提供三个实参，效果与省略默认值一致。',
            '第 3 次调用全部使用关键字参数，顺序与定义不同但绑定正确。',
            '第 4 次混用位置参数与关键字参数，位置参数在前，符合语法约束。'
          ]
        },
        {
          type: 'prose',
          title: '可变对象默认值与参数收集',
          paras: [
            '下面这个例子直接展示陷阱：若把默认值写成空列表并在函数内 append，连续三次调用会看到累积结果，因为三次使用的是同一个列表对象。改用 None 并在函数体内新建列表，就能让每次调用互不干扰。这不是 Python 的设计缺陷，而是「默认值只求值一次」这一规则的必然结果。',
            '*args 与 **kwargs 让函数可以接受数量不定的参数。例如一个求和函数不必限定只能传三个数，写成 def add(*nums): 后，add(1,2) 与 add(1,2,3,4) 都可用，nums 在函数内是元组。若还需要接收任意配置项，用 **opts 收集为字典。',
            '参数设计的经验法则是：必需参数放在前面，有合理默认值的可选参数放在后面；参数超过四五个时，考虑把它们组织成字典或数据结构，而不是继续加长参数列表。'
          ]
        },
        {
          type: 'code',
          title: '可变默认值的陷阱与 *args',
          code: String.raw`def add(*nums):
    total = 0
    for n in nums:
        total += n
    return total

print('两个', add(1, 2))
print('四个', add(1, 2, 3, 4))
print('无参数', add())

def collect(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket

print(collect('a'))
print(collect('b'))
print('独立对象', collect('a') is collect('a'))`,
          output: String.raw`两个 3
四个 10
无参数 0
['a']
['b']
独立对象 False`,
          explain: [
            '*nums 把任意数量的位置实参收集为元组，因此两次调用参数个数不同也能正常工作。',
            'add() 无实参时 nums 为空元组，循环不执行，返回 0。',
            'collect 用 None 作默认值并在函数体内新建列表，所以第二次调用不会带上第一次的「a」。',
            '最后一行用 is 比较两次调用返回的对象，结果为 False，确认它们是不同的列表。'
          ]
        },
        {
          type: 'table',
          title: '参数形式速查',
          head: ['形式', '含义', '约束 / 用途'],
          rows: [
            ['def f(a, b)', '位置参数', '调用时按顺序提供'],
            ["def f(a, b='x')", '默认参数', '必须位于无默认值参数之后'],
            ['f(b=2, a=1)', '关键字实参', '位置实参须在其之前'],
            ['def f(*args)', '收集多余位置实参', '函数内为元组'],
            ['def f(**kwargs)', '收集多余关键字实参', '函数内为字典'],
            ['默认值为 None', '规避可变默认值', '在函数体内新建对象']
          ]
        },
        {
          type: 'pitfalls',
          title: '常见错误与排查',
          items: [
            {
              wrong: 'def f(items=[]): 并在函数内 append',
              why: '默认值只求值一次，多次调用共享同一列表，产生数据残留。',
              right: '用 items=None，函数体内 if items is None: items = []。'
            },
            {
              wrong: 'def f(a=1, b):',
              why: '有默认值参数之后又出现无默认值参数，抛出 SyntaxError。',
              right: '调整顺序为 def f(b, a=1):。'
            },
            {
              wrong: 'f(a=1, 2)',
              why: '关键字实参之后不能再出现位置实参，抛出 SyntaxError。',
              right: '写成 f(2, a=1) 会重复绑定，正确做法是统一用位置或关键字。'
            },
            {
              wrong: '调用时提供的实参数量与定义不符',
              why: '缺少必需参数或多出未声明参数都会抛 TypeError。',
              right: '核对参数列表，或使用 *args 接收可变数量。'
            }
          ]
        },
        {
          type: 'summary',
          title: '知识小结',
          items: [
            '位置实参按顺序绑定，关键字实参按名绑定且顺序自由。',
            '默认参数须置于参数列表末尾，且默认值在定义时求值一次。',
            '绝不用列表/字典作默认值，改用 None 并在体内新建。',
            '*args 收集位置实参为元组，**kwargs 收集关键字实参为字典。',
            '参数过多时应重构为数据结构，而非继续扩充参数列表。'
          ]
        },
        {
          type: 'review',
          title: '巩固练习解析',
          paras: [
            '「运行验证」常要求定义带参数的函数并调用两次，注意按位置与按名传参的绑定结果应一致，输出格式由 return 之后的字符串决定。',
            '「预测输出」会混合默认值与关键字参数，考查绑定顺序。建议先列出每个参数最终绑定的值，再执行函数体。',
            '「找错改错」高频错误是默认参数顺序颠倒、关键字参数后跟位置参数、以及实参数量不匹配。TypeError 通常指向数量问题。',
            '「配对分类」把位置参数、默认参数、*args、**kwargs 与用途对应，帮助你在设计接口时选择合适的参数形式。'
          ]
        }
      ]
    },
    {
      id: 18,
      title: '作用域：名字在哪里可见',
      minutes: 25,
      objectives: [
        '能区分局部作用域与全局作用域',
        '能解释 LEGB 查找顺序',
        '能说明 global 与 nonlocal 的作用与代价',
        '能识别 UnboundLocalError 的成因'
      ],
      blocks: [
        {
          type: 'lead',
          text: '函数带来一个新问题：函数内部定义的名字，外部能不能用？函数内部能否修改外部的变量？这套可见性规则称为作用域（scope）。它直接影响参数传递、状态管理和闭包，也是理解后续装饰器与生成器的前提。'
        },
        {
          type: 'prose',
          title: '局部、全局与查找顺序',
          paras: [
            '在函数内部赋值的名字属于局部作用域（local），只在函数执行期间存在，函数结束后即消失；在模块顶层赋值的名字属于全局作用域（global），整个文件都可访问。Python 查找一个名字时按 LEGB 顺序：Local（当前函数）→ Enclosing（外层函数）→ Global（模块）→ Built-in（内置名字如 print、len）。',
            '关键规则是：只要在函数体内对某个名字**赋值**，这个名字在整个函数内就被视为局部变量。因此若在赋值之前先读取它，会抛 UnboundLocalError——解释器已把它登记为局部，但此刻还没有值。这与「先查全局」的直觉相反，是作用域相关的典型错误。',
            '若确实需要在函数内修改全局变量，可用 global 声明；需要修改外层嵌套函数的变量，用 nonlocal。但两者都会引入隐式耦合：函数的行为不再只由参数决定，测试与复用都变困难。更推荐的做法是把需要的值作为参数传入、把结果 return 出来。'
          ]
        },
        {
          type: 'code',
          title: '局部变量与 LEGB 查找',
          code: String.raw`base = 10

def compute(x):
    factor = 2
    return x * factor + base

print(compute(5))
print('全局 base =', base)
print('内置函数可见', len('abc'))`,
          output: String.raw`20
全局 base = 10
内置函数可见 3`,
          explain: [
            'factor 是局部变量，只在 compute 执行期间存在；base 在函数内未赋值，因此按 LEGB 找到全局的 10。',
            'compute(5) 计算 5 * 2 + 10 = 20。',
            '第 8 行在全局读取 base 仍为 10，说明函数内只是读取，没有修改它。',
            '最后一行 len 是内置名字，属于 LEGB 的最外层 B。'
          ]
        },
        {
          type: 'prose',
          title: '可变对象的传递与状态管理',
          paras: [
            '参数传递常被描述为「传对象引用」。对不可变对象（整数、字符串、元组），函数内重新赋值不会影响外部；对可变对象（列表、字典），函数内调用 append() 这类原地修改会被外部看到，因为操作的是同一个对象。第 12 节的别名现象在此重现。',
            '这带来一条实用准则：如果函数不应修改调用方的数据，就在开头复制一份（如 items = list(items)），再对副本操作；如果函数本来就是要「填充」一个容器，则应在函数名或文档中明确表达这一副作用。',
            '把状态保存在全局变量里看似方便，实则让函数的输出依赖隐藏状态。同样的参数在不同时刻可能得到不同结果，难以复现问题。更稳妥的设计是把状态作为参数传入、以返回值交还，让数据流显式可见。'
          ]
        },
        {
          type: 'code',
          title: '可变参数与 global 的代价',
          code: String.raw`def append_item(items, value):
    items.append(value)
    return items

data = [1, 2]
append_item(data, 3)
print('外部可见', data)

def safe_append(items, value):
    copy = list(items)
    copy.append(value)
    return copy

original = [1, 2]
result = safe_append(original, 3)
print('原表', original, '新表', result)

counter = 0
def increase():
    global counter
    counter += 1

increase()
print('全局计数', counter)`,
          output: String.raw`外部可见 [1, 2, 3]
原表 [1, 2] 新表 [1, 2, 3]
全局计数 1`,
          explain: [
            'append_item 原地修改传入的列表，因此外部 data 也变成 [1, 2, 3]。',
            'safe_append 先复制为副本再追加，原表保持不变，新表作为返回值交出。',
            'increase 用 global 声明后修改全局 counter；这是可行写法，但引入了隐式状态依赖。'
          ]
        },
        {
          type: 'table',
          title: '作用域速查',
          head: ['层级', '含义', '典型例子'],
          rows: [
            ['L Local', '当前函数内部', '函数内赋值的变量'],
            ['E Enclosing', '外层嵌套函数', '闭包中被引用的变量'],
            ['G Global', '模块顶层', '文件开头定义的常量'],
            ['B Built-in', '内置名字', 'print、len、range'],
            ['global 声明', '在函数内改全局', '应谨慎，优先用返回值'],
            ['nonlocal 声明', '在内层函数改外层', '闭包计数器等场景']
          ]
        },
        {
          type: 'pitfalls',
          title: '常见错误与排查',
          items: [
            {
              wrong: '函数内先 print(x) 再 x = 1，而全局有 x',
              why: 'x 被判定为局部变量，赋值前读取抛 UnboundLocalError。',
              right: '把赋值移到读取之前，或改用 global / 参数传入。'
            },
            {
              wrong: '把列表传给函数后以为外部不会变',
              why: '列表是可变对象，原地修改会反映到调用方。',
              right: '函数开头用 list(items) 建立副本。'
            },
            {
              wrong: '用全局变量在函数间传递状态',
              why: '行为依赖隐藏状态，难以测试与复用。',
              right: '改为参数传入、返回值交出。'
            },
            {
              wrong: '把局部变量名起成 len、list 等内置名',
              why: '遮蔽内置名字后，同名函数无法调用。',
              right: '改用 length、items 等不冲突的命名。'
            }
          ]
        },
        {
          type: 'summary',
          title: '知识小结',
          items: [
            '名字按 LEGB 顺序查找：局部 → 外层 → 全局 → 内置。',
            '函数内只要赋值，该名字在整个函数内即为局部。',
            '可变对象的原地修改会被调用方看到，需复制以隔离。',
            'global / nonlocal 可行但增加隐式耦合，优先用参数与返回值。',
            '避免用内置名字作变量名，防止遮蔽。'
          ]
        },
        {
          type: 'review',
          title: '巩固练习解析',
          paras: [
            '「运行验证」通常考查 global 计数器的行为，注意 global 声明必须出现在函数内使用该名字之前，且多次调用会累积状态。',
            '「预测输出」会把局部变量、全局常量与同名遮蔽混在一起。先判定每个名字属于哪个作用域，再代入求值。',
            '「找错改错」高频问题是 UnboundLocalError、误以为列表参数被复制、以及遮蔽内置名字。报错信息中的变量名通常直接指向出错位置。',
            '「配对分类」把 LEGB 四层与示例对应，帮助你在阅读多层嵌套函数时快速定位一个名字的来源。'
          ]
        }
      ]
    },
    {
      id: 19,
      title: '字符串方法综合应用',
      minutes: 30,
      objectives: [
        '能组合 strip / split / join 完成文本清洗',
        '能使用 startswith / find / count 做检索统计',
        '能说明链式调用中中间结果的类型',
        '能用 f-string 输出对齐的表格文本'
      ],
      blocks: [
        {
          type: 'lead',
          text: '第 4 节介绍了字符串的基础操作，本节把它们组合起来处理更接近真实的文本：带有多余空白、由分隔符组织、需要统计与格式化输出的数据。字符串方法都是函数，因此本节也是上一章函数知识的自然应用场。'
        },
        {
          type: 'prose',
          title: '清洗、拆分与重组',
          paras: [
            '真实输入的常见问题是首尾空白、字段之间用不统一的分隔符、大小写混杂。处理顺序通常是：strip() 去首尾 → split(sep) 拆成列表 → 对元素逐个清理或转换 → join() 重组回字符串。这条流水线的每一步都返回新对象，因此必须把结果保存到变量或继续链式调用。',
            'split() 不带参数时按任意空白字符切分，并自动忽略连续空白，适合处理空格不规则的文本；带参数时严格按指定分隔符切分，连续分隔符会产生空字符串元素。选择哪一种取决于数据格式是否规整。',
            '检索类方法包括 startswith / endswith（返回布尔）、find（返回首次出现的下标，找不到返回 -1）、count（出现次数）、replace（替换，可指定次数）。注意 find 与 index 的区别：后者找不到时抛 ValueError，前者返回 -1 更便于条件判断。'
          ]
        },
        {
          type: 'code',
          title: '清洗并重组一行数据',
          code: String.raw`raw = '  林晓 , 88 , 95 , 91  '
cleaned = raw.strip()
parts = cleaned.split(',')
name = parts[0].strip()
scores = [int(p.strip()) for p in parts[1:]]
print('姓名', name)
print('分数', scores)
print('总分', sum(scores))
print('重组', '|'.join([name] + [str(s) for s in scores]))`,
          output: String.raw`姓名 林晓
分数 [88, 95, 91]
总分 274
重组 林晓|88|95|91`,
          explain: [
            'strip() 去掉整行首尾空白，split(\',\') 按逗号拆成 4 段。',
            '每段的空白仍需单独 strip()；姓名取第 0 段，其余三段转成整数列表。',
            'sum() 对纯数值列表求和得到 274。',
            '最后用 join() 以竖线重组，注意 join 要求所有元素都是字符串，所以数字要先 str() 转换。'
          ]
        },
        {
          type: 'prose',
          title: '检索统计与格式化输出',
          paras: [
            '统计文本时，先明确「统计对象是什么」：字符、子串还是单词。count(sub) 统计子串出现次数（不重叠），len(s) 统计字符数，len(s.split()) 可近似得到以空白分隔的词数。三者结果不同，混用会导致口径不一致。',
            '生成表格类文本时，f-string 的对齐说明符非常实用：{name:<8} 左对齐占 8 个字符宽，{score:>6} 右对齐占 6 个字符宽，{value:.2f} 控制小数位。把每行的字段用固定宽度格式化，就能在不依赖第三方库的情况下输出整齐的纯文本报表。',
            '需要注意，中文字符在等宽字体中与西文字符宽度不同，用字符数对齐中文表格可能出现视觉偏差。本节示例以数值与短标签为主，实际涉及长中文内容时应接受这一限制或改用专门的排版方案。'
          ]
        },
        {
          type: 'code',
          title: '检索统计与对齐输出',
          code: String.raw`text = 'Python is easy. Python is powerful.'
print('字符数', len(text))
print('Python 出现', text.count('Python'))
print('首次位置', text.find('easy'))
print('找不到时', text.find('hard'))
print('是否以 P 开头', text.startswith('Python'))
rows = [('林晓', 92.5), ('陈默', 88), ('王同学', 95.25)]
for name, score in rows:
    print(f'{name:<6}{score:>8.2f}')`,
          output: String.raw`字符数 35
Python 出现 2
首次位置 10
找不到时 -1
是否以 P 开头 True
林晓       92.50
陈默       88.00
王同学      95.25`,
          explain: [
            'len() 统计字符个数 35；count(\'Python\') 得到 2 次。',
            'find(\'easy\') 返回首次出现下标 10；find(\'hard\') 找不到返回 -1，而不是抛异常。',
            'startswith 返回布尔值 True。',
            '循环中 {name:<6} 左对齐占 6 字符，{score:>8.2f} 右对齐占 8 字符并保留两位小数。'
          ]
        },
        {
          type: 'table',
          title: '字符串方法速查（进阶）',
          head: ['方法', '返回值', '典型用途'],
          rows: [
            ['strip() / lstrip() / rstrip()', '新字符串', '清理空白'],
            ['split(sep)', '列表', '按分隔符拆解'],
            ['join(parts)', '新字符串', '重组字段'],
            ['find(sub)', '下标或 -1', '安全检索'],
            ['count(sub)', '整数', '出现次数统计'],
            ['startswith(p) / endswith(p)', '布尔值', '前缀后缀判断'],
            ['replace(a, b, n)', '新字符串', '受限替换']
          ]
        },
        {
          type: 'pitfalls',
          title: '常见错误与排查',
          items: [
            {
              wrong: "'|'.join(['a', 1])",
              why: 'join 要求所有元素为字符串，含整数会抛 TypeError。',
              right: "先把数字转换：'|'.join(str(x) for x in parts)。"
            },
            {
              wrong: 'strip() 调用后没有接收返回值',
              why: '字符串不可变，方法返回新对象，原串不变。',
              right: 's = s.strip()。'
            },
            {
              wrong: '用 index(sub) 判断子串是否存在却不捕获异常',
              why: '找不到时抛 ValueError，中断程序。',
              right: '改用 find(sub) != -1，或 sub in s。'
            },
            {
              wrong: 'split(\',\') 后直接对字段做数值运算',
              why: 'split 得到的是字符串列表，需先转换类型。',
              right: '对字段调用 int() / float() 后再计算。'
            }
          ]
        },
        {
          type: 'summary',
          title: '知识小结',
          items: [
            '文本清洗流水线：strip → split → 逐元素处理 → join。',
            'split() 无参数按任意空白切分，带参数则严格按分隔符切分。',
            'find 返回 -1 表示未找到，适合条件判断；index 会抛异常。',
            'join 要求元素全为字符串；数字须先 str() 转换。',
            'f-string 的 :<n / :>n / :.2f 可生成对齐的纯文本报表。'
          ]
        },
        {
          type: 'review',
          title: '巩固练习解析',
          paras: [
            '「运行验证」通常要求清洗字符串并转大写输出。注意 strip / upper 都返回新字符串，必须接收结果；输出中不应残留首尾空白。',
            '「预测输出」常把 split 产生的列表与 join 重组放在一起，逐行记录每一步的类型变化就能避免出错。',
            '「找错改错」高频错误是 join 混入数字、忘记接收返回值、以及 split 后忘记转换类型。TypeError 多指向前者，ValueError 多指向后者。',
            '「配对分类」把 strip、split、join、find 与用途对应，重点是记住每个方法的返回值类型。'
          ]
        }
      ]
    },
    {
      id: 20,
      title: '综合课：一个可复用的判断程序',
      minutes: 35,
      objectives: [
        '能把输入、转换、判断、函数封装组合应用',
        '能用函数返回值驱动分支输出',
        '能对多次调用的结果做汇总',
        '能通过分组输入验证各分支'
      ],
      blocks: [
        {
          type: 'lead',
          text: '本章把函数作为组织代码的主要手段。用一个「数值判断」程序收尾：读入若干数值，用函数完成比较与分类，再汇总输出。它同时覆盖参数、返回值、作用域与字符串格式化，也为第 5 章的文件与异常处理做好铺垫。'
        },
        {
          type: 'prose',
          title: '把判断逻辑封装成函数',
          paras: [
            '面对「读入一批数据、逐一判断、给出结论」这类需求，最清晰的结构是把「判断单个值」封装成函数，把「遍历与汇总」留在主流程。这样判断规则变了只需改一个函数，主流程保持不变；判断函数也能独立测试。',
            '函数应返回结果而不是直接打印。返回值能被主流程用于计数、筛选或格式化，而打印会把它变成不可复用的副作用。若需要向用户展示，由调用方决定何时、以什么格式打印。',
            '汇总阶段用一个字典保存各类别的计数，是字典章节知识的应用。注意累计前先用 get(key, 0) 取旧值，避免键尚不存在导致 KeyError。'
          ]
        },
        {
          type: 'code',
          title: '完整示例：分类与汇总',
          code: String.raw`def classify(value, target):
    if value > target:
        return '偏大'
    elif value < target:
        return '偏小'
    return '相等'

target = 50
values = [62, 38, 50, 77]
counts = {}
for v in values:
    label = classify(v, target)
    print(f'{v} 相对 {target}：{label}')
    counts[label] = counts.get(label, 0) + 1
print('汇总', counts)`,
          output: String.raw`62 相对 50：偏大
38 相对 50：偏小
50 相对 50：相等
77 相对 50：偏大
汇总 {'偏大': 2, '偏小': 1, '相等': 1}`,
          explain: [
            'classify 用 elif 链表达三种互斥结果，返回文本而不打印。',
            '主流程遍历四个值，把返回值既用于输出，也用于计数。',
            'counts.get(label, 0) 在键首次出现时返回 0，从而安全地实现累计。',
            '最后输出字典，键的顺序与首次插入顺序一致。'
          ]
        },
        {
          type: 'prose',
          title: '从固定数据到外部输入',
          paras: [
            '示例中 values 写死在源码里，便于观察结构。改成运行时输入时，只需把这一行替换为按行读取并转换，其余逻辑完全不动——这正是职责拆分带来的好处。',
            '一旦引入外部输入，就要重新考虑边界：用户可能输入非数字、可能一行都不给。前者需要 try / except（第 22 节），后者可用 while 循环配合结束标记，或先读取一个数量再按次数循环（第 11 节）。',
            '把「读数据」「处理数据」「呈现结果」分成三段，是后续所有综合项目的通用骨架。第 30 节的毕业项目会在此基础上加入文件读写与数据结构，但骨架不变。'
          ]
        },
        {
          type: 'code',
          title: '接收外部输入并复用同一函数',
          code: String.raw`def classify(value, target):
    if value > target:
        return '偏大'
    elif value < target:
        return '偏小'
    return '相等'

n = int(input())
target = int(input())
values = [int(input()) for _ in range(n)]
print('判定基准', target)
for v in values:
    print(v, classify(v, target))`,
          stdin: ['3', '50', '62', '38', '50'],
          output: String.raw`判定基准 50
62 偏大
38 偏小
50 相等`,
          explain: [
            '前两行读取数量 3 与基准 50，均用 int() 转换。',
            '列表推导式配合 range(n) 连续读取 3 个数值，得到 [62, 38, 50]。',
            '主流程复用同一个 classify 函数，说明判断逻辑与数据来源解耦。',
            '所有输出都来自显式 print()，input() 不带提示语，格式可精确核对。'
          ]
        },
        {
          type: 'table',
          title: '综合程序的结构分层',
          head: ['层次', '职责', '本例对应'],
          rows: [
            ['输入层', '读取并转换外部数据', 'int(input()) 与列表推导式'],
            ['逻辑层', '封装可复用判断', 'classify(value, target)'],
            ['流程层', '遍历、累计、组织', 'for 循环与 counts 字典'],
            ['呈现层', '格式化输出', 'f-string 与 print()'],
            ['边界处理', '非法输入、空输入', '后续章节的异常处理']
          ]
        },
        {
          type: 'pitfalls',
          title: '常见错误与排查',
          items: [
            {
              wrong: '在判断函数内部直接 print 结论',
              why: '结果无法被主流程复用，计数与筛选都要另写一遍。',
              right: '让函数 return 结论，交由调用方决定输出。'
            },
            {
              wrong: 'counts[label] += 1 而键首次出现',
              why: '键不存在时读取抛 KeyError。',
              right: '用 counts.get(label, 0) + 1。'
            },
            {
              wrong: '把输入的数量 n 直接当作数值参与运算',
              why: 'n 是循环次数，不是数据本身，混用会造成逻辑错误。',
              right: '明确区分控制变量与数据变量，命名上加以区分。'
            },
            {
              wrong: '读取数值时忘记 int() 转换',
              why: '字符串之间的大小比较按字典序，结果不符合数值语义。',
              right: '读取后立即转换类型。'
            }
          ]
        },
        {
          type: 'summary',
          title: '知识小结',
          items: [
            '把「判断单个值」封装成函数，主流程负责遍历与汇总。',
            '函数返回结果而非打印，使结果可被计数、筛选、复用。',
            '字典配合 get(key, 0) 可安全实现分类计数。',
            '输入层、逻辑层、流程层、呈现层分离，便于扩展与测试。',
            '外部输入不可信，非法值与空输入需由后续异常处理覆盖。'
          ]
        },
        {
          type: 'review',
          title: '巩固练习解析',
          paras: [
            '「运行验证」要求完成判断程序，注意输出来自主流程的 print()，函数内部应保持安静；比较结果要与期望的分类文本逐字一致。',
            '「预测输出」会把多个输入值与 elif 链组合，先确认每个值命中哪个分支，再按遍历顺序写出输出。',
            '「找错改错」高频问题是函数内 print 却无 return、字典计数键不存在、以及字符串未转数字导致字典序比较。',
            '「配对分类」把本章的函数、参数、返回值、作用域概念对应，检验你能否描述一次完整调用中数据的流向与可见范围。'
          ]
        }
      ]
    }
  ]
};
