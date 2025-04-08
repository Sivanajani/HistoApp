# HistoApp – Backend

The backend of the HistoApp provides RESTful APIs for managing image metadata, tags, and comments.  
Built with **Spring Boot** and **Kotlin**, it interacts with a PACS server (Orthanc) and a local database for storing user-generated content.

---

## 🔧 Tech Stack

- Spring Boot 3 (RESTful APIs)
- Kotlin
- H2 (in-memory database for tags/comments)
- Orthanc PACS (DICOM backend)
- Bruno (API testing)
- Docker & Docker Compose

---

## 📌 Main Features

- Manage image **tags** and **comments**
- Serve DICOM metadata to the frontend
- REST endpoints secured and tested

---