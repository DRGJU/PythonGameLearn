export default {
  id: 3,
  title: '循环与容器',
  subtitle: '用列表保存一组数据，用循环让重复操作自动完成',
  intro: '前两章的程序每条语句只执行一次。当数据从「一个值」变成「一组值」，就需要容器来保存它们、用循环来逐个处理。本章建立两个核心概念：列表（list）与字典（dict）这两种最常用的容器，以及 while / for 两种循环。学完本章，你应能对一组数据做遍历、筛选、统计，并理解遍历时修改容器为什么危险。',
  lessons: [
    {
      id: 11,
      title: 'while：条件驱动的重复',
      minutes: 25,
      objectives: [
        '能说明 while 循环的执行流程与终止条件',
        '能识别并避免死循环',
        '能使用 break 与 continue 控制循环',
        '能用循环完成累加与计数'
      ],
      blocks: [
        {
          type: 'lead',
          text: '如果需要输出 1 到 100，写一百行 print() 显然不可接受。循环（loop）让一段代码在条件满足时反复执行。while 是最直接的形式：只要条件为真就继续，因此它的正确性完全依赖「条件最终会变成假」——这正是初学者最容易出错的地方。'
        },
        {
          type: 'prose',
          title: '执行流程与终止条件',
          paras: [
            'while 语句以冒号结尾，其后缩进的语句构成循环体（body）。每次执行前先求值条件：为真则执行整个循环体，执行完回到条件处再次判断；为假则跳过循环体，继续执行后面的代码。这个「判断—执行—回到判断」的节奏，决定了循环变量必须在循环体内被更新。',
            '所谓死循环（infinite loop），就是条件永远为真。最常见的成因是忘记递增计数器，例如 while i < 5: 里只写了 print(i)。一旦发生，程序会持续输出直到被外部中断。写 while 时养成一个习惯：先问自己「哪一行会让条件向假靠近」，确认存在再运行。',
            'break 用于立即结束整个循环，continue 用于跳过本次循环剩余语句、直接进入下一轮判断。二者都应与条件判断搭配使用，避免让循环的退出路径散落在多处而难以推理。'
          ]
        },
        {
          type: 'code',
          title: '计数循环与累加',
          code: String.raw`i = 1
total = 0
while i <= 5:
    print('第', i, '轮')
    total += i
    i += 1
print('累加结果', total)
print('循环结束时 i =', i)`,
          output: String.raw`第 1 轮
第 2 轮
第 3 轮
第 4 轮
第 5 轮
累加结果 15
循环结束时 i = 6`,
          explain: [
            'i 从 1 开始，每轮末尾执行 i += 1，使条件 i <= 5 最终为假，循环共执行 5 次。',
            'total 在每轮累加当前的 i，最终得到 1+2+3+4+5 = 15。',
            '循环结束后 i 为 6，说明退出发生在「条件第一次为假」的那次判断，循环体并未执行。',
            '注意 print(\'第\', i, \'轮\') 用逗号分隔参数，因此输出中「第」与数字之间有一个默认空格。'
          ]
        },
        {
          type: 'prose',
          title: 'break、continue 与循环设计',
          paras: [
            '有时退出条件无法写在 while 头部，例如需要读到某个特定值才停止。这时常用 while True: 配合循环体内的 break，形成「无限循环 + 内部出口」的结构。它本身没有错，但必须保证至少存在一条可达的 break 路径，否则仍是死循环。',
            'continue 的典型用途是跳过不符合条件的元素。例如累加 1 到 10 中的奇数，可以先判断偶数则 continue，再累加。要小心：continue 会跳过循环体中它之后的所有语句，如果把计数器递增写在 continue 之后，就会造成计数器永不更新，从而死循环。',
            '一个更稳妥的设计原则是：能用明确的循环条件，就优先写在 while 头部；把 break 留给「搜索到目标」「用户输入结束指令」这类由数据决定的提前退出。循环条件表达「为什么继续」，比在中间散落 break 更容易验证。'
          ]
        },
        {
          type: 'code',
          title: 'break 与 continue 的行为',
          code: String.raw`n = 1
odd_sum = 0
while n <= 10:
    n += 1
    if n % 2 == 0:
        continue
    odd_sum += n
    if n >= 9:
        break
print('奇数和', odd_sum)
print('退出时 n =', n)`,
          output: String.raw`奇数和 24
退出时 n = 9`,
          explain: [
            '每轮开头先把 n 加 1，确保计数器一定更新，避免 continue 造成死循环。',
            'n 为偶数时 continue 跳过累加；被累加的是 3、5、7、9，和为 24。',
            '当 n 达到 9 时执行 break 立即退出，因此 n 为 10 的情况不会被处理。',
            '把递增放在循环体最前面，是使用 continue 时规避死循环的常用写法。'
          ]
        },
        {
          type: 'table',
          title: 'while 相关写法速查',
          head: ['写法', '作用', '风险提示'],
          rows: [
            ['while 条件:', '条件为真时重复', '必须有使条件变假的语句'],
            ['i += 1', '更新计数器', '漏写即死循环'],
            ['break', '立即结束整个循环', '需保证至少一条可达路径'],
            ['continue', '跳过本轮剩余语句', '勿跳过计数器更新'],
            ['while True: ... break', '由数据决定退出时机', '出口必须明确']
          ]
        },
        {
          type: 'pitfalls',
          title: '常见错误与排查',
          items: [
            {
              wrong: 'while i < 5: 循环体内没有修改 i',
              why: '条件恒为真，形成死循环，程序不会自行结束。',
              right: '在循环体内加入 i += 1 或等价的推进语句。'
            },
            {
              wrong: '把 i += 1 写在 continue 之后',
              why: '命中 continue 的轮次不会执行递增，计数器停滞。',
              right: '把计数器更新移到循环体开头或 continue 之前。'
            },
            {
              wrong: 'while x != 0: 而 x 每次减 0.3',
              why: '浮点误差可能让 x 永远不精确等于 0。',
              right: '改用整数计数，或用 x > 1e-9 之类的区间条件。'
            },
            {
              wrong: '在 while 行尾漏写冒号',
              why: '复合语句需要冒号引出缩进块，否则 SyntaxError。',
              right: '补冒号并检查循环体缩进。'
            }
          ]
        },
        {
          type: 'summary',
          title: '知识小结',
          items: [
            'while 每轮先判断条件再执行循环体，条件为假时退出。',
            '循环体内必须存在使条件趋向为假的语句，否则死循环。',
            'break 结束整个循环，continue 跳过本轮剩余语句。',
            '使用 continue 时，把计数器更新放在 continue 之前。',
            '浮点循环条件应避免精确等值比较，优先用整数计数或区间判断。'
          ]
        },
        {
          type: 'review',
          title: '巩固练习解析',
          paras: [
            '「运行验证」通常要求用 while 输出连续数字。注意循环边界：i <= 5 与 i < 5 会相差一轮，输出行数也随之不同。',
            '「预测输出」常把累加、continue、break 组合，考查每轮是否执行、何时退出。建议画一张表格逐轮记录变量值。',
            '「找错改错」最高频的问题是漏写递增导致死循环，以及递增写在 continue 之后。若程序长时间无输出或输出不停止，优先检查推进语句。',
            '「配对分类」把 break、continue、计数器与各自作用对应，帮助建立「循环三要素：初始状态、继续条件、状态推进」的检查清单。'
          ]
        }
      ]
    },
    {
      id: 12,
      title: '列表：保存一组有序数据',
      minutes: 30,
      objectives: [
        '理解列表是有序、可变、可含异构元素的序列',
        '能使用索引、切片、len() 访问元素',
        '能用 append / insert / pop / remove 修改列表',
        '能说明列表是可变对象及赋值的含义'
      ],
      blocks: [
        {
          type: 'lead',
          text: '一个变量只能保存一个值，处理全班成绩、购物车条目这类数据时就需要容器。列表（list）是 Python 最常用的容器：用方括号定义，元素有序排列，可以随时增删。它与字符串同为序列，因此索引、切片、len() 等规则可以直接迁移，但「可变」这一点带来了全新的行为。'
        },
        {
          type: 'prose',
          title: '有序、可变与异构',
          paras: [
            '列表用 [元素1, 元素2, ...] 定义，元素之间用逗号分隔。有序（ordered）意味着每个元素有确定的位置，索引从 0 开始，可以用负数从末尾访问；切片同样遵循左闭右开。用 len() 获取元素个数，用 in 判断某元素是否存在。',
            '可变（mutable）指列表对象本身可以被修改：append() 追加、insert() 按位置插入、pop() 删除并返回、remove() 按值删除、直接通过下标赋值替换。这与字符串的不可变形成对照，也是本节最需要建立的区别。',
            '列表可以容纳不同类型的元素，例如 [1, \'a\', 3.5] 是合法的，称为异构。但实践中同一列表通常保持元素类型一致，这样遍历与统计时才不必逐个元素判断类型，代码也更可预测。'
          ]
        },
        {
          type: 'code',
          title: '创建、访问与切片',
          code: String.raw`scores = [88, 95, 72, 91]
print(len(scores))
print(scores[0], scores[-1])
print(scores[1:3])
print(scores[:2], scores[2:])
print(95 in scores)
print(scores * 2)`,
          output: String.raw`4
88 91
[95, 72]
[88, 95] [72, 91]
True
[88, 95, 72, 91, 88, 95, 72, 91]`,
          explain: [
            'len() 返回元素个数 4；scores[0] 是首元素 88，scores[-1] 是末元素 91。',
            'scores[1:3] 取下标 1、2，得到含两个元素的新列表；省略端点表示从头或到尾。',
            'in 判断成员是否存在，返回布尔值 True。',
            '列表与整数相乘会重复元素生成新列表，这与字符串乘法的行为一致。'
          ]
        },
        {
          type: 'prose',
          title: '可变性与引用',
          paras: [
            '列表可变带来一个必须理解的现象：把同一个列表绑定到两个名字，通过其中一个名字修改列表，另一个名字看到的内容也会变化。因为它们指向的是同一个对象，而不是两份副本。若确实需要独立副本，应使用 scores.copy() 或切片 scores[:]。',
            '这一点在函数传参时同样成立，第 18 节讲作用域时会再次遇到。初学阶段最安全的习惯是：当意图是「复制一份数据」时，显式调用 copy()，不要用赋值语句代替。',
            '修改方法各有侧重：append(x) 只在末尾追加；insert(i, x) 在指定位置插入，其后的元素依次后移；pop() 默认删除并返回最后一个元素，pop(0) 删除首位；remove(x) 删除第一次出现的值，若值不存在会抛 ValueError。删除前用 in 判断是常见的防御写法。'
          ]
        },
        {
          type: 'code',
          title: '增删改与共享引用',
          code: String.raw`nums = [10, 20, 30]
nums.append(40)
nums.insert(1, 15)
print('插入后', nums)
last = nums.pop()
print('弹出', last, '剩余', nums)
nums.remove(15)
print('删除后', nums)
alias = nums
alias.append(99)
print('原名字看到', nums)
copy = nums[:]
copy.append(0)
print('副本', copy, '原表', nums)`,
          output: String.raw`插入后 [10, 15, 20, 30, 40]
弹出 40 剩余 [10, 15, 20, 30]
删除后 [10, 20, 30]
原名字看到 [10, 20, 30, 99]
副本 [10, 20, 30, 99, 0] 原表 [10, 20, 30, 99]`,
          explain: [
            'append 追加到末尾，insert(1, 15) 把 15 插到下标 1，后续元素后移。',
            'pop() 删除并返回末元素 40；remove(15) 按值删除第一次出现的 15。',
            'alias = nums 只是新增一个名字指向同一对象，因此 alias.append(99) 后 nums 也变化。',
            '最后用切片 nums[:] 得到独立副本，对副本追加不再影响原表。'
          ]
        },
        {
          type: 'table',
          title: '列表方法速查',
          head: ['写法', '作用', '是否修改原列表'],
          rows: [
            ['len(a)', '元素个数', '否'],
            ['a[i] / a[i:j]', '索引 / 切片', '否'],
            ['a.append(x)', '末尾追加', '是'],
            ['a.insert(i, x)', '按位置插入', '是'],
            ['a.pop() / a.pop(0)', '删除并返回元素', '是'],
            ['a.remove(x)', '按值删除首次出现', '是'],
            ['a.copy() / a[:]', '生成独立副本', '否']
          ]
        },
        {
          type: 'pitfalls',
          title: '常见错误与排查',
          items: [
            {
              wrong: 'b = a 后以为 b 是独立副本',
              why: '两个名字指向同一列表对象，任一处的修改都会被另一处看到。',
              right: '用 b = a.copy() 或 b = a[:] 显式复制。'
            },
            {
              wrong: 'a[4] 而 len(a) 为 4',
              why: '最大索引为 3，越界抛出 IndexError。',
              right: '确认长度；切片 a[0:5] 越界不会报错。'
            },
            {
              wrong: 'a.remove(x) 而 x 不在列表中',
              why: '按值删除找不到目标时抛出 ValueError。',
              right: '先 if x in a: 再删除，或捕获异常。'
            },
            {
              wrong: '在 for 循环中边遍历边 append 同一列表',
              why: '新元素会继续被遍历到，可能形成不断增长的循环。',
              right: '遍历副本 for x in a[:]，或把结果写入新列表。'
            }
          ]
        },
        {
          type: 'summary',
          title: '知识小结',
          items: [
            '列表有序、可变、可异构；索引从 0 开始，切片左闭右开。',
            'append / insert / pop / remove 直接修改原列表；切片与 copy() 生成副本。',
            '赋值只是新增名字，两个名字可指向同一对象，修改会互相可见。',
            'in 用于成员判断，删除前判断可避免 ValueError。',
            '遍历时修改同一列表存在风险，应遍历副本或写入新列表。'
          ]
        },
        {
          type: 'review',
          title: '巩固练习解析',
          paras: [
            '「运行验证」常要求输出列表首元素与长度。注意 len() 返回元素个数，而 a[0] 是首元素；两者类型不同，输出格式也不同。',
            '「预测输出」偏爱考查切片边界、pop 的返回值，以及别名赋值后的联动变化。遇到 a.pop() 要同时记录「返回值」与「列表新状态」。',
            '「找错改错」高频问题是索引越界、remove 不存在的值、以及误把赋值当复制。IndexError 查下标，ValueError 查按值删除。',
            '「配对分类」把 append、insert、pop、remove 与语义对应，重点是区分「按位置操作」与「按值操作」。'
          ]
        }
      ]
    },
    {
      id: 13,
      title: 'for：遍历序列与 range()',
      minutes: 30,
      objectives: [
        '能说明 for 循环与 while 循环的适用差异',
        '能使用 range() 生成整数序列并控制步长',
        '能结合 enumerate() 同时取得索引与值',
        '能用循环完成求和、计数与筛选'
      ],
      blocks: [
        {
          type: 'lead',
          text: '当「要处理的对象」本身就是一组已知的数据时，for 循环比 while 更贴切：它直接依次取出容器中的每个元素，不需要自己维护计数器和终止条件。本节把 for 与 range() 一起讲，并说明为什么遍历时修改容器会带来隐患。'
        },
        {
          type: 'prose',
          title: '遍历的含义',
          paras: [
            'for 变量 in 可迭代对象: 的语义是：依次从对象中取出一个值，绑定到变量，执行循环体，直到对象被取完。字符串、列表、元组、字典、range() 都是可迭代对象（iterable）。循环次数由对象长度决定，因此不会像 while 那样因为忘记递增而死循环。',
            'range(stop) 生成 0 到 stop-1 的整数序列，同样左闭右开；range(start, stop, step) 可指定起点与步长，步长可以是负数以实现倒序。需要强调 range() 返回的是可迭代的 range 对象，不是列表；只有在确实需要列表时才用 list(range(...)) 转换。',
            '如果既需要元素又需要下标，用 enumerate(a)，它在每轮给出一个「下标, 元素」二元组。这比写 for i in range(len(a)): 再用 a[i] 取值更直接，也不容易因下标计算出错。'
          ]
        },
        {
          type: 'code',
          title: '遍历列表、字符串与 range',
          code: String.raw`fruits = ['苹果', '香蕉', '橙子']
for f in fruits:
    print('水果：' + f)
for ch in 'Py':
    print('字符', ch)
for i in range(1, 6, 2):
    print('奇数位', i)
for idx, f in enumerate(fruits):
    print(idx, f)`,
          output: String.raw`水果：苹果
水果：香蕉
水果：橙子
字符 P
字符 y
奇数位 1
奇数位 3
奇数位 5
0 苹果
1 香蕉
2 橙子`,
          explain: [
            '第 2～3 行依次取出列表中的三个字符串，循环体执行三次。',
            '第 4～5 行说明字符串也可遍历，每次给出一个字符。',
            'range(1, 6, 2) 生成 1、3、5，注意右端点 6 不包含在内，步长为 2。',
            '最后用 enumerate 同时取得下标与元素，输出从 0 开始。'
          ]
        },
        {
          type: 'prose',
          title: '累加模式与遍历时修改',
          paras: [
            '循环最常见的用途是聚合：在循环前设一个累加器（如 total = 0 或 count = 0），循环体内按条件更新，循环结束后使用结果。这个「初始化—更新—使用」三步模式，几乎出现在所有统计类代码中。写之前先明确累加器的初值与更新条件，可以避免把计数和求和混在一起。',
            '另一类需求是筛选：把满足条件的元素收集到新列表。正确做法是新建一个空列表，遍历原列表，符合条件就 append 到新列表。切勿在遍历原列表的同时删除它的元素——删除会让后续元素前移，导致部分元素被跳过。',
            '若确实需要按条件删除，推荐两种安全写法：遍历副本 for x in a[:]，或者用列表推导式直接生成新列表（第 23 节会讲）。两者都遵循「不在遍历过程中改变被遍历对象」这一原则。'
          ]
        },
        {
          type: 'code',
          title: '累加、筛选与安全删除',
          code: String.raw`nums = [3, 8, 5, 12, 7]
total = 0
big = []
for n in nums:
    total += n
    if n > 6:
        big.append(n)
print('总和', total)
print('大于 6 的', big)
kept = [n for n in nums if n <= 6]
print('保留', kept)
print('原表未变', nums)`,
          output: String.raw`总和 35
大于 6 的 [8, 12, 7]
保留 [3, 5]
原表未变 [3, 8, 5, 12, 7]`,
          explain: [
            'total 是累加器，遍历 5 个元素后得到 3+8+5+12+7 = 35。',
            'big 是新建列表，只收集大于 6 的元素，保持原表不变。',
            'kept 用列表推导式生成新列表，同样不修改原表；这是筛分场景的推荐写法。',
            '最后一行说明原表仍然是原来的五个元素，遍历与筛选过程没有改动它。'
          ]
        },
        {
          type: 'table',
          title: 'for 与 range 速查',
          head: ['写法', '产生 / 作用', '说明'],
          rows: [
            ['for x in a:', '依次取出元素', '循环次数由 a 长度决定'],
            ['range(5)', '0,1,2,3,4', '左闭右开'],
            ['range(2, 8, 3)', '2, 5', '带起点与步长'],
            ['range(5, 0, -1)', '5,4,3,2,1', '负步长倒序'],
            ['enumerate(a)', '(下标, 元素) 对', '同时需要索引时使用']
          ]
        },
        {
          type: 'pitfalls',
          title: '常见错误与排查',
          items: [
            {
              wrong: 'for i in range(5): 后期望 i 取到 5',
              why: 'range 左闭右开，最大值为 4。',
              right: '用 range(6) 或调整边界。'
            },
            {
              wrong: '遍历列表时对其 remove()',
              why: '删除导致后续元素前移，部分元素被跳过。',
              right: '遍历副本 a[:]，或用推导式生成新列表。'
            },
            {
              wrong: '把累加器初始化写在循环体内部',
              why: '每轮都被重置，最终只保留最后一轮的值。',
              right: '累加器初始化放在 for 之前。'
            },
            {
              wrong: "for x in 5:",
              why: '整数不是可迭代对象，抛出 TypeError。',
              right: '改用 range(5)，或遍历一个列表。'
            }
          ]
        },
        {
          type: 'summary',
          title: '知识小结',
          items: [
            'for 依次取出可迭代对象的元素，无需手动维护计数器。',
            'range(start, stop, step) 左闭右开，支持负步长倒序。',
            'enumerate() 同时给出下标与元素，优于 range(len(a)) 的下标写法。',
            '聚合遵循「初始化累加器 → 循环内更新 → 循环后使用」。',
            '筛选应写入新列表，不要在遍历中修改被遍历对象。'
          ]
        },
        {
          type: 'review',
          title: '巩固练习解析',
          paras: [
            '「运行验证」通常要求用 for 遍历输出若干元素，注意输出顺序与容器顺序一致，且每行只 print() 一次。',
            '「预测输出」常把 range 的边界、步长与累加器组合。先列出 range 实际产生的整数序列，再逐轮更新累加器。',
            '「找错改错」高频错误是 range 少一位、累加器放错位置、以及在遍历中删除元素。若结果比预期少一个元素，优先检查 range 右端点。',
            '「配对分类」把 for、range、enumerate 与用途对应，帮助你在「已知数据集合」与「条件驱动」之间正确选择循环形式。'
          ]
        }
      ]
    },
    {
      id: 14,
      title: '列表操作：排序、切片与常用模式',
      minutes: 30,
      objectives: [
        '能区分 sort() 与 sorted() 的返回值差异',
        '能使用切片完成反转、步长取值与赋值',
        '能说明 min / max / sum 的适用条件',
        '能识别切片赋值与深浅复制的区别'
      ],
      blocks: [
        {
          type: 'lead',
          text: '掌握增删之后，本节处理更常见的「整理数据」需求：排序、反转、取前几项、求最值。这些操作大多有内置实现，但它们的返回值语义各不相同——有的修改原列表并返回 None，有的返回新列表。混淆这两类，是这一节最高频的错误来源。'
        },
        {
          type: 'prose',
          title: '原地修改与返回新对象',
          paras: [
            'a.sort() 是列表的方法，它**原地**排序，返回 None；sorted(a) 是内置函数，返回一个排好序的**新列表**，原列表不变。因此写 print(a.sort()) 会得到 None，写 a = a.sort() 更会把 a 变成 None，导致后续操作全部报错。判断标准很简单：方法名是动词原形的多为原地修改，独立函数多返回新对象。',
            'a.reverse() 同样原地反转并返回 None；反转的另一种写法是切片 a[::-1]，它生成新列表。切片完整形式是 a[start:stop:step]，第三个参数步长设为 -1 即可得到倒序副本，设为 2 可隔一个取一个。切片赋值 a[1:3] = [...] 则能一次替换一段元素，长度可以与原段不同。',
            '统计类内置函数 sum(a)、min(a)、max(a)、len(a) 都不修改列表。它们要求元素类型兼容：sum() 只能用于数值，若列表里混入字符串会抛 TypeError。对混合类型数据，应先筛分或转换再统计。'
          ]
        },
        {
          type: 'code',
          title: '排序、反转与切片',
          code: String.raw`nums = [5, 2, 9, 1, 7]
print('降序新表', sorted(nums, reverse=True))
print('原表', nums)
nums.sort()
print('原地排序后', nums)
print('倒序副本', nums[::-1])
print('隔一个取', nums[::2])
print('前三项', nums[:3])
print('统计', sum(nums), min(nums), max(nums))`,
          output: String.raw`降序新表 [9, 7, 5, 2, 1]
原表 [5, 2, 9, 1, 7]
原地排序后 [1, 2, 5, 7, 9]
倒序副本 [9, 7, 5, 2, 1]
隔一个取 [1, 5, 9]
前三项 [1, 2, 5]
统计 24 1 9`,
          explain: [
            'sorted() 返回降序新列表，第 2 行可见原表仍保持未排序状态。',
            'nums.sort() 原地升序，之后原表内容改变；它本身返回 None，不应被赋值。',
            '[::-1] 用负步长生成倒序副本，[::2] 从下标 0 起每隔一个取一个。',
            '最后一行演示 sum/min/max，排序后列表总和为 24。'
          ]
        },
        {
          type: 'prose',
          title: '复制的层次与切片赋值',
          paras: [
            '第 12 节讲过 a[:] 与 a.copy() 能生成副本，但它们只复制最外层，称为浅复制（shallow copy）。若列表里还嵌套着列表，内层对象仍被两个外层列表共享，修改嵌套内容会同时反映到两边。需要完全独立时应使用标准库 copy 模块的 deepcopy()。',
            '切片赋值是一个容易被忽略但很实用的能力：a[1:3] = [10, 20, 30] 会用三个元素替换原来两个元素，列表长度随之改变。它与「按下标赋值 a[1] = 10」不同，后者只替换单个元素、不改变长度。',
            '排序还可以通过 key 参数自定义依据，例如 sorted(words, key=len) 按字符串长度排序。key 接收一个函数，对排序对象逐个求值。这是后续学习函数与 lambda 时的重要铺垫。'
          ]
        },
        {
          type: 'code',
          title: '浅复制与按规则排序',
          code: String.raw`words = ['banana', 'kiwi', 'apple', 'fig']
print('按字母', sorted(words))
print('按长度', sorted(words, key=len))
a = [1, 2, 3]
a[1:2] = [20, 30]
print('切片赋值后', a)
nested = [[1, 2], [3, 4]]
shallow = nested[:]
shallow[0].append(99)
print('浅复制共享内层', nested)`,
          output: String.raw`按字母 ['apple', 'banana', 'fig', 'kiwi']
按长度 ['fig', 'kiwi', 'apple', 'banana']
切片赋值后 [1, 20, 30, 3]
浅复制共享内层 [[1, 2, 99], [3, 4]]`,
          explain: [
            'sorted(words) 按字母序；sorted(words, key=len) 按长度得到 fig(3)、kiwi(4)、apple(5)、banana(6)。',
            'a[1:2] 原为 [2]，替换为 [20, 30] 后列表长度由 3 变 4。',
            'nested[:] 只复制外层，内层列表仍是共享对象；对 shallow[0] 追加 99 后 nested 也变化。'
          ]
        },
        {
          type: 'table',
          title: '列表整理操作速查',
          head: ['写法', '修改原表', '返回值'],
          rows: [
            ['a.sort()', '是', 'None'],
            ['sorted(a)', '否', '新列表'],
            ['a.reverse()', '是', 'None'],
            ['a[::-1]', '否', '倒序新列表'],
            ['a[::2]', '否', '隔项新列表'],
            ['sum / min / max', '否', '数值'],
            ['a[:] / a.copy()', '否', '浅复制新列表']
          ]
        },
        {
          type: 'pitfalls',
          title: '常见错误与排查',
          items: [
            {
              wrong: 'a = a.sort()',
              why: 'sort() 原地排序并返回 None，赋值后 a 变成 None。',
              right: '直接调用 a.sort()，或 a = sorted(a)。'
            },
            {
              wrong: 'sum([\'a\', 1])',
              why: 'sum() 要求数值元素，混合类型抛 TypeError。',
              right: '先筛出数值，或改用字符串拼接 \'\'.join()。'
            },
            {
              wrong: '以为 a[:] 能隔离嵌套列表的修改',
              why: '浅复制只复制外层引用，内层对象仍共享。',
              right: '使用 copy.deepcopy()。'
            },
            {
              wrong: 'a[5:2] 期望得到倒序片段',
              why: '起始大于结束且步长为正时结果为空列表。',
              right: '用 a[2:5][::-1] 或 a[5:2:-1]。'
            }
          ]
        },
        {
          type: 'summary',
          title: '知识小结',
          items: [
            'sort() / reverse() 原地修改并返回 None；sorted() / 切片返回新对象。',
            '切片 a[start:stop:step] 支持负步长倒序与隔项取值。',
            '切片赋值可一次替换一段元素并改变列表长度。',
            'sum / min / max 要求元素类型兼容，均不修改原列表。',
            '浅复制只隔离外层，嵌套结构需 deepcopy；sorted 可用 key 自定义依据。'
          ]
        },
        {
          type: 'review',
          title: '巩固练习解析',
          paras: [
            '「运行验证」常要求增删元素后输出列表，注意 print(list) 会显示方括号、逗号和空格，与逐元素输出格式不同。',
            '「预测输出」偏爱考查 sort() 返回 None 的情形、切片边界以及 [::2] 的取值。先判断操作是否改变原表，再写出结果。',
            '「找错改错」高频错误是把 a = a.sort() 当作排序、对混合类型用 sum()、以及误以为浅复制完全独立。AttributeError: \'NoneType\' 通常就来自前者。',
            '「配对分类」把 sort 与 sorted、reverse 与 [::-1] 对应，核心是区分「原地」与「返回新对象」两类语义。'
          ]
        }
      ]
    },
    {
      id: 15,
      title: '字典：按键取值的数据结构',
      minutes: 30,
      objectives: [
        '理解键值对映射与列表顺序存储的区别',
        '能创建、读取、新增、修改与删除键值项',
        '能使用 get() 安全取值并说明其价值',
        '能遍历 keys / values / items'
      ],
      blocks: [
        {
          type: 'lead',
          text: '列表用位置找数据，字典（dict）用「名字」找数据。当数据天然带有标识——学生姓名对应成绩、商品编号对应价格——用键值对（key-value pair）表达比记住下标可靠得多。本节建立映射（mapping）这一模型，并说明为什么 get() 比直接下标取值更安全。'
        },
        {
          type: 'prose',
          title: '映射、键与值',
          paras: [
            '字典用花括号定义，形如 {\'键\': 值, ...}。键（key）必须唯一且为不可变类型，常用字符串、数字、元组；值（value）可以是任意对象。通过 d[key] 读取对应值，通过 d[key] = value 新增或修改。若 key 不存在，读取会抛出 KeyError，这是字典最常见的运行时错误。',
            '与列表的本质差异在查找方式：列表按位置索引，要找某个内容往往需要遍历；字典按键直接定位，不依赖元素顺序。Python 3.7 起字典保持插入顺序，这是实现细节带来的便利，但设计代码时仍应把字典理解为「映射」而非「有序列表」。',
            'get(key, default) 在键不存在时返回默认值而不是抛异常，因此处理外部数据时更稳健。in 用于判断键是否存在（注意判断的是键，不是值）。删除用 del d[key] 或 d.pop(key)，后者会同时返回被删除的值。'
          ]
        },
        {
          type: 'code',
          title: '创建、读取与修改',
          code: String.raw`student = {'姓名': '林晓', '年龄': 16, '城市': '杭州'}
print(student['姓名'])
student['年龄'] = 17
student['班级'] = '高二 3 班'
print('修改后', student['年龄'], student['班级'])
print('用 get 取不存在的键', student.get('电话', '未填写'))
print('键是否存在', '城市' in student, '林晓' in student)
removed = student.pop('城市')
print('删除的值', removed)
print('剩余键', list(student.keys()))`,
          output: String.raw`林晓
修改后 17 高二 3 班
用 get 取不存在的键 未填写
键是否存在 True False
删除的值 杭州
剩余键 ['姓名', '年龄', '班级']`,
          explain: [
            '第 2 行按键读取；第 3、4 行分别修改已有键与新增键，语法相同。',
            'get(\'电话\', \'未填写\') 因键不存在返回默认值，避免了 KeyError。',
            'in 判断的是键：\'城市\' 是键故 True，\'林晓\' 是值故 False。',
            'pop() 删除并返回被删的值；keys() 返回所有键，转成列表后便于查看。'
          ]
        },
        {
          type: 'prose',
          title: '遍历字典与嵌套结构',
          paras: [
            '直接 for k in d: 遍历的是键。若需要值，用 d.values()；若同时需要两者，用 d.items()，它在每轮给出 (键, 值) 二元组。 items() 是统计与格式化输出中最常用的形式。',
            '字典的值可以是列表、也可以是另一个字典，由此能表达层级数据，例如 {\'林晓\': {\'语文\': 88, \'数学\': 95}}。访问时逐层按键取值即可。层级越深，越应该在读取前确认每一层的键都存在，或用 get() 提供默认值。',
            '把「一组同结构记录」存为列表、每条记录是字典，是处理表格数据的常见做法。它兼顾了列表的顺序性与字典的自描述性，后续章节的综合项目会沿用这一结构。'
          ]
        },
        {
          type: 'code',
          title: '遍历与嵌套字典',
          code: String.raw`scores = {'语文': 88, '数学': 95, '英语': 91}
total = 0
for subject, score in scores.items():
    print(subject, score)
    total += score
print('总分', total)
print('平均值', round(total / len(scores), 2))
records = [{'姓名': '林晓', '分数': 92}, {'姓名': '陈默', '分数': 85}]
for r in records:
    print(r['姓名'], r['分数'])`,
          output: String.raw`语文 88
数学 95
英语 91
总分 274
平均值 91.33
林晓 92
陈默 85`,
          explain: [
            'items() 每轮给出 (科目, 分数)，累加三科得到 274。',
            '平均值用总分除以 len(scores) 即 3，round 到两位为 91.33。',
            '最后两行演示「列表套字典」：遍历列表，再按姓名与分数两个键取值。'
          ]
        },
        {
          type: 'table',
          title: '字典操作速查',
          head: ['写法', '作用', '键不存在时'],
          rows: [
            ['d[k]', '按键取值', '抛 KeyError'],
            ['d.get(k, 默认)', '安全取值', '返回默认值'],
            ['d[k] = v', '新增或修改', '自动新增'],
            ['d.pop(k)', '删除并返回值', '抛 KeyError'],
            ['k in d', '判断键是否存在', '返回 False'],
            ['d.items()', '遍历键值对', '—']
          ]
        },
        {
          type: 'pitfalls',
          title: '常见错误与排查',
          items: [
            {
              wrong: "d['不存在的键']",
              why: '按键读取时键缺失会抛 KeyError。',
              right: '用 d.get(k, 默认值)，或先用 k in d 判断。'
            },
            {
              wrong: "用 '值' in d 判断某个值是否存在",
              why: 'in 对字典判断的是键，值永远匹配不上。',
              right: "改用 值 in d.values()。"
            },
            {
              wrong: '把列表当作字典的键',
              why: '键必须是不可变类型，列表可变，抛出 TypeError: unhashable type。',
              right: '改用元组或字符串作为键。'
            },
            {
              wrong: '遍历字典时认为遍历的是值',
              why: 'for k in d 遍历的是键。',
              right: '需要值用 d.values()，需要两者用 d.items()。'
            }
          ]
        },
        {
          type: 'summary',
          title: '知识小结',
          items: [
            '字典是键到值的映射；键唯一且不可变，值可为任意对象。',
            'd[k] 取值缺键抛 KeyError，get(k, 默认) 可安全回退。',
            'in 判断键；values() 取值集合，items() 取键值对。',
            '字典可嵌套，列表套字典适合表达一组同结构记录。',
            '字典保持插入顺序，但设计上仍应作为映射理解。'
          ]
        },
        {
          type: 'review',
          title: '巩固练习解析',
          paras: [
            '「运行验证」常要求按给定键读取并修改字典后输出。注意输出的是值而不是整个字典，且新增键与修改已有键写法相同。',
            '「预测输出」偏爱考查 get() 的默认值、in 判断的是键、以及遍历顺序。逐行记录字典状态变化比只看最后一行更可靠。',
            '「找错改错」高频问题是缺键直接用下标、把值当键判断、以及误以为遍历得到的是值。KeyError 直接指向键名拼写或缺失。',
            '「配对分类」把 keys / values / items / get 与用途对应，检验你能否为不同需求选择正确的访问方式。'
          ]
        }
      ]
    }
  ]
};
