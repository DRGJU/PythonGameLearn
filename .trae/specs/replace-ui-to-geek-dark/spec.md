# 替换UI为极客深色风

## Why
用户对当前浅色清新风格的UI不满意，希望替换为更符合程序员审美的极客深色风格。

## What Changes
- 将整个网站的配色系统从浅色主题切换为深色主题
- 保持彩色点缀（如蓝色、紫色、绿色）作为强调色
- 优化代码编辑器在深色背景下的可读性
- 保持所有现有功能完整可用

## Impact
- Affected specs: UI风格彻底改变，从浅色转为深色
- Affected code: css/style.css（主要）、index.html、level.html（少量调整）

## ADDED Requirements

### Requirement: 深色背景系统
整个网站应使用深色背景系统

#### Scenario: 背景配色
- **WHEN** 用户打开网站
- **THEN** 看到深色背景（接近纯黑或深灰），而非浅色背景

### Requirement: 彩色强调色
保留彩色点缀作为交互元素的强调色

#### Scenario: 强调色使用
- **WHEN** 用户与按钮、链接等交互
- **THEN** 看到蓝色、紫色、绿色等鲜艳的强调色

### Requirement: 代码可读性
代码编辑器和代码展示区域在深色背景下清晰可读

#### Scenario: 代码显示
- **WHEN** 用户查看代码示例或编辑器
- **THEN** 代码在深色背景上显示，高亮颜色清晰

## MODIFIED Requirements

### Requirement: 整体配色
将现有的浅色主题配色系统替换为深色主题

**Changes:**
- 背景色：从 `#ffffff`、`#f7fafc` 改为深色（`#0d1117`、`#161b22`）
- 文字色：从深色文字改为浅色文字（`#e6edf3`、`#8b949e`）
- 卡片背景：从白色改为深灰色（`#21262d`）
- 边框色：从浅灰改为深灰（`#30363d`）
- 强调色：保持或微调蓝色（`#58a6ff`）、紫色（`#a371f7`）

## REMOVED Requirements
### Requirement: 浅色主题
原有的浅色主题配色系统
**Reason**: 用户明确表示不喜欢浅色风格
**Migration**: 完全替换，无需保留浅色版本
