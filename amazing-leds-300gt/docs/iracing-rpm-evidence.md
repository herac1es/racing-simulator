# iRacing 官方 RPM 依据

核对日期：2026-09-12。官方入口：[Vehicle User Manuals](https://www.iracing.com/resources/user-manuals/)。以用户确认的当前游戏表现为验收目标，结合适用于当前版本的官方手册、SDK/遥测及更新说明；不能仅凭官方来源身份忽略版本不匹配。

## BMW M4 GT3 / EVO

**当前决定：撤回旧手册单表。** 用户指出 M4 数据不符；此前将 2024 年旧款手册的单表填入所有 EVO 挡位并不成立，即使标注“未验证”也不应替代已有分挡基线。重新核对官方目录后仍只找到下述 V3，未找到 EVO 专用逐灯表；这不等于证明官方从未发布其他资料。

[2025 Season 4 官方更新说明](https://support.iracing.com/support/solutions/articles/31000177148-2025-season-4-release-notes-2025-09-08-02-)明确写明 EVO 更新发生于原车包，物理参数和美术均有更新，且新增 FIA gear stack。沿用 `bmwm4gt3` 只能确定车辆识别，不能证明旧版 RPM 表仍适用；该更新说明没有给出新的逐灯 RPM 表。

运行配置恢复 Lovely 分挡阈值：用户此前反馈其节奏较吻合，但尚未逐项验证。方向按用户确认的左到右；来源十个有效灯位由 `[1,12,2,11,4,9,5,8,6,7]` 排列，末两灯各复制一次得到 `[1,12,2,11,4,9,5,8,6,6,7,7]`。这是临时布局适配，保留来源的五个阶段和配色，不是官方 EVO 十灯表。不得插值出额外阶段，或把源文件名/CarId 当成数据版本证据。需结合当前游戏版本、齿比选项、挡位、RPM 与视频定位偏差。

### 历史记录：旧款 V3 表（不参与当前运行）

官方目录目前链接 [BMW M4 GT3 User Manual V3](https://s100.iracing.com/wp-content/uploads/2024/07/BMW-M4-GT3-Manual_V3.pdf)。第 8 页 `SHIFT LIGHTS` 的图示从左到右为两绿、六黄、两橙，配合以下递增阈值；用户也确认当前 iRacing 灯组从左到右点亮。第 5 页建议灯组全部变红时升挡。

| 原车灯位/状态 | 官方颜色 | 官方表 RPM | 300 GT 灯位 |
| --- | --- | ---: | --- |
| 1 | Green | 4800 | 1 |
| 2 | Green | 5000 | 2 |
| 3 | Yellow | 5200 | 3 |
| 4 | Yellow | 5400 | 4 |
| 5 | Yellow | 5600 | 5 |
| 6 | Yellow | 5800 | 6 |
| 7 | Yellow | 6000 | 7 |
| 8 | Yellow | 6200 | 8 |
| 9 | Orange | 6400 | 9、10 |
| 10 | Orange | 6600 | 11、12 |
| All Red | Red | 6800 | 1–12 |

上表的 300 GT 列仅记录已撤回方案的映射。旧表完整转录保存在 [official/bmw-m4-gt3-v3.json](../src/rpm/iracing/official/bmw-m4-gt3-v3.json)，不由当前 BMW 配置引用。

**证据范围与实现选择：**

- PDF 链接日期为 2024-07，早于 [2025 Season 4 EVO 更新](https://support.iracing.com/support/solutions/articles/31000177148-2025-season-4-release-notes-2025-09-08-02-)。官方目录仍在链接这份手册，但不能据此声称其阈值已对当前 EVO 重新校准。
- 手册只提供一张表，没有给出逐挡差异。此前复制到各挡的方案已撤回，当前 UI 采用 Lovely 对应挡位的值。
- 表中只给颜色名称，没有 RGB。项目采用标准 RGB 绿、黄、橙、红（橙为 `#FFFFA500`），不能宣称色度与游戏屏幕完全一致。
- 手册只写 `All Red 6800 rpm`，没有规定红线闪烁频率。当前全红常亮与各挡红线值来自 Lovely，不再引用旧手册的统一 6800 RPM。
- Lovely 的 `bmwm4gt3.json` 是对称布局、五个成对阶段及不同分挡阈值。临时左到右适配不把它称作官方物理灯位表；原始文件保持不变。
- 首灯、全亮、换挡提示等实时遥测可以辅助检查当前版本，但少数锚点不等于完整的逐灯阈值表。本次没有把手册表重缩放到实时 FirstRPM/LastRPM。

本次 PDF SHA-256：`80a3553e0df6030e51bc5077445716f0e1fcf1fd53644af9564b9cea11428128`。原 PDF 和图片不随项目分发，仅记录出处和转录的配置事实。

## Porsche 911 GT3 R (992)

[官方 V2 手册](https://s100.iracing.com/wp-content/uploads/2024/09/Porsche-911-GT3-R-992_V2.pdf)第 11 页 `LED CLUSTERS / SHIFT LIGHTS` 明确写明灯光从外侧向内侧点亮（绿至红）；达到最佳换挡点时全部变蓝并开始闪烁。图示为 16 灯。第 5 页也建议全部蓝灯时升挡。

因此 Porsche 继续采用 Lovely 分挡阈值、现有 16→12 映射，以及两侧向内、全蓝闪烁。**官方这两页没有给出逐灯 RPM、精确 RGB 或 250 ms 亮灭时长**，这些数值仍来自 Lovely 基线并需对照游戏；不能因为方向得到官方支持就把全部社区参数描述成官方认证。省略四个来源灯位的映射限制保持明确记录。

本次 PDF SHA-256：`0244f2ee03a8e81da7011019d80bc7aa8bfca6633c2d1f9b5a3988eefe84c01a`。
