#!/usr/bin/env python3
"""
颜色对比度和可读性分析脚本
"""
import json
from playwright.sync_api import sync_playwright

def analyze_contrast():
    """分析颜色对比度和可读性"""
    
    results = {
        'contrast_ratio': {},
        'wcag_compliance': {},
        'readability': {}
    }
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        try:
            print("=" * 70)
            print("颜色对比度和可读性分析")
            print("=" * 70)
            
            # 加载首页
            page.goto('http://localhost:8081/index.html')
            page.wait_for_load_state('networkidle')
            
            # 分析主要元素的对比度
            elements_to_check = [
                {'selector': 'body', 'name': '页面背景-正文'},
                {'selector': 'h1', 'name': '标题H1'},
                {'selector': 'h2', 'name': '标题H2'},
                {'selector': 'p', 'name': '段落文本'},
                {'selector': '.stat-number', 'name': '统计数字'},
                {'selector': '.stat-label', 'name': '统计标签'},
                {'selector': '.level-btn', 'name': '关卡按钮'},
                {'selector': '.btn-primary', 'name': '主按钮'},
                {'selector': '.back-button', 'name': '返回按钮'},
                {'selector': '.mode-tab', 'name': '模式标签'},
                {'selector': 'a', 'name': '链接文本'},
                {'selector': '.progress-percentage', 'name': '进度百分比'}
            ]
            
            print("\n[1] 对比度分析 (WCAG AA标准)")
            print("-" * 70)
            print(f"{'元素':<20} {'前景色':<20} {'背景色':<20} {'对比度':<10} {'WCAG AA':<10}")
            print("-" * 70)
            
            for elem_info in elements_to_check:
                try:
                    # 获取元素的前景色和背景色
                    colors = page.evaluate(f'''() => {{
                        const elem = document.querySelector('{elem_info['selector']}');
                        if (!elem) return null;
                        
                        const styles = window.getComputedStyle(elem);
                        const bg = styles.backgroundColor;
                        const fg = styles.color;
                        
                        // 获取元素的父元素背景
                        let parentBg = bg;
                        let parent = elem.parentElement;
                        while (parent && parentBg === bg) {{
                            const parentStyles = window.getComputedStyle(parent);
                            if (parentStyles.backgroundColor !== 'rgba(0, 0, 0, 0)') {{
                                parentBg = parentStyles.backgroundColor;
                            }}
                            parent = parent.parentElement;
                        }}
                        
                        return {{
                            foreground: fg,
                            background: parentBg,
                            elementBg: bg
                        }};
                    }}''')
                    
                    if colors:
                        # 计算对比度（简化版本）
                        def hex_to_rgb(color):
                            if color.startswith('rgb'):
                                # 解析rgb(r, g, b)格式
                                nums = color.replace('rgb(', '').replace(')', '').split(',')
                                return tuple(int(n.strip()) for n in nums)
                            return (0, 0, 0)
                        
                        def calculate_contrast(rgb1, rgb2):
                            # 简化的对比度计算
                            def luminance(rgb):
                                r, g, b = [x/255.0 for x in rgb]
                                r = r/12.92 if r <= 0.03928 else ((r+0.055)/1.055) ** 2.4
                                g = g/12.92 if g <= 0.03928 else ((g+0.055)/1.055) ** 2.4
                                b = b/12.92 if b <= 0.03928 else ((b+0.055)/1.055) ** 2.4
                                return 0.2126 * r + 0.7152 * g + 0.0722 * b
                            
                            l1 = luminance(rgb1)
                            l2 = luminance(rgb2)
                            lighter = max(l1, l2)
                            darker = min(l1, l2)
                            return (lighter + 0.05) / (darker + 0.05)
                        
                        fg_rgb = hex_to_rgb(colors['foreground'])
                        bg_rgb = hex_to_rgb(colors['background'])
                        ratio = calculate_contrast(fg_rgb, bg_rgb)
                        
                        # WCAG AA标准: 正常文本需要4.5:1，大文本需要3:1
                        wcag_aa_normal = '✓ 通过' if ratio >= 4.5 else '⚠ 警告'
                        wcag_aa_large = '✓ 通过' if ratio >= 3.0 else '⚠ 警告'
                        
                        results['contrast_ratio'][elem_info['name']] = {
                            'foreground': colors['foreground'],
                            'background': colors['background'],
                            'ratio': round(ratio, 2)
                        }
                        
                        results['wcag_compliance'][elem_info['name']] = {
                            'normal_text': ratio >= 4.5,
                            'large_text': ratio >= 3.0
                        }
                        
                        print(f"{elem_info['name']:<20} {colors['foreground']:<20} {colors['background']:<20} {ratio:>6.2f}:1  {wcag_aa_large}")
                    
                except Exception as e:
                    print(f"{elem_info['name']:<20} 错误: {str(e)[:30]}")
            
            # 分析字体可读性
            print("\n[2] 字体可读性分析")
            print("-" * 70)
            
            font_info = page.evaluate('''() => {
                const body = document.body;
                const styles = window.getComputedStyle(body);
                return {
                    fontFamily: styles.fontFamily,
                    fontSize: styles.fontSize,
                    lineHeight: styles.lineHeight,
                    letterSpacing: styles.letterSpacing,
                    fontWeight: styles.fontWeight
                };
            }''')
            
            print(f"  字体族: {font_info['fontFamily']}")
            print(f"  字号: {font_info['fontSize']}")
            print(f"  行高: {font_info['lineHeight']}")
            print(f"  字间距: {font_info['letterSpacing']}")
            print(f"  字重: {font_info['fontWeight']}")
            
            # 检查字体加载
            font_loaded = page.evaluate('''() => {
                return document.fonts.check('16px "JetBrains Mono"') || 
                       document.fonts.check('16px "Outfit"');
            }''')
            
            results['readability'] = {
                'font_info': font_info,
                'custom_fonts_loaded': font_loaded
            }
            
            print(f"\n  自定义字体加载: {'✓ 是' if font_loaded else '✗ 否'}")
            
            print("\n" + "=" * 70)
            print("对比度分析完成!")
            print("=" * 70)
            
        except Exception as e:
            print(f"\n✗ 分析异常: {e}")
            import traceback
            traceback.print_exc()
        
        finally:
            browser.close()
    
    return results

if __name__ == '__main__':
    print("开始对比度分析...\n")
    
    results = analyze_contrast()
    
    # 保存结果
    output_file = '/workspace/dogfood-output/contrast-analysis.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n结果已保存: {output_file}")
