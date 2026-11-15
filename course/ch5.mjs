export default {
  id: 5,
  title: '文件与程序健壮性',
  subtitle: '让数据持久化、让程序在出错时可控，并掌握 Python 的表达力工具',
  intro: '本章从「程序内部的数据」走向「程序外部的世界」。你会学习文件读写让数据持久化，用异常处理让程序在出错时不崩溃，用列表推导式与字典方法写出更凝练的表达，最后用模块与标准库组织代码。这四项能力共同决定一个程序是否真正可用，而不只是能在理想输入下跑通。',
  lessons: [
    {
      id: 21,
      title: '文件读写：让数据留下来',
      minutes: 30,
      objectives: [
        '能使用 open() 配合 with 安全读写文件',
        '能区分 r / w / a 三种模式的语义',
        '能说明编码参数 encoding 的必要性',
        '能正确处理读写换行符'
      ],
      blocks: [
        {
          type: 'lead',
          text: '到目前为止，程序结束后所有数据都会消失。文件（file）让数据持久化：把结果写进磁盘，下次运行时再读回来。文本文件读写是最常见的一类，核心是 open() 与文件对象，以及一个几乎必须遵守的实践——用 with 语句确保文件被正确关闭。'
        },
        {
          type: 'prose',
          title: 'open()、模式与 with',
          paras: [
            'open(path, mode, encoding) 返回一个文件对象。常用模式：\'r\' 只读（默认，文件不存在则抛 FileNotFoundError）、\'w\' 写入（**会先清空**原有内容，不存在则创建）、\'a\' 追加（保留原内容，写在末尾）。需要同时读写可用 \'r+\'，但初学阶段用读写分离更不易出错。',
            'encoding=\'utf-8\' 应始终显式写出。不指定时，Python 使用操作系统默认编码，在 Windows 中文环境下常为 GBK，导致同一份代码换一台机器读中文文件就出现乱码或 UnicodeDecodeError。把编码写进代码，是消除这类环境依赖的最简单手段。',
            'with open(...) as f: 称为上下文管理器（context manager）。它的作用是：无论代码块内是否发生异常，退出时都自动调用 f.close()。若手动 open() 而忘记 close()，数据可能仍留在缓冲区未写入磁盘，文件句柄也会一直被占用。因此 with 是文件操作的标准写法。'
          ]
        },
        {
          type: 'code',
          title: '写入与读取（用临时路径演示）',
          code: String.raw`import os
path = 'demo_note.txt'
with open(path, 'w', encoding='utf-8') as f:
    f.write('第一行：Python 文件读写\n')
    f.write('第二行：使用 with 自动关闭\n')
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()
print(content, end='')
print('字符数', len(content))
with open(path, 'a', encoding='utf-8') as f:
    f.write('第三行：追加模式\n')
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()
print('行数', len(lines))
os.remove(path)`,
          output: String.raw`第一行：Python 文件读写
第二行：使用 with 自动关闭
字符数 33
行数 3`,
          explain: [
            '第 3～5 行以 w 模式写入两行，字符串末尾的 \\n 表示换行，write() 不会自动添加换行。',
            '第 6～7 行以 r 模式一次性 read() 读出全文；print 时用 end=\'\' 避免再补一个换行。',
            '第 10～11 行以 a 模式追加第三行，原内容保留；readlines() 返回按行组成的列表，因此长度为 3。',
            '最后 os.remove 清理临时文件，保证示例不留下副作用，也不依赖任何外部文件。'
          ]
        },
        {
          type: 'prose',
          title: '逐行处理与换行符',
          paras: [
            '文件对象本身可迭代，for line in f: 每次给出一行，适合处理大文件——不必把整个文件一次性读进内存。读取到的行末尾通常带 \'\\n\'，参与比较或拼接前习惯用 line.rstrip(\'\\n\') 或 strip() 去掉，否则会多出空行。',
            '写入时若数据来源是列表，可以用 writelines(parts)，但它**不会**自动添加分隔符，需要列表元素自身包含换行符。另一种做法是先 \'\\n\'.join(parts) 组成整段文本再 write() 一次，两者都要注意末尾是否需要换行。',
            '路径可以使用相对路径（相对当前工作目录）或绝对路径。用 os.path / pathlib 处理路径拼接，比手工用字符串拼 \'/\' 或 \'\\\\\' 更可靠，也能避免跨平台差异。'
          ]
        },
        {
          type: 'code',
          title: '逐行读取与清理',
          code: String.raw`import os
path = 'demo_lines.txt'
rows = ['苹果 3', '香蕉 5', '橙子 2']
with open(path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(rows) + '\n')
total = 0
with open(path, 'r', encoding='utf-8') as f:
    for line in f:
        name, count = line.rstrip('\n').split(' ')
        total += int(count)
        print(name, count)
print('合计', total)
os.remove(path)`,
          output: String.raw`苹果 3
香蕉 5
橙子 2
合计 10`,
          explain: [
            '写入时用 \'\\n\'.join(rows) 组成文本并补一个末尾换行，得到三行。',
            'for line in f 逐行迭代；先用 rstrip(\'\\n\') 去掉行末换行，再按空格拆成名称与数量。',
            '数量是字符串，用 int() 转换后累加，得到 10。',
            '示例末尾清理临时文件，保持运行环境干净。'
          ]
        },
        {
          type: 'table',
          title: '文件模式与方法速查',
          head: ['写法', '作用', '注意'],
          rows: [
            ["open(p, 'r', encoding='utf-8')", '只读', '文件不存在抛 FileNotFoundError'],
            ["open(p, 'w', ...)", '写入', '先清空原内容'],
            ["open(p, 'a', ...)", '追加', '保留原内容'],
            ['f.read() / f.readlines()', '读全文 / 读成行列表', '大文件优先考虑逐行迭代'],
            ['f.write(s) / writelines(parts)', '写入', '都不自动加换行'],
            ['with open(...) as f:', '自动关闭', '文件操作的标准写法']
          ]
        },
        {
          type: 'pitfalls',
          title: '常见错误与排查',
          items: [
            {
              wrong: "open(p, 'w') 想追加内容",
              why: 'w 模式会清空文件，原数据全部丢失。',
              right: '改用 a 模式，或先读回原内容再整体写入。'
            },
            {
              wrong: 'open() 时不指定 encoding',
              why: '依赖系统默认编码，跨平台读中文文件易乱码。',
              right: "始终显式写 encoding='utf-8'。"
            },
            {
              wrong: '手动 open() 后忘记 close()',
              why: '缓冲可能未落盘，句柄泄漏。',
              right: '统一使用 with 语句。'
            },
            {
              wrong: '读取的行直接与字符串比较',
              why: "行尾含 \\n，比较结果常为 False。",
              right: "先用 rstrip('\\n') 或 strip() 清理。"
            }
          ]
        },
        {
          type: 'summary',
          title: '知识小结',
          items: [
            'r 只读、w 写入会清空、a 追加保留原内容。',
            '始终显式指定 encoding=\'utf-8\'，并用 with 自动关闭。',
            'write() 不自动加换行；readlines() 得到含换行的行列表。',
            '逐行迭代适合大文件，处理前需清理行尾换行符。',
            '路径拼接优先使用 os.path / pathlib，避免平台差异。'
          ]
        },
        {
          type: 'review',
          title: '巩固练习解析',
          paras: [
            '「运行验证」通常要求写入内容再读出，注意输出来自读取后的 print()，而不是 write() 本身；若期望输出只有一行，检查是否重复打印了换行。',
            '「预测输出」常把 write 的换行符与 readlines 的行数放在一起。先确定写入的文本究竟有几行，再推断读取结果。',
            '「找错改错」高频错误是用 w 覆盖而非追加、遗漏 encoding、忘记 close、以及未清理行尾换行。FileNotFoundError 指向路径或模式。',
            '「配对分类」把 r / w / a 与语义对应，核心是分清「清空」与「保留」这两种写入行为。'
          ]
        }
      ]
    },
    {
      id: 22,
      title: '异常处理：让失败可控',
      minutes: 30,
      objectives: [
        '能说明异常与语法错误的区别',
        '能使用 try / except / else / finally 结构',
        '能针对具体异常类型分别处理',
        '能说明「不要裸 except」的理由'
      ],
      blocks: [
        {
          type: 'lead',
          text: '前面章节遇到的 ValueError、TypeError、KeyError、ZeroDivisionError 都会在发生时中断程序。真实程序不能因为一次误输入就整体退出，需要把「可能失败的操作」包起来，明确指定失败时怎么办。这套机制叫异常处理（exception handling）。'
        },
        {
          type: 'prose',
          title: '异常是什么，如何捕获',
          paras: [
            '异常（exception）是程序运行期间发生的错误对象。它与语法错误不同：语法错误在解析阶段就会被发现，程序根本不会开始执行；异常发生在运行过程中，可以被捕获并恢复。当异常未被捕获，Python 会打印回溯信息（traceback）并终止程序。',
            '基本结构是 try: 放可能出错的代码，except 异常类型: 放对应处理，else: 在**没有异常**时执行，finally: 无论是否异常都执行（常用于释放资源）。捕获时应写明具体类型，例如 except ValueError:，而不是裸 except: 或 except Exception: ——后者会把拼写错误、逻辑错误等本该暴露的问题一起吞掉，让调试变得困难。',
            '异常类型有继承层次，例如 ZeroDivisionError 属于 ArithmeticError，而它们最终都继承 Exception。多个 except 分支按顺序匹配，因此更具体的类型应写在前面。可以用 as e 绑定异常对象，读取错误信息用于日志或提示。'
          ]
        },
        {
          type: 'code',
          title: '把类型转换放进 try',
          code: String.raw`def to_int(text):
    try:
        value = int(text)
    except ValueError:
        return None
    else:
        return value

for raw in ['42', 'abc', '3.5', '  7  ']:
    result = to_int(raw)
    if result is None:
        print(repr(raw), '不是合法整数')
    else:
        print(repr(raw), '->', result)`,
          output: String.raw`'42' -> 42
'abc' 不是合法整数
'3.5' 不是合法整数
'  7  ' -> 7`,
          explain: [
            'to_int 把 int() 放进 try；文本非法时捕获 ValueError 并返回 None，而不是让程序崩溃。',
            'else 分支只在转换成功时执行，返回转换后的整数。',
            '主流程对四种文本逐一调用：\'42\' 与带空白的 \'  7  \' 能转换，\'abc\' 与 \'3.5\' 被判为非法。',
            'repr() 让输出中保留字符串原本的引号与空格，便于观察输入形态。'
          ]
        },
        {
          type: 'prose',
          title: '多异常分支与 finally',
          paras: [
            '一个操作可能抛出多种异常，应分别处理。例如做除法时，除数为零抛 ZeroDivisionError，操作数不是数字抛 TypeError，两者对应的用户提示完全不同。分开捕获既准确，也避免把类型错误误报成「除数为零」。',
            'finally 的典型用途是释放资源：打开文件、建立连接后，无论处理过程是否成功，都要关闭。虽然 with 语句已经替我们处理了文件关闭，但在其它资源场景中 finally 仍是必要工具。需要强调，finally 中的 return 会覆盖 try / except 中的返回值，应避免在 finally 里写 return。',
            '也可以主动抛出异常：raise ValueError(\'具体说明\')。当函数收到的参数不满足前提时，与其返回 None 让错误延后暴露，不如尽早 raise，让调用方立刻知道问题所在。这是编写可复用函数时的良好实践。'
          ]
        },
        {
          type: 'code',
          title: '多分支捕获与 finally',
          code: String.raw`def divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return '除数不能为 0'
    except TypeError:
        return '操作数必须是数字'
    finally:
        pass

print(divide(10, 2))
print(divide(10, 0))
print(divide('10', 2))

def require_positive(n):
    if n <= 0:
        raise ValueError('n 必须为正数')
    return n * 2

try:
    print(require_positive(3))
    require_positive(-1)
except ValueError as e:
    print('捕获到', e)`,
          output: String.raw`5.0
除数不能为 0
操作数必须是数字
6
捕获到 n 必须为正数`,
          explain: [
            'divide 对除零与类型错误分别给出不同提示；10 / 2 返回 5.0，说明 / 结果为 float。',
            'finally: pass 表示本例无需额外清理，仅演示该子句始终执行。',
            'require_positive 在参数不合法时主动 raise ValueError，并附带说明文字。',
            '最后一个 try 中，第二次调用抛出异常被捕获，as e 取得错误信息并输出。'
          ]
        },
        {
          type: 'table',
          title: '常见异常与触发原因',
          head: ['异常类型', '典型触发', '处理方向'],
          rows: [
            ['ValueError', 'int(\'abc\')', '提示输入格式'],
            ['TypeError', '字符串 + 整数', '检查或转换类型'],
            ['ZeroDivisionError', '除数为 0', '前置判断或捕获'],
            ['KeyError', '字典缺键', '用 get 或捕获'],
            ['IndexError', '索引越界', '检查长度'],
            ['FileNotFoundError', '文件不存在', '检查路径或创建']
          ]
        },
        {
          type: 'pitfalls',
          title: '常见错误与排查',
          items: [
            {
              wrong: 'except: 或 except Exception: 一概吞掉',
              why: '掩盖了本应暴露的逻辑错误，调试困难。',
              right: '只捕获预期且能处理的异常类型。'
            },
            {
              wrong: 'except 分支顺序把宽泛类型放在前面',
              why: '具体异常会被前面的宽泛分支先匹配，具体分支永不执行。',
              right: '按从具体到宽泛排列 except。'
            },
            {
              wrong: '在 finally 中写 return',
              why: '会覆盖 try / except 的返回值，造成难以察觉的逻辑错误。',
              right: 'finally 只做清理，不返回结果。'
            },
            {
              wrong: '捕获异常后不做任何处理（pass）',
              why: '程序看似正常，实际数据已经丢失或状态不一致。',
              right: '至少记录日志或返回明确的失败标识。'
            }
          ]
        },
        {
          type: 'summary',
          title: '知识小结',
          items: [
            '异常发生在运行期，可被捕获；语法错误发生在解析期，无法捕获。',
            'try / except / else / finally 分别承担尝试、失败处理、成功处理、清理。',
            '按具体类型捕获并排序，避免裸 except。',
            'finally 用于释放资源，不要在其中 return。',
            '参数不满足前提时用 raise 尽早暴露问题。'
          ]
        },
        {
          type: 'review',
          title: '巩固练习解析',
          paras: [
            '「运行验证」通常要求实现带兜底的逻辑，注意异常分支的输出文本要与期望一致，且不能额外打印 traceback。',
            '「预测输出」会把多个输入与不同异常类型组合，先判断每次调用是否抛异常、被哪个 except 捕获，再写出输出。',
            '「找错改错」高频错误是 except 顺序颠倒、捕获类型写错、以及 finally 中误写 return。若程序静默给出错误结果，优先检查是否吞掉了异常。',
            '「配对分类」把 ValueError、TypeError、ZeroDivisionError 等与触发原因对应，目标是看到报错最后一行就能定位根因。'
          ]
        }
      ]
    },
    {
      id: 23,
      title: '列表推导式与表达式写法',
      minutes: 25,
      objectives: [
        '能把简单 for + append 改写为列表推导式',
        '能在推导式中使用条件过滤',
        '能说明推导式与循环的可读性边界',
        '能使用字典推导式与集合推导式'
      ],
      blocks: [
        {
          type: 'lead',
          text: '「遍历一个序列、按规则变换或筛选、收集到新列表」是极常见的模式，用四行循环写出来略显冗长。列表推导式（list comprehension）把它压缩成一行表达式。它更凝练，但不是任何时候都更清晰——本节会同时说明适用边界。'
        },
        {
          type: 'prose',
          title: '语法结构与等价循环',
          paras: [
            '基本形式是 [表达式 for 变量 in 可迭代对象]，例如 [x * 2 for x in nums]。带过滤的形式是 [表达式 for 变量 in 可迭代对象 if 条件]，只有条件为真的元素才参与生成。执行顺序可以理解为：先遍历，再判断 if，最后对保留下来的元素计算最前面的表达式。',
            '它与「新建空列表 → for 循环 → if 判断 → append」完全等价，区别在于推导式是一个表达式，本身就有值，可以直接赋给变量或作为参数传递。由于它总会生成完整的新列表，处理超大数据时可能占用较多内存；那种场景应考虑生成器（第 29 节）。',
            '可读性边界有一条实用准则：只有一个 for、最多一个 if，且表达式简单时，用推导式；一旦出现嵌套 for、多个条件、或表达式本身很长，就退回普通循环。让别人一眼看懂，比少写两行更重要。'
          ]
        },
        {
          type: 'code',
          title: '变换、筛选与等价写法',
          code: String.raw`nums = [1, 2, 3, 4, 5, 6]
doubled = [n * 2 for n in nums]
odds = [n for n in nums if n % 2 == 1]
labels = [f'{n}是偶数' if n % 2 == 0 else f'{n}是奇数' for n in nums[:3]]
print('翻倍', doubled)
print('奇数', odds)
print('标签', labels)
traditional = []
for n in nums:
    if n > 4:
        traditional.append(n * 10)
print('循环写法', traditional)
print('推导式写法', [n * 10 for n in nums if n > 4])`,
          output: String.raw`翻倍 [2, 4, 6, 8, 10, 12]
奇数 [1, 3, 5]
标签 ['1是奇数', '2是偶数', '3是奇数']
循环写法 [50, 60]
推导式写法 [50, 60]`,
          explain: [
            'doubled 对每个元素乘 2；odds 只保留奇数，展示 if 过滤。',
            'labels 在表达式部分使用条件表达式（三元写法）决定文本，等价于对每个元素做分支。',
            'traditional 用四行循环实现「大于 4 的元素乘 10」，最后一行用推导式得到完全相同的结果。',
            '注意 print(labels) 输出的是列表的 repr：元素带引号、逗号分隔，与字符串拼接显示不同。'
          ]
        },
        {
          type: 'prose',
          title: '字典与集合推导式',
          paras: [
            '同样的语法可以生成字典：{键表达式: 值表达式 for ...}，以及集合：{表达式 for ...}。字典推导式常用于把两个序列配对、或对已有字典做键值变换。集合推导式自动去重，因为集合（set）不允许重复元素。',
            '一个常见应用是把列表转成「值 → 出现次数」的映射，或把字符串列表转成「名称 → 长度」的映射。写之前先明确「键是什么、值是什么」，否则容易把两者写反。',
            '也可以嵌套使用推导式生成二维结构，例如乘法表，但嵌套会明显降低可读性。当推导式需要换行才能读清时，通常说明该改用普通循环了。'
          ]
        },
        {
          type: 'code',
          title: '字典与集合推导式',
          code: String.raw`names = ['fig', 'kiwi', 'apple', 'fig']
lengths = {n: len(n) for n in names}
print('名称长度', lengths)
unique = {n for n in names}
print('去重后', sorted(unique))
squares = {n: n * n for n in range(1, 6)}
print('平方表', squares)
summary = f'共 {len(names)} 项，去重 {len(unique)} 项'
print(summary)`,
          output: String.raw`名称长度 {'fig': 3, 'kiwi': 4, 'apple': 5}
去重后 ['apple', 'fig', 'kiwi']
平方表 {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
共 4 项，去重 3 项`,
          explain: [
            'lengths 用字典推导式生成「名称 → 长度」；重复的 fig 在字典中只保留一个键。',
            '集合推导式去重后配合 sorted() 得到有序的三个名称。',
            'squares 用 range(1, 6) 生成 1 到 5 的平方映射。',
            '最后用 len() 统计原始列表与去重集合的大小，说明二者数量差异。'
          ]
        },
        {
          type: 'table',
          title: '推导式速查',
          head: ['形式', '结果类型', '示例'],
          rows: [
            ['[e for x in a]', 'list', '逐元素变换'],
            ['[e for x in a if c]', 'list', '带条件筛选'],
            ['{k: v for x in a}', 'dict', '生成键值映射'],
            ['{e for x in a}', 'set', '生成并去重'],
            ['(e for x in a)', '生成器', '惰性求值，见第 29 节']
          ]
        },
        {
          type: 'pitfalls',
          title: '常见错误与排查',
          items: [
            {
              wrong: '在推导式中写赋值语句',
              why: '推导式最前面只能是表达式，赋值是语句，会抛 SyntaxError。',
              right: '把逻辑写成表达式，或退回普通循环。'
            },
            {
              wrong: '多层嵌套推导式压成一行',
              why: '阅读成本高，且容易把遍历顺序写反。',
              right: '拆成普通循环或分步计算。'
            },
            {
              wrong: '把集合推导式当作列表使用并依赖顺序',
              why: '集合无序，输出顺序不稳定。',
              right: '需要顺序时用列表，或 sorted() 显式排序。'
            },
            {
              wrong: '在推导式内修改被遍历的列表',
              why: '与循环同样存在遍历中修改的隐患。',
              right: '推导式应生成新对象，不产生副作用。'
            }
          ]
        },
        {
          type: 'summary',
          title: '知识小结',
          items: [
            '[表达式 for 变量 in 对象 if 条件] 等价于带筛选的收集循环。',
            '推导式是表达式，直接生成新对象；大数据量时注意内存占用。',
            '字典推导式需明确键与值；集合推导式自动去重且无序。',
            '仅当结构简单时使用，多层嵌套应改写为普通循环。',
            '生成器表达式使用圆括号，惰性求值，第 29 节展开。'
          ]
        },
        {
          type: 'review',
          title: '巩固练习解析',
          paras: [
            '「运行验证」常要求生成一组平方或立方数，注意输出是列表还是逐行数字；print(列表) 会带方括号与逗号。',
            '「预测输出」偏爱考查 if 过滤条件与表达式中的三元写法。先确定哪些元素被保留，再计算每个元素的输出值。',
            '「找错改错」高频问题是把 if 位置写错、在表达式里写赋值、以及误用集合导致顺序不稳定。',
            '「配对分类」把列表、字典、集合推导式与结果类型对应，帮助你在需要「变换」「映射」「去重」时选对工具。'
          ]
        }
      ]
    },
    {
      id: 24,
      title: '字典进阶与数据组织',
      minutes: 25,
      objectives: [
        '能使用 setdefault 与 get 简化计数逻辑',
        '能按值对字典排序并说明 key 的作用',
        '能合并字典并说明冲突规则',
        '能组织列表套字典的表格型数据'
      ],
      blocks: [
        {
          type: 'lead',
          text: '第 15 节建立了字典的基本用法，本节处理更实际的数据组织问题：统计词频、按分数排名、合并两份配置、以及用「列表套字典」表达表格。这些都是后续综合项目会反复用到的模式。'
        },
        {
          type: 'prose',
          title: '计数、默认值与合并',
          paras: [
            '统计词频时最直白的写法是 if k in d: d[k] += 1 else: d[k] = 1。字典提供了两个更简洁的工具：d.get(k, 0) + 1 在读取时给默认值；d.setdefault(k, 0) 则在键不存在时先写入默认值，再返回该值，适合需要同时初始化与后续修改的场景。标准库 collections.Counter 进一步把整段计数压缩成一行，但理解前两者有助于读懂它的原理。',
            '字典本身没有「按值排序」的方法，通常用 sorted(d.items(), key=lambda kv: kv[1]) 实现。sorted 的 key 参数接收一个函数，用来从每个元素中取出排序依据；这里每个元素是 (键, 值) 二元组，取下标 1 即按值排序。lambda 是匿名函数，第 28 节会再遇到。',
            '合并字典可用 d1 | d2（Python 3.9 起）或 d1.update(d2)。前者返回新字典，后者原地修改。当两边有同名键时，**右侧的值覆盖左侧**，这一点在合并配置时尤其需要确认顺序。'
          ]
        },
        {
          type: 'code',
          title: '计数、按值排序与合并',
          code: String.raw`words = ['a', 'b', 'a', 'c', 'b', 'a']
counts = {}
for w in words:
    counts[w] = counts.get(w, 0) + 1
print('词频', counts)
ranked = sorted(counts.items(), key=lambda kv: kv[1], reverse=True)
print('按频次降序', ranked)
left = {'x': 1, 'y': 2}
right = {'y': 20, 'z': 3}
print('合并', left | right)
print('左侧未变', left)`,
          output: String.raw`词频 {'a': 3, 'b': 2, 'c': 1}
按频次降序 [('a', 3), ('b', 2), ('c', 1)]
合并 {'x': 1, 'y': 20, 'z': 3}
左侧未变 {'x': 1, 'y': 2}`,
          explain: [
            'counts.get(w, 0) 在键首次出现时返回 0，安全地完成累计。',
            'sorted 配合 key=lambda kv: kv[1] 按值降序，返回由 (键, 值) 元组组成的列表。',
            'left | right 生成新字典，同名键 y 取右侧的 20；left 本身保持不变。'
          ]
        },
        {
          type: 'prose',
          title: '列表套字典：表达一张表',
          paras: [
            '当每条记录有相同字段时，用「列表 + 字典」表达最自然：外层列表保持顺序，内层字典让字段自描述。例如学生表 [{姓名, 分数}, ...]。相比「多个平行列表」或「按下标约定的元组」，这种写法在读代码时不需要记住「第 2 个位置是分数」。',
            '常见操作包括：遍历打印、按某字段排序、按条件筛选、按某字段分组。排序用 sorted(records, key=lambda r: r[\'分数\'])，筛选用列表推导式 [r for r in records if 条件]。这些写法把「做什么」表达得很直接。',
            '字段缺失是这类结构的常见风险。读取时优先用 r.get(\'字段\', 默认值)，或在构建记录时保证字段齐全。若数据结构会持续增长、字段变多，第 26 节的类会提供更好的抽象方式。'
          ]
        },
        {
          type: 'code',
          title: '表格型数据的排序与筛选',
          code: String.raw`records = [
    {'姓名': '林晓', '分数': 92},
    {'姓名': '陈默', '分数': 85},
    {'姓名': '王同学', '分数': 96},
]
top = sorted(records, key=lambda r: r['分数'], reverse=True)
for r in top:
    print(f"{r['姓名']}: {r['分数']}")
passed = [r['姓名'] for r in records if r['分数'] >= 90]
print('达到 90 分', passed)
print('平均分', round(sum(r['分数'] for r in records) / len(records), 2))`,
          output: String.raw`王同学: 96
林晓: 92
陈默: 85
达到 90 分 ['林晓', '王同学']
平均分 91.0`,
          explain: [
            'sorted 以每条记录的「分数」字段为依据降序排列，得到 96、92、85。',
            'passed 用列表推导式筛出分数不低于 90 的姓名。',
            '最后用生成器表达式求和再除以记录数，round 到两位得到 91.0。'
          ]
        },
        {
          type: 'table',
          title: '字典进阶写法速查',
          head: ['写法', '作用', '返回'],
          rows: [
            ['d.get(k, 默认)', '安全读取', '值或默认值'],
            ['d.setdefault(k, 默认)', '缺键时写入默认值', '该键的值'],
            ['sorted(d.items(), key=...)', '按指定依据排序', '元组列表'],
            ['d1 | d2', '合并（右侧优先）', '新字典'],
            ['d1.update(d2)', '原地合并', 'None'],
            ["[r for r in rs if 条件]", '筛选记录', '新列表']
          ]
        },
        {
          type: 'pitfalls',
          title: '常见错误与排查',
          items: [
            {
              wrong: 'counts[k] += 1 而键首次出现',
              why: '读取不存在的键抛 KeyError。',
              right: '用 get(k, 0) + 1 或 setdefault(k, 0)。'
            },
            {
              wrong: 'sorted(d) 后以为是按键以外顺序排列',
              why: '直接对字典排序得到的是排好序的键列表，不含值。',
              right: '用 sorted(d.items(), key=...) 保留键值对。'
            },
            {
              wrong: '合并配置时把默认配置放在 | 右侧',
              why: '右侧覆盖左侧，默认值会盖掉用户配置。',
              right: '把用户配置放右侧：defaults | user_settings。'
            },
            {
              wrong: "遍历记录时直接 r['字段'] 而部分记录缺字段",
              why: '缺字段抛 KeyError。',
              right: '用 r.get(\'字段\', 默认值) 或保证构建时字段齐全。'
            }
          ]
        },
        {
          type: 'summary',
          title: '知识小结',
          items: [
            'get(k, 0) 与 setdefault(k, 0) 都能简化计数，后者会写入默认值。',
            '按值排序用 sorted(d.items(), key=lambda kv: kv[1])。',
            'd1 | d2 返回新字典，update 原地修改；同名键右侧优先。',
            '列表套字典适合表达一组字段相同的记录。',
            '读取字段优先用 get，避免缺字段导致 KeyError。'
          ]
        },
        {
          type: 'review',
          title: '巩固练习解析',
          paras: [
            '「运行验证」常要求安全取值与遍历，注意输出的是值还是整个字典，且 get 的默认值应出现在缺键分支。',
            '「预测输出」偏爱考查按值排序后的顺序、合并时的覆盖规则。先确定排序依据与合并方向，再写出最终字典。',
            '「找错改错」高频问题是计数时直接 +=、对字典直接 sorted 后当作键值对使用、以及缺字段访问。',
            '「配对分类」把 get、setdefault、items、update 与用途对应，帮助你在统计与配置合并场景选择正确方法。'
          ]
        }
      ]
    },
    {
      id: 25,
      title: '模块与标准库',
      minutes: 25,
      objectives: [
        '能使用 import 导入模块并调用其成员',
        '能说明 import 与 from ... import 的差异',
        '能使用 math、random、datetime 中的常用函数',
        '能说明 __name__ 与脚本入口的作用'
      ],
      blocks: [
        {
          type: 'lead',
          text: '一个文件里的代码越写越长，就需要拆分；很多通用能力也不必自己实现。模块（module）就是「一个 .py 文件」，标准库（standard library）是随 Python 一起安装、无需额外依赖的模块集合。本节讲如何导入并使用它们。'
        },
        {
          type: 'prose',
          title: '导入方式与作用',
          paras: [
            'import math 导入整个模块，使用时写 math.sqrt(16)；from math import sqrt 只导入指定名字，可直接写 sqrt(16)；import math as m 给模块起别名。优先使用第一种：调用处带模块名，读者能立刻看出函数来自哪里，也避免同名函数互相覆盖。',
            'from 模块 import * 会一次性导入大量名字，极易造成命名冲突且难以追溯来源，应避免使用。导入语句通常写在文件顶部，import 一个模块时，其顶层代码会被执行一次；这也是为什么可执行的测试语句不该散落在模块顶层。',
            '标准库覆盖极广，常用的有：math（数学函数）、random（随机数）、datetime（日期时间）、os / pathlib（路径与系统）、collections（数据结构）、json（数据交换）。使用标准库而非自己重写，能减少错误并提升可维护性。'
          ]
        },
        {
          type: 'code',
          title: 'math、random 与确定性种子',
          code: String.raw`import math
import random

print('平方根', math.sqrt(16))
print('向上取整', math.ceil(3.2), '向下取整', math.floor(3.8))
print('圆周率保留两位', round(math.pi, 2))
random.seed(7)
print('固定种子', random.randint(1, 100))
random.seed(7)
print('再次相同', random.randint(1, 100))
print('选择', random.choice(['甲', '乙', '丙']) if False else '已跳过随机')`,
          output: String.raw`平方根 4.0
向上取整 4 向下取整 3
圆周率保留两位 3.14
固定种子 42
再次相同 42
选择 已跳过随机`,
          explain: [
            'math.sqrt 返回浮点数 4.0；ceil / floor 分别向上、向下取整。',
            'round(math.pi, 2) 得到 3.14。',
            'random.seed(7) 固定随机种子后，两次 randint 得到相同结果 42，说明伪随机序列可复现——这是测试中常用的技巧。',
            '最后一行用条件表达式避免输出不可预测的值，保证示例输出确定。'
          ]
        },
        {
          type: 'prose',
          title: '脚本入口与日期时间',
          paras: [
            '每个模块都有一个内置变量 __name__。当文件被直接运行时它的值是 \'__main__\'；当它被 import 时则是模块名。因此常见写法是 if __name__ == \'__main__\': 下面放测试代码或程序入口，这样该文件既能作为模块被复用，也能单独执行。',
            'datetime 模块用于处理日期时间。datetime.date.today() 依赖系统当前日期，输出会随运行日期变化，因此不适合写在需要精确核对输出的示例里；改用 date(2026, 11, 15) 这类显式构造，再用 strftime 格式化，结果才稳定可验证。',
            '第三方库需要通过 pip 安装，且要关注版本与环境差异；标准库没有这个负担。初学阶段优先把标准库用熟，遇到明确需求再引入外部依赖。'
          ]
        },
        {
          type: 'code',
          title: 'datetime 与脚本入口',
          code: String.raw`from datetime import date, timedelta

def main():
    d = date(2026, 11, 15)
    print('日期', d.isoformat())
    print('格式化', d.strftime('%Y/%m/%d'))
    print('星期（0=周一）', d.weekday())
    print('五天后', (d + timedelta(days=5)).isoformat())

if __name__ == '__main__':
    main()`,
          output: String.raw`日期 2026-11-15
格式化 2026/11/15
星期（0=周一） 6
五天后 2026-11-20`,
          explain: [
            '显式构造 2026 年 11 月 15 日，避免依赖运行当天日期。',
            'isoformat() 给出 YYYY-MM-DD，strftime 按指定格式输出。',
            'weekday() 中周一为 0、周日为 6，该日期是周日故返回 6。',
            'timedelta(days=5) 做日期加减；main() 只在文件被直接运行时调用。'
          ]
        },
        {
          type: 'table',
          title: '标准库常用模块速查',
          head: ['模块', '典型用途', '示例'],
          rows: [
            ['math', '数学运算', 'math.sqrt(16)'],
            ['random', '随机数与抽样', 'random.randint(1, 10)'],
            ['datetime', '日期时间', 'date(2026, 11, 15)'],
            ['os / pathlib', '路径与系统', 'os.path.join(a, b)'],
            ['collections', '增强数据结构', 'Counter(words)'],
            ['json', '数据序列化', 'json.dumps(obj)']
          ]
        },
        {
          type: 'pitfalls',
          title: '常见错误与排查',
          items: [
            {
              wrong: 'from 模块 import *',
              why: '导入大量名字，易冲突且难以追溯来源。',
              right: '显式导入需要的名字，或用 import 模块名。'
            },
            {
              wrong: 'import math 后直接写 sqrt(16)',
              why: '未加模块前缀时名字不在当前作用域，抛 NameError。',
              right: '写 math.sqrt(16)，或 from math import sqrt。'
            },
            {
              wrong: '把可执行测试代码写在模块顶层',
              why: '被 import 时也会执行，产生意外副作用。',
              right: '放入 if __name__ == \'__main__\': 块。'
            },
            {
              wrong: '在需精确核对输出的示例中用 today()',
              why: '结果随运行日期变化，无法稳定验证。',
              right: '显式构造固定日期，或把当前时间作为可选输入。'
            }
          ]
        },
        {
          type: 'summary',
          title: '知识小结',
          items: [
            'import 模块名 最清晰；from ... import 用于少量明确名字，避免通配符导入。',
            '导入语句放在文件顶部，模块顶层代码在 import 时会执行一次。',
            'random.seed() 可复现伪随机序列，便于测试。',
            'datetime 显式构造日期可让输出稳定；strftime 控制显示格式。',
            'if __name__ == \'__main__\': 让文件既能被导入也能直接运行。'
          ]
        },
        {
          type: 'review',
          title: '巩固练习解析',
          paras: [
            '「运行验证」常要求导入 math 后输出计算结果，注意 sqrt 返回浮点数，输出会是 4.0 而非 4。',
            '「预测输出」偏爱考查 ceil/floor/round 的差别，以及固定种子后随机数序列可复现这一性质。',
            '「找错改错」高频错误是漏写模块前缀、误用通配符导入后命名冲突、以及把入口代码放在顶层。ModuleNotFoundError 指向模块名或环境。',
            '「配对分类」把常用标准库模块与用途对应，帮助你在遇到需求时先判断是否已有内置方案。'
          ]
        }
      ]
    }
  ]
};
