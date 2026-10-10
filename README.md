# X3 PDF 批量转 XTC / XTCH

- 多选 PDF 或导入文件夹中的 PDF。
- 每份 PDF 内部的页面连续拼接：不重叠、不丢内容；每份 PDF 结束时，未满 528 × 792 的最后一页用白色补齐。下一份 PDF 从新的 XTC 页面开始，不会与上一份 PDF 的尾部拼接。
- 选择每 1、2、3、4、5、10 或 20 个 PDF 输出为一个 XTC/XTCH 文件。合并模式下，队列顶部统一显示每组输出结果，源 PDF 列表不重复显示“输出”或“已合并到”。
- 合并文件名会尽量保留连续编号，例如 `玫瑰与香槟 台版01.pdf` + `玫瑰与香槟 台版02.pdf` 输出为 `玫瑰与香槟 台版01-02.xtc`。
- 选择 1 个 PDF 时，每份 PDF 单独输出，并在对应队列项右侧显示下载按钮。
- 选择 PDF 后快速显示第一份 PDF 第 1 页按宽度缩放后的顶部 528 × 792 裁切；预览不执行拼接、抖动或 XTC/XTCH 编码，仅切换蒙版兼容模式时重新渲染。
- 文件仅在本机浏览器处理，不会上传。

依赖 PDF.js 5.4.624 与 JSZip 3.10.1（cdnjs）。


## 灰度与图像处理选项

- 抖动算法：Atkinson、Floyd–Steinberg、Stucki、Ostromoukhov、Zhou–Fang、Sierra Lite、Ordered、Matt Parker、Stochastic，以及无抖动阈值模式。
- 对比度：None、Light、Medium、Strong、Maximum。对比度和抖动应用于最终输出；快速裁切预览不执行这些处理。
- Stochastic 使用 Hilbert 曲线处理，计算量较大；大量页面转换时建议优先使用 Atkinson 或 Floyd–Steinberg。

## Image processing options

- Dithering: Atkinson, Floyd–Steinberg, Stucki, Ostromoukhov, Zhou–Fang, Sierra Lite, Ordered, Matt Parker, Stochastic, and no-dither threshold mode.
- Contrast: None, Light, Medium, Strong, and Maximum. Contrast and dithering are applied to the final output; the fast crop preview does not run either operation.
- Stochastic uses a Hilbert-curve traversal and is more computationally expensive. For large batches, Atkinson or Floyd–Steinberg is recommended.
