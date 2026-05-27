# 自动跳转下一关 - 产品需求文档

## Overview
- **Summary**: 修改通关后的行为，移除庆祝弹窗，改为显示短暂提示后自动跳转到下一关
- **Purpose**: 提供更流畅的连续学习体验，减少用户操作
- **Target Users**: 所有使用该平台学习 Python 的用户

## Goals
- 通关后自动跳转到下一关
- 提供短暂的成功提示反馈
- 保持进度保存功能
- 在最后一关或没有下一关时提供适当的处理

## Non-Goals (Out of Scope)
- 不添加新的关卡数据
- 不修改关卡解锁逻辑
- 不改变答题验证逻辑

## Background & Context
当前实现：通关后显示带有"继续练习"和"返回首页"按钮的庆祝弹窗
新需求：通关后直接自动跳到下一关，提供更流畅的学习体验

## Functional Requirements
- **FR-1**: 通关后不显示原有的庆祝弹窗
- **FR-2**: 显示短暂的成功提示（1-2秒）
- **FR-3**: 自动跳转到下一个已解锁关卡
- **FR-4**: 如果是最后一关或没有下一关，显示适当提示后返回首页

## Non-Functional Requirements
- **NFR-1**: 跳转动画流畅自然
- **NFR-2**: 提示信息清晰可见
- **NFR-3**: 保持现有进度保存功能

## Constraints
- **Technical**: 纯前端实现，使用原生 JavaScript、HTML 和 CSS
- **Dependencies**: 依赖 localStorage 进行进度存储

## Assumptions
- 用户希望连续学习的流畅体验
- 短暂的提示时间（1-2秒）足够用户获得反馈
- 如果是最后一关，用户可能想返回首页

## Acceptance Criteria

### AC-1: 自动跳转下一关
- **Given**: 用户完成关卡且有下一个已解锁关卡
- **When**: 用户提交正确答案
- **Then**: 显示成功提示，1-2秒后自动跳转到下一关
- **Verification**: `human-judgment`

### AC-2: 最后一关处理
- **Given**: 用户完成最后一关或没有下一关
- **When**: 用户提交正确答案
- **Then**: 显示完成提示，1-2秒后返回首页
- **Verification**: `human-judgment`

### AC-3: 进度保存
- **Given**: 用户完成关卡
- **When**: 成功通关
- **Then**: 进度保存到 localStorage
- **Verification**: `programmatic`

### AC-4: 所有答题模式兼容
- **Given**: 用户使用任意答题模式
- **When**: 成功通关
- **Then**: 自动跳转逻辑正常工作
- **Verification**: `human-judgment`

## Open Questions
- [x] 提示显示时间？推荐 1.5 秒
