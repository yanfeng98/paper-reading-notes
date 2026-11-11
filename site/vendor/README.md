# site/vendor

`site/build.py` 使用的本地化前端依赖（不依赖 CDN，构建出的站点离线可用）。构建时复制到 `_site/assets/vendor/`；笔记与汇总页面按需动态加载。

| 文件 | 版本 | 来源 | 许可 |
| --- | --- | --- | --- |
| `marked.min.js` | marked 12.0.2 | <https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js> | [MIT](licenses/marked-LICENSE.md) |
| `mermaid.min.js` | Mermaid 11.12.0 | <https://cdn.jsdelivr.net/npm/mermaid@11.12.0/dist/mermaid.min.js> | [MIT](licenses/mermaid-LICENSE.txt) |
| `mathjax/tex-svg.js` | MathJax 3.2.2 | <https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js> | [Apache-2.0](licenses/mathjax-LICENSE.txt) |
| `fonts/lora/*.woff2` | Lora variable（latin / latin-ext） | Google Fonts | [OFL](fonts/licenses/Lora-OFL.txt) |
| `fonts/noto-serif-sc/*.woff2` | Noto Serif SC variable 分片 | Google Fonts | [OFL](fonts/licenses/NotoSerifSC-OFL.txt) |
| `fonts/mashanzheng/*.woff2` | Ma Shan Zheng（控件 K 图标分片） | Google Fonts | [OFL](fonts/licenses/MaShanZheng-OFL.txt) |
| `licenses/hanzi-writer-data-ARPHICPL.txt` | 字标笔顺数据（内联进首页 SVG） | [hanzi-writer-data](https://github.com/chanind/hanzi-writer-data) | Arphic Public License |

升级时替换对应文件并更新本表（含 `licenses/` 下的许可证全文）。MathJax 使用 `tex-svg` 组合包（SVG 输出，无额外字体文件）。Mermaid 只在存在 `mermaid` 围栏的页面加载，MathJax 只在存在 `math` 围栏的页面加载。字体只在 Kimi 皮肤真正用到对应字符时按 `unicode-range` 分片加载；经典皮肤不会请求字体文件。

## 构建、预览与 PDF

```bash
# 构建静态站点（Python 标准库，无需第三方依赖）
python3 site/build.py --out _site

# 本地预览
python3 -m http.server 8000 --directory _site
# 打开 http://127.0.0.1:8000/

# 重新生成汇总 PDF（需要 Playwright；脚本会自动查找本地 node_modules / npx 缓存，
# 找不到时再用 PLAYWRIGHT_MODULE=/path/to/playwright 指定）
node skills/summarize-paper-methods/scripts/render_pdf.mjs \
  --site _site --page docs/rsi-methods/index.html --out docs/rsi-methods.pdf

# 重新构建，把新 PDF 复制进 _site
python3 site/build.py --out _site
```

GitHub Pages 使用 **Settings → Pages → Source = GitHub Actions**；workflow 构建并上传 `_site`。分支部署 `main /docs` 已退役（旧 `docs/index.html` 与 `docs/assets` 已删除）。
