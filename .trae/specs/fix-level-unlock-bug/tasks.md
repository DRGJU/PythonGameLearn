# 修复关卡解锁Bug - The Implementation Plan (Decomposed and Prioritized Task List)

## [x] Task 1: 修复初始完成关卡列表
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 将 `completedLevels` 数组从默认的 `[1]` 改为空数组 `[]`
  - 确保第一关仍然可以访问（即使没有在已完成列表中）
- **Acceptance Criteria Addressed**: [AC-1]
- **Test Requirements**:
  - `programmatic` TR-1.1: 初始化时 `completedLevels` 为空数组
  - `programmatic` TR-1.2: 第一关按钮仍然是可点击的（非锁定状态）
  - `programmatic` TR-1.3: 进度条显示0%
- **Notes**: 注意需要修改关卡锁定判断逻辑，第一关应该始终可用

## [x] Task 2: 修正关卡锁定/解锁逻辑
- **Priority**: P0
- **Depends On**: [Task 1]
- **Description**: 
  - 修改关卡锁定逻辑：只有已完成的关卡和下一关（如果存在）才是解锁的
  - 修改关卡选择逻辑：确保只能访问已完成的关卡和当前解锁的下一关
- **Acceptance Criteria Addressed**: [AC-2, AC-4]
- **Test Requirements**:
  - `programmatic` TR-2.1: 初始状态只有第1关解锁，其他都锁定
  - `programmatic` TR-2.2: 完成第1关后，第2关解锁，第3-10关保持锁定
  - `programmatic` TR-2.3: 完成第5关后，第6关解锁，其他保持原状态
  - `programmatic` TR-2.4: 第1关始终可访问
- **Notes**: 需要修改 `generateLevelButtons` 和 `initLevelSelector` 中的逻辑

## [x] Task 3: 验证进度条计算保持准确
- **Priority**: P0
- **Depends On**: [Task 1]
- **Description**: 
  - 确认进度条计算逻辑正确（已完成关卡数/总关卡数）
  - 测试在完成不同数量关卡时的进度显示
- **Acceptance Criteria Addressed**: [AC-3]
- **Test Requirements**:
  - `programmatic` TR-3.1: 0个关卡完成 → 0%
  - `programmatic` TR-3.2: 1个关卡完成 → 10%
  - `programmatic` TR-3.3: 5个关卡完成 → 50%
  - `programmatic` TR-3.4: 10个关卡完成 → 100%
- **Notes**: 现有的 `updateProgress` 函数逻辑应该是正确的，主要是确保数据源正确

## [x] Task 4: 完整功能测试
- **Priority**: P0
- **Depends On**: [Task 2, Task 3]
- **Description**: 
  - 测试完整的关卡流程，从第1关开始，逐个完成，验证每一关的解锁和进度
  - 确保所有功能正常工作
- **Acceptance Criteria Addressed**: [AC-1, AC-2, AC-3, AC-4]
- **Test Requirements**:
  - `programmatic` TR-4.1: 完成全部10关的流程测试
  - `human-judgement` TR-4.2: UI交互流畅，没有视觉异常
- **Notes**: 需要手动测试完整流程
