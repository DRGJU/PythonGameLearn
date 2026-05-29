#!/usr/bin/env python3
from playwright.sync_api import sync_playwright
import time
import subprocess
import sys

def main():
    # 启动本地服务器
    print("🚀 启动本地服务器...")
    server_process = subprocess.Popen(
        [sys.executable, "-m", "http.server", "8000"],
        cwd="/workspace",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    # 等待服务器启动
    time.sleep(2)
    
    try:
        test_shortcut_hint()
    finally:
        # 关闭服务器
        print("🔄 关闭服务器...")
        server_process.terminate()
        server_process.wait()

def test_shortcut_hint():
    with sync_playwright() as p:
        # 启动浏览器
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # 清理localStorage开始全新测试
        page.context.add_init_script("() => localStorage.clear()")
        
        # 测试步骤 1: 首次访问时检查提示是否显示
        print("\n🔍 测试 1: 首次访问 - 检查提示显示")
        page.goto('http://localhost:8000/level.html?level=1')
        page.wait_for_load_state('networkidle')
        
        # 等待提示显示
        time.sleep(0.5)
        
        # 检查提示是否出现
        hint = page.locator('.floating-shortcut-hint')
        assert hint.is_visible(), "❌ 首次访问时悬浮提示未显示"
        print("✅ 测试 1 通过: 首次访问时提示正确显示")
        
        # 截图保存证据
        page.screenshot(path='/workspace/screenshot_hint_visible.png', full_page=True)
        
        # 测试步骤 2: 等待3秒后检查提示是否消失
        print("\n🔍 测试 2: 检查 3 秒后提示消失")
        time.sleep(3.5)
        
        assert not hint.is_visible(), "❌ 3秒后提示仍未消失"
        print("✅ 测试 2 通过: 3秒后提示正确消失")
        
        # 测试步骤 3: 检查 localStorage 是否已保存状态
        print("\n🔍 测试 3: 检查 localStorage 保存状态")
        local_storage_value = page.evaluate("() => localStorage.getItem('shortcutHintSeen')")
        assert local_storage_value == 'true', "❌ localStorage 未正确保存状态"
        print("✅ 测试 3 通过: localStorage 状态正确保存")
        
        # 截图保存证据
        page.screenshot(path='/workspace/screenshot_hint_gone.png', full_page=True)
        
        # 测试步骤 4: 再次访问检查提示不显示
        print("\n🔍 测试 4: 再次访问 - 检查提示不显示")
        page.goto('http://localhost:8000/level.html?level=2')
        page.wait_for_load_state('networkidle')
        
        time.sleep(0.5)
        
        hint_after_reload = page.locator('.floating-shortcut-hint')
        assert not hint_after_reload.is_visible(), "❌ 再次访问时提示错误地显示了"
        print("✅ 测试 4 通过: 再次访问时提示不显示")
        
        # 截图保存证据
        page.screenshot(path='/workspace/screenshot_hint_not_visible.png', full_page=True)
        
        # 测试步骤 5: 测试键盘导航功能
        print("\n🔍 测试 5: 键盘导航功能")
        # 清除localStorage重新开始测试
        page.evaluate("() => localStorage.removeItem('shortcutHintSeen')")
        page.goto('http://localhost:8000/level.html?level=1')
        page.wait_for_load_state('networkidle')
        
        # 等待提示消失
        time.sleep(4)
        
        # 测试键盘导航
        current_display = page.locator('#level-nav-current')
        initial_text = current_display.text_content()
        print(f"   初始关卡显示: {initial_text}")
        
        # 按右键切换到下一关
        print("   测试 → 键导航...")
        page.keyboard.press('ArrowRight')
        time.sleep(1)
        
        next_text = current_display.text_content()
        assert next_text != initial_text, "❌ 右键导航失败"
        print(f"   导航后的关卡显示: {next_text}")
        
        # 按左键切换回来
        print("   测试 ← 键导航...")
        page.keyboard.press('ArrowLeft')
        time.sleep(1)
        
        back_text = current_display.text_content()
        assert back_text == initial_text, "❌ 左键导航失败"
        print(f"   导航回的关卡显示: {back_text}")
        
        print("✅ 测试 5 通过: 键盘导航功能正常")
        
        # 最终截图
        page.screenshot(path='/workspace/screenshot_final.png', full_page=True)
        
        browser.close()
        print("\n🎉 所有测试成功通过！")

if __name__ == "__main__":
    main()
