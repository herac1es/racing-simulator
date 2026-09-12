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
│   │   └── rpm.js             # 车型/挡位路由、会话检查、基线诊断和通用 RPM 渲染
│   ├── rpm/iracing/
│   │   ├── config.json        # RPM 模式、通用配色和回退参数
│   │   ├── overrides.json     # 按车型、挡位覆盖实际 12 灯参数；默认空
│   │   ├── official/          # 官方手册转录的基线、出处和适用范围
│   │   └── cars/              # 两辆车的身份、数据引用和灯位映射
│   ├── themes/                # 五套配色及布局差异
│   └── upstream.json         # 原配置文件、提交版本和 SHA-256
├── profiles/                 # 构建生成的五个 .ledsprofile
├── vendor/lovely-car-data/    # 固定版本的原始数据、哈希、署名和许可
├── tools/
│   ├── build.cjs             # 从 src 生成可导入配置
│   ├── rpm-ui.cjs            # 生成可在 SimHub UI 调参的分挡 RPM/红线节点
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

## RPM 默认原则

**未明确指定例外时，点亮方向、颜色和触发时机以游戏内实际转速灯为准。** 必须结合 iRacing 官方车辆手册、SDK/遥测和更新说明核对，再使用 Lovely 等补充数据，不能只凭社区数组推断方向和阶段。保留原车空间顺序、分挡阈值和红线/闪烁行为，不因主题、硬件灯数或刷新延迟自行调整时机。旧手册和社区数据的版本限制需明确记录；这是一条设计和验收原则，不代表未测试的车型已完全同步。详细出处见 [官方依据](docs/iracing-rpm-evidence.md)。

10 个有效原车灯位扩展为 12 灯时，统一采用 **前八颗各对应一颗，最后点亮的两颗各对应两颗**。两个双灯组分别继承对应原车灯的阈值、颜色和状态，不增加亮灯阶段。“最后”指点亮顺序，不固定指物理右端：两侧向内点亮时，对应中央四颗；单向点亮时，对应行进方向末端四颗。若原车末两颗的触发时机不同，两个双灯组仍分别按各自时机点亮。

这条扩展规则不适用于 16→12 等其他灯数转换。Porsche 继续使用下文已记录的映射，省略阶段的限制仍然存在；未知车型的通用回退也继续明确标为近似。后续开发约束见 [AGENTS.md](AGENTS.md)。

## RPM 车型与通用逻辑

默认 `src/rpm/iracing/config.json` 的 `mode` 为 `auto`：先按车型与挡位选择专用数据，未命中或缺少该挡位时使用通用逻辑。`generic` 强制所有车型走通用逻辑，`off` 关闭新 RPM 层。修改后需要重新构建、导入。

| 车型 | iRacing / SimHub CarId | 当前数据与映射 |
| --- | --- | --- |
| Porsche 911 GT3 R（992） | `porsche992rgt3` | Lovely 分挡数据；原 16 灯映射为 12 灯，两侧向内点亮 |
| BMW M4 GT3 EVO | `bmwm4gt3` | Lovely 分挡阈值恢复；五阶段临时排列为左到右，末两灯各扩为两灯；EVO 布局、配色和时机待验证 |
| 其他车型或未知挡位 | 不限 | 实时窗口优先，使用统一的绿→黄→红顺序 |

识别优先使用 `DataCorePlugin.CarId`，其次 `CarId`、`DataCorePlugin.GameData.NewData.CarId`。只有 ID 缺失时才匹配配置中的完整车型名称；不使用 `911`、`GT3` 等模糊关键词。因此 992 Cup、992.2 Cup 和旧款 911 GT3 R 不会误用 992 GT3 R 的数据。

iRacing 的 [2025 Season 4 更新](https://support.iracing.com/support/solutions/articles/31000177148-2025-season-4-release-notes-2025-09-08-02-)将原 M4 GT3 更新为 EVO，并新增 FIA 齿比选项；[官方车辆路径表](https://support.iracing.com/support/solutions/articles/31000172625-filepath-for-active-iracing-cars)仍使用 `bmwm4gt3`。同一 ID 不代表灯效数据跨版本一致。官方目录目前仍链接 2024 年 V3 旧手册；用户指出单表不符后，已撤回该表的运行使用。BMW 标为 `community-timing-left-to-right-evo-unverified`；Porsche 的分挡数值仍标为 `community-data-unverified`。

两车专用配置均按 Lovely 的 `R`、`N`、`1`–`6` 挡读取绝对 RPM 阈值、颜色、红线和闪烁间隔，不按 `MaxRpm` 或实时窗口重缩放。数值挡位 `-1`、`0` 分别对应 `R`、`N`。来源数组第 0 项为红线，后续项为来源灯位；社区灯位布局不自动等于当前游戏物理布局。

Porsche 的 12 灯依次映射原车灯位 `[1,2,4,6,7,8,9,10,11,13,15,16]`；省略 3、5、12、14，保留每侧两绿、两黄、两红及被保留灯的原始阈值。官方 V2 手册第 11 页支持“两侧向内、到换挡点全蓝闪烁”，但没有公布 Lovely 中的逐灯 RPM 或 250 ms 时长。硬件数量不同，因此不能复现全部 16 灯阶段。

BMW 恢复用户此前反馈节奏较吻合的 Lovely 分挡数据，采用临时左到右适配：十个有效来源灯位按 `[1,12,2,11,4,9,5,8,6,7]` 排列，扩展为 `[1,12,2,11,4,9,5,8,6,6,7,7]`。阈值和颜色不改，亮灯数依次为 2、4、6、8、12（四绿、四黄、四红）；来源 6、7 在当前表中同时点亮，各自对应右端一对灯珠。这只保留来源的五阶段，不代表已测得 EVO 的原车十灯表。例如 3 挡为 5520、5840、6160、6480、6800，6900 全红；其他挡位用各自的值。左到右由用户确认；具体布局、颜色、各阶段和齿比选项的影响仍需游戏对照。禁止把旧手册十阶段单表重新用作 EVO 默认值。

来源闪烁间隔为 0 时常亮；非零值暂按每个亮/灭阶段的毫秒数解释。专用车型在原生 Animation 节点中使用一帧常亮或“亮、黑”两帧闪烁；播放和重新触发由 SimHub 负责，其实际相位需导入后验证。通用脚本闪烁在超过阈值时从亮相开始，降转或换挡后重置。

通用逻辑每次渲染重新取值，依次选择：

1. `GameRawData.Telemetry.PlayerCarSLFirstRPM` / `LastRPM`，在两者之间均匀分布 12 个阈值。有效 `BlinkRPM` 控制红线闪烁，`ShiftRPM` 仅供诊断。
2. 若实时起止窗口无效，整组回退到 `GameRawData.SessionData.DriverInfo.DriverCarSL*`，不混用两组起止值。
3. 再回退到 SimHub 的 `CarSettings_CurrentGearRedLineRPM`、`CarSettings_RedLineRPM` 或 `MaxRpm`，默认从终点的 80% 开始。此分支明确是估算，不生成猜测的闪烁阈值。
4. 没有有效阈值或 RPM 时，顶部 RPM 层输出黑色。关闭、暂停、维修区、引擎关闭和非 RPM 模式则让出该层，继续显示原有效果。

通用插值不能保证原车逐灯同步。两辆专用车的 RPM 配色独立于主题；五套主题继续控制非 RPM 效果。`ConspitLEDs.TelemetryFunction` 未设置或为 1、2 时启用 RPM；3、4、5 保留刹车、油门/刹车和油量模式。

## 使用

1. 在 Conspit 软件中启用方向盘的 SimHub 灯光控制模式。
2. 在 SimHub 的 300 GT LED 配置中重新导入 `profiles/` 下的一套主题，并选中名称以 **`RPM UI v2`** 结尾的新版，例如 `amazing-leds-300gt - Sun Flare - iRacing - RPM UI v2`。
3. 打开该配置的 LED 编辑器，最外层第二行应为 **`amazing-leds-300gt - iRacing RPM`**。进入 iRacing 检查灯效。

本版名称和 Profile ID 与旧版不同，重新构建使用稳定的新 ID。旧版不会因仓库文件更新而自动刷新；若编辑器仍只有 `iRacing and desktop lighting` 与 `Clear unsupported games` 两行，或名称没有 `RPM UI v2`，请重新导入并选中新版。旧版已做过 UI 调参时先导出留存。

可选主题：Conspit Signature、Crimson Frost、Gulf Ignition、Lime Vector、Sun Flare。

选择其他游戏时，本配置输出全黑；未选择游戏且游戏未运行时，保留桌面灯光和输入反馈。若其他配置或软件也在控制同一组灯，需要分别选择配置进行对照。

沿用原配置的 `ConspitLEDs.*` 属性接口和 `0x3514,0x000E` 控制器输入标识。车型 JSON 随配置打包，运行时不联网，也不需要安装 DNR、Lovely 或 ATSR 插件。

## 优先在 SimHub LED 编辑器中调参

BMW 和 Porsche 使用原生 `RPM Segments` 与 `Animation` 节点，按车型、挡位展开。导入本版配置后，打开 LED 编辑器，依次展开：

```text
amazing-leds-300gt - Idle and base lighting
amazing-leds-300gt - iRacing RPM              ← 最外层第二行
└── Live session - expand for RPM
    └── Spectating - retain original condition
        └── Brightness - expand for car and gear
            ├── RPM background - keep black
            ├── BMW M4 GT3 EVO
            │   ├── Gear R / Gear N / Gear 1 / Gear 2 / …
            │   └── Gear 3
            │       ├── Progressive RPM - edit thresholds and colors
            │       └── Redline - edit trigger RPM here
            │           └── Redline color and timing - one frame is steady
            ├── Porsche 911 GT3 R (992)
            │   └── Gear R / Gear N / Gear 1 / … / Gear 6
            └── Generic RPM - live telemetry fallback
amazing-leds-300gt - Alerts, startup and wheel lighting
amazing-leds-300gt - Clear unsupported games
```

日常调整可以直接在 UI 保存，无需修改 Embedded JavaScript 或运行构建：

1. **逐灯阈值与配色**：选择对应挡位的 `Progressive RPM` 节点，在原生分段列表里修改 RPM、颜色和灯数量。初始 12 行按物理灯 1–12 排列，每行 1 灯；保持总数为 12、起点为 LED 1、绝对 RPM 模式，并关闭该节点自带的闪烁。Porsche 对称灯位（1/12、2/11 等）应一起调；BMW 的 9/10 和 11/12 分别是两个需保持同值的双灯组。
2. **红线触发转速**：选择该挡的 `Redline - edit trigger RPM here` 条件组，打开条件公式编辑器，只改数字即可。例如 BMW 3 挡的 Lovely 基线为 `return amazingRpmCurrent() >= 6900;`。要关闭该挡红线覆盖，可改为 `return false;`。这里仍是 UI 中的公式字段，不是独立数字输入框。
3. **红线颜色、常亮和闪烁**：选择红线组内的 `Animation` 节点编辑灯格和帧时长。BMW 默认为一帧全红常亮；Porsche 为蓝色、黑色两帧，各 250 ms。黑帧要保持不透明黑色，透明会露出底下的渐进灯。若调整了灯位布局，红线动画也要同步调整。

`RPM background` 负责遮住底层待机颜色，保持黑色即可。会话、维修区、启动、观战和亮度控制继续沿用原来的条件。其他车型和未知挡位仍使用 `Generic RPM` 脚本，按实时遥测动态计算阈值；该部分没有固定逐灯 RPM 表。

**保存与后续同步**：UI 调整只保存到当前 SimHub 配置，不会自动修改仓库，也不会自动同步到另外四套主题。调好后从 SimHub 导出 `.ledsprofile` 留存；需要同步回仓库时，将导出文件作为校准依据更新对应源码、重新生成五套配置。再次导入构建产物前先保留自己的导出版本，以免覆盖 UI 调整。当前没有自动回读 UI 修改的工具。

## 修改与构建

需要 Node.js 18 或更高版本。在本目录执行：

```sh
npm ci
npm run build
npm test
```

修改公共效果时编辑 `src/profile.json` 和 `src/runtime/`；调整主题时编辑 `src/themes/`；RPM 模式与车型映射在 `src/rpm/iracing/`。构建过程不依赖网络，也不读取原主题包。不要直接修改 `profiles/`，重新构建会覆盖生成文件。

新增车型时，在 `cars/` 添加身份和映射配置。Lovely 数据及来源登记到 `vendor/lovely-car-data/`；官方单表基线登记到 `src/rpm/iracing/official/`，并设置 `dataSource: "iracing-manual"`。构建校验别名冲突、数组长度、挡位阈值、颜色、映射、官方出处及活动 Lovely 数据的 SHA-256。更新阈值时同时记录新来源、哈希及校准状态；不要改写原始数据却继续沿用旧来源记录。

### BMW / Porsche 源码校准入口（同步和构建时使用）

`src/rpm/iracing/overrides.json` 默认为 `{ "cars": {} }`，不改变当前两车数据。实测后可按配置 ID（`bmw-m4-gt3-evo` 或 `porsche-911-gt3-r-992`）覆盖指定挡位。`auto` 模式下依次使用该挡自定义值、该挡原始车型数据、通用回退；`generic` 和 `off` 不启用自定义值。

例如下面仅演示配置格式，**数值为虚构示例，不能作为 EVO 校准结果直接使用**：

```json
{
  "cars": {
    "bmw-m4-gt3-evo": {
      "calibrationStatus": "local-unverified",
      "notes": "格式示例；实测后改为游戏版本、日期和观察记录",
      "gears": {
        "3": {
          "thresholds": [5000, 5200, 0, 5400, 5600, 5800, 5800, 5600, 5400, 0, 5200, 5000],
          "redline": 6000,
          "blinkIntervalMs": 0
        }
      }
    }
  }
}
```

- `thresholds` 必须是物理 LED 1–12 的 12 个非负 RPM，0 表示该灯关闭；Porsche 同样直接填写 12 灯，无需填写原车 16 灯数组。
- `redline` 必填，正数表示全条红线提示的起点，不能小于任一亮灯阈值；`null` 表示不覆盖渐进灯条。
- 可选 `colors` 为 12 个 `#AARRGGBB` 颜色；可选 `redlineColor` 为红线提示色；可选 `blinkIntervalMs` 为每个亮/灭阶段的毫秒数，0 常亮。省略时沿用该车原始映射配色和闪烁间隔。透明色和零阈值灯位在红线阶段也保持黑色。
- `calibrationStatus` 与 `notes` 必填，记录可信程度和依据。构建拒绝未知车型、拼错字段、无效挡位、长度及数值错误。删除该挡条目即可恢复原数据，删除所有挡位时也要删除该车型条目。

修改源码后执行 `npm run check` 并重新导入；这些值会填入原生 UI 节点。诊断的 `source: "car-override"` 表示构建基线包含自定义值，`notes` 和 `calibrationStatus` 给出本地记录，`revision` 仍指原始数据版本。原始 vendor 文件和哈希保持不变；分享派生配置时保留来源和许可说明。

本项目通过 `.gitattributes` 固定源码与生成文件为 LF，并保留 vendor 原始字节，避免 Windows 的 `core.autocrlf` 改变 SHA-256 校验结果。若旧工作区报 `source hash mismatch`，先检查对应 vendor 文件是否有本地编辑或换行转换，不要通过修改登记哈希来绕过校验。

`inherited.js` 保留旧函数名及仍有依赖的覆盖顺序，方便与原配置对照；五套主题共用同一份脚本。主题中的 `runtime` 值对应原脚本不同阶段的配色赋值，`layoutOverrides` 则记录相对于公共布局的路径和值。

`npm run import:existing` 会从上一级的原主题包重新提取并覆盖 `src/profile.json`、`src/runtime/inherited.js`、`src/themes/` 和来源记录。它用于显式重新迁移，不是日常构建步骤；执行前应先保存这些文件中的自定义修改。

## 验证范围

本地检查涵盖配置与公式语法、生成文件一致性、游戏范围、两车各挡位的逐灯边界、闪烁、换挡/换车、无效数据回退及层级优先级，并以模拟遥测和控制器输入对比五套主题的非 RPM 脚本输出。原生节点测试检查序列化参数、路由、逐灯/红线边界，以及修改 UI 参数后不被脚本基线覆盖；它不运行 SimHub 本体的原生动画调度器。对照测试需要同仓库中的原主题包。

用户最初反馈 BMW 节奏看起来吻合，随后明确指出游戏为左到右，并指出旧手册数据不符。当前撤回旧手册单表、恢复 Lovely 分挡时机并保留左到右临时排列；初步感受不能替代逐项验证。优先记录当前 EVO 游戏版本、所选齿比、挡位、RPM 和灯组视频，针对有偏差的阶段校准，不要求从零测全部阈值。已通过的模拟测试只证明配置按所存数据执行，不能证明数据与当前游戏版本一致。

在本配置的 JavaScript 公式测试器中使用 `return JSON.stringify(amazingRpmDiagnostics());` 可查看当前匹配车型、挡位、RPM、构建基线中的每灯阈值、红线、来源和校准状态。专用车型返回 `renderer: "native-ui"`、`nativeUiEditsIncluded: false`：诊断不能读取后来在 UI 中修改的节点值，实际参数以该挡的原生节点为准。该函数不推进闪烁状态，属于本配置的内嵌函数，不是全局 SimHub 属性。

校准时记录游戏版本、车型 ID、挡位、RPM 和同步视频，逐个核对亮灯边界，再核对红线颜色、开始 RPM 与亮灭时长。遥测窗口可以辅助核对，不能代替逐灯观察；Porsche 被省略的四颗灯不参与 12 灯映射验收。

## 来源

非 RPM 内容派生自本仓库现有 Conspit 配置，来源快照见 [src/upstream.json](src/upstream.json)。原有内容及新增渲染、构建代码沿用仓库 [MIT 许可](../LICENSE)。

BMW 和 Porsche 的活动分挡数据来自 [Lovely Car Data](https://github.com/Lovely-Sim-Racing/lovely-car-data)，固定提交 `7cd16dd51d403f9f688e3e02f064e690e6b1a22c`。两个 Lovely 原始 JSON、URL 和 SHA-256 保存在 [vendor/lovely-car-data/upstream.json](vendor/lovely-car-data/upstream.json)。旧 BMW 手册转录仅保留为历史对照，不作为活动数据；出处和版本限制见 [官方依据](docs/iracing-rpm-evidence.md)。Lovely 数据及其映射改编、包含它们的生成配置按 CC BY-NC-SA 4.0 提供；MIT 代码仍保留原许可。官方 PDF/图片不随项目分发或重新授权。详见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
