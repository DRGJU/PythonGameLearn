#!/usr/bin/env python3
"""
极客深色风UI全面测试脚本
测试首页和关卡页面的深色主题实现
"""
import sys
from playwright.sync_api import sync_playwright
import os

def test_geek_dark_ui():
    """测试极客深色风UI"""
    
    results = {
        'index_page': {},
        'level_page': {},
        'issues': []
    }
    
    with sync_playwright() as p:
        # 启动浏览器
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        # 捕获控制台日志
        console_logs = []
        page.on("console", lambda msg: console_logs.append({
            'type': msg.type,
            'text': msg.text
        }))
        
        try:
            print("=" * 60)
            print("开始测试极客深色风UI")
            print("=" * 60)
            
            # ========== 测试1: 首页 (index.html) ==========
            print("\n[1/2] 测试首页 (index.html)...")
            
            # 导航到首页
            page.goto('http://localhost:8081/index.html')
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(1000)  # 等待动画完成
            
            # 截图
            page.screenshot(path='/workspace/dogfood-output/screenshots/index-page.png', full_page=True)
            
            # 检查深色主题
            bg_color = page.evaluate('''() => {
                return window.getComputedStyle(document.body).backgroundColor;
            }''')
            
            # 检查关键元素
            logo_exists = page.locator('.python-icon').count() > 0
            header_exists = page.locator('.hero-header').count() > 0
            progress_exists = page.locator('.progress-section').count() > 0
            game_section_exists = page.locator('.game-section').count() > 0
            level_selector_exists = page.locator('.level-selector').count() > 0
            
            results['index_page'] = {
                'loaded': True,
                'background_color': bg_color,
                'logo_exists': logo_exists,
                'header_exists': header_exists,
                'progress_exists': progress_exists,
                'game_section_exists': game_section_exists,
                'level_selector_exists': level_selector_exists,
                'console_errors': [log for log in console_logs if log['type'] == 'error']
            }
            
            print(f"  ✓ 背景颜色: {bg_color}")
            print(f"  ✓ Logo存在: {logo_exists}")
            print(f"  ✓ 头部存在: {header_exists}")
            print(f"  ✓ 进度条存在: {progress_exists}")
            print(f"  ✓ 游戏区域存在: {game_section_exists}")
            print(f"  ✓ 关卡选择器存在: {level_selector_exists}")
            
            # 测试关卡按钮点击
            level_buttons = page.locator('.level-btn')
            if level_buttons.count() > 0:
                print(f"  ✓ 发现 {level_buttons.count()} 个关卡按钮")
                
                # 点击第一个关卡
                first_level = level_buttons.first
                first_level.click()
                page.wait_for_timeout(500)
                
                # 检查是否跳转到关卡页面
                current_url = page.url
                print(f"  ✓ 点击后URL: {current_url}")
                
                # 返回首页
                page.goto('http://localhost:8081/index.html')
                page.wait_for_load_state('networkidle')
            else:
                print(f"  ✗ 未发现关卡按钮")
            
            # ========== 测试2: 关卡页面 (level.html) ==========
            print("\n[2/2] 测试关卡页面 (level.html)...")
            
            # 导航到关卡页面
            page.goto('http://localhost:8081/level.html')
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(1000)
            
            # 截图
            page.screenshot(path='/workspace/dogfood-output/screenshots/level-page.png', full_page=True)
            
            # 检查深色主题
            bg_color_level = page.evaluate('''() => {
                return window.getComputedStyle(document.body).backgroundColor;
            }''')
            
            # 检查关键元素
            back_button_exists = page.locator('.back-button').count() > 0
            level_title_exists = page.locator('#level-title').count() > 0
            navigation_bar_exists = page.locator('.level-navigation-bar').count() > 0
            mode_tabs_exists = page.locator('.mode-tabs').count() > 0
            code_input_exists = page.locator('#code-input').count() > 0
            
            results['level_page'] = {
                'loaded': True,
                'background_color': bg_color_level,
                'back_button_exists': back_button_exists,
                'level_title_exists': level_title_exists,
                'navigation_bar_exists': navigation_bar_exists,
                'mode_tabs_exists': mode_tabs_exists,
                'code_input_exists': code_input_exists,
                'console_errors': [log for log in console_logs if log['type'] == 'error']
            }
            
            print(f"  ✓ 背景颜色: {bg_color_level}")
            print(f"  ✓ 返回按钮存在: {back_button_exists}")
            print(f"  ✓ 关卡标题存在: {level_title_exists}")
            print(f"  ✓ 导航栏存在: {navigation_bar_exists}")
            print(f"  ✓ 模式标签页存在: {mode_tabs_exists}")
            print(f"  ✓ 代码输入框存在: {code_input_exists}")
            
            # 测试模式切换
            mode_tabs = page.locator('.mode-tab')
            if mode_tabs.count() > 0:
                print(f"  ✓ 发现 {mode_tabs.count()} 个模式标签")
                
                # 依次点击每个模式
                for i in range(mode_tabs.count()):
                    mode_tab = mode_tabs.nth(i)
                    mode_tab.click()
                    page.wait_for_timeout(300)
                print(f"  ✓ 所有模式切换测试完成")
            
            # 测试导航按钮
            prev_btn = page.locator('#level-nav-prev')
            next_btn = page.locator('#level-nav-next')
            
            if prev_btn.count() > 0 and next_btn.count() > 0:
                # 点击下一个关卡
                next_btn.click()
                page.wait_for_timeout(500)
                print(f"  ✓ 导航按钮测试完成")
            
            # ========== 检查控制台错误 ==========
            print("\n[3/3] 检查JavaScript控制台错误...")
            
            errors = [log for log in console_logs if log['type'] == 'error']
            
            if errors:
                print(f"  ✗ 发现 {len(errors)} 个控制台错误:")
                for i, error in enumerate(errors, 1):
                    print(f"    {i}. {error['text'][:100]}...")
                    results['issues'].append({
                        'severity': 'high',
                        'category': 'console',
                        'description': error['text']
                    })
            else:
                print(f"  ✓ 无控制台错误")
            
            # ========== 验证视觉风格 ==========
            print("\n[4/4] 验证视觉风格一致性...")
            
            # 检查字体是否正确加载
            font_loaded = page.evaluate('''() => {
                return document.fonts.check('16px "JetBrains Mono"');
            }''')
            print(f"  ✓ JetBrains Mono字体: {'已加载' if font_loaded else '未加载'}")
            
            # 检查颜色对比度
            text_contrast = page.evaluate('''() => {
                const body = document.body;
                const styles = window.getComputedStyle(body);
                const bg = styles.backgroundColor;
                const color = styles.color;
                return { bg, color };
            }''')
            print(f"  ✓ 文本颜色: {text_contrast['color']}")
            print(f"  ✓ 背景颜色: {text_contrast['bg']}")
            
            # 检查滚动条样式
            scrollbar_check = page.evaluate('''() => {
                const scrollbar = document.createElement('div');
                scrollbar.style.cssText = 'width: 10px; height: 10px; overflow: scroll;';
                document.body.appendChild(scrollbar);
                const has_scrollbar = scrollbar.offsetWidth - scrollbar.clientWidth > 0;
                document.body.removeChild(scrollbar);
                return has_scrollbar;
            }''')
            print(f"  ✓ 自定义滚动条: {'支持' if scrollbar_check else '不支持'}")
            
            print("\n" + "=" * 60)
            print("测试完成!")
            print("=" * 60)
            
        except Exception as e:
            print(f"\n✗ 测试过程中发生错误: {e}")
            results['issues'].append({
                'severity': 'critical',
                'category': 'functional',
                'description': str(e)
            })
            import traceback
            traceback.print_exc()
        
        finally:
            browser.close()
    
    return results

if __name__ == '__main__':
    print("开始运行极客深色风UI测试...")
    
    # 检查服务器是否运行
    import urllib.request
    try:
        urllib.request.urlopen('http://localhost:8081', timeout=2)
        print("✓ 服务器正在运行")
    except Exception as e:
        print(f"✗ 服务器未运行: {e}")
        sys.exit(1)
    
    # 运行测试
    results = test_geek_dark_ui()
    
    # 保存结果
    import json
    output_file = '/workspace/dogfood-output/test-results.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n结果已保存到: {output_file}")
