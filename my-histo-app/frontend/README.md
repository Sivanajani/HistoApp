# HistoApp
A web-based application for displaying, filtering, and managing medical images with tagging, commenting, and download functionality.

## 🔐 Authentication

The application uses **Keycloak** for user authentication. Access is restricted to authenticated users only.

- Realm: `FHNW-LST-MI`
- Client: `g4-app`
- Login is enforced automatically on application start.

## ✨ Key Features

- **Tag-based filtering** with AND/OR logic
- **Search** through comments and image descriptions
- **Color-based filtering**
- **ZIP download** of selected images
- **Multilingual interface** (German / French / English)
- **Toggleable Dark/Light mode**

## 🖼️ Image Display

Images are loaded directly from a DICOM-compatible backend: (`https://v000564.fhnw.ch/orthanc/...`).

### 🔍 Detail View

- Click to zoom into image
- Add or remove tags
- Full **CRUD functionality for comments** (Create, Read, Update, Delete)

## ⚙️ Setup & Start

### Prerequisites

- Node.js (recommended: ≥ v18)
- Access to Keycloak + PACS backend (Orthanc)

### Start local development server

```bash
npm run dev
