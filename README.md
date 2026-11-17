<!-- project-showcase:start -->
<p align="center"><img src="docs/showcase/cover.svg" width="100%" alt="榫生听雨 · 榫卯主题AIGC与文创作品" /></p>
<p align="center"><b>榫卯结构 · 方案互动 · 模型视图</b></p>
<p align="center"><a href="#作品画面">看作品</a>　 ·　 <a href="ITERATION_HISTORY.md">历次迭代</a>　 ·　 <a href="https://github.com/qiuyimei/sunsheng-listening-to-rain/archive/refs/heads/main.zip">下载源码</a>　 ·　 <a href="https://github.com/qiuyimei/project-collection#作品图录">全部作品</a></p>

**榫生听雨** · 榫卯主题AIGC与文创作品。

## 作品画面

<table><tr><td width="50%" align="center" valign="top"><a href="docs/showcase/preview-01.png"><img src="docs/showcase/preview-01.png" width="420" alt="榫卯互动界面" /></a><br/><sub>榫卯互动界面</sub></td><td width="50%" align="center" valign="top"><a href="docs/showcase/preview-02.png"><img src="docs/showcase/preview-02.png" width="420" alt="模型平面视图" /></a><br/><sub>模型平面视图</sub></td></tr></table>

## 从这里开始

| 想做什么 | 入口 |
| --- | --- |
| 查看每次迭代、日期与改动 | [历史版本目录](ITERATION_HISTORY.md) |
| 下载当前完整源码 | [当前版本 ZIP](https://github.com/qiuyimei/sunsheng-listening-to-rain/archive/refs/heads/main.zip) |
| 下载发布包、查看已有附件 | [Releases 发布页](https://github.com/qiuyimei/sunsheng-listening-to-rain/releases) |
| 浏览当前工程 | [仓库文件](.) |

<!-- project-showcase:end -->

---

## 使用与项目说明

# 榫生 · 听雨亭

**传统木构文旅驿站与数字共创体验**

面向“昆仑谣·数字文旅创作大赛暨2026 AIGC多模态创新设计与技术应用大赛”制作的建筑概念作品初稿。以榫卯连接为文化线索，将山水步道的檐下休憩、木构阅读和数字交互放进同一座小亭。

![作品主视觉](assets/主视觉_AI概念图.png)

> 主视觉为AI气氛概念图，构造与尺度以参数模型及图纸为准。当前为概念设计，不能直接用于施工。

## 运行

下载仓库后，用近期版本的 Edge 或 Chrome 打开 [`index.html`](index.html)（或 `作品.html`）。保持 `assets` 文件夹与页面在同一目录。无需安装依赖、API密钥或账号；页面运行不请求外部服务。

也可以在仓库目录启动本地静态服务：

```bash
python -m http.server 8000 --bind 127.0.0.1
```

然后访问 `http://127.0.0.1:8000/`。此命令只在本机提供预览。

## 交互功能

- 拖动旋转、滚轮缩放，以及自动巡游。
- 建筑、直榫节点、俯瞰三种视图。
- 调节柱网面宽（5.4—7.2m）与屋檐出挑（0.60—1.40m）。
- 构造拆解、屋面显隐、雨境与手动雨声开关。
- 导出当前视角的PNG方案卡与当前参数的OBJ几何模型。
- 恢复基准方案。

页面还支持 `?film=theme` 和 `?film=open` 自动播放两套章节镜头；`?capture=1` 供确定性逐帧绘制使用。自动镜头不包含成片旁白与配乐。

## 建筑设定

| 项目 | 基准方案 |
| --- | --- |
| 场地 | 虚构山水步道转折处 |
| 功能 | 临时避雨、短时坐憩、小组集合、木作研学 |
| 柱网 | 6.0 × 4.8m，两列三柱 |
| 柱网面积 | 28.8m² |
| 石台面积 | 47.25m² |
| 屋面水平投影面积 | 57.4m² |
| 檐口 / 屋脊 | 3.70 / 5.00m，相对室外地坪 |
| 基准出檐 | 1.10m |

## 文件

| 文件 | 用途 |
| --- | --- |
| [`index.html`](index.html)、[`作品.html`](作品.html) | 可离线打开的交互界面 |
| [`assets/scene.js`](assets/scene.js) | 三维几何、灯光、纹理、参数交互与导出 |
| [`assets/content.js`](assets/content.js) | 双主题章节脚本和旁白文本 |
| [`01_榫生听雨亭_建筑方案与创作说明.pdf`](01_榫生听雨亭_建筑方案与创作说明.pdf) | 13页A3横向建筑方案册 |
| [`听雨亭_建筑概念模型.obj`](听雨亭_建筑概念模型.obj) | 米制、Y向上的基准几何模型 |
| [`04_3DShow双主题创作说明_可编辑.txt`](04_3DShow双主题创作说明_可编辑.txt) | 可迁移至3DShow的说明 |
| [`源码/`](源码/) | 提示词、脚本、生成过程与检查记录 |

两支成片均为2分12秒、2560×1440、H.264/AAC，独立提供下载附件，不放进Git历史。

## 技术与创作披露

采用 HTML/CSS/JavaScript、Three.js 0.160.1 与程序几何，木纹、屋面纹理、雨滴和雨声均为本地程序表现。交互采用确定性参数规则，**没有在线模型推理**。

AI辅助文本、代码和概念图创作；主视觉由内置ImageGen生成，[完整提示词](源码/主视觉生成提示词.txt)保留。成片中文旁白使用 Windows Microsoft Huihui Desktop，未克隆特定真人；配乐与雨声由程序合成。

整体模型未加工全部榫卯槽口，独立节点只解释直榫插接原理。未进行结构、排水、照明或无障碍规范验算，也未进行真实场地部署或用户效果验证。

## 参赛状态

作品初稿制作于2026-10-24。作者、学校、指导教师和赛区须据实补齐。指定合集素材要求、组别、时间及平台发布规则应按所在赛区核对；当前没有代为报名、发布参赛视频或提交比赛。

## 第三方依赖与权利

Three.js保留其[MIT许可证](assets/THREE-LICENSE.txt)。本次上传不为项目自创代码、建筑方案、文本或生成图片另行授予开源许可证；仓库可见性本身不代表自由再使用授权。

