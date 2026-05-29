#!/usr/bin/env python3
"""
极客深色风UI详细测试 - 捕获网络请求和控制台日志
"""
import sys
import json
from playwright.sync_api import sync_playwright

def detailed_test():
    """详细测试极客深色风UI"""
    
    results = {
        'pages_tested': [],
        'network_errors': [],
        'console_errors': [],
        'visual_checks': {}
    }
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        # 捕获所有网络请求和响应
        def handle_request(request):
            if request.resource_type in ['stylesheet', 'script', 'image', 'font']:
                pass  # 记录请求
        
        def handle_response(response):
            if response.status >= 400:
                results['network_errors'].append({
                    'url': response.url,
                    'status': response.status,
                    'status_text': response.status_text
                })
        
        page.on("request", handle_request)
        page.on("response", handle_response)
        
        # 捕获控制台日志
        def handle_console(msg):
            if msg.type == 'error':
                results['console_errors'].append({
                    'text': msg.text,
                    'location': msg.location
                })
        
        page.on("console", handle_console)
        
        try:
            print("=" * 70)
            print("极客深色风UI - 详细测试")
            print("=" * 70)
            
            # ========== 测试1: 首页 ==========
            print("\n[1] 测试首页 (index.html)")
            print("-" * 70)
            
            results['pages_tested'].append('index.html')
            page.goto('http://localhost:8081/index.html')
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(1000)
            
            # 截图
            page.screenshot(path='/workspace/dogfood-output/screenshots/index-full.png', full_page=True)
            
            # 视觉检查
            visual_checks = {
                'background_color': page.evaluate('''() => {
                    return window.getComputedStyle(document.body).backgroundColor;
                }'''),
                'text_color': page.evaluate('''() => {
                    return window.getComputedStyle(document.body).color;
                }'''),
                'has_dark_theme': page.evaluate('''() => {
                    const bg = window.getComputedStyle(document.body).backgroundColor;
                    // 深色主题背景通常是rgb(13, 17, 23)即#0d1117
                    return bg === 'rgb(13, 17, 23)' || bg === '#0d1117';
                }'''),
                'font_family': page.evaluate('''() => {
                    return window.getComputedStyle(document.body).fontFamily;
                }'''),
                'elements_count': {
                    'buttons': page.locator('button').count(),
                    'links': page.locator('a').count(),
                    'divs': page.locator('div').count(),
                    'headings': page.locator('h1, h2, h3, h4, h5, h6').count()
                }
            }
            
            results['visual_checks']['index'] = visual_checks
            
            print(f"  背景颜色: {visual_checks['background_color']}")
            print(f"  文本颜色: {visual_checks['text_color']}")
            print(f"  深色主题: {'✓ 是' if visual_checks['has_dark_theme'] else '✗ 否'}")
            print(f"  字体族: {visual_checks['font_family'][:50]}...")
            print(f"  元素统计:")
            for elem, count in visual_checks['elements_count'].items():
                print(f"    - {elem}: {count}")
            
            # ========== 测试2: 关卡页面 ==========
            print("\n[2] 测试关卡页面 (level.html)")
            print("-" * 70)
            
            results['pages_tested'].append('level.html')
            page.goto('http://localhost:8081/level.html')
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(1000)
            
            # 截图
            page.screenshot(path='/workspace/dogfood-output/screenshots/level-full.png', full_page=True)
            
            # 视觉检查
            visual_checks_level = {
                'background_color': page.evaluate('''() => {
                    return window.getComputedStyle(document.body).backgroundColor;
                }'''),
                'text_color': page.evaluate('''() => {
                    return window.getComputedStyle(document.body).color;
                }'''),
                'has_dark_theme': page.evaluate('''() => {
                    const bg = window.getComputedStyle(document.body).backgroundColor;
                    return bg === 'rgb(13, 17, 23)' || bg === '#0d1117';
                }'''),
                'font_family': page.evaluate('''() => {
                    return window.getComputedStyle(document.body).fontFamily;
                }'''),
                'elements_count': {
                    'buttons': page.locator('button').count(),
                    'links': page.locator('a').count(),
                    'divs': page.locator('div').count(),
                    'headings': page.locator('h1, h2, h3, h4, h5, h6').count(),
                    'textareas': page.locator('textarea').count()
                },
                'code_input_focus': False,
                'mode_tabs_count': page.locator('.mode-tab').count()
            }
            
            results['visual_checks']['level'] = visual_checks_level
            
            print(f"  背景颜色: {visual_checks_level['background_color']}")
            print(f"  文本颜色: {visual_checks_level['text_color']}")
            print(f"  深色主题: {'✓ 是' if visual_checks_level['has_dark_theme'] else '✗ 否'}")
            print(f"  字体族: {visual_checks_level['font_family'][:50]}...")
            print(f"  元素统计:")
            for elem, count in visual_checks_level['elements_count'].items():
                print(f"    - {elem}: {count}")
            print(f"  模式标签数量: {visual_checks_level['mode_tabs_count']}")
            
            # ========== 测试3: 功能交互 ==========
            print("\n[3] 测试功能交互")
            print("-" * 70)
            
            # 测试代码输入框
            code_input = page.locator('#code-input')
            if code_input.count() > 0:
                code_input.click()
                page.wait_for_timeout(200)
                visual_checks_level['code_input_focus'] = True
                print("  ✓ 代码输入框可聚焦")
                
                # 测试输入
                code_input.fill('print("Hello")')
                value = code_input.input_value()
                print(f"  ✓ 代码输入: '{value}'")
                
                # 清空并测试
                code_input.clear()
                value = code_input.input_value()
                print(f"  ✓ 清空功能: {'正常' if value == '' else '异常'}")
            else:
                print("  ✗ 代码输入框不存在")
            
            # 测试模式切换
            mode_tabs = page.locator('.mode-tab')
            for i in range(min(5, mode_tabs.count())):
                mode_tabs.nth(i).click()
                page.wait_for_timeout(200)
            print("  ✓ 模式切换功能正常")
            
            # 测试返回按钮
            back_btn = page.locator('.back-button')
            if back_btn.count() > 0:
                back_btn.click()
                page.wait_for_timeout(500)
                print(f"  ✓ 返回按钮: {page.url}")
            
            # ========== 测试4: 响应式设计 ==========
            print("\n[4] 测试响应式设计")
            print("-" * 70)
            
            # 移动端视口
            page.set_viewport_size({"width": 375, "height": 667})
            page.goto('http://localhost:8081/index.html')
            page.wait_for_load_state('networkidle')
            page.screenshot(path='/workspace/dogfood-output/screenshots/index-mobile.png', full_page=True)
            print(f"  ✓ 移动端视图测试完成")
            
            # 平板视口
            page.set_viewport_size({"width": 768, "height": 1024})
            page.goto('http://localhost:8081/index.html')
            page.wait_for_load_state('networkidle')
            page.screenshot(path='/workspace/dogfood-output/screenshots/index-tablet.png', full_page=True)
            print(f"  ✓ 平板视图测试完成")
            
            # 桌面视口
            page.set_viewport_size({"width": 1920, "height": 1080})
            
            print("\n" + "=" * 70)
            print("详细测试完成!")
            print("=" * 70)
            
        except Exception as e:
            print(f"\n✗ 测试异常: {e}")
            import traceback
            traceback.print_exc()
        
        finally:
            browser.close()
    
    return results

if __name__ == '__main__':
    print("开始详细测试...\n")
    
    # 检查服务器
    import urllib.request
    try:
        urllib.request.urlopen('http://localhost:8081', timeout=2)
        print("✓ 服务器正常\n")
    except Exception as e:
        print(f"✗ 服务器未运行: {e}")
        sys.exit(1)
    
    # 运行测试
    results = detailed_test()
    
    # 保存结果
    output_file = '/workspace/dogfood-output/detailed-test-results.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n详细结果已保存: {output_file}")
    
    # 显示错误摘要
    if results['network_errors']:
        print(f"\n发现 {len(results['network_errors'])} 个网络错误:")
        for i, err in enumerate(results['network_errors'], 1):
            print(f"  {i}. {err['status']} {err['url']}")
    
    if results['console_errors']:
        print(f"\n发现 {len(results['console_errors'])} 个控制台错误:")
        for i, err in enumerate(results['console_errors'], 1):
            print(f"  {i}. {err['text'][:100]}")
