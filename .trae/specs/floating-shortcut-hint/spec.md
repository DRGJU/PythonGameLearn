
# 悬浮快捷键提示 - Product Requirement Document

## Overview
- **Summary**: 将现有的固定导航栏中的快捷键提示改为优雅的悬浮提示，首次访问时在页面中下方显示，几秒后自动消失
- **Purpose**: 提供更好的用户体验，让新用户了解快捷键功能，同时不占用固定界面空间
- **Target Users**: Python学习平台的所有用户，特别是首次访问的用户

## Goals
- 将快捷键提示从固定导航栏移除
- 创建美观的悬浮提示组件
- 首次访问时自动显示，3秒后自动消失
- 使用localStorage记住用户已看过，后续访问不再显示
- 保持清新的视觉风格

## Non-Goals (Out of Scope)
- 不改变现有的键盘导航功能
- 不添加复杂的提示设置选项
- 不添加关闭按钮（自动消失即可）

## Background & Context
- 目前快捷键提示固定在关卡导航栏中显示
- 希望将这个改为更现代的悬浮提示方式
- 系统已使用浅色清新风格
- 已有localStorage存储机制

## Functional Requirements
- **FR-1**: 创建悬浮快捷键提示组件
- **FR-2**: 使用localStorage检测首次访问
- **FR-3**: 自动显示并在3秒后消失
- **FR-4**: 从导航栏移除原有的固定提示

## Non-Functional Requirements
- **NFR-1**: 提示样式与整体UI风格一致
- **NFR-2**: 动画流畅自然
- **NFR-3**: 不影响页面其他功能

## Constraints
- **Technical**: 纯HTML/CSS/JavaScript
- **Business**: 保持现有功能不变
- **Dependencies**: 无外部依赖

## Assumptions
- 用户希望了解一次快捷键即可
- localStorage可用

## Acceptance Criteria

### AC-1: 提示样式美观
- **Given**: 首次访问网站
- **When**: 页面加载完成
- **Then**: 看到一个美观的悬浮提示，与整体风格一致
- **Verification**: `human-judgment`

### AC-2: 自动显示和隐藏
- **Given**: 用户首次访问
- **When**: 页面加载后
- **Then**: 提示立即显示，3秒后优雅消失
- **Verification**: `programmatic`

### AC-3: 记住用户选择
- **Given**: 用户已经看到过提示
- **When**: 再次访问网站
- **Then**: 提示不再显示
- **Verification**: `programmatic`

### AC-4: 原有提示已移除
- **Given**: 任何时候
- **When**: 查看导航栏
- **Then**: 原有固定提示已不存在
- **Verification**: `programmatic`

## Open Questions
- [ ] 提示显示时间是否需要调整？（默认3秒）
