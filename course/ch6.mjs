export default {
  id: 6,
  title: '面向对象与进阶特性',
  subtitle: '用类组织数据与行为，理解继承、装饰器与生成器的工作原理',
  intro: '最后一章从「把数据传给函数」转向「让数据自带行为」。类（class）把相关的数据与操作封装成对象，继承让相似类型共享实现；装饰器与生成器则是 Python 表达力最强的两个进阶机制。本章不追求语法罗列，而是把每个机制解决什么问题、代价是什么讲清楚。学完本章，你应能读懂主流 Python 项目的基本结构。',
  lessons: [
    {
      id: 26,
      title: '类与对象：让数据自带行为',
      minutes: 35,
      objectives: [
        '能区分类、实例、属性与方法',
        '能说明 __init__ 与 self 的作用',
        '能定义实例方法并调用',
        '能说明类属性与实例属性的差别'
      ],
      blocks: [
        {
          type: 'lead',
          text: '前面的章节里，数据（字典、列表）和操作它的函数是分离的。当数据字段固定、且总被同一组操作处理时，把它们放在一起更自然。类（class）就是这种「数据 + 行为」的模板，按模板创建出来的具体个体称为实例（instance）或对象。'
        },
        {
          type: 'prose',
          title: 'class、__init__ 与 self',
          paras: [
            '定义类用 class 类名:，类体内用 def 定义方法（method）。__init__ 是初始化方法，在创建实例时自动调用，用来给实例设置初始状态。它的第一个参数约定写成 self，代表「正在被操作的这个实例」；调用时不需要手动传，Python 会自动把实例作为第一个参数传进去。',
            '创建实例的写法是类名(参数)，例如 Student(\'林晓\', 92)。这一过程会分配新对象、调用 __init__、返回该实例。实例自己的数据通过 self.属性名 保存，称为实例属性；读取时用 实例.属性名。同一个类的不同实例拥有各自独立的一组实例属性。',
            '方法也是函数，只是定义在类体内且第一个参数为 self。调用 s.describe() 时，Python 等价于执行 Student.describe(s)。理解这一点，就能明白为什么方法定义时忘了写 self 会抛 TypeError：调用时传入的实例没有对应形参接收。'
          ]
        },
        {
          type: 'code',
          title: '定义类、创建实例与调用方法',
          code: String.raw`class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def describe(self):
        return f'{self.name}：{self.score} 分'

    def is_pass(self, line=60):
        return self.score >= line

a = Student('林晓', 92)
b = Student('陈默', 55)
print(a.describe())
print(b.describe())
print('是否及格', a.is_pass(), b.is_pass(50))
print('类型', type(a))
print('实例属性', a.name, a.score)`,
          output: String.raw`林晓：92 分
陈默：55 分
是否及格 True True
类型 <class '__main__.Student'>
实例属性 林晓 92`,
          explain: [
            '__init__ 把 name 与 score 保存为实例属性，两个实例各自持有一份。',
            'describe 与 is_pass 都通过 self 读取实例属性；is_pass 还带一个默认参数。',
            '第 15 行 b.is_pass(50) 传入自定义及格线 50，因此 55 分也返回 True。',
            'type(a) 显示实例类型；直接访问 a.name 可读取实例属性。'
          ]
        },
        {
          type: 'prose',
          title: '类属性、实例属性与封装',
          paras: [
            '定义在类体内、方法之外的变量是类属性（class attribute），被所有实例共享；定义在 __init__ 内、通过 self 赋值的是实例属性，每个实例独立。判断该用哪种，标准很简单：这个值是否会因实例不同而不同。若会，就必须用实例属性；把它错放成类属性，尤其当值是可变对象（如列表）时，会出现所有实例共享同一份数据的隐蔽错误。',
            'Python 没有强制的私有成员机制，约定以单下划线开头的名字（如 _internal）视为内部实现，提示调用方不要直接访问。更严格的双下划线会触发名称改写（name mangling），但主要用于避免继承时的命名冲突，并不等同于访问控制。',
            '把「状态」与「操作状态的方法」放在一起，带来的直接好处是调用方不需要知道数据内部如何组织。例如学生是否及格由 is_pass 决定，调用方只问结果，不必知道及格线怎么存、分数是什么类型。这种把实现细节藏起来的做法称为封装（encapsulation）。'
          ]
        },
        {
          type: 'code',
          title: '类属性与实例属性的区别',
          code: String.raw`class Counter:
    total_created = 0

    def __init__(self, label):
        self.label = label
        self.value = 0
        Counter.total_created += 1

    def increase(self, step=1):
        self.value += step
        return self.value

c1 = Counter('甲')
c2 = Counter('乙')
c1.increase()
c1.increase(5)
print('甲', c1.value, '乙', c2.value)
print('共享类属性', c1.total_created, c2.total_created)
print('实例字典', c1.__dict__)`,
          output: String.raw`甲 6 乙 0
共享类属性 2 2
实例字典 {'label': '甲', 'value': 6}`,
          explain: [
            'value 是实例属性，c1 累加两次得到 6，c2 仍为 0，二者互不影响。',
            'total_created 是类属性，两次 __init__ 使其变为 2，通过任一实例读到的都是同一份。',
            '__dict__ 展示实例自身保存的属性，可见其中只有 label 与 value，没有 total_created。'
          ]
        },
        {
          type: 'table',
          title: '面向对象术语速查',
          head: ['术语', '含义', '示例'],
          rows: [
            ['类 class', '创建对象的模板', 'class Student:'],
            ['实例 instance', '按模板创建的具体对象', 'Student(\'林晓\', 92)'],
            ['__init__', '初始化方法', '创建实例时自动调用'],
            ['self', '指向当前实例的参数', '方法第一个形参'],
            ['实例属性', '每个实例独立的数据', 'self.score'],
            ['类属性', '所有实例共享的数据', 'total_created'],
            ['方法 method', '定义在类内的函数', 's.describe()']
          ]
        },
        {
          type: 'pitfalls',
          title: '常见错误与排查',
          items: [
            {
              wrong: '定义方法时漏写 self',
              why: '调用时 Python 自动传入实例，形参不足抛 TypeError。',
              right: '实例方法的第一个参数统一写 self。'
            },
            {
              wrong: '把可变对象（如列表）作为类属性存放每个实例的数据',
              why: '类属性被所有实例共享，一处修改处处可见。',
              right: '在 __init__ 中用 self.items = [] 创建实例属性。'
            },
            {
              wrong: '创建实例时忘记传 __init__ 要求的参数',
              why: '实参数量不匹配抛 TypeError。',
              right: '按 __init__ 的形参列表提供实参，或设置默认值。'
            },
            {
              wrong: "写成 Student.describe() 期望输出某个学生的信息",
              why: '通过类调用实例方法时没有传入 self。',
              right: '通过实例调用 s.describe()。'
            }
          ]
        },
        {
          type: 'summary',
          title: '知识小结',
          items: [
            '类是模板，实例是按模板创建的具体对象。',
            '__init__ 在创建时初始化状态，self 指向当前实例且由 Python 自动传入。',
            '实例属性各自独立，类属性被所有实例共享。',
            '方法定义在类内，调用时实例自动作为第一个参数。',
            '封装把实现细节隐藏在方法之后，降低调用方的认知负担。'
          ]
        },
        {
          type: 'review',
          title: '巩固练习解析',
          paras: [
            '「运行验证」通常要求定义类并调用其方法，注意输出来自方法的返回值经 print() 显示，而不是方法内部自行打印。',
            '「预测输出」会把多个实例的状态变化放在一起，先分别记录每个实例的属性，再代入方法计算。',
            '「找错改错」高频错误是漏写 self、把实例数据放成类属性、以及创建实例时参数不全。TypeError 多指向实参数量或 self。',
            '「配对分类」把类、实例、属性、方法与含义对应，检验你能否准确描述一次实例化过程中发生了什么。'
          ]
        }
      ]
    },
    {
      id: 27,
      title: '继承：复用并扩展已有类型',
      minutes: 30,
      objectives: [
        '能写出子类并说明继承关系',
        '能使用 super() 调用父类方法',
        '能说明方法重写与多态的含义',
        '能判断何时应优先使用组合而非继承'
      ],
      blocks: [
        {
          type: 'lead',
          text: '当两个类型大部分行为相同、只在一处不同时，复制整份类定义会造成重复。继承（inheritance）让新类基于已有类构建：自动获得父类的属性与方法，只声明需要新增或改动的部分。'
        },
        {
          type: 'prose',
          title: '父类、子类与方法重写',
          paras: [
            '写法是 class 子类名(父类名):。子类（subclass）拥有父类（superclass）的全部公开方法，即使类体内什么都不写也能直接使用。若需要改变某个方法的行为，在子类中定义同名方法即可，这叫方法重写（override）。',
            'super() 用于调用父类实现，最常见于 __init__：子类先通过 super().__init__(...) 完成通用字段的初始化，再设置自己新增的字段。这避免把父类初始化逻辑复制一遍，也让父类日后修改时子类自动跟随。',
            '多态（polymorphism）指不同类型的对象可以被同一段代码以统一方式调用，只要它们都实现了同名方法。例如遍历一个包含多种图形的列表，对每项调用 area()，各自按自己的规则计算。调用方无需用 if 判断具体类型，扩展新类型时也不必修改这段遍历代码。'
          ]
        },
        {
          type: 'code',
          title: '继承、super 与方法重写',
          code: String.raw`class Person:
    def __init__(self, name):
        self.name = name

    def introduce(self):
        return '我是' + self.name

class Student(Person):
    def __init__(self, name, score):
        super().__init__(name)
        self.score = score

    def introduce(self):
        return super().introduce() + f'，考了 {self.score} 分'

p = Person('林晓')
s = Student('陈默', 88)
print(p.introduce())
print(s.introduce())
print('是否父类实例', isinstance(s, Person))
print('继承的方法名', Person.introduce.__name__)`,
          output: String.raw`我是林晓
我是陈默，考了 88 分
是否父类实例 True
继承的方法名 introduce`,
          explain: [
            'Student 通过 super().__init__(name) 复用父类的姓名初始化，再添加 score。',
            'introduce 在子类中被重写，内部又用 super().introduce() 取回父类文本后追加内容。',
            'isinstance(s, Person) 为 True，说明子类实例也被视为父类类型，这是多态的基础。'
          ]
        },
        {
          type: 'prose',
          title: '继承的代价与组合',
          paras: [
            '继承表达的是「是一种（is-a）」关系：学生是人、正方形是图形。若关系其实是「有一个（has-a）」——例如订单里有一个地址、课程里有一组学生——更合适的是组合（composition）：把另一个对象作为属性保存，而不是继承它。用错关系会让类层次僵硬，父类一改动，所有子类都受影响。',
            '多重继承（一个子类有多个父类）Python 支持，但会引入方法解析顺序（MRO）的复杂性。除非有明确需求（如混入类 mixin），初学阶段应优先使用单一继承。可以用 类名.__mro__ 查看查找顺序。',
            '一个实用的经验是：继承层级不宜过深。两层（父类 + 若干子类）通常足够表达共性；超过三层后，理解某个方法究竟来自哪一层会变得困难，此时往往该用组合重新组织。'
          ]
        },
        {
          type: 'code',
          title: '多态与组合的对照',
          code: String.raw`class Rectangle:
    def __init__(self, w, h):
        self.w, self.h = w, h

    def area(self):
        return self.w * self.h

class Circle:
    def __init__(self, r):
        self.r = r

    def area(self):
        return round(3.14 * self.r * self.r, 2)

shapes = [Rectangle(3, 4), Circle(2)]
print('面积列表', [s.area() for s in shapes])

class Address:
    def __init__(self, city):
        self.city = city

class Order:
    def __init__(self, oid, address):
        self.oid = oid
        self.address = address

o = Order('A001', Address('杭州'))
print('订单城市', o.address.city)`,
          output: String.raw`面积列表 [12, 12.56]
订单城市 杭州`,
          explain: [
            'Rectangle 与 Circle 没有继承关系，但都实现了 area()，因此可被同一段遍历统一调用，这就是多态。',
            '面积分别为 3*4=12 与 3.14*2*2=12.56。',
            'Order 通过把 Address 实例保存为属性来表达「有一个地址」，这是组合而非继承。'
          ]
        },
        {
          type: 'table',
          title: '继承相关写法速查',
          head: ['写法', '作用', '说明'],
          rows: [
            ['class B(A):', 'B 继承 A', 'B 获得 A 的公开成员'],
            ['super().__init__(...)', '调用父类初始化', '避免复制父类逻辑'],
            ['def m(self): 同名', '方法重写', '子类行为覆盖父类'],
            ['isinstance(x, A)', '判断类型关系', '子类实例返回 True'],
            ['类名.__mro__', '查看方法解析顺序', '多重继承时有用'],
            ['把对象存为属性', '组合', '表达 has-a 关系']
          ]
        },
        {
          type: 'pitfalls',
          title: '常见错误与排查',
          items: [
            {
              wrong: '子类 __init__ 中漏掉 super().__init__()',
              why: '父类定义的属性未被初始化，访问时抛 AttributeError。',
              right: '在子类 __init__ 首行调用父类初始化。'
            },
            {
              wrong: '用继承表达「有一个」的关系',
              why: '语义错误，导致类层次僵硬、职责混乱。',
              right: '改用组合，把对象保存为属性。'
            },
            {
              wrong: '在子类重写方法时完全复制父类实现',
              why: '父类日后修改，子类不会跟随，产生不一致。',
              right: '用 super() 调用父类方法后只追加差异部分。'
            },
            {
              wrong: '继承层级过深并依赖多重继承',
              why: '方法来源难以追踪，MRO 复杂。',
              right: '优先两层以内的单一继承，必要时重构为组合。'
            }
          ]
        },
        {
          type: 'summary',
          title: '知识小结',
          items: [
            'class B(A): 让子类获得父类成员；同名方法实现重写。',
            'super() 调用父类实现，__init__ 中最常用。',
            '多态让不同实现的对象能被同一段代码统一调用。',
            'is-a 用继承，has-a 用组合；优先单一继承、控制层级深度。',
            'isinstance 判断类型关系，__mro__ 查看多重继承查找顺序。'
          ]
        },
        {
          type: 'review',
          title: '巩固练习解析',
          paras: [
            '「运行验证」常要求基于父类定义子类并调用方法，注意 super() 传参顺序与父类 __init__ 形参一致。',
            '「预测输出」偏爱考查方法重写后究竟执行哪个版本，以及 super() 调用返回的文本如何被追加。',
            '「找错改错」高频错误是漏调父类初始化导致 AttributeError、重写方法时忘记 self、以及把组合写成了继承。',
            '「配对分类」把父类、子类、重写、super、多态与含义对应，帮助你在设计类型关系时先把语义判断清楚。'
          ]
        }
      ]
    },
    {
      id: 28,
      title: '装饰器：不改动原函数地增强它',
      minutes: 35,
      objectives: [
        '理解函数是一等对象，可以作为参数与返回值',
        '能说明闭包与变量捕获',
        '能手写并使用简单装饰器',
        '能说明 functools.wraps 的作用'
      ],
      blocks: [
        {
          type: 'lead',
          text: '装饰器（decorator）是 Python 中最容易被当作「语法魔法」的机制，但它其实只是函数的一等对象性质加上一层包装。理解它需要三个前置概念：函数可以赋给变量、可以作为参数传递、可以在函数内部定义并返回另一个函数。'
        },
        {
          type: 'prose',
          title: '一等函数、闭包与包装',
          paras: [
            '在 Python 中函数也是对象：def f(): 会把函数对象绑定到名字 f，之后可以写成 g = f 再用 g() 调用，也可以把 f 作为参数传给别的函数。这正是 sorted(..., key=...) 能工作的原因——key 接收的就是一个函数。',
            '在函数内部再定义函数，且内层函数引用了外层函数的局部变量，就形成闭包（closure）：外层函数已经返回，但它引用的变量仍被内层函数「记住」。装饰器正是用闭包保存「被包装的原函数」这一信息。',
            '装饰器本质上是一个「接收函数、返回新函数」的函数。用 @decorator 写在 def 之前，等价于在函数定义后执行 f = decorator(f)。因此调用 f() 时实际执行的是包装后的版本，包装函数可以在调用原函数前后加日志、计时、权限校验等逻辑。'
          ]
        },
        {
          type: 'code',
          title: '从函数对象到手写装饰器',
          code: String.raw`def shout(text):
    return text.upper()

alias = shout
print('别名调用', alias('hello'))

def apply(func, value):
    return func(value)

print('作为参数', apply(shout, 'world'))

def log_calls(func):
    def wrapper(*args, **kwargs):
        print('调用', func.__name__)
        return func(*args, **kwargs)
    return wrapper

@log_calls
def add(a, b):
    return a + b

print('结果', add(3, 5))
print('函数名', add.__name__)`,
          output: String.raw`别名调用 HELLO
作为参数 WORLD
调用 add
结果 8
函数名 wrapper`,
          explain: [
            'alias = shout 说明函数可赋给另一个名字；apply 接收函数作为参数并调用它。',
            'log_calls 接收 func 并返回 wrapper，wrapper 用 *args / **kwargs 透传任意参数。',
            '@log_calls 等价于 add = log_calls(add)，因此调用 add(3, 5) 会先打印日志再返回 8。',
            '最后一行显示 add.__name__ 变成 wrapper——元数据被覆盖了，这正是下一节 functools.wraps 要解决的问题。'
          ]
        },
        {
          type: 'prose',
          title: '保留元数据与带参数的装饰器',
          paras: [
            '上面的 wrapper 会顶替原函数的 __name__、__doc__ 等元数据，给调试和文档生成带来困扰。标准库 functools.wraps 是一个专门用于复制这些信息的装饰器，写在 wrapper 之前即可：@functools.wraps(func)。它几乎是手写装饰器时的标准配置。',
            '装饰器本身也可以带参数，做法是在外层再包一层「返回装饰器的函数」：@repeat(3) 先调用 repeat(3) 得到真正的装饰器，再作用于目标函数。于是会出现三层函数嵌套，阅读时要分清哪一层接收配置、哪一层接收原函数、哪一层接收调用参数。',
            '装饰器的代价是增加了一层间接调用：出错时回溯信息里会出现 wrapper，且被装饰函数的签名在部分工具中不再直观。因此它适合横切关注点（日志、计时、缓存、鉴权），不适合承载核心业务逻辑。标准库中的 functools.lru_cache 就是缓存型装饰器的典型应用。'
          ]
        },
        {
          type: 'code',
          title: 'functools.wraps 与带参数的装饰器',
          code: String.raw`import functools

def repeat(times):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            result = None
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def greet(name):
    print('你好，' + name)
    return name

greet('林晓')
print('保留名称', greet.__name__)
print('保留文档', greet.__doc__)`,
          output: String.raw`你好，林晓
你好，林晓
你好，林晓
保留名称 greet
保留文档 None`,
          explain: [
            'repeat(3) 返回真正的装饰器 decorator，它再把 greet 包装成 wrapper。',
            'wrapper 内部循环调用原函数三次，因此打印三行问候；返回值取最后一次结果。',
            '@functools.wraps(func) 把原函数的 __name__ 复制过来，所以输出为 greet 而非 wrapper。',
            'greet 没有写文档字符串，因此 __doc__ 为 None，输出 None。'
          ]
        },
        {
          type: 'table',
          title: '装饰器相关概念速查',
          head: ['概念', '含义', '示例'],
          rows: [
            ['一等函数', '函数可作值传递', 'g = f; apply(f, x)'],
            ['闭包', '内层函数记住外层变量', 'wrapper 引用 func'],
            ['@decorator', '等价于 f = decorator(f)', '写在 def 之前'],
            ['*args / **kwargs', '透传任意参数', '包装函数签名'],
            ['functools.wraps', '复制原函数元数据', '@wraps(func)'],
            ['带参装饰器', '外层再包一层工厂函数', '@repeat(3)']
          ]
        },
        {
          type: 'pitfalls',
          title: '常见错误与排查',
          items: [
            {
              wrong: '包装函数忘记 return func(...) 的结果',
              why: '被装饰函数返回 None，调用方拿到空值。',
              right: '在 wrapper 中返回原函数调用结果。'
            },
            {
              wrong: '不用 functools.wraps',
              why: '__name__、__doc__ 等元数据被替换，调试与文档工具受损。',
              right: '在 wrapper 前加 @functools.wraps(func)。'
            },
            {
              wrong: '包装函数签名写死为 (a, b)',
              why: '无法装饰参数个数不同的其它函数，通用性差。',
              right: '使用 *args, **kwargs 透传。'
            },
            {
              wrong: '把核心业务逻辑塞进装饰器',
              why: '执行路径被隐藏，难以测试与理解。',
              right: '装饰器只承担横切关注点，业务逻辑留在原函数。'
            }
          ]
        },
        {
          type: 'summary',
          title: '知识小结',
          items: [
            '函数是一等对象，可赋值、传参、作为返回值。',
            '闭包让内层函数保留外层变量，装饰器据此保存原函数。',
            '@decorator 等价于 f = decorator(f)。',
            'functools.wraps 保留 __name__ / __doc__ 等元数据。',
            '带参装饰器需多一层工厂函数；装饰器适合横切关注点。'
          ]
        },
        {
          type: 'review',
          title: '巩固练习解析',
          paras: [
            '「运行验证」通常要求实现一个简单的包装装饰器，注意 wrapper 必须返回原函数结果，且输出顺序是「包装逻辑在前、原函数输出在后」。',
            '「预测输出」偏爱考查装饰后 __name__ 的变化、以及多次包装时各层执行的先后顺序。',
            '「找错改错」高频错误是遗漏 return、忘写 @wraps、以及把参数写死导致 TypeError。',
            '「配对分类」把闭包、装饰器、wraps、*args 与职责对应，检验你能否说清装饰一次调用时数据的流转路径。'
          ]
        }
      ]
    },
    {
      id: 29,
      title: '生成器：按需产出数据',
      minutes: 30,
      objectives: [
        '能说明迭代器与惰性求值的含义',
        '能区分 yield 与 return',
        '能使用生成器表达式与 next()',
        '能判断何时应使用生成器而非列表'
      ],
      blocks: [
        {
          type: 'lead',
          text: '列表推导式会一次性生成全部元素并占用内存。若数据规模很大，或根本不需要全部结果，更合适的做法是「用一个、算一个」。生成器（generator）就是这种惰性求值（lazy evaluation）的工具。'
        },
        {
          type: 'prose',
          title: '迭代器、yield 与执行暂停',
          paras: [
            '可迭代对象（iterable）能被 for 遍历；迭代器（iterator）则记住「当前走到哪里」，通过 next() 取下一个值，取完抛 StopIteration。for 循环内部正是反复调用 next() 并捕获该异常来结束的。',
            '含有 yield 的函数是生成器函数。调用它并不会立即执行函数体，而是返回一个生成器对象；每次 next() 时执行到 yield 处，把值交出并**暂停**在此，下次从暂停处继续，直到函数结束。因此生成器的状态（局部变量、执行位置）在多次取值之间被保留，但值本身不会一次性全部生成。',
            '与 return 的关键区别是：return 一次性交出结果并结束函数；yield 可以交出多次，且每次之后函数仍处于可继续状态。生成器表达式用圆括号，写法与列表推导式类似：(x * 2 for x in nums)，它同样惰性求值。'
          ]
        },
        {
          type: 'code',
          title: 'yield 与 next() 的逐步执行',
          code: String.raw`def countdown(n):
    while n > 0:
        yield n
        n -= 1

g = countdown(3)
print('生成器对象', type(g).__name__)
print('第一次', next(g))
print('第二次', next(g))
print('剩余', list(g))

squares = (x * x for x in range(1, 5))
print('生成器表达式', list(squares))
print('消耗后', list(squares))`,
          output: String.raw`生成器对象 generator
第一次 3
第二次 2
剩余 [1]
生成器表达式 [1, 4, 9, 16]
消耗后 []`,
          explain: [
            'countdown 含 yield，调用后返回 generator 对象，函数体此刻尚未执行。',
            '前两次 next() 分别得到 3 与 2；list(g) 取走剩下的 1。',
            '生成器表达式用圆括号，list() 触发完整求值得到 [1, 4, 9, 16]。',
            '生成器是**一次性**的：再次 list(squares) 得到空列表，因为元素已被取完。'
          ]
        },
        {
          type: 'prose',
          title: '内存特征与适用边界',
          paras: [
            '生成器的优势在于内存占用与元素总数无关。计算 1 到一百万的平方，列表会一次性保存一百万个整数，而生成器每次只在内存里保留当前值。对于大文件逐行处理、无限序列、管道式数据流，这一性质非常关键。',
            '代价也需要明确：生成器只能顺序向前、遍历一次即耗尽，不能按下标访问、不能 len()、也不能重复使用。若后续需要多次遍历、排序或随机访问，应先转换为列表，或重新创建生成器。',
            '生成器常与 sum()、max()、any()、all() 等接收可迭代对象的内置函数配合，写成 sum(x * x for x in range(n)) 既简洁又不必构造中间列表。标准库 itertools 提供了 chain、islice、cycle 等工具，用于组合与截取迭代器，是处理数据流的常用模块。'
          ]
        },
        {
          type: 'code',
          title: '惰性求值与管道式处理',
          code: String.raw`def even_squares(nums):
    for n in nums:
        if n % 2 == 0:
            yield n * n

values = range(1, 8)
print('偶数平方', list(even_squares(values)))
print('直接求和', sum(n * n for n in values if n % 2 == 0))

def first_two(it):
    count = 0
    for item in it:
        yield item
        count += 1
        if count == 2:
            return

print('只取前两个', list(first_two(x * 10 for x in range(1, 100))))`,
          output: String.raw`偶数平方 [4, 16, 36]
直接求和 56
只取前两个 [10, 20]`,
          explain: [
            'even_squares 只对偶数产出平方，range(1, 8) 中的 2、4、6 得到 4、16、36。',
            'sum 直接消费生成器表达式得到 4+16+36 = 56，无需中间列表。',
            'first_two 在产出两个值后 return，因此即使上游 range 很长也只计算前两项，体现惰性求值。'
          ]
        },
        {
          type: 'table',
          title: '列表与生成器对比',
          head: ['特性', '列表', '生成器'],
          rows: [
            ['求值时机', '立即生成全部', '取值时才计算'],
            ['内存占用', '与元素数成正比', '与元素数无关'],
            ['可否重复遍历', '可以', '一次即耗尽'],
            ['下标访问 / len()', '支持', '不支持'],
            ['典型写法', '[x for x in a]', '(x for x in a)'],
            ['适用场景', '需多次使用、排序', '大数据流、只需一次']
          ]
        },
        {
          type: 'pitfalls',
          title: '常见错误与排查',
          items: [
            {
              wrong: '对生成器多次遍历却期望每次都有值',
              why: '生成器一次耗尽，第二次迭代为空。',
              right: '重新创建生成器，或先转换为列表。'
            },
            {
              wrong: '对生成器调用 len() 或下标访问',
              why: '生成器不实现长度协议与索引，抛 TypeError。',
              right: '改为 list(g) 后再操作，或用 enumerate 计数。'
            },
            {
              wrong: '把 yield 与 return 混用在同一位置期望多次返回',
              why: 'return 会终止生成器，之后不再产出。',
              right: '需要多次产出统一用 yield。'
            },
            {
              wrong: '对超大数据使用列表推导式',
              why: '一次性占用大量内存。',
              right: '改用生成器表达式或逐行迭代。'
            }
          ]
        },
        {
          type: 'summary',
          title: '知识小结',
          items: [
            '迭代器记住遍历位置，next() 取值、耗尽后抛 StopIteration。',
            '含 yield 的函数是生成器函数，调用返回生成器对象，每次取值执行到 yield 并暂停。',
            '生成器惰性求值，内存占用与数据规模无关，但只能遍历一次。',
            '生成器表达式用圆括号，常与 sum / max / any 配合。',
            '需要多次遍历、排序或随机访问时应使用列表。'
          ]
        },
        {
          type: 'review',
          title: '巩固练习解析',
          paras: [
            '「运行验证」通常要求用生成器产出一组数值，注意 yield 的每个值都要被正确收集，输出往往是列表形态。',
            '「预测输出」偏爱考查生成器一次性耗尽的特性，以及 next() 逐次取值时函数暂停的位置。',
            '「找错改错」高频错误是对生成器 len()、重复遍历、以及把 return 当作多次产出。',
            '「配对分类」把迭代器、yield、生成器表达式与含义对应，帮助你在「一次全部生成」与「按需生成」之间做出正确选择。'
          ]
        }
      ]
    },
    {
      id: 30,
      title: '综合课：一个完整的数据管理程序',
      minutes: 40,
      objectives: [
        '能把类、容器、函数、异常与文件操作组合为完整程序',
        '能用列表套字典或对象组织记录并做统计',
        '能为外部输入添加校验与异常兜底',
        '能按「输入—处理—输出」分层阅读较复杂代码'
      ],
      blocks: [
        {
          type: 'lead',
          text: '最后一节把整门课程的知识合并到一个可运行的数据管理程序：用类描述记录、用列表保存多条记录、用函数完成统计、对外部输入做校验、把结果写入文件再读回。它的规模仍在几十行内，但结构已经接近真实小工具。'
        },
        {
          type: 'prose',
          title: '先定结构，再写实现',
          paras: [
            '动手前先把需求拆成四层：数据层（一条成绩记录包含哪些字段）、逻辑层（如何计算总分、平均分、等级）、输入层（数据来自哪里、如何校验）、呈现层（输出什么格式、是否落盘）。分层之后，每一层都可以独立验证，出错时也能快速定位。',
            '数据层用类表达最清晰：ScoreRecord 保存姓名与若干科分数，并提供 total() / average() 方法。这样「怎么算平均分」这类规则只写一次，调用方不必重复实现。逻辑层再定义 classify(avg) 把数值映射为等级文本。',
            '输入层必须假定不可信。本节用 try / except 包住转换，遇到非法数字返回 None 并跳过该行，而不是让整个程序终止。呈现层统一用 f-string 对齐输出，并用 with 把汇总写入临时文件后读回，验证持久化链路完整。'
          ]
        },
        {
          type: 'code',
          title: '完整示例：成绩登记表',
          code: String.raw`import os

class ScoreRecord:
    def __init__(self, name, scores):
        self.name = name
        self.scores = scores

    def total(self):
        return sum(self.scores)

    def average(self):
        return self.total() / len(self.scores) if self.scores else 0

def classify(avg):
    if avg >= 90:
        return '优秀'
    elif avg >= 60:
        return '及格'
    return '需努力'

def parse_line(line):
    try:
        parts = line.rstrip('\n').split(' ')
        return ScoreRecord(parts[0], [int(x) for x in parts[1:]])
    except (ValueError, IndexError):
        return None

raw_lines = ['林晓 88 95 91\n', '陈默 55 62 58\n', '王同学 97 96 98\n']
records = [r for r in (parse_line(x) for x in raw_lines) if r is not None]
print('有效记录', len(records))
for r in records:
    print(f'{r.name:<4}{r.total():>5}{r.average():>9.2f}  {classify(r.average())}')
path = 'demo_report.txt'
with open(path, 'w', encoding='utf-8') as f:
    for r in records:
        f.write(f'{r.name},{r.total()}\n')
with open(path, 'r', encoding='utf-8') as f:
    saved = f.read().strip()
print('已保存内容', repr(saved))
os.remove(path)`,
          output: String.raw`有效记录 3
林晓    274    91.33  优秀
陈默    175    58.33  需努力
王同学   291    97.00  优秀
已保存内容 '林晓,274\n陈默,175\n王同学,291'`,
          explain: [
            'ScoreRecord 用方法封装 total() 与 average()，空分数列表时 average 返回 0，避免除零。',
            'parse_line 用 try / except 捕获转换与拆分异常，非法行返回 None；外层用生成器配合推导式过滤掉 None。',
            '对齐输出用 {name:<4}、{total:>5}、{avg:>9.2f}，等级由 classify 依据平均分给出。',
            '最后用 with 写入并读回文件，repr() 显示文本中的换行；os.remove 清理临时文件。'
          ]
        },
        {
          type: 'prose',
          title: '可读性取舍与后续方向',
          paras: [
            '示例把 parse_line 写成一行推导式加异常捕获，是为展示第 23、22 节的组合用法。在真实项目中，若解析规则更复杂（多分隔符、可选字段、注释行），应拆成显式的多行循环，让每个判断都可读。简洁不是目标，可维护才是。',
            '同样地，把原始数据写死在列表里便于教学与验证；换成文件读取时，只需把 raw_lines 替换为 with open(...) as f: 后 f.readlines()，其余逻辑完全不变。这正是分层带来的直接收益。',
            '至此你已覆盖 Python 核心语法的主要部分。后续可沿三个方向继续：用标准库深入文件与数据处理（csv、json、pathlib）、学习测试（unittest / pytest）为上述函数补上自动化验证、或进入具体领域（Web、数据分析、自动化脚本）。无论哪个方向，本课程反复使用的「先拆结构、再逐层验证」方法都同样适用。'
          ]
        },
        {
          type: 'code',
          title: '加入容错：非法输入不会影响整体',
          code: String.raw`def parse_score(text):
    try:
        return int(text)
    except ValueError:
        return None

raw = ['90', 'abc', '85', '', '77']
valid = []
for item in raw:
    value = parse_score(item)
    if value is not None:
        valid.append(value)
print('有效值', valid)
print('有效个数', len(valid), '平均', round(sum(valid) / len(valid), 2))
print('最高', max(valid), '最低', min(valid))`,
          output: String.raw`有效值 [90, 85, 77]
有效个数 3 平均 84.0
最高 90 最低 77`,
          explain: [
            'parse_score 把 int() 放进 try，非法文本返回 None 而不是中断程序。',
            '主流程只收集非 None 的结果，因此 \'abc\' 与空字符串被跳过。',
            '对有效值统计个数、平均值、最大值与最小值，全部基于清洗后的数据。'
          ]
        },
        {
          type: 'table',
          title: '综合程序分层回顾',
          head: ['层', '使用的知识', '本例位置'],
          rows: [
            ['数据层', '类、属性、方法', 'ScoreRecord'],
            ['逻辑层', '条件分支、函数', 'classify / total / average'],
            ['输入层', '字符串处理、异常', 'parse_line / parse_score'],
            ['流程层', '列表、推导式、过滤', 'records 构建'],
            ['呈现层', 'f-string、文件 with', '对齐输出与报告落盘']
          ]
        },
        {
          type: 'pitfalls',
          title: '常见错误与排查',
          items: [
            {
              wrong: 'average() 中直接除以 len(scores) 而不判空',
              why: '空分数列表会导致 ZeroDivisionError。',
              right: '先判断长度，为空时返回 0 或约定值。'
            },
            {
              wrong: '解析外部行时不捕获 ValueError',
              why: '一处非法数据就会让整批处理中断。',
              right: '在解析函数内捕获并返回 None，由主流程过滤。'
            },
            {
              wrong: '写文件时遗漏 encoding 或未用 with',
              why: '中文乱码或缓冲未落盘。',
              right: "显式 encoding='utf-8' 并统一使用 with。"
            },
            {
              wrong: '把统计逻辑直接写在输出循环里',
              why: '规则与呈现耦合，难以复用和测试。',
              right: '把计算封装进方法或函数，输出层只负责格式化。'
            }
          ]
        },
        {
          type: 'summary',
          title: '知识小结',
          items: [
            '完整程序按数据层、逻辑层、输入层、流程层、呈现层组织。',
            '类把字段与计算规则封装在一起，调用方无需了解内部实现。',
            '解析外部数据时用异常兜底并返回可过滤的失败标识（如 None）。',
            '对齐输出靠 f-string 宽度说明符，持久化靠 with + 显式编码。',
            '分层结构使得「换数据来源」或「换输出格式」只需改动一层。'
          ]
        },
        {
          type: 'review',
          title: '巩固练习解析',
          paras: [
            '「运行验证」是整门课程的收尾综合题，注意对齐输出中的空格由格式说明符决定，中文字符按字符计宽会与西文显示略有差异。',
            '「预测输出」会把统计、等级判断与文件读回放在一起，建议分三段核对：先算总分与平均分，再映射等级，最后检查写入文本的格式。',
            '「找错改错」高频问题是平均除以空列表、解析异常未捕获、文件未指定编码，以及把计算逻辑混进输出循环。',
            '「配对分类」把本课程六章的核心概念与用途对应，用来检验你是否建立起从「值 → 容器 → 函数 → 文件与异常 → 类与进阶」的完整知识脉络。'
          ]
        }
      ]
    }
  ]
};
