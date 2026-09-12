# amazing-leds-300gt

面向 Conspit 300 GT 的自定义 SimHub 灯效配置项目，当前只支持 iRacing。

从本仓库的 `Conspit 300 GT Themes Pack V1.2/LEDs Profiles/` 迁入非 RPM 灯效，保留五套主题，并增加独立的 RPM 框架：Porsche 911 GT3 R（992）、BMW M4 GT3 EVO，以及其他车型的通用逻辑。`profiles/` 中的文件已按 SimHub 格式生成，实体导入与游戏同步效果仍待实测。

## 目录

```text
amazing-leds-300gt/
├── src/
│   ├── profile.json           # 公共灯效层级、设备位置、亮度与触发条件
│   ├── runtime/
│   │   ├── inherited.js       # 提取的 iRacing 非 RPM 脚本
│   │   ├── entrypoints.js     # 游戏范围检查及其他游戏的清灯输出
│   │   └── rpm.js             # 车型识别、阈值选择和顶部 12 灯渲染
│   ├── rpm/iracing/
│   │   ├── config.json        # RPM 模式、通用配色和回退参数
│   │   └── cars/              # 两辆车的身份、数据引用和灯位映射
│   ├── themes/                # 五套配色及布局差异
│   └── upstream.json         # 原配置文件、提交版本和 SHA-256
├── profiles/                 # 构建生成的五个 .ledsprofile
├── vendor/lovely-car-data/    # 固定版本的原始数据、哈希、署名和许可
├── tools/
│   ├── build.cjs             # 从 src 生成可导入配置
│   ├── rpm.cjs               # 车型数据校验及打包
│   ├── import-existing.cjs   # 从原配置重新迁移，仅迁移时使用
│   └── javascript.cjs       # 迁移用的 JavaScript 解析与裁剪
└── tests/                    # 模拟遥测、输入以及与原脚本的对照检查
```

## 当前灯效

沿用原配置的灯效优先级、动画时序和输入映射：

- 桌面待机、菜单配色、点火和发动机启动动画。
- 八个按钮的按下、长按、松开反馈，以及背部按钮反馈。
- 拇指编码器方向动画和三个前置旋钮的灯环反馈。
- 旗语、左右旁车提示、进站限速及进出维修区提示。
- ABS、TC、刹车等灯环遥测，以及顶部油门/刹车和油量模式。
- 原配置中的亮度与夜间亮度控制。

只保留原配置当前启用的主题分支。灯效仍受原有 `ConspitLEDs.*` 设置、会话状态和车辆实际可用遥测控制；例如没有有效 TC 激活信号时不会凭空生成 TC 介入提示。

硬件布局为顶部 12 灯、按钮 8 灯、旋钮灯环 36 灯，共 56 灯。按钮与灯环从物理 LED 13 开始。迁移时将旧配置部分层的 45 灯长度收敛为实际的 44 灯。

旧 RPM 容器、转速数据库和按钮/灯环红线联动已移除。新 RPM 只输出顶部 LED 1–12，使用已有会话、观战和亮度控制；启动、维修区及原有顶部提示层可覆盖它。按钮与灯环继续使用迁入的非 RPM 逻辑。

## RPM 车型与通用逻辑

默认 `src/rpm/iracing/config.json` 的 `mode` 为 `auto`：先按车型与挡位选择专用数据，未命中或缺少该挡位时使用通用逻辑。`generic` 强制所有车型走通用逻辑，`off` 关闭新 RPM 层。修改后需要重新构建、导入。

| 车型 | iRacing / SimHub CarId | 当前数据与映射 |
| --- | --- | --- |
| Porsche 911 GT3 R（992） | `porsche992rgt3` | Lovely 分挡数据；原 16 灯映射为 12 灯，两侧向内点亮 |
| BMW M4 GT3 EVO | `bmwm4gt3` | Lovely BMW M4 GT3 分挡数据，EVO 校准待完成；12 灯直接映射，位置 3、10 留黑 |
| 其他车型或未知挡位 | 不限 | 实时窗口优先，使用统一的绿→黄→红顺序 |

识别优先使用 `DataCorePlugin.CarId`，其次 `CarId`、`DataCorePlugin.GameData.NewData.CarId`。只有 ID 缺失时才匹配配置中的完整车型名称；不使用 `911`、`GT3` 等模糊关键词。因此 992 Cup、992.2 Cup 和旧款 911 GT3 R 不会误用 992 GT3 R 的数据。

iRacing 的 [2025 Season 4 更新](https://support.iracing.com/support/solutions/articles/31000177148-2025-season-4-release-notes-2025-09-08-02-)将原 M4 GT3 更新为 EVO；[官方车辆路径表](https://support.iracing.com/support/solutions/articles/31000172625-filepath-for-active-iracing-cars)仍使用 `bmwm4gt3`。这可以确认车型路由，但不能证明公开数据中的旧名称阈值已针对 EVO 校准。BMW 配置因此标为 `evo-calibration-pending`，Porsche 标为 `community-data-unverified`。

专用配置按 `R`、`N`、`1`–`6` 挡读取绝对 RPM 阈值、颜色、红线和闪烁间隔，不按 `MaxRpm` 或实时窗口重缩放。数值挡位 `-1`、`0` 分别对应 `R`、`N`。来源数组的第 0 项为红线，后续项为原车物理灯位。

Porsche 的 12 灯依次映射原车灯位 `[1,2,4,6,7,8,9,10,11,13,15,16]`；省略 3、5、12、14，保留每侧两绿、两黄、两红及被保留灯的原始阈值。硬件数量不同，因此不能复现全部 16 灯阶段。BMW 的空位在红线时也保持黑色。来源闪烁间隔为 0 时常亮；非零值暂按每个亮/灭阶段的毫秒数解释，超过阈值时从亮相开始，降转或换挡后重置。这种解释及闪烁相位需对照游戏验证。

通用逻辑每次渲染重新取值，依次选择：

1. `GameRawData.Telemetry.PlayerCarSLFirstRPM` / `LastRPM`，在两者之间均匀分布 12 个阈值。有效 `BlinkRPM` 控制红线闪烁，`ShiftRPM` 仅供诊断。
2. 若实时起止窗口无效，整组回退到 `GameRawData.SessionData.DriverInfo.DriverCarSL*`，不混用两组起止值。
3. 再回退到 SimHub 的 `CarSettings_CurrentGearRedLineRPM`、`CarSettings_RedLineRPM` 或 `MaxRpm`，默认从终点的 80% 开始。此分支明确是估算，不生成猜测的闪烁阈值。
4. 没有有效阈值或 RPM 时，顶部 RPM 层输出黑色。关闭、暂停、维修区、引擎关闭和非 RPM 模式则让出该层，继续显示原有效果。

通用插值不能保证原车逐灯同步。两辆专用车的 RPM 配色独立于主题；五套主题继续控制非 RPM 效果。`ConspitLEDs.TelemetryFunction` 未设置或为 1、2 时启用 RPM；3、4、5 保留刹车、油门/刹车和油量模式。

## 使用

1. 在 Conspit 软件中启用方向盘的 SimHub 灯光控制模式。
2. 在 SimHub 的 300 GT LED 配置中导入 `profiles/` 下的一套主题并启用。
3. 进入 iRacing 检查灯效。新配置使用独立名称和 Profile ID，可与原配置区分。

可选主题：Conspit Signature、Crimson Frost、Gulf Ignition、Lime Vector、Sun Flare。

选择其他游戏时，本配置输出全黑；未选择游戏且游戏未运行时，保留桌面灯光和输入反馈。若其他配置或软件也在控制同一组灯，需要分别选择配置进行对照。

沿用原配置的 `ConspitLEDs.*` 属性接口和 `0x3514,0x000E` 控制器输入标识。车型 JSON 随配置打包，运行时不联网，也不需要安装 DNR、Lovely 或 ATSR 插件。

## 修改与构建

需要 Node.js 18 或更高版本。在本目录执行：

```sh
npm ci
npm run build
npm test
```

修改公共效果时编辑 `src/profile.json` 和 `src/runtime/`；调整主题时编辑 `src/themes/`；RPM 模式与车型映射在 `src/rpm/iracing/`。构建过程不依赖网络，也不读取原主题包。不要直接修改 `profiles/`，重新构建会覆盖生成文件。

新增车型时，在 `cars/` 添加身份和映射配置，并将数据及来源登记到 `vendor/lovely-car-data/`。构建会校验别名冲突、数组长度、挡位阈值、颜色、映射和原始数据 SHA-256。更新阈值时同时记录新来源、哈希及校准状态；不要改写原始数据却继续沿用旧来源记录。

`inherited.js` 保留旧函数名及仍有依赖的覆盖顺序，方便与原配置对照；五套主题共用同一份脚本。主题中的 `runtime` 值对应原脚本不同阶段的配色赋值，`layoutOverrides` 则记录相对于公共布局的路径和值。

`npm run import:existing` 会从上一级的原主题包重新提取并覆盖 `src/profile.json`、`src/runtime/inherited.js`、`src/themes/` 和来源记录。它用于显式重新迁移，不是日常构建步骤；执行前应先保存这些文件中的自定义修改。

## 验证范围

本地检查涵盖配置与公式语法、生成文件一致性、游戏范围、两车各挡位的逐灯边界、闪烁、换挡/换车、无效数据回退及层级优先级，并以模拟遥测和控制器输入对比五套主题的非 RPM 脚本输出。对照测试需要同仓库中的原主题包。

尚未在 Windows SimHub 和实体 300 GT 上实测。导入后先检查原有待机、输入和状态灯，再逐挡对照游戏灯组与方向盘。特别检查 BMW EVO 的阈值、Porsche 的映射及闪烁亮灭时长。已通过的模拟测试只证明配置按所存数据执行，不能证明数据与当前游戏版本一致。

在 SimHub 的 JavaScript 公式测试器中使用 `return JSON.stringify(amazingRpmDiagnostics());` 可查看当前匹配车型、挡位、RPM、每灯阈值、红线、数据来源和校准状态。该函数不推进闪烁状态。它属于本配置的内嵌函数，不是全局 SimHub 属性。

校准时记录游戏版本、车型 ID、挡位、RPM 和同步视频，逐个核对亮灯边界，再核对红线颜色、开始 RPM 与亮灭时长。遥测窗口可以辅助核对，不能代替逐灯观察；Porsche 被省略的四颗灯不参与 12 灯映射验收。

## 来源

非 RPM 内容派生自本仓库现有 Conspit 配置，来源快照见 [src/upstream.json](src/upstream.json)。原有内容及新增渲染、构建代码沿用仓库 [MIT 许可](../LICENSE)。

车型数据来自 [Lovely Car Data](https://github.com/Lovely-Sim-Racing/lovely-car-data)，固定提交 `7cd16dd51d403f9f688e3e02f064e690e6b1a22c`。原始 JSON、逐文件 URL 和 SHA-256 保存在 [vendor/lovely-car-data/upstream.json](vendor/lovely-car-data/upstream.json)。数据及其映射改编按 CC BY-NC-SA 4.0 提供，包含这些内容的生成配置按该许可提供；MIT 代码仍保留原许可。详见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
