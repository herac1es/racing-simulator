# CONSPIT 300GT 独立整轮灯效 V2.0

主文件：`CONSPIT_300GT_Standalone_V2.0_DNR703.ledsprofile`

以你提供的 CONSPIT 官网 V1.6 Individual (ungrouped) 配置为框架，更新为 DNR 7.0.3 的内置车型转速灯数据，并将缺失的函数内嵌。它是个人独立适配，不是 DNR 或 CONSPIT 官方发布的 V2.0。

## 导入

1. 打开 SimHub → Devices → CONSPIT 300GT。
2. 进入当前使用的 **Individual / Ungrouped / Raw（整轮独立灯位）** 模式的灯效配置列表。
3. 使用 Import 导入主 `.ledsprofile` 文件，选择名称为 `CONSPIT 300GT - Standalone V2.0 - DNR 7.0.3 Data` 的新配置。
4. 用游戏或 SimHub 的配置测试数据检查 RPM、进站、旗语与旋钮显示。

此文件是整轮配置，应导入你原来使用 V1.6 的同一配置区域，**不要导入仅有 12 灯的 RPM 分区**。它采用独立 ProfileId，方便与原配置并存、随时切回。一次选择一个整轮配置，避免再叠加旧 RPM 配置。

本次只生成文件，没有替换、导入或切换你正在使用的 SimHub 配置。

## 保留和更新

完整保留所提供 V1.6 框架的三大部分及其图层优先级、原配色、亮度、默认启用/禁用选项：

- **RPM 区**：待机动画、进站限速、无效圈、限速提示、发动机启动、SimHub 音量/亮度通知、离合起步显示。
- **8 个按键灯**：原有背光/待机效果、DRS、大灯闪烁、点火/发动机状态、进站请求、雨刷、菜单、旗语、后车距离、左右来车、限速器与转向灯等原框架效果。
- **三个旋钮环灯**：原有燃油、ABS、发动机制动、Engine Map、ERS、TC/TC2、Delta、无效圈、DRS 和进站效果，以及原先可手动切换的功能组。

更新了以下部分：

- 用 DNR 7.0.3 的全部 12 灯车型树替换旧专属转速灯数据，包含 AC、AC Rally、ACC、AMS2、EA WRC、LMU、iRacing 七个游戏。保留原始车型/挡位条件、转速阈值、配色、动画及偏移，不将它们压平成统一百分比灯条。
- 保留 CONSPIT 的 F1 原始遥测位图转速灯与 SC/VSC Delta 动画，补齐所需辅助函数。SC/VSC Delta 开启且数据有效时才切换显示；缺少 Delta 时继续显示普通 F1 转速灯。
- 原本依赖 `dnr_RedlineState()` 的调用改用内嵌实现；移除对 `DNRLEDs.SCDelta` / `DNRLEDs.DRSDetectionPoint` 的依赖，提供本地设置。
- 未匹配车型时显示原 CONSPIT 通用转速图案，避免新旧专属/通用转速条同时输出。
- 旧 F1 游戏列表增加 `F12026`，沿用原字段布局；新游戏遥测兼容性仍需实际运行验证。
- 修复两处直接对空游戏名称调用 `.startsWith()` 的公式。
- 所有 JavaScript 公式使用 SimHub `JSExt=4`，即仅加载本配置内嵌函数，不依赖全局 JavascriptExtensions。此标志已从本机 SimHub 9.12.6 枚举核对。

配置中不存在 `DNRLEDs.*` 依赖，不需要 DNR 插件、账号或订阅状态。游戏遥测和原框架使用的 `DataCorePlugin`、`PersistantTrackerPlugin` 仍由 SimHub 提供。

## 灯位

这些是 **原 V1.6 文件的逻辑灯位编号**，保持不变：

| 区域 | 1 起算灯位 |
|---|---|
| 转速灯 | 1～12 |
| 8 个按键 | 13～20 |
| 左旋钮 | 21～32 |
| 中旋钮 | 33～44 |
| 右旋钮 | 45～56 |

实际物理映射由 SimHub 中的 300GT 驱动和 Individual/Ungrouped 模式决定。各效果的对应按键和旋钮功能沿用 CONSPIT 原文件；它不会自动推断你在游戏中重新绑定的按键功能。

## M4 GT3 EVO 检查示例

iRacing 的 `BMW M4 GT3 EVO` / `bmwm4gt3` 三挡：5518、5838、6159、6479 RPM 依次点亮绿/绿/黄/黄的对称灯对；6800 RPM 中央两红灯亮起，6900 RPM 全部有效灯变红，不闪烁。

12 位布局为 `绿 绿 空 黄 黄 红 红 黄 黄 空 绿 绿`，两处空位保留。其余挡位使用 DNR 原始独立阈值。

## 本地设置

在 SimHub 的配置属性中打开 Embedded JavaScript，顶部 `C300_OPTIONS` 可修改：

| 选项 | 默认 | 作用 |
|---|---|---|
| `darkMode` | false | 七个游戏的新专属转速灯树使用 TDM 配色 |
| `useCarRedline` | true | 使用内置车型红线；false 使用 SimHub 每车红线 |
| `lastGearRedline` | true | 允许最高挡红线提示 |
| `safetyCarDelta` | true | F1 SC/VSC Delta 显示 |
| `drsDetection` | true | F1 转速区 DRS 检测提示的本地开关 |
| `darkMain` | 红色 | 新专属转速灯的 TDM 主色 |
| `darkAlt` | 深橙色 | 新专属转速灯的 TDM 辅色 |

TDM 选项只影响更新的车型专属转速灯分支；原 F1、按键、旋钮与提示效果继续使用框架配色。本包没有把整轮颜色统一替换为 TDM。

构建后 `.validation/embedded-runtime.js` 是内嵌代码的可读副本，供查看。无需把它复制到 SimHub 的 JavascriptExtensions 目录；运行时以 `.ledsprofile` 内的代码为准。仓库源码修改和构建方式见 [项目 README](../README.md)。

## 验证结果与范围

- 本机 SimHub 9.12.6 的实际 `RGBDriver.Settings.Profile` 类在独立进程中反序列化并重新序列化成功，**4205 个效果容器完整保留、无 UnknownContainer**。验证时只在该进程中注册 SimHub 自带容器类型，没有修改已运行的 SimHub。
- **365 条非空 NCalc 公式**通过本机 NCalc 解析。
- **1683 条 JavaScript 公式**在 8 组模拟输入下执行；连同框架保留、M4 边界、F1 SC/DRS 和最高挡设置，共 **13522 项检查通过，0 失败**。
- 更新的车型树和红线函数还沿用前一阶段已完成的原始公式对照检查。

没有进行真实游戏、USB 硬件或实时 SimHub 渲染测试。个别效果仍取决于当前游戏是否提供相应遥测；仅通过公式解析不能证明每个游戏字段都可用。

本文件是“**CONSPIT V1.6 全部原有编排 + 更新数据与依赖补齐**”。没有声称加入未取得的新版 DNR 官方 300GT 设备配置中的全部新增效果。

DNR 7.0.3 内部 JS 红线表与 C# redlines.json 存在部分差异。本包采用与保留的原生车型公式对应的 JS 表；M4 GT3 EVO 的各挡阈值在两套表中一致。

## 回退

在 SimHub 配置列表中重新选择原 V1.6 或你原来的主题即可。本包未改写原文件，也未修改或移除任何插件。
