# CONSPIT 300GT DNR-based standalone configuration

从会话 [评估 DNR 模型器插件逆向](codex://threads/01a0962d-08a7-7390-af58-e108062985c5)
整合的独立项目：CONSPIT V1.6 整轮框架 + DNR 7.0.3 车型数据与内嵌函数。
运行时无需 DNR 插件。本次整合保留来源会话的效果，尚未验证实体方向盘或当前游戏同步。

## 导入

整轮配置：[CONSPIT_300GT_Standalone_V2.0_DNR703.ledsprofile](profiles/CONSPIT_300GT_Standalone_V2.0_DNR703.ledsprofile)。
在 SimHub → CONSPIT 300GT → **Individual / Ungrouped / Raw 整轮配置区**导入，
选择 `CONSPIT 300GT - Standalone V2.0 - DNR 7.0.3 Data`。
它使用来源会话的同一 ProfileId；已有 UI 调整时先导出留存，再重新导入。

`profiles/rpm/` 的 FullColour、TDM 两份配置只输出顶部 12 灯，
用于单独 RPM 分区测试，不能替代整轮文件。完整导入说明、灯位及选项见 [使用说明](docs/usage.md)。

## 与 amazing-leds-300gt 的关系

| 项目 | 用途 | 当前 BMW 基线 |
| --- | --- | --- |
| 本目录 | CONSPIT V1.6 整轮编排；DNR 七个游戏的车型树，加原框架 F1 效果 | DNR 7.0.3 原始 12 位对称布局，保留第 3、10 灯空位 |
| [amazing-leds-300gt](../amazing-leds-300gt/README.md) | iRacing 专用、五套主题、独立 RPM 框架 | Lovely 分挡数据的临时左到右适配，末两灯各扩成两灯 |

两套实现供选择和对照，不应在同一整轮输出上同时叠加。DNR 数据不是 iRacing 官方手册，
也未因版本较新而获得当前 EVO 实测认证。比如 DNR 的 BMW 6 挡红线为 7100 RPM，
当前 Lovely 快照为 7250 RPM；这类差异需结合游戏、挡位和视频核对。

## 源码与构建

后续获取新版 DNR 资源、比较差异及更新配置，按 [版本更新方案](docs/update-workflow.md) 执行。
`node tools/inspect-update.cjs --resources <资源目录> --version <发行版本> --installer <安装包>`
可准备本地候选与差异报告；它不自动切换活动数据。每次更新使用 [记录模板](docs/update-record-template.md)。

Node.js 18+，无 npm 第三方依赖。在本目录运行：

```sh
npm run check
```

- `vendor/`：原 CONSPIT 文件、DNR LED 引擎、C# 红线对照、仅保留 12 灯宽度的车型树、RPM 模板。
- `src/provenance.json`：来源会话、版本、原始/导入哈希；脚本哈希记录初次导入状态，vendor 哈希在每次构建前验证。
- `tools/build-rpm.cjs`：从原始 JS 表和车型树生成两份 RPM 配置。
- `tools/build-full.cjs`：基于 V1.6 框架整合车型树及辅助函数，生成整轮配置。
- `tools/build.cjs`：校验来源后按顺序构建；从其他工作目录调用也可运行。
- `tests/`：原始公式对照、红线边界、非 RPM 框架保留及构建确定性。
- `docs/`：使用说明、来源会话摘要、生成的改动与内容清单。
- `.validation/`：每次验证的报告、原生往返文件及生成的内嵌 JS 副本，Git 忽略。

修改 `tools/` 中的构建/内嵌运行代码后重新生成 profiles，不只编辑生成文件。
SimHub 中的车型树保留原生 RPM/Animation 节点；TDM 等全局选项目前仍在 Embedded JavaScript 的 `C300_OPTIONS` 中。

可选 Windows 原生解析验证（使用已安装的 SimHub，不导入或切换运行中的配置）：

```powershell
powershell.exe -NoProfile -File tools/validate-native.ps1 -SimHubRoot 'D:\Program Files (x86)\SimHub'
node tools/verify-roundtrip.cjs
powershell.exe -NoProfile -File tools/check-ncalc.ps1 -SimHubRoot 'D:\Program Files (x86)\SimHub'
```

`docs/previous-validation.json` 是来源会话的历史报告摘要；本地新报告生成在 `.validation/`。
脚本模拟和原生反序列化不能替代真实遥测、动画调度与 USB 输出测试。

来源与权利归属见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
