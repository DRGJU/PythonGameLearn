
import json

# 尝试读取并修复JSON
try:
    with open('/workspace/data/levels.json', 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("文件长度:", len(content))
    print("\n文件末尾500字符:")
    print(repr(content[-500:]))
    
    # 尝试找到最后一个完整的关卡结束位置
    # 先尝试找到第14个关卡的结束位置
    # 让我们尝试读取前18000个字符来看看
    partial_content = content[:18000]
    print("\n\n尝试解析前18000个字符...")
    
    # 找到第14个关卡的位置
    level14_start = partial_content.find('"id": 14,')
    if level14_start != -1:
        print(f"找到第14关开始位置: {level14_start}")
        # 尝试找到第14关的结束位置
        level14_content = partial_content[level14_start:]
        # 找到下一个关卡的开始或者文件结尾
        next_level = level14_content.find('"id": 15,')
        if next_level == -1:
            # 可能没有第15关，尝试找到最后一个完整的结构
            # 找到最后一个 } 的位置
            last_brace = level14_content.rfind('}')
            if last_brace != -1:
                level14_complete = level14_content[:last_brace+1]
                print("\n第14关内容预览:")
                print(level14_complete[:500])
                
except Exception as e:
    print("错误:", e)
    import traceback
    traceback.print_exc()
