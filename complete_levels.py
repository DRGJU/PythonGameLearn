
import json

# 先读取原文件的前14关（前1860行左右）
with open('/workspace/data/levels.json', 'r', encoding='utf-8') as f:
    content = f.read()

# 找到第14关开始的位置
level14_start = content.find('"id": 14,')
if level14_start != -1:
    # 我们需要构建完整的关卡数据
    full_data = {
        "metadata": {
            "version": "3.0.0",
            "totalLevels": 30,
            "difficulty": "入门到大师",
            "estimatedTime": "10-20小时",
            "lastUpdated": "2026-05-28"
        },
        "levels": []
    }
    
    # 先解析前14关（我们通过提取或手动重新创建）
    # 为了简化，我们直接在代码中创建完整的关卡
    # 关卡1-14我们已经基本完成了，让我们补充第14关并添加15-30关
    
    # 完整的第14关（补充被截断的部分）
    level14 = {
        "id": 14,
        "title": "关卡14: 列表操作",
        "description": "学习添加、删除和修改列表元素！",
        "objectives": ["学会用append()添加元素", "学会修改列表元素", "了解len()获取长度"],
        "example": "# 列表操作\nfruits = [\"苹果\", \"香蕉\"]\nfruits.append(\"橙子\")  # 添加\nprint(fruits)  # [\"苹果\", \"香蕉\", \"橙子\"]\nfruits[0] = \"西瓜\"  # 修改\nprint(len(fruits))  # 长度",
        "challenge": "创建一个空列表，用append()添加3个颜色，然后修改第二个颜色，最后输出列表长度。",
        "hints": ["空列表：[]", "append()在末尾添加", "列表名[索引] = 新值 来修改", "len(列表) 获取长度"],
        "validation": {
            "requiredKeywords": ["append", "len"],
            "successFeedback": "完美！你已经掌握了列表的常用操作！",
            "errorFeedback": "请确保使用了append()和len()函数。"
        },
        "difficulty": 3,
        "category": "数据结构",
        "tags": ["列表", "append", "len"],
        "phase": 3,
        "phaseName": "技能进阶",
        "isMiniProject": False,
        "questionTypes": ["code", "drag", "choice", "fill", "guided"],
        "defaultType": "code",
        "codeBlocks": {
            "available": ["colors = []", "colors.append(\"红色\")", "colors.append(\"蓝色\")", "colors.append(\"绿色\")", "colors[1] = \"黄色\"", "print(len(colors))"],
            "correctOrder": ["colors = []", "colors.append(\"红色\")", "colors.append(\"蓝色\")", "colors.append(\"绿色\")", "colors[1] = \"黄色\"", "print(len(colors))"]
        },
        "choices": {
            "question": "要在列表末尾添加一个元素，应该用什么方法？",
            "options": [
                {"text": "append()", "correct": True, "feedback": "正确！append()用于在末尾添加！"},
                {"text": "add()", "correct": False, "feedback": "不对，列表没有add()方法。"},
                {"text": "insert()", "correct": False, "feedback": "不对，insert()是在指定位置插入。"},
                {"text": "push()", "correct": False, "feedback": "不对，Python列表没有push()。"}
            ]
        },
        "fillBlanks": {
            "template": "colors = []\ncolors.___(\"红色\")\ncolors.___(\"蓝色\")\ncolors.___(\"绿色\")\ncolors[1] = \"黄色\"\nprint(___(colors))",
            "blanks": [
                {"id": 0, "answer": "append", "options": ["append", "add", "insert", "push"]},
                {"id": 1, "answer": "append", "options": ["append", "add", "insert", "push"]},
                {"id": 2, "answer": "append", "options": ["append", "add", "insert", "push"]},
                {"id": 3, "answer": "len", "options": ["len", "length", "size", "count"]}
            ]
        },
        "guidedHints": [
            {"step": 1, "hint": "首先，创建一个空列表。", "code": "# 第一步：空列表\ncolors = []"},
            {"step": 2, "hint": "很好！用append()添加3个颜色。", "code": "# 第二步：添加元素\ncolors = []\ncolors.append(\"红色\")\ncolors.append(\"蓝色\")\ncolors.append(\"绿色\")"},
            {"step": 3, "hint": "太棒了！修改第二个颜色（索引1），然后用len()输出长度。", "code": "# 第三步：完整答案\ncolors = []\ncolors.append(\"红色\")\ncolors.append(\"蓝色\")\ncolors.append(\"绿色\")\ncolors[1] = \"黄色\"\nprint(len(colors))"}
        ]
    }
    
    # 添加剩余的关卡
    # 先添加关卡1-13（我们可以简化，直接手动创建完整的）
    # 让我们直接创建所有关卡1-30
    
    # 我们用一个更高效的方式：先创建关卡15-30
    
    # 关卡15
    level15 = {
        "id": 15,
        "title": "关卡15: 字典入门",
        "description": "学习使用字典存储键值对数据，更灵活地管理信息！",
        "objectives": ["学会创建字典", "访问字典的值", "理解键和值的概念"],
        "example": "# 字典示例\nplayer = {\"name\": \"勇者\", \"level\": 10, \"hp\": 100}\nprint(player[\"name\"])\nprint(player[\"hp\"])",
        "challenge": "创建一个玩家字典，包含名字、等级、生命值，然后输出这些信息。",
        "hints": ["用花括号{}创建字典", "键值对格式：键: 值", "用字典名[键]访问值"],
        "validation": {
            "requiredKeywords": ["{", "}"],
            "successFeedback": "太棒了！你已经学会了使用字典！恭喜完成技能进阶阶段！",
            "errorFeedback": "请确保创建了字典并访问了值。"
        },
        "difficulty": 3,
        "category": "数据结构",
        "tags": ["字典", "键值对", "数据结构"],
        "phase": 3,
        "phaseName": "技能进阶",
        "isMiniProject": True,
        "questionTypes": ["code", "drag", "choice", "fill", "guided"],
        "defaultType": "code",
        "codeBlocks": {
            "available": ["player = {\"name\": \"勇者\", \"level\": 10, \"hp\": 100}", "print(player[\"name\"])", "print(player[\"level\"])", "print(player[\"hp\"])"],
            "correctOrder": ["player = {\"name\": \"勇者\", \"level\": 10, \"hp\": 100}", "print(player[\"name\"])", "print(player[\"level\"])", "print(player[\"hp\"])"]
        },
        "choices": {
            "question": "在字典中，用来访问值的是什么？",
            "options": [
                {"text": "键", "correct": True, "feedback": "正确！通过键来访问对应的值！"},
                {"text": "索引", "correct": False, "feedback": "不对，索引用在列表中。"},
                {"text": "位置", "correct": False, "feedback": "不对，字典不是按位置存储的。"},
                {"text": "顺序", "correct": False, "feedback": "不对，字典没有顺序的概念。"}
            ]
        },
        "fillBlanks": {
            "template": "player = {\"name\": \"勇者\", \"level\": 10, \"hp\": 100}\nprint(player[___])\nprint(player[___])",
            "blanks": [
                {"id": 0, "answer": "\"name\"", "options": ["\"name\"", "\"level\"", "\"hp\"", "name"]},
                {"id": 1, "answer": "\"level\"", "options": ["\"name\"", "\"level\"", "\"hp\"", "level"]}
            ]
        },
        "guidedHints": [
            {"step": 1, "hint": "首先，创建一个玩家字典，包含键值对。", "code": "# 第一步：创建字典\nplayer = {\"name\": \"勇者\", \"level\": 10, \"hp\": 100}"},
            {"step": 2, "hint": "很好！用字典名[键]的方式访问值。", "code": "# 第二步：访问值\nplayer = {\"name\": \"勇者\", \"level\": 10, \"hp\": 100}\nprint(player[\"name\"])"},
            {"step": 3, "hint": "太棒了！输出所有需要的信息。", "code": "# 第三步：完整答案\nplayer = {\"name\": \"勇者\", \"level\": 10, \"hp\": 100}\nprint(player[\"name\"])\nprint(player[\"level\"])\nprint(player[\"hp\"])"}
        ]
    }
    
    # 关卡16
    level16 = {
        "id": 16,
        "title": "关卡16: 函数入门",
        "description": "学习定义和使用函数，让代码更有条理！",
        "objectives": ["学会定义函数", "理解函数的作用", "调用函数"],
        "example": "# 函数示例\ndef greet(name):\n    print(f\"你好，{name}！\")\n\ngreet(\"小明\")",
        "challenge": "定义一个函数add(a, b)，返回两个数的和，然后调用它。",
        "hints": ["用def定义函数", "函数名后面加括号和冒号", "return语句返回结果"],
        "validation": {
            "requiredKeywords": ["def", "return"],
            "successFeedback": "太棒了！你已经学会了定义函数！",
            "errorFeedback": "请确保定义了函数并使用了return。"
        },
        "difficulty": 4,
        "category": "函数",
        "tags": ["函数", "def", "return"],
        "phase": 4,
        "phaseName": "挑战大师",
        "isMiniProject": False,
        "questionTypes": ["code", "drag", "choice", "fill", "guided"],
        "defaultType": "code",
        "codeBlocks": {
            "available": ["def add(a, b):", "    return a + b", "result = add(3, 5)", "print(result)"],
            "correctOrder": ["def add(a, b):", "    return a + b", "result = add(3, 5)", "print(result)"]
        },
        "choices": {
            "question": "定义函数时用什么关键字？",
            "options": [
                {"text": "def", "correct": True, "feedback": "正确！def用来定义函数！"},
                {"text": "function", "correct": False, "feedback": "不对，Python不用function。"},
                {"text": "fn", "correct": False, "feedback": "不对，不是fn。"},
                {"text": "func", "correct": False, "feedback": "不对，不是func。"}
            ]
        },
        "fillBlanks": {
            "template": "___ add(a, b):\n    ___ a + b\n\nresult = add(3, 5)\nprint(result)",
            "blanks": [
                {"id": 0, "answer": "def", "options": ["def", "function", "fn", "func"]},
                {"id": 1, "answer": "return", "options": ["return", "print", "give", "send"]}
            ]
        },
        "guidedHints": [
            {"step": 1, "hint": "首先，用def定义函数add，参数是a和b。", "code": "# 第一步：定义函数\ndef add(a, b):"},
            {"step": 2, "hint": "很好！在函数体内用return返回a + b的结果。", "code": "# 第二步：返回结果\ndef add(a, b):\n    return a + b"},
            {"step": 3, "hint": "太棒了！调用函数并输出结果。", "code": "# 第三步：完整答案\ndef add(a, b):\n    return a + b\n\nresult = add(3, 5)\nprint(result)"}
        ]
    }
    
    # 关卡17
    level17 = {
        "id": 17,
        "title": "关卡17: 函数参数",
        "description": "深入学习函数参数的各种用法，让函数更灵活！",
        "objectives": ["理解位置参数", "了解默认参数", "学会传递多个参数"],
        "example": "# 参数示例\ndef greet(name, greeting=\"你好\"):\n    print(f\"{greeting}，{name}！\")\n\ngreet(\"小明\")\ngreet(\"小红\", \"早上好\")",
        "challenge": "定义一个函数calculate_area(width, height=None)，计算矩形面积，如果只给一个参数则是正方形。",
        "hints": ["可以给参数设置默认值", "默认参数要放在后面", "return width * height"],
        "validation": {
            "requiredKeywords": ["def", "="],
            "successFeedback": "完美！你已经掌握了函数参数的用法！",
            "errorFeedback": "请确保定义了带默认参数的函数。"
        },
        "difficulty": 4,
        "category": "函数",
        "tags": ["函数", "参数", "默认值"],
        "phase": 4,
        "phaseName": "挑战大师",
        "isMiniProject": False,
        "questionTypes": ["code", "drag", "choice", "fill", "guided"],
        "defaultType": "code",
        "codeBlocks": {
            "available": ["def calculate_area(width, height=None):", "    if height is None:", "        height = width", "    return width * height", "print(calculate_area(5))", "print(calculate_area(4, 6))"],
            "correctOrder": ["def calculate_area(width, height=None):", "    if height is None:", "        height = width", "    return width * height", "print(calculate_area(5))", "print(calculate_area(4, 6))"]
        },
        "choices": {
            "question": "关于默认参数，哪个说法是正确的？",
            "options": [
                {"text": "默认参数必须放在非默认参数后面", "correct": True, "feedback": "正确！默认参数要放在后面！"},
                {"text": "默认参数必须放在前面", "correct": False, "feedback": "不对，默认参数要放在后面。"},
                {"text": "所有参数都必须有默认值", "correct": False, "feedback": "不对，不是所有的都需要。"},
                {"text": "默认参数没有用", "correct": False, "feedback": "不对，默认参数很有用！"}
            ]
        },
        "fillBlanks": {
            "template": "def calculate_area(width, height=None):\n    if height is None:\n        height = width\n    ___ width * height",
            "blanks": [
                {"id": 0, "answer": "return", "options": ["return", "print", "output", "give"]}
            ]
        },
        "guidedHints": [
            {"step": 1, "hint": "首先，定义函数，height有默认值None。", "code": "# 第一步：定义函数\ndef calculate_area(width, height=None):"},
            {"step": 2, "hint": "很好！判断height是否为None，如果是就设置为width。", "code": "# 第二步：判断参数\ndef calculate_area(width, height=None):\n    if height is None:\n        height = width"},
            {"step": 3, "hint": "太棒了！返回面积并测试函数。", "code": "# 第三步：完整答案\ndef calculate_area(width, height=None):\n    if height is None:\n        height = width\n    return width * height\n\nprint(calculate_area(5))\nprint(calculate_area(4, 6))"}
        ]
    }
    
    # 关卡18
    level18 = {
        "id": 18,
        "title": "关卡18: 作用域",
        "description": "理解变量的作用域，避免命名冲突！",
        "objectives": ["理解全局变量和局部变量", "了解作用域的概念", "正确使用变量"],
        "example": "# 作用域示例\nx = 10  # 全局变量\n\ndef func():\n    x = 20  # 局部变量\n    print(x)\n\nfunc()\nprint(x)",
        "challenge": "创建一个全局变量和一个函数，在函数内创建同名局部变量，观察不同的输出。",
        "hints": ["函数内定义的变量是局部的", "global关键字可以修改全局变量", "局部变量优先于全局变量"],
        "validation": {
            "requiredKeywords": ["def", "="],
            "successFeedback": "太棒了！你已经理解了作用域！",
            "errorFeedback": "请确保创建了全局和局部变量。"
        },
        "difficulty": 4,
        "category": "函数",
        "tags": ["作用域", "全局变量", "局部变量"],
        "phase": 4,
        "phaseName": "挑战大师",
        "isMiniProject": False,
        "questionTypes": ["code", "drag", "choice", "fill", "guided"],
        "defaultType": "code",
        "codeBlocks": {
            "available": ["x = 10", "def func():", "    x = 20", "    print(x)", "func()", "print(x)"],
            "correctOrder": ["x = 10", "def func():", "    x = 20", "    print(x)", "func()", "print(x)"]
        },
        "choices": {
            "question": "在函数内定义的变量是什么变量？",
            "options": [
                {"text": "局部变量", "correct": True, "feedback": "正确！函数内是局部变量！"},
                {"text": "全局变量", "correct": False, "feedback": "不对，函数外的是全局变量。"},
                {"text": "静态变量", "correct": False, "feedback": "不对，Python没有静态变量的概念。"},
                {"text": "临时变量", "correct": False, "feedback": "不对，叫做局部变量。"}
            ]
        },
        "fillBlanks": {
            "template": "x = 10  # ___变量\n\ndef func():\n    x = 20  # ___变量\n    print(x)",
            "blanks": [
                {"id": 0, "answer": "全局", "options": ["全局", "局部", "静态", "临时"]},
                {"id": 1, "answer": "局部", "options": ["全局", "局部", "静态", "临时"]}
            ]
        },
        "guidedHints": [
            {"step": 1, "hint": "首先，在函数外创建一个全局变量x。", "code": "# 第一步：全局变量\nx = 10"},
            {"step": 2, "hint": "很好！定义函数，在内部创建局部变量x。", "code": "# 第二步：函数和局部变量\nx = 10\ndef func():\n    x = 20\n    print(x)"},
            {"step": 3, "hint": "太棒了！调用函数并输出全局x，观察区别。", "code": "# 第三步：完整答案\nx = 10\ndef func():\n    x = 20\n    print(x)\n\nfunc()\nprint(x)"}
        ]
    }
    
    # 关卡19
    level19 = {
        "id": 19,
        "title": "关卡19: 字符串方法",
        "description": "学习常用的字符串方法，方便处理文本！",
        "objectives": ["学会使用upper()和lower()", "了解strip()去除空格", "掌握split()分割字符串"],
        "example": "# 字符串方法\ntext = \"  Hello World!  \"\nprint(text.upper())\nprint(text.strip())\nprint(text.split())",
        "challenge": "让用户输入一段文本，转换成大写，去除首尾空格，然后按空格分割成列表。",
        "hints": ["input()获取输入", ".upper()转大写", ".strip()去除空格", ".split()分割"],
        "validation": {
            "requiredKeywords": [".", "upper", "strip"],
            "successFeedback": "完美！你已经掌握了常用的字符串方法！",
            "errorFeedback": "请确保使用了字符串方法。"
        },
        "difficulty": 4,
        "category": "字符串",
        "tags": ["字符串", "方法", "upper", "strip", "split"],
        "phase": 4,
        "phaseName": "挑战大师",
        "isMiniProject": False,
        "questionTypes": ["code", "drag", "choice", "fill", "guided"],
        "defaultType": "code",
        "codeBlocks": {
            "available": ["text = input(\"请输入一段文本：\")", "print(text.upper())", "print(text.strip())", "print(text.split())"],
            "correctOrder": ["text = input(\"请输入一段文本：\")", "print(text.upper())", "print(text.strip())", "print(text.split())"]
        },
        "choices": {
            "question": "哪个方法可以把字符串转成大写？",
            "options": [
                {"text": "upper()", "correct": True, "feedback": "正确！upper()转大写！"},
                {"text": "lower()", "correct": False, "feedback": "不对，lower()转小写。"},
                {"text": "capitalize()", "correct": False, "feedback": "不对，capitalize()只首字母大写。"},
                {"text": "title()", "correct": False, "feedback": "不对，title()每个单词首字母大写。"}
            ]
        },
        "fillBlanks": {
            "template": "text = \"  hello  \"\nprint(text.___())  # 转大写\nprint(text.___())  # 去除空格",
            "blanks": [
                {"id": 0, "answer": "upper", "options": ["upper", "lower", "strip", "split"]},
                {"id": 1, "answer": "strip", "options": ["upper", "lower", "strip", "split"]}
            ]
        },
        "guidedHints": [
            {"step": 1, "hint": "首先，获取用户输入的文本。", "code": "# 第一步：获取输入\ntext = input(\"请输入一段文本：\")"},
            {"step": 2, "hint": "很好！用upper()转大写，strip()去除空格。", "code": "# 第二步：处理文本\ntext = input(\"请输入一段文本：\")\nprint(text.upper())\nprint(text.strip())"},
            {"step": 3, "hint": "太棒了！用split()分割成列表。", "code": "# 第三步：完整答案\ntext = input(\"请输入一段文本：\")\nprint(text.upper())\nprint(text.strip())\nprint(text.split())"}
        ]
    }
    
    # 关卡20
    level20 = {
        "id": 20,
        "title": "关卡20: 猜数字游戏",
        "description": "综合运用前面所学，创建一个有趣的猜数字游戏！",
        "objectives": ["综合运用循环和条件", "使用随机数", "创建完整的游戏"],
        "example": "# 猜数字示例\nimport random\nnumber = random.randint(1, 10)\nguess = int(input(\"猜1-10之间的数字：\"))\nif guess == number:\n    print(\"猜对了！\")",
        "challenge": "创建一个猜数字游戏，让用户猜1-100之间的数，给出提示直到猜对为止。",
        "hints": ["import random", "random.randint(1, 100)", "while循环", "if判断大小"],
        "validation": {
            "requiredKeywords": ["import", "random", "while"],
            "successFeedback": "太棒了！你完成了挑战大师阶段！恭喜！",
            "errorFeedback": "请确保创建了完整的猜数字游戏。"
        },
        "difficulty": 4,
        "category": "综合应用",
        "tags": ["游戏", "随机数", "循环", "条件"],
        "phase": 4,
        "phaseName": "挑战大师",
        "isMiniProject": True,
        "questionTypes": ["code", "drag", "choice", "fill", "guided"],
        "defaultType": "code",
        "codeBlocks": {
            "available": ["import random", "number = random.randint(1, 100)", "while True:", "    guess = int(input(\"猜1-100之间的数字：\"))", "    if guess == number:", "        print(\"恭喜猜对了！\")", "        break", "    elif guess < number:", "        print(\"太小了，再试试！\")", "    else:", "        print(\"太大了，再试试！\")"],
            "correctOrder": ["import random", "number = random.randint(1, 100)", "while True:", "    guess = int(input(\"猜1-100之间的数字：\"))", "    if guess == number:", "        print(\"恭喜猜对了！\")", "        break", "    elif guess < number:", "        print(\"太小了，再试试！\")", "    else:", "        print(\"太大了，再试试！\")"]
        },
        "choices": {
            "question": "生成1到100之间的随机数用什么？",
            "options": [
                {"text": "random.randint(1, 100)", "correct": True, "feedback": "正确！randint()生成随机整数！"},
                {"text": "random(1, 100)", "correct": False, "feedback": "不对，要用randint()。"},
                {"text": "randint(1, 100)", "correct": False, "feedback": "不对，要import random。"},
                {"text": "random.number(1, 100)", "correct": False, "feedback": "不对，没有这个方法。"}
            ]
        },
        "fillBlanks": {
            "template": "___ random\nnumber = random.___(1, 100)",
            "blanks": [
                {"id": 0, "answer": "import", "options": ["import", "include", "use", "load"]},
                {"id": 1, "answer": "randint", "options": ["randint", "random", "number", "int"]}
            ]
        },
        "guidedHints": [
            {"step": 1, "hint": "首先，导入random模块，生成随机数。", "code": "# 第一步：导入和随机数\nimport random\nnumber = random.randint(1, 100)"},
            {"step": 2, "hint": "很好！用while循环让用户不断猜，break来结束。", "code": "# 第二步：循环\nimport random\nnumber = random.randint(1, 100)\nwhile True:\n    guess = int(input(\"猜1-100之间的数字：\"))\n    if guess == number:\n        print(\"恭喜猜对了！\")\n        break"},
            {"step": 3, "hint": "太棒了！添加大小提示，让游戏更友好。", "code": "# 第三步：完整答案\nimport random\nnumber = random.randint(1, 100)\nwhile True:\n    guess = int(input(\"猜1-100之间的数字：\"))\n    if guess == number:\n        print(\"恭喜猜对了！\")\n        break\n    elif guess < number:\n        print(\"太小了，再试试！\")\n    else:\n        print(\"太大了，再试试！\")"}
        ]
    }
    
    # 关卡21
    level21 = {
        "id": 21,
        "title": "关卡21: 文件读写",
        "description": "学习读写文件，保存和加载数据！",
        "objectives": ["学会打开文件", "写入内容到文件", "读取文件内容"],
        "example": "# 文件操作\n# 写入\nwith open(\"test.txt\", \"w\") as f:\n    f.write(\"Hello World!\")\n# 读取\nwith open(\"test.txt\", \"r\") as f:\n    content = f.read()\n    print(content)",
        "challenge": "让用户输入一段话，保存到文件，然后读取出来显示。",
        "hints": ["with open() as f:", "\"w\"是写入模式", "\"r\"是读取模式", "f.write()", "f.read()"],
        "validation": {
            "requiredKeywords": ["open", "with"],
            "successFeedback": "太棒了！你已经学会了文件读写！",
            "errorFeedback": "请确保使用了文件操作。"
        },
        "difficulty": 5,
        "category": "文件",
        "tags": ["文件", "open", "write", "read"],
        "phase": 5,
        "phaseName": "终极挑战",
        "isMiniProject": False,
        "questionTypes": ["code", "drag", "choice", "fill", "guided"],
        "defaultType": "code",
        "codeBlocks": {
            "available": ["text = input(\"请输入一段话：\")", "with open(\"myfile.txt\", \"w\") as f:", "    f.write(text)", "with open(\"myfile.txt\", \"r\") as f:", "    content = f.read()", "print(\"文件内容：\", content)"],
            "correctOrder": ["text = input(\"请输入一段话：\")", "with open(\"myfile.txt\", \"w\") as f:", "    f.write(text)", "with open(\"myfile.txt\", \"r\") as f:", "    content = f.read()", "print(\"文件内容：\", content)"]
        },
        "choices": {
            "question": "写入文件用什么模式？",
            "options": [
                {"text": "\"w\"", "correct": True, "feedback": "正确！\"w\"是write写入！"},
                {"text": "\"r\"", "correct": False, "feedback": "不对，\"r\"是read读取。"},
                {"text": "\"a\"", "correct": False, "feedback": "不对，\"a\"是append追加。"},
                {"text": "\"x\"", "correct": False, "feedback": "不对，\"x\"是创建新文件。"}
            ]
        },
        "fillBlanks": {
            "template": "with open(\"test.txt\", \"___\") as f:\n    f.___(\"Hello\")",
            "blanks": [
                {"id": 0, "answer": "w", "options": ["w", "r", "a", "x"]},
                {"id": 1, "answer": "write", "options": ["write", "read", "save", "put"]}
            ]
        },
        "guidedHints": [
            {"step": 1, "hint": "首先，获取用户输入，然后打开文件写入。", "code": "# 第一步：获取输入和写入\ntext = input(\"请输入一段话：\")\nwith open(\"myfile.txt\", \"w\") as f:\n    f.write(text)"},
            {"step": 2, "hint": "很好！再打开文件，用read()读取内容。", "code": "# 第二步：读取\ntext = input(\"请输入一段话：\")\nwith open(\"myfile.txt\", \"w\") as f:\n    f.write(text)\nwith open(\"myfile.txt\", \"r\") as f:\n    content = f.read()"},
            {"step": 3, "hint": "太棒了！输出读取到的内容。", "code": "# 第三步：完整答案\ntext = input(\"请输入一段话：\")\nwith open(\"myfile.txt\", \"w\") as f:\n    f.write(text)\nwith open(\"myfile.txt\", \"r\") as f:\n    content = f.read()\nprint(\"文件内容：\", content)"}
        ]
    }
    
    # 关卡22
    level22 = {
        "id": 22,
        "title": "关卡22: 异常处理",
        "description": "学习处理错误，让程序更健壮！",
        "objectives": ["学会try-except", "处理常见错误", "优雅地处理异常"],
        "example": "# 异常处理\ntry:\n    num = int(input(\"请输入数字：\"))\n    print(num)\nexcept ValueError:\n    print(\"请输入有效的数字！\")",
        "challenge": "让用户输入两个数相除，处理除零错误和输入错误。",
        "hints": ["try-except结构", "ValueError处理输入错误", "ZeroDivisionError处理除零", "在except中给出提示"],
        "validation": {
            "requiredKeywords": ["try", "except"],
            "successFeedback": "完美！你已经掌握了异常处理！",
            "errorFeedback": "请确保使用了try-except。"
        },
        "difficulty": 5,
        "category": "错误处理",
        "tags": ["异常", "try", "except", "ValueError", "ZeroDivisionError"],
        "phase": 5,
        "phaseName": "终极挑战",
        "isMiniProject": False,
        "questionTypes": ["code", "drag", "choice", "fill", "guided"],
        "defaultType": "code",
        "codeBlocks": {
            "available": ["try:", "    a = int(input(\"请输入第一个数：\"))", "    b = int(input(\"请输入第二个数：\"))", "    result = a / b", "    print(\"结果：\", result)", "except ValueError:", "    print(\"请输入有效的数字！\")", "except ZeroDivisionError:", "    print(\"不能除以零！\")"],
            "correctOrder": ["try:", "    a = int(input(\"请输入第一个数：\"))", "    b = int(input(\"请输入第二个数：\"))", "    result = a / b", "    print(\"结果：\", result)", "except ValueError:", "    print(\"请输入有效的数字！\")", "except ZeroDivisionError:", "    print(\"不能除以零！\")"]
        },
        "choices": {
            "question": "处理异常的结构是什么？",
            "options": [
                {"text": "try-except", "correct": True, "feedback": "正确！try-except处理异常！"},
                {"text": "if-error", "correct": False, "feedback": "不对，不是这个。"},
                {"text": "catch-throw", "correct": False, "feedback": "不对，Python不用这个。"},
                {"text": "check-handle", "correct": False, "feedback": "不对，不是这个。"}
            ]
        },
        "fillBlanks": {
            "template": "___:\n    num = int(input(\"输入数字：\"))\n___ ValueError:\n    print(\"错误！\")",
            "blanks": [
                {"id": 0, "answer": "try", "options": ["try", "if", "check", "start"]},
                {"id": 1, "answer": "except", "options": ["except", "catch", "handle", "error"]}
            ]
        },
        "guidedHints": [
            {"step": 1, "hint": "首先，用try包裹可能出错的代码。", "code": "# 第一步：try\ntry:\n    a = int(input(\"请输入第一个数：\"))\n    b = int(input(\"请输入第二个数：\"))\n    result = a / b\n    print(\"结果：\", result)"},
            {"step": 2, "hint": "很好！添加except ValueError处理输入错误。", "code": "# 第二步：ValueError\ntry:\n    a = int(input(\"请输入第一个数：\"))\n    b = int(input(\"请输入第二个数：\"))\n    result = a / b\n    print(\"结果：\", result)\nexcept ValueError:\n    print(\"请输入有效的数字！\")"},
            {"step": 3, "hint": "太棒了！再添加except ZeroDivisionError。", "code": "# 第三步：完整答案\ntry:\n    a = int(input(\"请输入第一个数：\"))\n    b = int(input(\"请输入第二个数：\"))\n    result = a / b\n    print(\"结果：\", result)\nexcept ValueError:\n    print(\"请输入有效的数字！\")\nexcept ZeroDivisionError:\n    print(\"不能除以零！\")"}
        ]
    }
    
    # 关卡23
    level23 = {
        "id": 23,
        "title": "关卡23: 列表推导式",
        "description": "学习列表推导式，快速创建和处理列表！",
        "objectives": ["学会列表推导式语法", "用推导式处理数据", "简洁地生成列表"],
        "example": "# 列表推导式\nnumbers = [1, 2, 3, 4, 5]\nsquares = [x * x for x in numbers]\nprint(squares)  # [1, 4, 9, 16, 25]\nevens = [x for x in numbers if x % 2 == 0]\nprint(evens)  # [2, 4]",
        "challenge": "创建1-10的平方数列表，然后筛选出偶数的平方。",
        "hints": ["[x*x for x in range(1, 11)]", "可以加if条件过滤", "range(1, 11)生成1-10"],
        "validation": {
            "requiredKeywords": ["[", "for", "in"],
            "successFeedback": "太棒了！你已经掌握了列表推导式！",
            "errorFeedback": "请确保使用了列表推导式。"
        },
        "difficulty": 5,
        "category": "高级语法",
        "tags": ["列表推导式", "推导式", "for", "if"],
        "phase": 5,
        "phaseName": "终极挑战",
        "isMiniProject": False,
        "questionTypes": ["code", "drag", "choice", "fill", "guided"],
        "defaultType": "code",
        "codeBlocks": {
            "available": ["squares = [x*x for x in range(1, 11)]", "print(squares)", "even_squares = [x for x in squares if x % 2 == 0]", "print(even_squares)"],
            "correctOrder": ["squares = [x*x for x in range(1, 11)]", "print(squares)", "even_squares = [x for x in squares if x % 2 == 0]", "print(even_squares)"]
        },
        "choices": {
            "question": "[x*2 for x in [1,2,3]] 的结果是？",
            "options": [
                {"text": "[2, 4, 6]", "correct": True, "feedback": "正确！每个元素乘2！"},
                {"text": "[1, 2, 3, 1, 2, 3]", "correct": False, "feedback": "不对，不是这样的。"},
                {"text": "[12, 22, 32]", "correct": False, "feedback": "不对，不是拼接。"},
                {"text": "[1, 4, 9]", "correct": False, "feedback": "不对，这是平方。"}
            ]
        },
        "fillBlanks": {
            "template": "squares = [x*x ___ x in range(1, 11)]\nevens = [x for x in squares ___ x % 2 == 0]",
            "blanks": [
                {"id": 0, "answer": "for", "options": ["for", "in", "if", "while"]},
                {"id": 1, "answer": "if", "options": ["for", "in", "if", "while"]}
            ]
        },
        "guidedHints": [
            {"step": 1, "hint": "首先，用列表推导式生成平方数。", "code": "# 第一步：平方数\nsquares = [x*x for x in range(1, 11)]\nprint(squares)"},
            {"step": 2, "hint": "很好！再用带if条件的推导式筛选偶数。", "code": "# 第二步：筛选偶数\nsquares = [x*x for x in range(1, 11)]\nprint(squares)\neven_squares = [x for x in squares if x % 2 == 0]"},
            {"step": 3, "hint": "太棒了！输出筛选后的结果。", "code": "# 第三步：完整答案\nsquares = [x*x for x in range(1, 11)]\nprint(squares)\neven_squares = [x for x in squares if x % 2 == 0]\nprint(even_squares)"}
        ]
    }
    
    # 关卡24
    level24 = {
        "id": 24,
        "title": "关卡24: 字典高级用法",
        "description": "深入学习字典，包括遍历、嵌套等！",
        "objectives": ["遍历字典的键和值", "使用get()方法", "嵌套字典"],
        "example": "# 字典高级用法\nstudent = {\"name\": \"小明\", \"age\": 18, \"scores\": {\"math\": 90, \"english\": 85}}\n# 遍历\nfor key, value in student.items():\n    print(key, value)\n# get方法\nprint(student.get(\"name\", \"未知\"))",
        "challenge": "创建一个学生字典，包含姓名、年龄和成绩字典，遍历输出所有信息。",
        "hints": [".items()同时获取键和值", ".get(key, default)安全获取", "嵌套字典像普通字典一样"],
        "validation": {
            "requiredKeywords": ["for", "in", "items()"],
            "successFeedback": "完美！你已经掌握了字典高级用法！",
            "errorFeedback": "请确保使用了字典遍历。"
        },
        "difficulty": 5,
        "category": "数据结构",
        "tags": ["字典", "items()", "get()", "嵌套"],
        "phase": 5,
        "phaseName": "终极挑战",
        "isMiniProject": False,
        "questionTypes": ["code", "drag", "choice", "fill", "guided"],
        "defaultType": "code",
        "codeBlocks": {
            "available": ["student = {\"name\": \"小红\", \"age\": 17, \"scores\": {\"math\": 95, \"chinese\": 88}}", "for key, value in student.items():", "    print(f\"{key}: {value}\")"],
            "correctOrder": ["student = {\"name\": \"小红\", \"age\": 17, \"scores\": {\"math\": 95, \"chinese\": 88}}", "for key, value in student.items():", "    print(f\"{key}: {value}\")"]
        },
        "choices": {
            "question": "同时获取字典的键和值用什么方法？",
            "options": [
                {"text": ".items()", "correct": True, "feedback": "正确！items()返回键值对！"},
                {"text": ".keys()", "correct": False, "feedback": "不对，keys()只返回键。"},
                {"text": ".values()", "correct": False, "feedback": "不对，values()只返回值。"},
                {"text": ".all()", "correct": False, "feedback": "不对，没有这个方法。"}
            ]
        },
        "fillBlanks": {
            "template": "for ___, ___ in student.items():\n    print(key, value)",
            "blanks": [
                {"id": 0, "answer": "key", "options": ["key", "keys", "item", "k"]},
                {"id": 1, "answer": "value", "options": ["value", "values", "val", "v"]}
            ]
        },
        "guidedHints": [
            {"step": 1, "hint": "首先，创建一个包含嵌套字典的学生信息。", "code": "# 第一步：创建字典\nstudent = {\"name\": \"小红\", \"age\": 17, \"scores\": {\"math\": 95, \"chinese\": 88}}"},
            {"step": 2, "hint": "很好！用for循环和.items()遍历。", "code": "# 第二步：遍历\nstudent = {\"name\": \"小红\", \"age\": 17, \"scores\": {\"math\": 95, \"chinese\": 88}}\nfor key, value in student.items():"},
            {"step": 3, "hint": "太棒了！格式化输出所有信息。", "code": "# 第三步：完整答案\nstudent = {\"name\": \"小红\", \"age\": 17, \"scores\": {\"math\": 95, \"chinese\": 88}}\nfor key, value in student.items():\n    print(f\"{key}: {value}\")"}
        ]
    }
    
    # 关卡25
    level25 = {
        "id": 25,
        "title": "关卡25: 模块导入",
        "description": "学习创建和导入自己的模块，代码更模块化！",
        "objectives": ["学会导入模块", "了解常用标准库", "导入特定函数"],
        "example": "# 导入模块\nimport math\nprint(math.sqrt(16))  # 4.0\n\nfrom math import pi\nprint(pi)  # 3.14159...",
        "challenge": "导入math模块，计算圆的面积和周长，显示结果。",
        "hints": ["import math", "math.pi获取圆周率", "math.sqrt()开方", "面积=pi*r²"],
        "validation": {
            "requiredKeywords": ["import", "math"],
            "successFeedback": "太棒了！你已经学会了模块导入！",
            "errorFeedback": "请确保导入了math模块。"
        },
        "difficulty": 5,
        "category": "模块化",
        "tags": ["import", "模块", "math", "标准库"],
        "phase": 5,
        "phaseName": "终极挑战",
        "isMiniProject": False,
        "questionTypes": ["code", "drag", "choice", "fill", "guided"],
        "defaultType": "code",
        "codeBlocks": {
            "available": ["import math", "radius = 5", "area = math.pi * radius * radius", "circumference = 2 * math.pi * radius", "print(f\"半径{radius}的圆\")", "print(f\"面积：{area:.2f}\")", "print(f\"周长：{circumference:.2f}\")"],
            "correctOrder": ["import math", "radius = 5", "area = math.pi * radius * radius", "circumference = 2 * math.pi * radius", "print(f\"半径{radius}的圆\")", "print(f\"面积：{area:.2f}\")", "print(f\"周长：{circumference:.2f}\")"]
        },
        "choices": {
            "question": "导入模块用什么关键字？",
            "options": [
                {"text": "import", "correct": True, "feedback": "正确！import导入模块！"},
                {"text": "include", "correct": False, "feedback": "不对，这是C语言的。"},
                {"text": "use", "correct": False, "feedback": "不对，不是use。"},
                {"text": "load", "correct": False, "feedback": "不对，不是load。"}
            ]
        },
        "fillBlanks": {
            "template": "___ math\nprint(math.___)",  # 填入pi
            "blanks": [
                {"id": 0, "answer": "import", "options": ["import", "include", "use", "load"]},
                {"id": 1, "answer": "pi", "options": ["pi", "PI", "π", "3.14"]}
            ]
        },
        "guidedHints": [
            {"step": 1, "hint": "首先，导入math模块，设置半径。", "code": "# 第一步：导入和半径\nimport math\nradius = 5"},
            {"step": 2, "hint": "很好！计算面积和周长。", "code": "# 第二步：计算\nimport math\nradius = 5\narea = math.pi * radius * radius\ncircumference = 2 * math.pi * radius"},
            {"step": 3, "hint": "太棒了！格式化输出结果，保留两位小数。", "code": "# 第三步：完整答案\nimport math\nradius = 5\narea = math.pi * radius * radius\ncircumference = 2 * math.pi * radius\nprint(f\"半径{radius}的圆\")\nprint(f\"面积：{area:.2f}\")\nprint(f\"周长：{circumference:.2f}\")"}
        ]
    }
    
    # 关卡26
    level26 = {
        "id": 26,
        "title": "关卡26: 类和对象入门",
        "description": "学习面向对象编程，创建和使用类！",
        "objectives": ["学会定义类", "理解__init__方法", "创建对象实例"],
        "example": "# 类的定义\nclass Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    \n    def greet(self):\n        print(f\"你好，我是{self.name}！\")\n\np = Person(\"小明\", 18)\np.greet()",
        "challenge": "定义一个Player类，有名字和等级属性，有一个introduce方法介绍自己。",
        "hints": ["class Player:", "def __init__(self, name, level):", "self.name = name", "def introduce(self):"],
        "validation": {
            "requiredKeywords": ["class", "__init__", "self"],
            "successFeedback": "完美！你已经踏入面向对象编程的大门！",
            "errorFeedback": "请确保定义了类和方法。"
        },
        "difficulty": 6,
        "category": "面向对象",
        "tags": ["class", "对象", "__init__", "self"],
        "phase": 5,
        "phaseName": "终极挑战",
        "isMiniProject": False,
        "questionTypes": ["code", "drag", "choice", "fill", "guided"],
        "defaultType": "code",
        "codeBlocks": {
            "available": ["class Player:", "    def __init__(self, name, level):", "        self.name = name", "        self.level = level", "    def introduce(self):", "        print(f\"我是{self.name}，等级{self.level}！\")", "p = Player(\"勇者\", 10)", "p.introduce()"],
            "correctOrder": ["class Player:", "    def __init__(self, name, level):", "        self.name = name", "        self.level = level", "    def introduce(self):", "        print(f\"我是{self.name}，等级{self.level}！\")", "p = Player(\"勇者\", 10)", "p.introduce()"]
        },
        "choices": {
            "question": "定义类用什么关键字？",
            "options": [
                {"text": "class", "correct": True, "feedback": "正确！class定义类！"},
                {"text": "object", "correct": False, "feedback": "不对，不是object。"},
                {"text": "struct", "correct": False, "feedback": "不对，这是C语言的。"},
                {"text": "type", "correct": False, "feedback": "不对，不是type。"}
            ]
        },
        "fillBlanks": {
            "template": "___ Person:\n    def __init__(___, name):\n        ___.name = name",
            "blanks": [
                {"id": 0, "answer": "class", "options": ["class", "object", "struct", "type"]},
                {"id": 1, "answer": "self", "options": ["self", "this", "me", "instance"]},
                {"id": 2, "answer": "self", "options": ["self", "this", "me", "instance"]}
            ]
        },
        "guidedHints": [
            {"step": 1, "hint": "首先，定义类和__init__方法初始化属性。", "code": "# 第一步：定义类\nclass Player:\n    def __init__(self, name, level):\n        self.name = name\n        self.level = level"},
            {"step": 2, "hint": "很好！添加introduce方法来介绍。", "code": "# 第二步：添加方法\nclass Player:\n    def __init__(self, name, level):\n        self.name = name\n        self.level = level\n    def introduce(self):\n        print(f\"我是{self.name}，等级{self.level}！\")"},
            {"step": 3, "hint": "太棒了！创建实例并调用方法。", "code": "# 第三步：完整答案\nclass Player:\n    def __init__(self, name, level):\n        self.name = name\n        self.level = level\n    def introduce(self):\n        print(f\"我是{self.name}，等级{self.level}！\")\n\np = Player(\"勇者\", 10)\np.introduce()"}
        ]
    }
    
    # 关卡27
    level27 = {
        "id": 27,
        "title": "关卡27: 继承",
        "description": "学习类的继承，代码复用更方便！",
        "objectives": ["理解继承概念", "学会子类继承父类", "调用父类方法"],
        "example": "# 继承\nclass Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        pass\n\nclass Dog(Animal):\n    def speak(self):\n        print(f\"{self.name}汪汪叫！\")\n\nd = Dog(\"旺财\")\nd.speak()",
        "challenge": "定义一个基础角色类，然后定义战士和法师继承它，有各自的攻击方法。",
        "hints": ["class Child(Parent):", "super().__init__()调用父类", "子类可以重写方法"],
        "validation": {
            "requiredKeywords": ["class", "(", ")"],
            "successFeedback": "太棒了！你已经掌握了继承！",
            "errorFeedback": "请确保使用了继承。"
        },
        "difficulty": 6,
        "category": "面向对象",
        "tags": ["继承", "父类", "子类", "super"],
        "phase": 5,
        "phaseName": "终极挑战",
        "isMiniProject": False,
        "questionTypes": ["code", "drag", "choice", "fill", "guided"],
        "defaultType": "code",
        "codeBlocks": {
            "available": ["class Character:", "    def __init__(self, name, hp):", "        self.name = name", "        self.hp = hp", "class Warrior(Character):", "    def attack(self):", "        print(f\"{self.name}挥动长剑！\")", "class Mage(Character):", "    def attack(self):", "        print(f\"{self.name}施放火球术！\")", "w = Warrior(\"勇士\", 100)", "m = Mage(\"法师\", 80)", "w.attack()", "m.attack()"],
            "correctOrder": ["class Character:", "    def __init__(self, name, hp):", "        self.name = name", "        self.hp = hp", "class Warrior(Character):", "    def attack(self):", "        print(f\"{self.name}挥动长剑！\")", "class Mage(Character):", "    def attack(self):", "        print(f\"{self.name}施放火球术！\")", "w = Warrior(\"勇士\", 100)", "m = Mage(\"法师\", 80)", "w.attack()", "m.attack()"]
        },
        "choices": {
            "question": "子类继承父类的语法是？",
            "options": [
                {"text": "class Child(Parent):", "correct": True, "feedback": "正确！子类(父类)！"},
                {"text": "class Child extends Parent:", "correct": False, "feedback": "不对，这是Java的。"},
                {"text": "class Child: Parent:", "correct": False, "feedback": "不对，不是这样的。"},
                {"text": "Child inherits Parent:", "correct": False, "feedback": "不对，没有这个。"}
            ]
        },
        "fillBlanks": {
            "template": "class Dog(___):\n    pass",
            "blanks": [
                {"id": 0, "answer": "Animal", "options": ["Animal", "Parent", "Super", "Base"]}
            ]
        },
        "guidedHints": [
            {"step": 1, "hint": "首先，定义基础的Character父类。", "code": "# 第一步：父类\nclass Character:\n    def __init__(self, name, hp):\n        self.name = name\n        self.hp = hp"},
            {"step": 2, "hint": "很好！创建Warrior和Mage子类继承Character。", "code": "# 第二步：子类\nclass Character:\n    def __init__(self, name, hp):\n        self.name = name\n        self.hp = hp\n\nclass Warrior(Character):\n    def attack(self):\n        print(f\"{self.name}挥动长剑！\")\n\nclass Mage(Character):\n    def attack(self):\n        print(f\"{self.name}施放火球术！\")"},
            {"step": 3, "hint": "太棒了！创建实例并测试。", "code": "# 第三步：完整答案\nclass Character:\n    def __init__(self, name, hp):\n        self.name = name\n        self.hp = hp\n\nclass Warrior(Character):\n    def attack(self):\n        print(f\"{self.name}挥动长剑！\")\n\nclass Mage(Character):\n    def attack(self):\n        print(f\"{self.name}施放火球术！\")\n\nw = Warrior(\"勇士\", 100)\nm = Mage(\"法师\", 80)\nw.attack()\nm.attack()"}
        ]
    }
    
    # 关卡28
    level28 = {
        "id": 28,
        "title": "关卡28: 装饰器",
        "description": "学习装饰器，给函数添加额外功能！",
        "objectives": ["理解装饰器概念", "学会使用@语法", "创建简单装饰器"],
        "example": "# 装饰器\ndef my_decorator(func):\n    def wrapper():\n        print(\"函数执行前\")\n        func()\n        print(\"函数执行后\")\n    return wrapper\n\n@my_decorator\ndef say_hello():\n    print(\"Hello!\")\n\nsay_hello()",
        "challenge": "创建一个计时装饰器，测量一个函数执行的时间。",
        "hints": ["import time", "time.time()获取当前时间", "装饰器返回包装函数", "@decorator使用装饰器"],
        "validation": {
            "requiredKeywords": ["@", "import", "time"],
            "successFeedback": "完美！你已经掌握了装饰器！",
            "errorFeedback": "请确保使用了装饰器。"
        },
        "difficulty": 6,
        "category": "高级语法",
        "tags": ["装饰器", "@", "time", "包装函数"],
        "phase": 5,
        "phaseName": "终极挑战",
        "isMiniProject": False,
        "questionTypes": ["code", "drag", "choice", "fill", "guided"],
        "defaultType": "code",
        "codeBlocks": {
            "available": ["import time", "def timer(func):", "    def wrapper():", "        start = time.time()", "        func()", "        end = time.time()", "        print(f\"耗时：{end - start:.4f}秒\")", "    return wrapper", "@timer", "def slow_function():", "    time.sleep(1)", "slow_function()"],
            "correctOrder": ["import time", "def timer(func):", "    def wrapper():", "        start = time.time()", "        func()", "        end = time.time()", "        print(f\"耗时：{end - start:.4f}秒\")", "    return wrapper", "@timer", "def slow_function():", "    time.sleep(1)", "slow_function()"]
        },
        "choices": {
            "question": "使用装饰器的语法是什么？",
            "options": [
                {"text": "@decorator", "correct": True, "feedback": "正确！@符号使用装饰器！"},
                {"text": "#decorator", "correct": False, "feedback": "不对，#是注释。"},
                {"text": "$decorator", "correct": False, "feedback": "不对，不是$。"},
                {"text": "&decorator", "correct": False, "feedback": "不对，不是&。"}
            ]
        },
        "fillBlanks": {
            "template": "___timer\ndef my_func():\n    pass",
            "blanks": [
                {"id": 0, "answer": "@", "options": ["@", "#", "$", "&"]}
            ]
        },
        "guidedHints": [
            {"step": 1, "hint": "首先，导入time模块，创建装饰器函数。", "code": "# 第一步：导入和装饰器\nimport time\ndef timer(func):\n    def wrapper():\n        pass\n    return wrapper"},
            {"step": 2, "hint": "很好！在wrapper中记录开始和结束时间。", "code": "# 第二步：计时逻辑\nimport time\ndef timer(func):\n    def wrapper():\n        start = time.time()\n        func()\n        end = time.time()\n        print(f\"耗时：{end - start:.4f}秒\")\n    return wrapper"},
            {"step": 3, "hint": "太棒了！用@timer装饰一个函数并测试。", "code": "# 第三步：完整答案\nimport time\ndef timer(func):\n    def wrapper():\n        start = time.time()\n        func()\n        end = time.time()\n        print(f\"耗时：{end - start:.4f}秒\")\n    return wrapper\n\n@timer\ndef slow_function():\n    time.sleep(1)\n\nslow_function()"}
        ]
    }
    
    # 关卡29
    level29 = {
        "id": 29,
        "title": "关卡29: 生成器",
        "description": "学习生成器，高效处理大量数据！",
        "objectives": ["理解yield关键字", "创建生成器函数", "使用next()或for循环"],
        "example": "# 生成器\ndef count_down(n):\n    while n > 0:\n        yield n\n        n -= 1\n\nfor num in count_down(5):\n    print(num)  # 5, 4, 3, 2, 1",
        "challenge": "创建一个斐波那契数列生成器，生成前10个数。",
        "hints": ["yield而不是return", "生成器可以暂停执行", "a, b = b, a + b这种写法"],
        "validation": {
            "requiredKeywords": ["yield"],
            "successFeedback": "太棒了！你已经掌握了生成器！",
            "errorFeedback": "请确保使用了yield。"
        },
        "difficulty": 6,
        "category": "高级语法",
        "tags": ["生成器", "yield", "迭代器", "序列"],
        "phase": 5,
        "phaseName": "终极挑战",
        "isMiniProject": False,
        "questionTypes": ["code", "drag", "choice", "fill", "guided"],
        "defaultType": "code",
        "codeBlocks": {
            "available": ["def fibonacci(n):", "    a, b = 0, 1", "    for _ in range(n):", "        yield a", "        a, b = b, a + b", "for num in fibonacci(10):", "    print(num)"],
            "correctOrder": ["def fibonacci(n):", "    a, b = 0, 1", "    for _ in range(n):", "        yield a", "        a, b = b, a + b", "for num in fibonacci(10):", "    print(num)"]
