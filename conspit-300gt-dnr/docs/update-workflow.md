# DNR 新版本提取与配置更新方案

这份流程用于维护本目录的 CONSPIT 300GT 独立配置。目标是从用户通过 DNR 官方渠道
取得的新版安装包中提取灯效资源，核对差异后更新现有配置。当前已验证基线为 **7.0.3**；
这里的“最新”必须由每次执行时的官网版本和安装包证据确定，不能将该基线永久视为最新版。

## 1. 确定更新范围与当前状态

先读本目录 `AGENTS.md`、`src/provenance.json`、`docs/session-integration.md`，
检查 `git status`，保留已有源码改动和 SimHub UI 导出备份。

日常更新只需 LED 引擎、车型树和红线参考资源。原 CONSPIT V1.6 框架、按键/旋钮映射、
图层优先级与用户设置保留。插件车型库更新不等于取得新版官方 300GT 设备效果编排；
如果需要更新设备编排，另外获取对应 `.ledsprofile` 并逐项迁移。

本目录支持多游戏；`amazing-leds-300gt` 继续是独立的 iRacing 项目。
新数据先在本目录对照验证，不能顺手覆盖另一个项目的车型或布局。

## 2. 获取并核对官方安装包

打开 [DNR 官方下载页](https://www.danielnewmanracing.com/downloads)，选择 SimHub Plugin，
记录检查日期、页面版本、稳定版/预览版渠道及长期页面 URL。需要登录时使用用户已有的官网流程。
下载后记录安装包字节数、SHA-256、Authenticode 状态和签名主体。
签名下载 URL 可能过期，只保存在当次下载过程，不写入仓库。

PowerShell 核对示例（将路径替换为本次实际下载的文件）：

```powershell
$dnrInstaller = 'C:\path\to\DNR_SimHub_Plugin_Installer.exe'
Get-Item -LiteralPath $dnrInstaller | Select-Object Length, VersionInfo
Get-FileHash -LiteralPath $dnrInstaller -Algorithm SHA256
Get-AuthenticodeSignature -LiteralPath $dnrInstaller | Select-Object Status, SignerCertificate
```

7.0.3 的已知证据：安装包 38,871,968 字节，签名主体 DANIEL NEWMAN RACING LTD，
SHA-256 `5f5b96c116548432042576ec8ccce69ccd4765f75225bff2a2d5c18464470421`。
它的主 DLL AssemblyVersion/FileVersion 为 `1.0.0.0`，不能单独用这个值判断发行版本。
综合官网、安装器 ProductVersion 和插件内版本常量；不一致时先查明具体包和渠道。
签名异常或文件哈希与同一已知样本不同，也应记录并查明原因。

## 3. 静态解包与资源提取

在 `.validation/updates/` 下的本地工作区或仓库同级临时目录处理安装包。
不运行安装器、不覆盖 SimHub 插件目录，不需要启动 DNR 插件来读取这些内嵌资源。

本次成功的工具组合：

| 工具 | 已验证版本 | 用途 |
| --- | --- | --- |
| Inno Unpacker | 2.67.11 | 解包 Inno Setup 6.7.0 安装器，做安装包完整性检查 |
| ILSpyCmd | 9.1.0.7988 | 导出 .NET 插件 C# 和内嵌资源 |
| Newtonsoft.Json 引用 | 13.0.3 net45 | 作为反编译参考依赖，减少缺失引用警告 |
| Node.js | 18+ | gzip/JSON 提取、差异报告、配置构建和模拟测试 |
| Windows PowerShell / 本机 SimHub | 以本次安装版本为准 | 可选原生 JSON 往返与 NCalc 解析 |

工具取自其官方发行页或 NuGet；安装包格式/目标框架改变时，先核对所用版本是否支持。
按工具 `--help`/帮助输出确认参数。常用调用结构为：

```powershell
& $innoUnpacker '-t' $dnrInstaller
& $innoUnpacker '-x' "-d$extractDir" $dnrInstaller
& $ilspyCmd '-p' '-o' $decompileDir $pluginDll
```

以上变量应指向本次实际工具、全新输出目录及解包得到的 `DanielNewmanRacing.Plugin.dll`。
若 ILSpyCmd 以 NuGet 工具 DLL 形式使用，通过匹配的 .NET runtime 调用；缺引用时按帮助添加参考路径。
不要为了获取车型表去重编译整个插件。

从导出目录确认三个资源，当前精确名称如下：

| 资源 | 用途 |
| --- | --- |
| `DanielNewmanRacing.Plugin.Services.Rpm.DNR_LEDs_Engine.js` | 原始内嵌 JS、分挡红线表及车型选择逻辑 |
| `DanielNewmanRacing.Plugin.Services.Rpm.cartrees.json.gz` | 按灯条宽度划分的原生车型效果树；300GT 选 `lengths["12"]` |
| `DanielNewmanRacing.Plugin.Services.Redline.redlines.json` | C# 侧红线参考；不是默认运行真值 |

资源来自程序集内嵌文本，不是凭反编译 C# 重新猜写的 JavaScript。
必要时对照 `SharedEngineInstaller`、`RpmCarTreeLibrary`、`dnr_SelectCarRedline` 和
`dnr_RedlineState` 的实现，确认资源加载/选择路径仍然成立。
资源重命名、压缩格式改变或没有 12 灯树时，定位新加载器再调整提取工具；不要擅自用 10/16 灯树替代。

保留导出日志、工具版本和资源哈希。7.0.3 的初次分析曾直接对照 DLL PE/CLI 资源区验证资源哈希；
本项目的新候选工具只处理导出的文件，不自动完成 DLL 资源区一致性检查。
C# 反编译警告不自动表示资源损坏，但影响上述关键加载/选择函数时必须人工核对。

## 4. 准备候选并查看差异

在本项目目录运行（版本号与路径均替换为本次真实值）：

```powershell
node tools/inspect-update.cjs --resources 'C:\path\to\decompiled\plugin' --version 7.0.3 --installer 'C:\path\to\DNR_SimHub_Plugin_Installer.exe'
```

PowerShell 中优先直接调用 Node，避免 npm.ps1 把 `--version` 当作 npm 自身参数。
需要 npm 入口时使用 `npm.cmd run update:inspect -- ...`。
工具在 `.validation/updates/<版本>/` 写入：

- `engine.js`、`csharp-redlines.json`：未修改的资源字节。
- `cartrees-12.json`：仅选出 width-12，保留其中全部游戏、车型、节点、条件和布局。
- `candidate.json`：当前/候选版本标签、安装包和资源哈希、游戏数、元数据、辅助函数清单。
- `tree-diff.json`：车型树逐路径差异，包含条件、阈值、颜色、偏移、动画等变化。
- `csharp-redline-diff.json`：C# 红线参考差异。

工具不联网判断最新版、不校验签名或版本真实性、不执行候选 JS，也不激活候选。
目录已存在时会拒绝覆盖，以保留先前核对结果。重新提取同一版本应保留/改名旧候选目录后再执行。
不要把命令成功当作“新版兼容”或“版本真实性已验证”。

工具在 2026-09-13 使用现有 7.0.3 官方安装包和原始 ILSpy 导出资源完成回归验证：
引擎未变化，width-12 与 C# 红线差异均为 0。自动测试还覆盖缺失 12 灯树、差异记录、
非法版本路径及已有候选目录保护。本次没有联网检查新的 DNR 发行版。

审阅重点：

1. 以游戏、CarId/CarModel、挡位及条件识别车型变化。数组重排会产生大量路径差异，不能把同一索引当成同一车型。
2. 对照每灯 RPM、颜色、StartPosition、Mirror/Remap 等布局节点、灯数及空位、红线触发和动画帧。
3. 检查引擎中的 JS 红线表和选择函数差异。C# 表与 JS 表在 7.0.3 已发现部分不一致，
   当前配置选择与保留的原生公式对应的 JS 表；不能因为 C# 文件更新就整体替换。
4. 审阅新增辅助函数及 `DNRLEDs.*`/DNR ONE 属性依赖，确认独立配置是否需要补实现或明确回退。
   文本清单只是线索，实际公式执行验证不可省略。
5. 保留车型来源，不能把 DNR 或 Lovely 称为官方 iRacing 数据。EVO 与旧款 CarId 相同，
   不证明布局/颜色/阈值相同；与适用于当前版本的官方说明及游戏观察共同核对。

## 5. 将候选更新为构建输入

差异已经查明、所需适配完成后，将三份候选资源放入新的 `vendor/dnr-<版本>/`，
保留旧版本快照。原始资源不直接修补；适配写到构建/运行代码中。
更新 `src/provenance.json` 的 `dnrVersion`、安装器哈希、来源页面/检查日期以及新增资源记录；
不要用更新旧哈希来掩盖原始快照变化。当前 `verifySources` 会校验记录中的全部 vendor 文件。

当前 7.0.3 构建路径和展示名称尚有显式常量，需要连同引用一起更新：

```powershell
rg -n '7\.0\.3|dnr-7|DNR703|DNR 7' tools tests package.json README.md src
```

逐项检查：

- `tools/build-rpm.cjs` 与 `tests/rpm.cjs` 的活动资源目录、资源接口、车型选择和 JS 红线表键。
- `tools/build-full.cjs` 的 RPM 输入文件名、内嵌辅助函数、描述、输出名和来源版本。
- `tests/full.cjs`、`tests/integration.cjs`、原生 PowerShell/往返脚本里的生成文件引用。
- 三份配置展示名称/文件名、内容清单、README 和第三方来源声明中的**活动版本**。
  历史记录继续保留原版本，不做全仓库机械替换。
- 维护已有 ProfileId。只在需要与旧版并存的明确迁移中分配新 ID；构建不能每次随机生成。
- 保留 CONSPIT V1.6 框架、原有非 RPM 编排、现有局部适配、TDM 开关和最高挡选项。
  用户在 SimHub 中的 UI 编辑不会自动回到仓库，按导出文件逐项同步。

原生车型节点保留原结构和公式；当前完整配置用 `JSExt=4` 加载内嵌函数。
修改 API、辅助函数或布局时记录原因和前后行为，不以测试通过为理由接受无依据的效果变化。
生成整轮配置及 FullColour/TDM 两份 RPM 配置，不只更新其中一份。

## 6. 验证与交付

在本目录运行 `npm run check`：来源哈希、原始/适配公式对照、各挡红线边界、
完整非 RPM 编排、F1 SC/DRS 回退、三配置确定性与候选准备测试必须通过。
新版确实改变阈值时，根据已查明的源数据和差异更新预期，不能只修改预期让报错消失。

本机有 SimHub 时继续执行：

```powershell
powershell.exe -NoProfile -File tools/validate-native.ps1 -SimHubRoot 'D:\Program Files (x86)\SimHub'
node tools/verify-roundtrip.cjs
powershell.exe -NoProfile -File tools/check-ncalc.ps1 -SimHubRoot 'D:\Program Files (x86)\SimHub'
```

记录实际工具/SimHub 版本、容器数、公式数、通过/失败和测试范围。
原生往返验证应保留节点数量与类型顺序，不能存在 UnknownContainer。
这些进程不导入配置、不切换设备、不执行实时灯效；没有本机 SimHub 时把原生验证标为未执行。

最后在 Individual / Ungrouped / Raw 整轮区域导入整轮文件做游戏/硬件验证，
与旧配置逐一对照；RPM-only 两份只用于 12 灯分区。记录车型、挡位、RPM、齿比、
正常/TDM 模式、红线、进站/启动覆盖及无效遥测行为。软件检查与实机结果分别报告。
发生回归时，用户可切回先前导出的配置，源码可回到旧版活动资源引用后重新构建。

为每次更新建立一份 [更新记录](update-record-template.md)，包含所有文件哈希和差异结论。
提交/PR 只包含需要的来源快照、适配代码、文档和生成配置；临时安装包、DLL、全量反编译结果、
登录信息和签名下载链接不入库。是否推送/合并由当前用户任务授权决定；更新资料本身不要求再次确认。

## 后续调用方式

以后可直接要求：**“按 conspit-300gt-dnr/docs/update-workflow.md 核对 DNR 官网最新稳定版，
提取并比较灯效数据，更新 300GT 配置并验证。”**

维护代理先读本方案，再执行当次版本发现与更新。没有配置定时任务；本次沉淀流程也不代表已检查到比 7.0.3 更新的发行版。
