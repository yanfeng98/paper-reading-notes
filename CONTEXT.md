# CONTEXT

站点视觉与内容的共用词汇。这里只放术语，不放实现细节；具体实现见 `CLAUDE.md` 与 `site/README.md`。

## 首页与皮肤

- **经典皮肤（Classic）**：不加载 hero 照片、云渲染与手写字体字标的阅读皮肤。
- **Kimi 皮肤（Kimi）**：默认皮肤。首页 hero 由底层照片、体积云、代码带与「读」字标组成；阅读页封面只放 `Paper Reading Notes` 字标。
- **Hero**：首页首屏的全屏场景。hero 的轮换只作用于底层照片，不改变云层、代码带、字标或 hero 的交接动画。

## Hero 照片

- **Hero 主图（Primary photo）**：来自 Kimi K3.1 Pro 文章页的云海照片，是 hero 默认显示的底层照片；首屏预加载与 LCP 都以它为准。
- **Hero 轮换图（Alt photo）**：站点作者提供的第二张云海照片。它在首屏渲染完成后才加载，只有在 hero 轮换时可见。
- **Hero 轮换（Hero rotation）**：Kimi 皮肤 Hero 在 Hero 主图与 Hero 轮换图之间自动进行的交叉淡化。轮换是持续循环的，不向访客暴露手动开关；当访客要求减弱动态、页面不可见、hero 离开视口或正在播放 hero→资料库交接时，轮换暂停。

## 阅读页

- **阅读页封面（Doc cover）**：阅读页顶部的全屏字标区域，与首页 Hero 是两套不同的展示，不参与 hero 轮换。
- **章节云（Reader clouds）**：阅读页每个二级标题处的体积云装饰，只在 Kimi 皮肤出现。
