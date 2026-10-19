# docs/assets

`docs/index.html` 使用的本地化前端依赖（不依赖 CDN，Pages 离线可用）。

| 文件 | 版本 | 来源 | 许可 |
| --- | --- | --- | --- |
| `marked.min.js` | marked 12.0.2 | <https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js> | [MIT](licenses/marked-LICENSE.md) |
| `mermaid.min.js` | Mermaid 11.12.0 | <https://cdn.jsdelivr.net/npm/mermaid@11.12.0/dist/mermaid.min.js> | [MIT](licenses/mermaid-LICENSE.txt) |
| `mathjax/tex-svg.js` | MathJax 3.2.2 | <https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js> | [Apache-2.0](licenses/mathjax-LICENSE.txt) |
| `reader.css` | — | 本仓库编写 | 同仓库 |

升级时替换对应文件并更新本表（含 `licenses/` 下的许可证全文）；`docs/index.html` 的引用路径不变。MathJax 使用 `tex-svg` 组合包（SVG 输出，无额外字体文件）。

## 本地预览与重新生成 PDF

```bash
# 在仓库根目录起静态服务器（直接双击 index.html 会因 file:// 限制无法 fetch Markdown）
python3 -m http.server 8000 --directory docs
# 打开 http://127.0.0.1:8000/

# 重新生成 PDF（需要 Playwright；本机复用 nano-dnf 的安装与 Chromium 缓存）
PLAYWRIGHT_MODULE=/home/luyanfeng/luyanfeng/nano-dnf/node_modules/playwright \
  node skills/summarize-paper-methods/scripts/render_pdf.mjs docs/rsi-methods.pdf
```
