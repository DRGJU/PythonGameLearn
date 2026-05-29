# 关卡和题目分离显示 - The Implementation Plan (Decomposed and Prioritized Task List)

## [x] Task 1: 创建关卡列表页面(index.html)
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修改现有的index.html，移除题目内容区域
  - 保留并优化关卡选择和进度展示功能
  - 确保页面只专注于关卡选择
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic` TR-1.1: 验证index.html中不再包含level-content-wrapper区域
  - `programmatic` TR-1.2: 验证阶段导航和关卡选择器正常显示
  - `human-judgement` TR-1.3: 页面布局清晰，只展示关卡选择相关内容
- **Notes**: 保持现有的视觉设计风格

## [x] Task 2: 创建题目页面(level.html)
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 创建新的level.html页面
  - 包含完整的题目显示和答题区域
  - 添加返回按钮导航回首页
  - 支持从URL参数获取关卡ID
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic` TR-2.1: 验证level.html可以创建并正确显示
  - `programmatic` TR-2.2: 验证URL参数解析功能正常
  - `human-judgement` TR-2.3: 验证返回按钮和页面布局合理
- **Notes**: 复用现有的HTML结构和样式

## [x] Task 3: 重构游戏逻辑为独立模块
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **Description**: 
  - 重构game.js，将公共功能抽取为可共享的模块
  - 创建关卡列表页面专用逻辑(index.js)
  - 创建题目页面专用逻辑(level.js)
  - 保持数据加载和进度保存的通用性
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-5
- **Test Requirements**:
  - `programmatic` TR-3.1: 验证公共功能正确抽取
  - `programmatic` TR-3.2: 验证两个页面都能正常加载数据
  - `programmatic` TR-3.3: 验证进度保存功能在两个页面都正常
- **Notes**: 确保代码可维护性

## [x] Task 4: 实现页面导航功能
- **Priority**: P0
- **Depends On**: Task 3
- **Description**: 
  - 修改关卡按钮点击行为，跳转到level.html
  - 在题目页面实现返回首页功能
  - 实现完成关卡后自动返回首页的功能
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic` TR-4.1: 验证点击关卡按钮正确跳转到对应题目页面
  - `programmatic` TR-4.2: 验证返回按钮正常工作
  - `programmatic` TR-4.3: 验证完成关卡后返回功能正常
- **Notes**: 使用URL参数传递关卡ID

## [x] Task 5: 保持答题功能完整
- **Priority**: P0
- **Depends On**: Task 4
- **Description**: 
  - 确保五种答题模式在题目页面都正常工作
  - 保持提示系统和验证逻辑完整
  - 确保提交功能和反馈显示正常
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic` TR-5.1: 验证自由代码模式正常工作
  - `programmatic` TR-5.2: 验证拖放编程模式正常工作
  - `programmatic` TR-5.3: 验证选择题模式正常工作
  - `programmatic` TR-5.4: 验证代码填空模式正常工作
  - `programmatic` TR-5.5: 验证智能引导模式正常工作
- **Notes**: 全面测试所有答题模式

## [x] Task 6: 更新和补充CSS样式
- **Priority**: P1
- **Depends On**: Task 1, Task 2
- **Description**: 
  - 更新CSS以适应新的页面结构
  - 为两个页面添加适当的样式
  - 确保响应式设计在两个页面都正常工作
- **Acceptance Criteria Addressed**: AC-1, AC-2
- **Test Requirements**:
  - `programmatic` TR-6.1: 验证两个页面的样式正常显示
  - `human-judgement` TR-6.2: 验证在不同屏幕尺寸下的表现
  - `human-judgement` TR-6.3: 验证视觉设计的一致性
- **Notes**: 保持现有的视觉风格

## [x] Task 7: 集成测试和验证
- **Priority**: P0
- **Depends On**: Task 5, Task 6
- **Description**: 
  - 完整测试整个流程：首页 → 关卡选择 → 答题 → 返回首页
  - 测试进度保存和解锁系统
  - 测试所有边界情况
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5
- **Test Requirements**:
  - `programmatic` TR-7.1: 验证完整的用户流程正常工作
  - `programmatic` TR-7.2: 验证进度保存和解锁正确
  - `programmatic` TR-7.3: 验证多个关卡连续完成流程
  - `human-judgement` TR-7.4: 整体用户体验评估
- **Notes**: 进行全面的集成测试

## [x] Task 8: 清理和优化
- **Priority**: P2
- **Depends On**: Task 7
- **Description**: 
  - 清理不需要的测试文件
  - 优化代码结构和注释
  - 确保文件组织清晰
- **Acceptance Criteria Addressed**: None
- **Test Requirements**:
  - `programmatic` TR-8.1: 验证测试文件已清理
  - `human-judgement` TR-8.2: 验证代码结构的清晰度
- **Notes**: 保持项目整洁
