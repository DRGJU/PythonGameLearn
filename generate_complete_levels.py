
import json

# 首先，尝试读取原文件的前14个关卡
try:
    with open('/workspace/data/levels.json', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 找到第14个关卡的开始，然后尝试解析到那里
    level14_start = content.find('"id": 14,')
    if level14_start != -1:
        # 尝试找到第14关的合理结束位置
        # 我们读取前46000个字符，然后尝试补全第14关
        partial_content = content[:46000]
        print(f"读取了 {len(partial_content)} 个字符")
        
        # 第14关被截断在 guidedHints 部分，让我们补全它
        # 先把内容读到 guidedHints 的开始
        guided_hints_start = partial_content.find('"guidedHints": [')
        if guided_hints_start != -1:
            # 我们需要补全第14关，然后添加第15-30关
            print("找到 guidedHints 位置")
except Exception as e:
    print("读取原文件出错:", e)

# 现在创建完整的关卡数据
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

# ==================== 关卡 1-5（保持原样，从原文件提取的完整版本）====================

# 关卡 1
level1 = {
    "id": 1,
    "title": "关卡 1: 初识Python",
    "description": "学习如何输出文字到屏幕，开始你的Python之旅！",
    "objectives": ["了解Python的基本语法结构", "学会使用print()函数", "理解字符串的概念"],
    "example": "# 输出文字\nprint(\"Hello, World!\")\nprint(\"欢迎来到编程世界！\")",
    "challenge": "编写一个程序，输出\"你好，Python！\"和\"我准备好了！\"这两句话。",
    "hints": ["使用print()函数", "用引号括住文字内容"],
    "validation": {
        "requiredKeywords": ["print"],
        "successFeedback": "太棒了！你已经成功完成了第一关，开始了编程之旅！",
        "errorFeedback": "请确保使用了print()函数来输出文字。"
    },
    "difficulty": 1,
    "category": "基础入门",
    "tags": ["print", "字符串", "输出"],
    "phase": 1,
    "phaseName": "新手村",
    "isMiniProject": False,
    "questionTypes": ["code", "drag", "choice", "fill", "guided"],
    "defaultType": "code",
    "codeBlocks": {
        "available": ["print(\"你好，Python！\")", "print(\"我准备好了！\")"],
        "correctOrder": ["print(\"你好，Python！\")", "print(\"我准备好了！\")"]
    },
    "choices": {
        "question": "要输出文字到屏幕，应该使用什么函数？",
        "options": [
            {"text": "print()", "correct": True, "feedback": "正确！print()函数用于输出内容！"},
            {"text": "input()", "correct": False, "feedback": "不对，input()是用来获取输入的。"},
            {"text": "write()", "correct": False, "feedback": "不对，write()通常用于文件操作。"},
            {"text": "echo()", "correct": False, "feedback": "不对，Python中没有echo()函数。"}
        ]
    },
    "fillBlanks": {
        "template": "___(\"你好，Python！\")\n___(\"我准备好了！\")",
        "blanks": [
            {"id": 0, "answer": "print", "options": ["print", "input", "write", "echo"]},
            {"id": 1, "answer": "print", "options": ["print", "input", "write", "echo"]}
        ]
    },
    "guidedHints": [
        {"step": 1, "hint": "首先，想想我们要用什么函数来输出文字？对了，就是print()函数！", "code": "# 第一步：使用print()\nprint()"},
        {"step": 2, "hint": "很好！现在在print()的括号里，用引号括住你想输出的文字。", "code": "# 第二步：添加文字\nprint(\"你好，Python！\")"},
        {"step": 3, "hint": "太棒了！现在再添加一个print()语句，输出第二句话。", "code": "# 第三步：完整答案\nprint(\"你好，Python！\")\nprint(\"我准备好了！\")"}
    ]
}
full_data["levels"].append(level1)

# 关卡 2
level2 = {
    "id": 2,
    "title": "关卡2: 变量的魔法",
    "description": "学习如何创建和使用变量来存储信息。",
    "objectives": ["理解变量的概念", "学会给变量赋值", "使用变量进行输出"],
    "example": "# 创建变量\nname = \"小明\"\nage = 10\nprint(name)\nprint(age)",
    "challenge": "创建两个变量：player_name（玩家名字）和player_level（玩家等级），然后输出它们。",
    "hints": ["使用=符号赋值", "变量名不能以数字开头"],
    "validation": {
        "requiredKeywords": ["=", "print"],
        "successFeedback": "很好！你已经掌握了变量的基本用法！",
        "errorFeedback": "请确保创建了变量并使用print输出它们。"
    },
    "difficulty": 1,
    "category": "基础入门",
    "tags": ["变量", "赋值", "print"],
    "phase": 1,
    "phaseName": "新手村",
    "isMiniProject": False,
    "questionTypes": ["code", "drag", "choice", "fill", "guided"],
    "defaultType": "code",
    "codeBlocks": {
        "available": ["player_name = \"勇者\"", "player_level = 10", "print(player_name)", "print(player_level)"],
        "correctOrder": ["player_name = \"勇者\"", "player_level = 10", "print(player_name)", "print(player_level)"]
    },
    "choices": {
        "question": "创建变量时，用什么符号给变量赋值？",
        "options": [
            {"text": "=", "correct": True, "feedback": "正确！等号=用来给变量赋值！"},
            {"text": "==", "correct": False, "feedback": "不对，==是用来比较相等的。"},
            {"text": ":", "correct": False, "feedback": "不对，冒号:有其他用途。"},
            {"text": "<-", "correct": False, "feedback": "不对，Python不用这个符号。"}
        ]
    },
    "fillBlanks": {
        "template": "player_name ___ \"勇者\"\nplayer_level ___ 10\n___(player_name)\n___(player_level)",
        "blanks": [
            {"id": 0, "answer": "=", "options": ["=", "==", ":", "<-"]},
            {"id": 1, "answer": "=", "options": ["=", "==", ":", "<-"]},
            {"id": 2, "answer": "print", "options": ["print", "input", "show", "display"]},
            {"id": 3, "answer": "print", "options": ["print", "input", "show", "display"]}
        ]
    },
    "guidedHints": [
        {"step": 1, "hint": "首先，创建第一个变量player_name，用等号给它赋值。", "code": "# 第一步：创建名字变量\nplayer_name = \"勇者\""},
        {"step": 2, "hint": "很好！现在创建第二个变量player_level，存一个数字。", "code": "# 第二步：创建等级变量\nplayer_name = \"勇者\"\nplayer_level = 10"},
        {"step": 3, "hint": "太棒了！现在用print()把这两个变量都输出出来。", "code": "# 第三步：完整答案\nplayer_name = \"勇者\"\nplayer_level = 10\nprint(player_name)\nprint(player_level)"}
    ]
}
full_data["levels"].append(level2)

# 关卡 3
level3 = {
    "id": 3,
    "title": "关卡3: 数字运算",
    "description": "学习Python中的基本数学运算。",
    "objectives": ["了解整数和浮点数", "掌握加减乘除运算", "学习幂运算和取模"],
    "example": "# 数学运算\na = 10\nb = 3\nprint(a + b)  # 加法\nprint(a - b)  # 减法\nprint(a * b)  # 乘法\nprint(a / b)  # 除法\nprint(a ** b) # 幂运算\nprint(a % b)  # 取模",
    "challenge": "计算：一个矩形的长是8，宽是5，计算它的面积和周长。",
    "hints": ["面积 = 长 × 宽", "周长 = 2 × (长 + 宽)"],
    "validation": {
        "requiredKeywords": ["*", "+"],
        "successFeedback": "完美！数学运算对你来说太简单了！",
        "errorFeedback": "请确保使用了乘法和加法运算。"
    },
    "difficulty": 1,
    "category": "基础入门",
    "tags": ["数学", "运算", "整数"],
    "phase": 1,
    "phaseName": "新手村",
    "isMiniProject": False,
    "questionTypes": ["code", "drag", "choice", "fill", "guided"],
    "defaultType": "code",
    "codeBlocks": {
        "available": ["length = 8", "width = 5", "area = length * width", "perimeter = 2 * (length + width)", "print(area)", "print(perimeter)"],
        "correctOrder": ["length = 8", "width = 5", "area = length * width", "perimeter = 2 * (length + width)", "print(area)", "print(perimeter)"]
    },
    "choices": {
        "question": "在Python中，乘法运算用什么符号？",
        "options": [
            {"text": "*", "correct": True, "feedback": "正确！星号*表示乘法！"},
            {"text": "×", "correct": False, "feedback": "不对，Python不用这个符号。"},
            {"text": "x", "correct": False, "feedback": "不对，字母x不是运算符。"},
            {"text": ".", "correct": False, "feedback": "不对，点号有其他用途。"}
        ]
    },
    "fillBlanks": {
        "template": "length = 8\nwidth = 5\narea = length ___ width\nperimeter = 2 ___ (length + width)\nprint(area)\nprint(perimeter)",
        "blanks": [
            {"id": 0, "answer": "*", "options": ["*", "+", "-", "/"]},
            {"id": 1, "answer": "*", "options": ["*", "+", "-", "/"]}
        ]
    },
    "guidedHints": [
        {"step": 1, "hint": "首先，创建变量存储长和宽的值。", "code": "# 第一步：定义变量\nlength = 8\nwidth = 5"},
        {"step": 2, "hint": "很好！现在计算面积：面积 = 长 × 宽，用*表示乘法。", "code": "# 第二步：计算面积\nlength = 8\nwidth = 5\narea = length * width"},
        {"step": 3, "hint": "太棒了！现在计算周长：周长 = 2×(长 + 宽)，然后输出结果。", "code": "# 第三步：完整答案\nlength = 8\nwidth = 5\narea = length * width\nperimeter = 2 * (length + width)\nprint(area)\nprint(perimeter)"}
    ]
}
full_data["levels"].append(level3)

# 关卡 4
level4 = {
    "id": 4,
    "title": "关卡4: 字符串游戏",
    "description": "学习如何操作字符串，创建有趣的文字效果。",
    "objectives": ["学会字符串拼接", "了解字符串重复", "使用f-string格式化"],
    "example": "# 字符串操作\nname = \"小红\"\nprint(\"你好，\" + name)\nprint(\"*\" * 10)\nprint(f\"我的名字是{name}\")",
    "challenge": "创建一个问候程序，使用变量存储名字，输出\"你好，[名字]！欢迎来到Python世界！\"",
    "hints": ["使用+拼接字符串", "或者使用f-string"],
    "validation": {
        "requiredKeywords": ["+", "print"],
        "successFeedback": "精彩！你已经掌握了字符串的基本操作！",
        "errorFeedback": "请确保使用了字符串拼接操作。"
    },
    "difficulty": 1,
    "category": "基础入门",
    "tags": ["字符串", "拼接", "格式化"],
    "phase": 1,
    "phaseName": "新手村",
    "isMiniProject": False,
    "questionTypes": ["code", "drag", "choice", "fill", "guided"],
    "defaultType": "code",
    "codeBlocks": {
        "available": ["name = \"小明\"", "print(\"你好，\" + name + \"！欢迎来到Python世界！\")"],
        "correctOrder": ["name = \"小明\"", "print(\"你好，\" + name + \"！欢迎来到Python世界！\")"]
    },
    "choices": {
        "question": "用什么符号可以拼接两个字符串？",
        "options": [
            {"text": "+", "correct": True, "feedback": "正确！加号+可以拼接字符串！"},
            {"text": "&", "correct": False, "feedback": "不对，Python不用&拼接。"},
            {"text": ".", "correct": False, "feedback": "不对，点号不是用来拼接的。"},
            {"text": ",", "correct": False, "feedback": "不对，逗号有其他用途。"}
        ]
    },
    "fillBlanks": {
        "template": "name = \"小明\"\nprint(\"你好，\" ___ name ___ \"！欢迎来到Python世界！\")",
        "blanks": [
            {"id": 0, "answer": "+", "options": ["+", "&", ".", ","]},
            {"id": 1, "answer": "+", "options": ["+", "&", ".", ","]}
        ]
    },
    "guidedHints": [
        {"step": 1, "hint": "首先，创建一个变量存储名字。", "code": "# 第一步：定义名字\nname = \"小明\""},
        {"step": 2, "hint": "很好！现在用+号把字符串和变量拼接起来。", "code": "# 第二步：拼接字符串\nname = \"小明\"\nprint(\"你好，\" + name)"},
        {"step": 3, "hint": "太棒了！现在把完整的问候语都拼接出来。", "code": "# 第三步：完整答案\nname = \"小明\"\nprint(\"你好，\" + name + \"！欢迎来到Python世界！\")"}
    ]
}
full_data["levels"].append(level4)

# 关卡 5
level5 = {
    "id": 5,
    "title": "关卡5: 角色卡片生成器",
    "description": "创建一个游戏角色卡片生成器！",
    "objectives": ["综合运用变量", "练习字符串操作", "创建美观的输出"],
    "example": "# 角色卡片\nname = \"勇士\"\nhp = 100\nmp = 50\nprint(\"=\" * 20)\nprint(f\"角色: {name}\")\nprint(f\"生命值: {hp}\")\nprint(\"=\" * 20)",
    "challenge": "设计一个游戏角色卡片，包含角色名、职业、攻击力、防御力和生命值，用漂亮的格式输出。",
    "hints": ["创建多个变量存储角色信息", "用重复字符创建边框"],
    "validation": {
        "requiredKeywords": ["print", "=", "*"],
        "successFeedback": "恭喜！你完成了新手村的迷你项目！",
        "errorFeedback": "请确保创建了完整的角色卡片程序。"
    },
    "difficulty": 2,
    "category": "综合应用",
    "tags": ["变量", "字符串", "游戏"],
    "phase": 1,
    "phaseName": "新手村",
    "isMiniProject": True,
    "questionTypes": ["code", "drag", "choice", "fill", "guided"],
    "defaultType": "code",
    "codeBlocks": {
        "available": ["name = \"勇者\"", "job = \"战士\"", "attack = 25", "defense = 15", "hp = 100", "print(\"=\" * 20)", "print(f\"角色: {name}\")", "print(f\"职业: {job}\")", "print(f\"攻击力: {attack}\")", "print(f\"防御力: {defense}\")", "print(f\"生命值: {hp}\")", "print(\"=\" * 20)"],
        "correctOrder": ["name = \"勇者\"", "job = \"战士\"", "attack = 25", "defense = 15", "hp = 100", "print(\"=\" * 20)", "print(f\"角色: {name}\")", "print(f\"职业: {job}\")", "print(f\"攻击力: {attack}\")", "print(f\"防御力: {defense}\")", "print(f\"生命值: {hp}\")", "print(\"=\" * 20)"]
    },
    "choices": {
        "question": "如果要让\"=\"重复20次，应该怎么写？",
        "options": [
            {"text": "\"=\" * 20", "correct": True, "feedback": "正确！用*号可以重复字符串！"},
            {"text": "\"=\"x20", "correct": False, "feedback": "不对，应该用*号。"},
            {"text": "repeat(\"=\", 20)", "correct": False, "feedback": "不对，没有这个函数。"},
            {"text": "\"=\"*\"20\"", "correct": False, "feedback": "不对，20不用加引号。"}
        ]
    },
    "fillBlanks": {
        "template": "name = \"勇者\"\njob = \"战士\"\nattack = 25\ndefense = 15\nhp = 100\nprint(___ ___ 20)\nprint(f\"角色: {name}\")\nprint(f\"职业: {job}\")\nprint(f\"攻击力: {attack}\")\nprint(f\"防御力: {defense}\")\nprint(f\"生命值: {hp}\")\nprint(___ ___ 20)",
        "blanks": [
            {"id": 0, "answer": "\"=\"", "options": ["\"=\"", "\"-\"", "\"*\"", "\"#\""]},
            {"id": 1, "answer": "*", "options": ["*", "+", "-", "/"]},
            {"id": 2, "answer": "\"=\"", "options": ["\"=\"", "\"-\"", "\"*\"", "\"#\""]},
            {"id": 3, "answer": "*", "options": ["*", "+", "-", "/"]}
        ]
    },
    "guidedHints": [
        {"step": 1, "hint": "首先，创建所有角色属性的变量。", "code": "# 第一步：创建变量\nname = \"勇者\"\njob = \"战士\"\nattack = 25\ndefense = 15\nhp = 100"},
        {"step": 2, "hint": "很好！现在打印边框和角色信息，用f-string格式化。", "code": "# 第二步：添加边框和信息\nname = \"勇者\"\njob = \"战士\"\nattack = 25\ndefense = 15\nhp = 100\nprint(\"=\" * 20)\nprint(f\"角色: {name}\")\nprint(f\"职业: {job}\")"},
        {"step": 3, "hint": "太棒了！现在把剩余信息和底部边框都加上。", "code": "# 第三步：完整答案\nname = \"勇者\"\njob = \"战士\"\nattack = 25\ndefense = 15\nhp = 100\nprint(\"=\" * 20)\nprint(f\"角色: {name}\")\nprint(f\"职业: {job}\")\nprint(f\"攻击力: {attack}\")\nprint(f\"防御力: {defense}\")\nprint(f\"生命值: {hp}\")\nprint(\"=\" * 20)"}
    ]
}
full_data["levels"].append(level5)

# ==================== 关卡 6-10（冒险启程）====================

# 关卡 6
level6 = {
    "id": 6,
    "title": "关卡6: 获取用户输入",
    "description": "学习如何从用户那里获取输入，让程序变得更加互动！",
    "objectives": ["掌握input()函数的使用", "学会处理用户输入", "理解字符串和数字输入的区别"],
    "example": "# 获取用户输入\nname = input(\"请输入你的名字：\")\nprint(f\"你好，{name}！\")",
    "challenge": "编写程序，询问用户的名字和年龄，然后输出\"你好，[名字]！你今年[年龄]岁了。\"",
    "hints": ["使用input()获取用户输入", "可以用多个input()语句"],
    "validation": {
        "requiredKeywords": ["input", "print"],
        "successFeedback": "太棒了！你已经学会了让程序与用户互动！",
        "errorFeedback": "请确保使用了input()函数获取用户输入。"
    },
    "difficulty": 2,
    "category": "输入输出",
    "tags": ["input", "交互", "变量"],
    "phase": 2,
    "phaseName": "冒险启程",
    "isMiniProject": False,
    "questionTypes": ["code", "drag", "choice", "fill", "guided"],
    "defaultType": "code",
    "codeBlocks": {
        "available": ["name = input(\"请输入你的名字：\")", "age = input(\"请输入你的年龄：\")", "print(f\"你好，{name}！你今年{age}岁了。\")"],
        "correctOrder": ["name = input(\"请输入你的名字：\")", "age = input(\"请输入你的年龄：\")", "print(f\"你好，{name}！你今年{age}岁了。\")"]
    },
    "choices": {
        "question": "要获取用户输入，应该使用什么函数？",
        "options": [
            {"text": "input()", "correct": True, "feedback": "正确！input()函数用于获取用户输入！"},
            {"text": "print()", "correct": False, "feedback": "不对，print()是用来输出的。"},
            {"text": "get()", "correct": False, "feedback": "不对，没有get()这个输入函数。"},
            {"text": "read()", "correct": False, "feedback": "不对，read()通常用于文件操作。"}
        ]
    },
    "fillBlanks": {
        "template": "name = ___(\"请输入你的名字：\")\nage = ___(\"请输入你的年龄：\")\n___(f\"你好，{name}！你今年{age}岁了。\")",
        "blanks": [
            {"id": 0, "answer": "input", "options": ["input", "print", "get", "read"]},
            {"id": 1, "answer": "input", "options": ["input", "print", "get", "read"]},
            {"id": 2, "answer": "print", "options": ["print", "input", "get", "read"]}
        ]
    },
    "guidedHints": [
        {"step": 1, "hint": "首先，使用input()获取用户的名字。", "code": "# 第一步：获取名字\nname = input(\"请输入你的名字：\")"},
        {"step": 2, "hint": "很好！现在再获取用户的年龄。", "code": "# 第二步：获取年龄\nname = input(\"请输入你的名字：\")\nage = input(\"请输入你的年龄：\")"},
        {"step": 3, "hint": "太棒了！现在把它们用print()和f-string输出。", "code": "# 第三步：完整答案\nname = input(\"请输入你的名字：\")\nage = input(\"请输入你的年龄：\")\nprint(f\"你好，{name}！你今年{age}岁了。\")"}
    ]
}
full_data["levels"].append(level6)

# 关卡 7
level7 = {
    "id": 7,
    "title": "关卡7: 类型转换",
    "description": "学习如何在不同数据类型之间转换，处理数字输入！",
    "objectives": ["理解int()和float()函数", "学会将字符串转换为数字", "处理数值计算"],
    "example": "# 类型转换\nage_str = input(\"请输入年龄：\")\nage = int(age_str)\nprint(f\"明年你就{age + 1}岁了！\")",
    "challenge": "编写程序，让用户输入两个数字，然后输出它们的和。",
    "hints": ["input()返回的是字符串", "需要用int()或float()转换", "然后才能进行加法运算"],
    "validation": {
        "requiredKeywords": ["input", "int", "+"],
        "successFeedback": "完美！你已经掌握了数据类型转换！",
        "errorFeedback": "请确保使用了类型转换函数（int或float）。"
    },
    "difficulty": 2,
    "category": "数据类型",
    "tags": ["类型转换", "int", "float"],
    "phase": 2,
    "phaseName": "冒险启程",
    "isMiniProject": False,
    "questionTypes": ["code", "drag", "choice", "fill", "guided"],
    "defaultType": "code",
    "codeBlocks": {
        "available": ["num1 = input(\"请输入第一个数字：\")", "num2 = input(\"请输入第二个数字：\")", "a = int(num1)", "b = int(num2)", "print(a + b)"],
        "correctOrder": ["num1 = input(\"请输入第一个数字：\")", "num2 = input(\"请输入第二个数字：\")", "a = int(num1)", "b = int(num2)", "print(a + b)"]
    },
    "choices": {
        "question": "要把字符串\"123\"转换为整数，应该用什么函数？",
        "options": [
            {"text": "int()", "correct": True, "feedback": "正确！int()用于转换为整数！"},
            {"text": "float()", "correct": False, "feedback": "不对，float()是转换为小数的。"},
            {"text": "str()", "correct": False, "feedback": "不对，str()是转换为字符串的。"},
            {"text": "number()", "correct": False, "feedback": "不对，没有这个函数。"}
        ]
    },
    "fillBlanks": {
        "template": "num1 = ___(\"请输入第一个数字：\")\nnum2 = ___(\"请输入第二个数字：\")\na = ___(num1)\nb = ___(num2)\nprint(a + b)",
        "blanks": [
            {"id": 0, "answer": "input", "options": ["input", "print", "int", "float"]},
            {"id": 1, "answer": "input", "options": ["input", "print", "int", "float"]},
            {"id": 2, "answer": "int", "options": ["int", "float", "str", "input"]},
            {"id": 3, "answer": "int", "options": ["int", "float", "str", "input"]}
        ]
    },
    "guidedHints": [
        {"step": 1, "hint": "首先，获取两个数字的输入（都是字符串）。", "code": "# 第一步：获取输入\nnum1 = input(\"请输入第一个数字：\")\nnum2 = input(\"请输入第二个数字：\")"},
        {"step": 2, "hint": "很好！现在用int()把它们转换成整数。", "code": "# 第二步：类型转换\nnum1 = input(\"请输入第一个数字：\")\nnum2 = input(\"请输入第二个数字：\")\na = int(num1)\nb = int(num2)"},
        {"step": 3, "hint": "太棒了！现在计算并输出它们的和。", "code": "# 第三步：完整答案\nnum1 = input(\"请输入第一个数字：\")\nnum2 = input(\"请输入第二个数字：\")\na = int(num1)\nb = int(num2)\nprint(a + b)"}
    ]
}
full_data["levels"].append(level7)

# 关卡 8
level8 = {
    "id": 8,
    "title": "关卡8: 条件判断if",
    "description": "学习使用if语句进行条件判断，让程序做出决策！",
    "objectives": ["掌握if语句的语法", "学会比较运算符", "理解缩进的重要性"],
    "example": "# 条件判断\nage = int(input(\"请输入年龄：\"))\nif age >= 18:\n    print(\"你是成年人了！\")",
    "challenge": "编写程序，让用户输入一个数字，如果这个数字大于10，就输出\"这个数字大于10\"。",
    "hints": ["使用if语句", "比较运算符：> < >= <= ==", "注意冒号和缩进"],
    "validation": {
        "requiredKeywords": ["if", ">"],
        "successFeedback": "太棒了！你已经学会了让程序做决策！",
        "errorFeedback": "请确保使用了if语句进行条件判断。"
    },
    "difficulty": 2,
    "category": "流程控制",
    "tags": ["if", "条件", "比较"],
    "phase": 2,
    "phaseName": "冒险启程",
    "isMiniProject": False,
    "questionTypes": ["code", "drag", "choice", "fill", "guided"],
    "defaultType": "code",
    "codeBlocks": {
        "available": ["num = int(input(\"请输入一个数字：\"))", "if num > 10:", "    print(\"这个数字大于10\")"],
        "correctOrder": ["num = int(input(\"请输入一个数字：\"))", "if num > 10:", "    print(\"这个数字大于10\")"]
    },
    "choices": {
        "question": "在Python中，表示\"等于\"的比较运算符是什么？",
        "options": [
            {"text": "==", "correct": True, "feedback": "正确！==用于比较相等！"},
            {"text": "=", "correct": False, "feedback": "不对，=是用来赋值的。"},
            {"text": "===", "correct": False, "feedback": "不对，Python不用这个。"},
            {"text": "equals", "correct": False, "feedback": "不对，没有这个运算符。"}
        ]
    },
    "fillBlanks": {
        "template": "num = int(___(\"请输入一个数字：\"))\n___ num > 10:\n    ___(\"这个数字大于10\")",
        "blanks": [
            {"id": 0, "answer": "input", "options": ["input", "print", "if", "else"]},
            {"id": 1, "answer": "if", "options": ["if", "else", "for", "while"]},
            {"id": 2, "answer": "print", "options": ["print", "input", "if", "output"]}
        ]
    },
    "guidedHints": [
        {"step": 1, "hint": "首先，获取用户输入的数字。", "code": "# 第一步：获取输入\nnum = int(input(\"请输入一个数字：\"))"},
        {"step": 2, "hint": "很好！现在使用if语句判断数字是否大于10。", "code": "# 第二步：条件判断\nnum = int(input(\"请输入一个数字：\"))\nif num > 10:"},
        {"step": 3, "hint": "太棒了！现在添加输出语句（注意缩进！）。", "code": "# 第三步：完整答案\nnum = int(input(\"请输入一个数字：\"))\nif num > 10:\n    print(\"这个数字大于10\")"}
    ]
}
full_data["levels"].append(level8)

# 关卡 9
level9 = {
    "id": 9,
    "title": "关卡9: if-else语句",
    "description": "学习使用if-else语句，处理两种不同的情况！",
    "objectives": ["掌握if-else语句", "处理条件成立和不成立两种情况", "继续练习缩进"],
    "example": "# if-else语句\nscore = int(input(\"请输入分数：\"))\nif score >= 60:\n    print(\"恭喜，及格了！\")\nelse:\n    print(\"加油，还需要努力！\")",
    "challenge": "编写程序，让用户输入一个数字，如果是偶数输出\"偶数\"，否则输出\"奇数\"。",
    "hints": ["用取模运算符%判断奇偶", "num % 2 == 0 是偶数", "使用if-else语句"],
    "validation": {
        "requiredKeywords": ["if", "else", "%"],
        "successFeedback": "完美！你已经掌握了if-else语句！",
        "errorFeedback": "请确保使用了if-else语句和取模运算。"
    },
    "difficulty": 2,
    "category": "流程控制",
    "tags": ["if-else", "条件", "奇偶"],
    "phase": 2,
    "phaseName": "冒险启程",
    "isMiniProject": False,
    "questionTypes": ["code", "drag", "choice", "fill", "guided"],
    "defaultType": "code",
    "codeBlocks": {
        "available": ["num = int(input(\"请输入一个数字：\"))", "if num % 2 == 0:", "    print(\"偶数\")", "else:", "    print(\"奇数\")"],
        "correctOrder": ["num = int(input(\"请输入一个数字：\"))", "if num % 2 == 0:", "    print(\"偶数\")", "else:", "    print(\"奇数\")"]
    },
    "choices": {
        "question": "取模运算符%的作用是什么？",
        "options": [
            {"text": "求除法的余数", "correct": True, "feedback": "正确！%用于求余数！"},
            {"text": "求百分比", "correct": False, "feedback": "不对，不是求百分比。"},
            {"text": "除法运算", "correct": False, "feedback": "不对，除法是/。"},
            {"text": "乘法运算", "correct": False, "feedback": "不对，乘法是*。"}
        ]
    },
    "fillBlanks": {
        "template": "num = int(input(\"请输入一个数字：\"))\n___ num % 2 == 0:\n    print(\"偶数\")\n___:\n    print(\"奇数\")",
        "blanks": [
            {"id": 0, "answer": "if", "options": ["if", "else", "for", "while"]},
            {"id": 1, "answer": "else", "options": ["else", "if", "elif", "or"]}
        ]
    },
    "guidedHints": [
        {"step": 1, "hint": "首先，获取用户输入的数字。", "code": "# 第一步：获取输入\nnum = int(input(\"请输入一个数字：\"))"},
        {"step": 2, "hint": "很好！用if语句判断num % 2 == 0是否成立。", "code": "# 第二步：if判断\nnum = int(input(\"请输入一个数字：\"))\nif num % 2 == 0:\n    print(\"偶数\")"},
        {"step": 3, "hint": "太棒了！现在加上else部分处理奇数的情况。", "code": "# 第三步：完整答案\nnum = int(input(\"请输入一个数字：\"))\nif num % 2 == 0:\n    print(\"偶数\")\nelse:\n    print(\"奇数\")"}
    ]
}
full_data["levels"].append(level9)

# 关卡 10
level10 = {
    "id": 10,
    "title": "关卡10: 简单计算器",
    "description": "把前面学的知识整合起来，创建一个简单的计算器！",
    "objectives": ["综合运用input、类型转换", "使用条件判断", "创建一个完整的小程序"],
    "example": "# 简单计算器示例\nprint(\"加法计算器\")\na = int(input(\"第一个数：\"))\nb = int(input(\"第二个数：\"))\nprint(f\"结果：{a + b}\")",
    "challenge": "创建一个计算器，让用户选择加法或减法，输入两个数，输出结果。",
    "hints": ["先让用户选择运算类型", "用if-else判断用户的选择", "然后进行相应的计算"],
    "validation": {
        "requiredKeywords": ["input", "if", "+", "-"],
        "successFeedback": "恭喜！你完成了冒险启程阶段的迷你项目！",
        "errorFeedback": "请确保实现了加法和减法两种运算。"
    },
    "difficulty": 3,
    "category": "综合应用",
    "tags": ["计算器", "综合", "项目"],
    "phase": 2,
    "phaseName": "冒险启程",
    "isMiniProject": True,
    "questionTypes": ["code", "drag", "choice", "fill", "guided"],
    "defaultType": "code",
    "codeBlocks": {
        "available": ["print(\"简单计算器\")", "op = input(\"请选择(+或-)：\")", "a = int(input(\"第一个数：\"))", "b = int(input(\"第二个数：\"))", "if op == \"+\":", "    print(a + b)", "else:", "    print(a - b)"],
        "correctOrder": ["print(\"简单计算器\")", "op = input(\"请选择(+或-)：\")", "a = int(input(\"第一个数：\"))", "b = int(input(\"第二个数：\"))", "if op == \"+\":", "    print(a + b)", "else:", "    print(a - b)"]
    },
    "choices": {
        "question": "在这个计算器项目中，首先要做什么？",
        "options": [
            {"text": "获取用户选择的运算类型", "correct": True, "feedback": "正确！先知道用户要做什么运算！"},
            {"text": "直接计算结果", "correct": False, "feedback": "不对，需要先知道用户想做什么运算。"},
            {"text": "输出结果", "correct": False, "feedback": "不对，这是最后一步。"},
            {"text": "输入两个数字", "correct": False, "feedback": "不对，应该先选择运算类型。"}
        ]
    },
    "fillBlanks": {
        "template": "print(\"简单计算器\")\nop = ___(\"请选择(+或-)：\")\na = int(___(\"第一个数：\"))\nb = int(___(\"第二个数：\"))\nif op == \"+\":\n    print(a + b)\nelse:\n    print(a - b)",
        "blanks": [
            {"id": 0, "answer": "input", "options": ["input", "print", "if", "else"]},
            {"id": 1, "answer": "input", "options": ["input", "print", "int", "float"]},
            {"id": 2, "answer": "input", "options": ["input", "print", "int", "float"]}
        ]
    },
    "guidedHints": [
        {"step": 1, "hint": "首先，获取用户选择的运算类型（+或-）。", "code": "# 第一步：选择运算\nprint(\"简单计算器\")\nop = input(\"请选择(+或-)：\")"},
        {"step": 2, "hint": "很好！现在获取两个数字的输入。", "code": "# 第二步：获取数字\nprint(\"简单计算器\")\nop = input(\"请选择(+或-)：\")\na = int(input(\"第一个数：\"))\nb = int(input(\"第二个数：\"))"},
        {"step": 3, "hint": "太棒了！用if-else根据选择进行计算并输出。", "code": "# 第三步：完整答案\nprint(\"简单计算器\")\nop = input(\"请选择(+或-)：\")\na = int(input(\"第一个数：\"))\nb = int(input(\"第二个数：\"))\nif op == \"+\":\n    print(a + b)\nelse:\n    print(a - b)"}
    ]
}
full_data["levels"].append(level10)

# ==================== 关卡 11-15（技能进阶）====================

# 关卡 11
level11 = {
    "id": 11,
    "title": "关卡11: while循环",
    "description": "学习使用while循环，让程序重复执行！",
    "objectives": ["掌握while循环的语法", "理解循环条件", "避免无限循环"],
    "example": "# while循环\ncount = 1\nwhile count <= 5:\n    print(count)\n    count = count + 1",
    "challenge": "使用while循环输出1到10的数字。",
    "hints": ["初始化一个计数器变量", "while条件控制循环次数", "每次循环要更新计数器"],
    "validation": {
        "requiredKeywords": ["while"],
        "successFeedback": "太棒了！你已经掌握了while循环！",
        "errorFeedback": "请确保使用了while循环。"
    },
    "difficulty": 3,
    "category": "流程控制",
    "tags": ["while", "循环", "计数"],
    "phase": 3,
    "phaseName": "技能进阶",
    "isMiniProject": False,
    "questionTypes": ["code", "drag", "choice", "fill", "guided"],
    "defaultType": "code",
    "codeBlocks": {
        "available": ["count = 1", "while count <= 10:", "    print(count)", "    count = count + 1"],
        "correctOrder": ["count = 1", "while count <= 10:", "    print(count)", "    count = count + 1"]
    },
    "choices": {
        "question": "在while循环中，如果忘记更新计数器会发生什么？",
        "options": [
            {"text": "会变成无限循环", "correct": True, "feedback": "正确！条件永远成立，循环永远不会停止！"},
            {"text": "循环会自动停止", "correct": False, "feedback": "不对，循环不会自动停止。"},
            {"text": "程序会报错", "correct": False, "feedback": "不对，程序不会报错，但会一直运行。"},
            {"text": "循环只会执行一次", "correct": False, "feedback": "不对，会一直执行下去。"}
        ]
    },
    "fillBlanks": {
        "template": "count = 1\n___ count <= 10:\n    print(count)\n    count = count ___ 1",
        "blanks": [
            {"id": 0, "answer": "while", "options": ["while", "if", "for", "else"]},
            {"id": 1, "answer": "+", "options": ["+", "-", "*", "/"]}
        ]
    },
    "guidedHints": [
        {"step": 1, "hint": "首先，创建一个计数器变量，从1开始。", "code": "# 第一步：初始化计数器\ncount = 1"},
        {"step": 2, "hint": "很好！现在添加while循环，条件是count <= 10。", "code": "# 第二步：while循环\ncount = 1\nwhile count <= 10:\n    print(count)"},
        {"step": 3, "hint": "太棒了！记得每次循环后count加1，否则会无限循环！", "code": "# 第三步：完整答案\ncount = 1\nwhile count <= 10:\n    print(count)\n    count = count + 1"}
    ]
}
full_data["levels"].append(level11)

# 关卡 12
level12 = {
    "id": 12,
    "title": "关卡12: 列表入门",
    "description": "学习使用列表存储多个数据，方便管理！",
    "objectives": ["学会创建列表", "访问列表元素", "理解索引从0开始"],
    "example": "# 列表示例\nfruits = [\"苹果\", \"香蕉\", \"橙子\"]\nprint(fruits[0])  # 输出第一个元素\nprint(fruits[1])  # 输出第二个元素",
    "challenge": "创建一个包含3个你喜欢的游戏的列表，然后输出第一个和第三个游戏。",
    "hints": ["用方括号[]创建列表", "元素之间用逗号分隔", "索引从0开始：0, 1, 2"],
    "validation": {
        "requiredKeywords": ["[", "]"],
        "successFeedback": "完美！你已经学会了使用列表！",
        "errorFeedback": "请确保创建了列表并访问了元素。"
    },
    "difficulty": 3,
    "category": "数据结构",
    "tags": ["列表", "索引", "数据结构"],
    "phase": 3,
    "phaseName": "技能进阶",
    "isMiniProject": False,
    "questionTypes": ["code", "drag", "choice", "fill", "guided"],
    "defaultType": "code",
    "codeBlocks": {
        "available": ["games = [\"马里奥\", \"塞尔达\", \"宝可梦\"]", "print(games[0])", "print(games[2])"],
        "correctOrder": ["games = [\"马里奥\", \"塞尔达\", \"宝可梦\"]", "print(games[0])", "print(games[2])"]
    },
    "choices": {
        "question": "在Python列表中，第一个元素的索引是多少？",
        "options": [
            {"text": "0", "correct": True, "feedback": "正确！Python索引从0开始！"},
            {"text": "1", "correct": False, "feedback": "不对，不是从1开始的。"},
            {"text": "-1", "correct": False, "feedback": "不对，-1是最后一个元素。"},
            {"text": "第一个", "correct": False, "feedback": "不对，要用数字索引。"}
        ]
    },
    "fillBlanks": {
        "template": "games = [\"马里奥\", \"塞尔达\", \"宝可梦\"]\nprint(games[___])  # 第一个\nprint(games[___])  # 第三个",
        "blanks": [
            {"id": 0, "answer": "0", "options": ["0", "1", "2", "3"]},
            {"id": 1, "answer": "2", "options": ["0", "1", "2", "3"]}
        ]
    },
    "guidedHints": [
        {"step": 1, "hint": "首先，创建一个包含3个游戏的列表。", "code": "# 第一步：创建列表\ngames = [\"马里奥\", \"塞尔达\", \"宝可梦\"]"},
        {"step": 2, "hint": "很好！现在输出第一个游戏，索引是0。", "code": "# 第二步：输出第一个\ngames = [\"马里奥\", \"塞尔达\", \"宝可梦\"]\nprint(games[0])"},
        {"step": 3, "hint": "太棒了！再输出第三个游戏，索引是2。", "code": "# 第三步：完整答案\ngames = [\"马里奥\", \"塞尔达\", \"宝可梦\"]\nprint(games[0])\nprint(games[2])"}
    ]
}
full_data["levels"].append(level12)

# 关卡 13
level13 = {
    "id": 13,
    "title": "关卡13: for循环",
    "description": "学习使用for循环遍历列表，处理每个元素！",
    "objectives": ["掌握for循环语法", "学会遍历列表", "理解for循环的工作原理"],
    "example": "# for循环\nfruits = [\"苹果\", \"香蕉\", \"橙子\"]\nfor fruit in fruits:\n    print(f\"我喜欢{fruit}\")",
    "challenge": "创建一个数字列表[1, 2, 3, 4, 5]，用for循环输出每个数字的平方。",
    "hints": ["for 变量 in 列表:", "平方是 num * num 或 num ** 2", "在循环中计算并输出"],
    "validation": {
        "requiredKeywords": ["for", "in"],
        "successFeedback": "太棒了！你已经掌握了for循环！",
        "errorFeedback": "请确保使用了for循环遍历列表。"
    },
    "difficulty": 3,
    "category": "流程控制",
    "tags": ["for", "循环", "遍历"],
    "phase": 3,
    "phaseName": "技能进阶",
    "isMiniProject": False,
    "questionTypes": ["code", "drag", "choice", "fill", "guided"],
    "defaultType": "code",
    "codeBlocks": {
        "available": ["numbers = [1, 2, 3, 4, 5]", "for num in numbers:", "    print(num * num)"],
        "correctOrder": ["numbers = [1, 2, 3, 4, 5]", "for num in numbers:", "    print(num * num)"]
    },
    "choices": {
        "question": "for循环和while循环的主要区别是什么？",
        "options": [
            {"text": "for通常用于遍历已知序列，while用于条件循环", "correct": True, "feedback": "正确！这是它们的主要用途区别！"},
            {"text": "for循环更快", "correct": False, "feedback": "不对，速度上没有本质区别。"},
            {"text": "while循环更强大", "correct": False, "feedback": "不对，各有用途。"},
            {"text": "没有区别", "correct": False, "feedback": "不对，使用场景不同。"}
        ]
    },
    "fillBlanks": {
        "template": "numbers = [1, 2, 3, 4, 5]\n___ num ___ numbers:\n    print(num * num)",
        "blanks": [
            {"id": 0, "answer": "for", "options": ["for", "while", "if", "else"]},
            {"id": 1, "answer": "in", "options": ["in", "on", "at", "for"]}
        ]
    },
    "guidedHints": [
        {"step": 1, "hint": "首先，创建数字列表。", "code": "# 第一步：创建列表\nnumbers = [1, 2, 3, 4, 5]"},
        {"step": 2, "hint": "很好！现在用for循环遍历列表。", "code": "# 第二步：for循环\nnumbers = [1, 2, 3, 4, 5]\nfor num in numbers:"},
        {"step": 3, "hint": "太棒了！在循环中计算平方并输出。", "code": "# 第三步：完整答案\nnumbers = [1, 2, 3, 4, 5]\nfor num in numbers:\n    print(num * num)"}
    ]
}
full_data["levels"].append(level13)

# 关卡 14
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
full_data["levels"].append(level14)

# 关卡 15
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
full_data["levels"].append(level15)

# ==================== 关卡 16-20（挑战大师）====================

# 关卡 16
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
full_data["levels"].append(level16)

# 关卡 17
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
    "phase":