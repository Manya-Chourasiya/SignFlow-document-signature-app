# SignFlow – Digital Document Signature Platform

> Developed as part of a Full Stack Web Development Internship at **Labmentix**.

## Live Deployment

### Frontend (Vercel)

https://sign-flow-document-signature-app.vercel.app

### Backend (Render)

https://signflow-document-signature-app-leli.onrender.com

---

## Overview

SignFlow is a full-stack digital signature platform that enables users to upload PDF documents, place signatures, generate public signing links, and securely download signed PDFs.

The platform streamlines document signing workflows by allowing both internal users and external signers to collaborate through secure token-based signing links.

---

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication

### Document Management

* Upload PDF Documents
* View Document Library
* PDF Preview
* Delete Documents

### Digital Signatures

* Upload Signature Images
* Place Signatures on PDFs
* Delete Incorrectly Placed Signatures
* Coordinate-Based Signature Placement

### Public Signing Portal

* Generate Public Signing Links
* Token-Based Access
* External Signer Workflow
* Signer Name & Email Collection

### PDF Processing

* Generate Signed PDFs
* Download Signed PDFs
* Dynamic Signature Placement

### Activity Tracking

* Audit Logs
* Public Link Management
* Signing Activity Monitoring

---

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* React PDF

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JWT (JSON Web Tokens)
* bcryptjs

### PDF Processing

* PDF-Lib

### File Uploads

* Multer

---

## System Workflow

1. User uploads a PDF document.
2. User uploads a signature image.
3. User places the signature on the document.
4. User generates a secure public signing link.
5. External signer accesses the link.
6. Signer uploads a signature image and signs the document.
7. System generates a signed PDF.
8. Signed document can be viewed and downloaded.

---

## Project Structure

### Frontend

* React
* Tailwind CSS
* React Router
* React PDF

### Backend

* Express.js
* MongoDB Atlas
* JWT Authentication
* PDF Processing APIs
* Audit Logging
* Public Signing Link APIs

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Manya-Chourasiya/SignFlow-document-signature-app.git
cd SignFlow-document-signature-app
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the backend directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## Screenshots

### Dashboard

(Add Dashboard Screenshot)

### Documents

(Add Documents Page Screenshot)

### Public Signing Page

(Add Public Signing Page Screenshot)

### Audit Logs

(Add Audit Logs Screenshot)

---

## Future Enhancements

* Email-Based Signing Invitations
* Multi-Signer Workflows
* Role-Based Access Control
* Multi-Page Signature Placement
* Cloud Storage Integration (AWS S3 / Cloudinary)
* Advanced Audit Analytics

---

## Internship Project

This project was developed as part of a **Full Stack Web Development Internship at Labmentix**.

The project demonstrates practical implementation of:

* Full Stack Web Development
* REST API Design
* JWT Authentication
* MongoDB Database Integration
* PDF Processing and Manipulation
* File Upload Management
* Secure Digital Signature Workflows

---

## Author

**Manya Chourasiya**

B.Tech Computer Science Engineering

Developed during the Full Stack Web Development Internship at **Labmentix**.
