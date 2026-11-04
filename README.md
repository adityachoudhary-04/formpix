# SarkariPhoto — Free Exam Photo & Signature Resizer

A modern, production-ready, privacy-first web application built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and **HTML5 Canvas**.

Designed to empower millions of students and government job aspirants across India to easily prepare, resize, crop, clean, and compress their passport photographs and signatures to match the strict dimension and kilobyte (KB) requirements of recruitment boards (UPSC, SSC, Banking, Railways, State PSCs, etc.).

---

## 🚀 Key Features

### 1. 100% Client-Side Processing & Privacy
- **Zero Server Uploads**: All image resizing, cropping, compression, and text manipulation execute locally inside the user's browser using HTML5 Canvas and Web APIs.
- **Biometric Security**: Candidate photos and signatures never leave the user's device memory.
- **Safe Memory Management**: Automatic cleanup of blob URLs and object URLs.

### 2. Comprehensive Tool Suite
- 📷 **Photo Resizer** (`/photo-resizer`): Custom dimensions (px, cm, mm), DPI support (150, 200, 300), interactive cropping, rotation, zoom, aspect ratio locking, and fit/crop modes.
- ✍️ **Signature Resizer & Enhancer** (`/signature-resizer`): Intelligent white paper background cleanup, threshold adjustment to eliminate scanner shadows, and ink contrast boost.
- 🗜️ **Image Compressor** (`/image-compressor`): Iterative binary search quality optimization to meet exact target file size ranges (e.g. 20–50 KB, 50–100 KB) without guesswork.
- 🖋️ **Signature Compressor** (`/signature-compressor`): Specialized handwriting compression preserving line clarity under 10–20 KB.
- 📅 **Add Name & Date of Photo (DOP)** (`/add-name-date`): Configurable bottom white info strip for candidate name and Date of Photograph, mandated by SSC CGL, CHSL, MTS, and state exams.
- 👁️ **Face Coverage Guide** (`/face-coverage`): Visual biometric alignment overlay (70%–80% face coverage oval, crown, eye level, and chin guidelines).

### 3. Exam Presets Directory
- Over **40+ preconfigured presets** across 9 categories:
  - **UPSC**: Civil Services (IAS), NDA, CDS, CAPF, ESE
  - **SSC**: CGL, CHSL, MTS, GD Constable, CPO, Stenographer
  - **Banking**: IBPS PO, Clerk, SO, RRB, SBI PO, Clerk, RBI Grade B, Assistant
  - **Railway (RRB)**: NTPC, Group D, ALP, JE, Ministerial
  - **State PSC**: UPPSC, BPSC, MPPSC, RPSC, WBPSC
  - **Police**: UP Police, Bihar Police, MP Police, Rajasthan Police
  - **Teaching**: CTET, UGC NET, UPTET, Super TET, KVS
  - **Entrance Exams**: JEE Main, NEET UG, GATE, CUET UG
  - **Other Govt**: LIC AAO, EPFO, FCI, Agniveer Army/Navy/IAF

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15.5+ (App Router)
- **UI & Styling**: React 19, Tailwind CSS, Lucide React icons
- **Components**: Reusable components modeled after shadcn/ui patterns
- **Image Processing**: HTML5 Canvas 2D API, React Cropper, Cropper.js, Browser Image Compression
- **Testing**: Vitest, JSDOM, Testing Library
- **Typography & Theme**: Next Inter font, custom CSS variable theming (light & dark mode support)

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18.0.0 or higher recommended; developed on Node v26 LTS)
- npm or pnpm

### Installation
```bash
# Clone or navigate to the project directory
cd exam-image-tools

# Install dependencies
npm install
```

### Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Automated Tests
```bash
npm test
```
Runs 21+ automated unit tests covering image validation, preset structure, unit conversion algorithms, signature cleanup, and formatting functions.

### Building for Production
```bash
npm run build
npm run start
```

---

## 🌐 Deployment to Vercel

The project is structured specifically for zero-configuration deployment on Vercel:

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of SarkariPhoto exam resizer"
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Log in to your [Vercel Dashboard](https://vercel.com).
   - Click **"Add New"** > **"Project"**.
   - Select your GitHub repository.
   - Vercel automatically detects Next.js.
   - Set Environment Variable (Optional):
     `NEXT_PUBLIC_SITE_URL` = `https://your-domain.vercel.app`
   - Click **Deploy**.

---

## 🔒 Privacy & Legal Compliance

All image modifications occur on the client machine inside HTML5 Canvas buffers. No biometric, face, photograph, or signature data is ever transmitted, logged, or retained on servers.
