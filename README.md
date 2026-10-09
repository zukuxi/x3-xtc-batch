# X3 PDF 批量转 XTC / XTCH

做这个是因为有的PDF加了蒙版，普通转换出来是黑的，结果做出来的不打钩也可以转。选项还是留着，万一转出来的是黑的就勾上，肯定是不勾的转换快。

- 多选 PDF 或导入文件夹中的 PDF。
- 每份 PDF 内部的页面连续拼接：不重叠、不丢内容；每份 PDF 结束时，未满 528 × 792 的最后一页用白色补齐。下一份 PDF 从新的 XTC 页面开始，不会与上一份 PDF 的尾部拼接。
- 选择每 1、2、3、4、5、10 或 20 个 PDF 输出为一个 XTC/XTCH 文件。合并模式下，队列顶部统一显示每组输出结果，源 PDF 列表不重复显示“输出”或“已合并到”。
- 合并文件名会尽量保留连续编号，例如 `a01.pdf` + `a02.pdf` 输出为 `a01-02.xtc`。
- 选择 1 个 PDF 时，每份 PDF 单独输出，并在对应队列项右侧显示下载按钮。
- 选择 PDF 后自动生成第一份 PDF 的最终灰度/抖动预览；调节处理参数会重新预览。
- 文件仅在本机浏览器处理，不会上传。

依赖 PDF.js 5.4.624 与 JSZip 3.10.1（cdnjs）。

https://zukuxi.github.io/x3-xtc-batch/

编码结构参考 srokl/xtcjsapp 的 xtc_converter.js（MIT 项目）

X3 PDF Batch Converter to XTC / XTCH

This tool was created to handle PDFs that contain masks, which can cause standard conversion to produce black pages. However, some of these PDFs can also be converted successfully without enabling the mask compatibility option. The option is retained as a fallback: leave it unchecked for faster conversion, and enable it only if the output appears black.

- Select multiple PDF files or import PDFs from a folder.
- Pages within each PDF are stitched together continuously without overlapping or losing content. At the end of each PDF, the final page is padded with white to fill the 528 × 792 output dimensions if necessary. Each subsequent PDF starts on a new XTC page, so content from different PDFs is never stitched together.
- Choose to combine every 1, 2, 3, 4, 5, 10, or 20 PDFs into a single XTC/XTCH file. In merge mode, the queue displays each group's output result at the top. The source PDF list does not redundantly display “Output” or “Merged into” labels.
- Output filenames preserve consecutive numbering whenever possible. For example, "a01.pdf" + "a02.pdf" produces "a01-02.xtc".
- When set to 1 PDF per output, each PDF is converted into a separate file, with a download button displayed next to its corresponding queue item.
- Automatically generates a final grayscale/dithered preview of the first PDF after selection. Adjusting the processing settings regenerates the preview.
- All processing takes place locally in your browser. No files are uploaded.

Dependencies: PDF.js 5.4.624 and JSZip 3.10.1 (via cdnjs).

The encoding structure is based on "xtc_converter.js" from the MIT-licensed project "srokl/xtcjsapp" (https://github.com/srokl/xtcjsapp).

Web app: https://zukuxi.github.io/x3-xtc-batch/

- Interface language: Chinese by default, with an English option in the top-right corner.
