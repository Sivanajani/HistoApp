# 🔄 DICOM Converter

This utility converts `.jpg` images into **valid DICOM files** using metadata provided via external XML files (*allImageMetadata.xml*). It was developed as part of the HistoApp project to support the integration of non-DICOM images into a PACS system (Orthanc).

---

## ⚙️ Features

- 📷 Convert `.jpg` files into `.dcm` format
- 📄 Metadata extraction from `.xml`
- 🔗 Generates unique SOPInstanceUIDs and Patient data

---

## 🚀 Usage
1. Place the source `.jpg` files in the input/ directory `input_jpegs`.
2. Provide metadata as `.xml` (*allImageMetadata.xml*) 
3. Run the script:
```bash
python dicom_converter.py
```
4. DICOM files will be saved in output/ folder.