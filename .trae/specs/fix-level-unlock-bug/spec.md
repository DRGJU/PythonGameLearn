# 修复关卡解锁Bug - Product Requirement Document

## Overview
- **Summary**: 修复Python游戏化学习平台中的关卡进度和解锁逻辑bug
- **Purpose**: 确保玩家必须完成前一关才能解锁下一关，并且进度条准确反映真实的完成情况
- **Target Users**: 使用该平台学习Python的用户

## Goals
- 修复初始完成关卡列表错误，默认没有已完成的关卡
- 修正关卡解锁逻辑，确保只有完成前一关后才能解锁下一关
- 确保进度条准确反映已完成的关卡比例
- 保持第一关始终可访问

## Non-Goals (Out of Scope)
- 不改变关卡验证逻辑
- 不改变UI设计风格
- 不新增功能特性

## Background & Context
- 当前代码在初始化时将 `completedLevels` 设置为 `[1]`，导致第一关默认被标记为完成
- 关卡解锁逻辑有缺陷，使得第二关在第一关未完成时就可以访问
- 进度条计算基于 `completedLevels` 数组长度，导致初始进度显示10%

## Functional Requirements
- **FR-1**: 初始状态时没有已完成的关卡，进度为0%
- **FR-2**: 只有第一关默认可用，其他关卡都处于锁定状态
- **FR-3**: 完成当前关卡后，自动解锁下一关
- **FR-4**: 进度条准确显示已完成关卡的百分比

## Non-Functional Requirements
- **NFR-1**: 所有现有功能保持正常工作
- **NFR-2**: 代码改动最小化，仅修复相关逻辑

## Constraints
- **Technical**: 保持现有代码结构，仅修改bug相关部分
- **Business**: 修复后不影响用户已有的使用体验
- **Dependencies**: 依赖现有的 levels.json 数据结构

## Assumptions
- 关卡按照ID顺序排列（1, 2, 3, ..., 10）
- 用户应该从第一关开始学习

## Acceptance Criteria

### AC-1: 初始状态正确
- **Given**: 用户首次访问页面
- **When**: 页面加载完成
- **Then**: 进度条显示0%，只有第一关可用，其他关卡锁定
- **Verification**: `programmatic`

### AC-2: 关卡解锁逻辑正确
- **Given**: 用户在关卡N
- **When**: 用户完成关卡N
- **Then**: 只有关卡N+1被解锁，其他后续关卡保持锁定
- **Verification**: `programmatic`

### AC-3: 进度条准确
- **Given**: 用户完成了K个关卡
- **When**: 查看进度条
- **Then**: 进度条显示 (K/10)*100%
- **Verification**: `programmatic`

### AC-4: 第一关始终可访问
- **Given**: 用户在任何状态
- **When**: 点击第一关按钮
- **Then**: 第一关内容正常显示
- **Verification**: `programmatic`

## Open Questions
- 无
