# 🧬 HistoApp – Web Application for Managing Histological Tissue Samples

🎓 *Hospital project as part of the B.Sc. Medical Informatics program at FHNW*

**HistoApp** is a web-based application for viewing, managing, annotating, and commenting on images of histological tissue samples. It was developed as part of a university project.

---

## 🔧 Tech Stack

- **Frontend:** React · TypeScript · Vite · Material UI · Axios · React Router  
→ Source code: [`/my-histo-app/frontend`](./my-histo-app/frontend)
- **Backend:** Spring Boot · Kotlin · RESTful API · Bruno (Test & Simulation)  
→ Source code: [`/my-histo-app/backend/histoapp`](./my-histo-app/backend/histoapp)
- **Database:** H2 (comments & tags)  
- **Containerization & Server:**  [Docker Compose](./Dokumente_Lieferobjekte/Lieferobjekte/Server/Docker-compose.yml) · Apache (Reverse Proxy)  
→ Setup & Konfiguration: [`/Dokumente_Lieferobjekte/Lieferobjekte/Server`](./Dokumente_Lieferobjekte/Lieferobjekte/Server)
- **Monitoring:** Prometheus · Grafana

---

## 🧪 API Testing with Bruno

The open-source tool [Bruno](https://www.usebruno.com/) was used to test the REST APIs.  
The test collection can be found in the folder [`/histoappBruno`](./histoappBruno).

---

## 📌 Features

- 🖼️ Viewing tissue images (DICOM integration via Orthanc)  
- 🏷️ Tagging and commenting on individual image instances  
- 🔌 RESTful APIs for data interaction  
- 📊 System monitoring with Prometheus & Grafana  
- 🐳 Containerized development & production environment (Docker)

---
## 🎥 Demo-Video
Curious to see HistoApp in action? Click the button below to watch a short demo video:

[![HistoApp Demo](images/thumbnail.png)](https://drive.google.com/file/d/1ck4kPS_QL9IJsGNLmrquxj2YifsK9PO0/view?usp=drive_link)

<p>
  <a href="https://drive.google.com/file/d/1ck4kPS_QL9IJsGNLmrquxj2YifsK9PO0/view?usp=drive_link" target="_blank">
    <img src="https://img.shields.io/badge/▶️%20Video-Demo-blue?style=for-the-badge" alt="Video ansehen">
  </a>
</p>

> The video demonstrates the following features:
> - Login via Keycloak
> - Image display & navigation
> - Language switching (German, French, English)
> - Light/Dark mode toggle 
> - Color-based filtering
> - Detail view with tagging & commenting
> - Filtering by tags, descriptions & comments
> - Download images as a ZIP archiv

*(If the button or thumbnail doesn't work, click here: [🎥 Watch demo video](https://drive.google.com/file/d/1ck4kPS_QL9IJsGNLmrquxj2YifsK9PO0/view?usp=drive_link))*

---

## 📄 Documentation

Additional project documents can be found in the folder [`/Dokumente_Lieferobjekte`](./Dokumente_Lieferobjekte):

- Requirements specification (SRS), risk analysis report  
- System & software architecture  
- Server configuration & HTTPS setup  
- Project structure, milestones, and team notes

---

## 🔄 DICOM Conversion (Custom Converter)

A custom **DICOM converter** was developed to support the integration of external image data into the PACS system.  
This allows `.jpg` files with metadata to be converted into **valid DICOM files**, which can then be uploaded to Orthanc.


🗂️ Source code: [`/my-histo-app/dicomConverter`](./my-histo-app/backend/dicomConverter)


---
## 📄 License

This project was developed as part of a university project at FHNW and is intended for demonstration and educational purposes only.

---