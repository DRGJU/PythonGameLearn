# 关卡和题目分离显示 - Product Requirement Document

## Overview
- **Summary**: 优化Python游戏化学习平台的关卡显示，将关卡列表和题目内容分离，点击关卡时跳转到独立的题目页面，提供更好的用户体验和清晰的页面结构
- **Purpose**: 解决当前页面关卡和题目混在一起显示导致内容过于拥挤的问题，让用户可以更专注于学习，提供清晰的页面导航
- **Target Users**: Python学习者，从初学者到进阶开发者

## Goals
- [Primary goal 1] 创建独立的关卡列表页面，专注于关卡选择和进度展示
- [Primary goal 2] 创建独立的题目页面，专注于学习内容和答题交互
- [Primary goal 3] 实现页面间的平滑跳转和导航
- [Primary goal 4] 保持所有现有的答题功能和关卡数据

## Non-Goals (Out of Scope)
- 不会重新设计关卡数据结构
- 不会添加新的答题模式
- 不会重新设计UI主题或颜色方案
- 不会修改关卡内容或数据
- 不会添加新的关卡数量

## Background & Context
- 现有的平台将关卡列表和题目内容都放在同一个页面上，导致页面过长、内容拥挤
- 页面切换通过CSS类控制显示/隐藏，缺乏真正的页面分离感
- 用户希望有更清晰的导航流程：首页 → 关卡选择 → 题目页面 → 返回首页
- 保持现有的所有功能：五种答题模式、进度保存、提示系统等

## Functional Requirements
- **FR-1**: 创建独立的关卡列表页面(index.html)，专注于关卡选择和进度展示
- **FR-2**: 创建独立的题目页面(level.html)，接收关卡ID参数显示对应内容
- **FR-3**: 实现页面间的导航：关卡按钮点击跳转到对应题目页面
- **FR-4**: 在题目页面添加返回关卡列表的导航按钮
- **FR-5**: 保持所有现有的答题功能和数据加载功能
- **FR-6**: 保持进度保存和解锁系统功能完整

## Non-Functional Requirements
- **NFR-1**: 页面加载速度应保持在当前水平，不因架构变化而降低
- **NFR-2**: 保持响应式设计，在移动端和桌面端都有良好表现
- **NFR-3**: 保持页面间跳转的平滑过渡
- **NFR-4**: 保持代码的可维护性和可扩展性

## Constraints
- **Technical**: 使用原生JavaScript、HTML和CSS，不引入新的框架
- **Business**: 保持所有现有功能完整，不改变用户已熟悉的交互方式
- **Dependencies**: 依赖现有的levels.json数据结构

## Assumptions
- 假设用户会使用现代浏览器，支持URLSearchParams API
- 假设localStorage可以正常工作用于进度保存
- 假设关卡数据结构保持不变
- 假设用户希望保持现有的五种答题模式

## Acceptance Criteria

### AC-1: 关卡列表页面功能
- **Given**: 用户访问网站首页
- **When**: 页面加载完成
- **Then**: 显示完整的阶段导航、关卡选择器、进度统计，不显示题目内容
- **Verification**: `programmatic`
- **Notes**: 验证首页只包含关卡选择相关内容

### AC-2: 题目页面加载功能
- **Given**: 用户点击某个关卡按钮
- **When**: 页面跳转到level.html并携带关卡ID参数
- **Then**: 显示对应关卡的完整教学内容和答题区域
- **Verification**: `programmatic`
- **Notes**: 验证URL参数正确解析并加载对应关卡

### AC-3: 页面导航功能
- **Given**: 用户在题目页面
- **When**: 点击返回按钮或完成关卡
- **Then**: 正确跳转到关卡列表页面，保持进度状态
- **Verification**: `programmatic`
- **Notes**: 验证跳转后进度正确保存和显示

### AC-4: 答题功能完整性
- **Given**: 用户在题目页面
- **When**: 使用任何一种答题模式提交答案
- **Then**: 验证逻辑正常工作，进度正常更新
- **Verification**: `programmatic`
- **Notes**: 验证所有五种答题模式都正常工作

### AC-5: 解锁系统保持正常
- **Given**: 用户完成一个关卡
- **When**: 返回关卡列表页面
- **Then**: 下一个关卡应该已解锁，进度正确更新
- **Verification**: `programmatic`
- **Notes**: 验证解锁和进度系统在页面分离后仍正常工作

## Open Questions
- [ ] 是否需要添加页面过渡动画效果？
- [ ] 是否需要在题目页面显示上一关/下一关的快速导航？
- [ ] 是否需要面包屑导航？
