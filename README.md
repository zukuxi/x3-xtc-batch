# X3 PDF 跨页拼接批量转 XTC / XTCH

- 支持多选 PDF 和文件夹导入。
- 支持设置每 1、2、3、4、5、10 或 20 个 PDF 合并为一本；设为 1 即每份 PDF 单独输出。
- 跨页连续拼接默认开启：把上一页剩余行接到下一页开头，按 528×792 切分，不重叠、不丢弃内容。
- 采用分段渲染与行缓冲，不生成中间 JPG 文件。
- 选择文件后自动生成最终 XTC 页面预览；更改灰度、抖动、阈值、蒙版、拼接和合并数量后自动更新。
- 保留 XTC（1bit）/XTCH（2bit）、Atkinson、Floyd–Steinberg、无抖动/阈值、蒙版兼容开关、单组下载和 ZIP 打包。
- PDF 在本机浏览器处理，不会上传。

## 部署
将 `index.html`、`app.js`、`README.md` 放在仓库根目录。GitHub Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save。

## 说明
PDF.js 5.4.624 和 JSZip 3.10.1 从 cdnjs 加载，因此需要浏览器能访问相应 CDN。建议用实际漫画 PDF 验证拼接和蒙版兼容模式。
