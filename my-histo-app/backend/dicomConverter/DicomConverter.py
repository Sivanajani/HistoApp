import os
import pydicom
from pydicom.dataset import FileDataset, FileMetaDataset
from PIL import Image
import numpy as np
import xml.etree.ElementTree as ET

# Input- und Outputordner definieren
INPUT_FOLDER = "dicomConverter/input_jpegs"
OUTPUT_FOLDER = "dicomConverter/output_dicoms"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Einheitliche Study Instance UID generieren
STUDY_INSTANCE_UID = pydicom.uid.generate_uid()
SERIES_INSTANCE_UID = pydicom.uid.generate_uid()

# Funktion zum Parsen des XML und Abrufen der UID
def get_uid_from_xml(xml_path, image_src):
    try:
        tree = ET.parse(xml_path)
        root = tree.getroot()
        for image in root.findall("image"):
            if image.get("src") == image_src:
                return image.find("uid").text
        raise ValueError(f"UID für {image_src} nicht gefunden.")
    except Exception as e:
        print(f"Fehler beim Parsen des XML: {e}")
        return None

# JPEG zu DICOM konvertieren
def jpeg_to_dicom(jpeg_path, dicom_path, uid):
    try:
        img = Image.open(jpeg_path).convert("RGB")
        np_img = np.array(img)

        meta = FileMetaDataset()
        meta.MediaStorageSOPClassUID = pydicom.uid.SecondaryCaptureImageStorage
        meta.MediaStorageSOPInstanceUID = pydicom.uid.generate_uid()
        meta.TransferSyntaxUID = pydicom.uid.ImplicitVRLittleEndian

        ds = FileDataset(dicom_path, {}, file_meta=meta, preamble=b"\0" * 128)
        ds.SOPInstanceUID = meta.MediaStorageSOPInstanceUID
        ds.Modality = "OT"
        ds.PatientName = "Unknown^Patient"
        ds.PatientID = "000000"
        ds.StudyInstanceUID = STUDY_INSTANCE_UID
        ds.SeriesInstanceUID = SERIES_INSTANCE_UID 
        ds.SeriesNumber = "1"
        ds.InstanceNumber = str(uid)  # Verwende die UID als InstanceNumber

        ds.Rows, ds.Columns, ds.SamplesPerPixel = np_img.shape
        ds.PhotometricInterpretation = "RGB"
        ds.BitsAllocated = 8
        ds.BitsStored = 8
        ds.HighBit = 7
        ds.PixelRepresentation = 0
        ds.PixelData = np_img.tobytes()

        ds.save_as(dicom_path)
        print(f"{jpeg_path} → {dicom_path} erfolgreich konvertiert!")
    except Exception as e:
        print(f"Fehler bei {jpeg_path}: {e}")

# Verarbeitung aller JPEG-Dateien nacheinander
XML_PATH = "dicomConverter/allImageMetadata.xml"  # Pfad zur XML-Datei
jpeg_files = [os.path.join(INPUT_FOLDER, f) for f in os.listdir(INPUT_FOLDER) if f.lower().endswith(".jpg")]
if not jpeg_files:
    print("Keine JPEG-Dateien gefunden!")
else:
    print(f"Starte die Konvertierung von {len(jpeg_files)} JPEGs nach DICOM...")
    for jpeg_file in jpeg_files:
        image_src = os.path.basename(jpeg_file)
        uid = get_uid_from_xml(XML_PATH, image_src)
        if uid:
            dicom_file = os.path.join(OUTPUT_FOLDER, image_src.replace(".jpg", ".dcm"))
            jpeg_to_dicom(jpeg_file, dicom_file, uid)
