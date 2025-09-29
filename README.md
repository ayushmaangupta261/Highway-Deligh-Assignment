# Highway Delight – Full-Stack Note-Taking Application

Highway Delight is a **full-stack note-taking application** built with **React (TypeScript), Node.js (TypeScript), and MongoDB**. The app allows users to sign up using **email & OTP** or **Google OAuth**, manage notes, and ensures secure authentication with JWT.


[Live Frontend](https://ayushmaangupta261.github.io/Highway-Delight-Assignment/)



---

## Features

* **User Authentication**

  * Signup and login via email & OTP
  * Google OAuth login
  * JWT-based authentication for secure access

* **Note Management**

  * Create and delete personal notes
  * Notes linked to authenticated users
  * Share notes with other users securely

* **AI Assistance**

  * Smart note suggestions
  * Content improvement or summarization using AI

* **Responsive UI**

  * Mobile-friendly design
  * Front-end assets available for download
  
* **Error Handling**

  * Validation messages for incorrect inputs
  * Handles OTP errors and API failures

---


## Technology Stack

* **Frontend:** ReactJS (TypeScript), Tailwind CSS
* **Backend:** Node.js with Express (TypeScript)
* **Database:** MongoDB (can switch to MySQL/PostgreSQL if needed)
* **Authentication:** JWT, Google OAuth
* **Version Control:** Git

---

## Project Structure

```
Highway-Delight-Assignment/
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ Auth/
│  │  │  │  ├─ Login.tsx
│  │  │  │  ├─ Signup.tsx
│  │  │  │  └─ ProtectedRoute.tsx
|  |  |  |  |_ UnProtectedRoute.tsx
│  │  ├─ pages/
│  │  │  ├─ Home.tsx
│  │  │  ├─ Dashboard.tsx
│  │  │  └─ ...
│  │  ├─ App.tsx
│  │  └─ main.tsx
│  └─ package.json
├─ backend/
│  ├─ controllers/
│  ├─ models/
│  ├─ routes/
│  ├─ middleware/
│  ├─ server.ts
│  └─ package.json
|  ├─.env
└─ README.md
```

---

## Installation

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

> Backend uses **ts-node** and **nodemon** for development with auto-reload.

---

## Environment Variables

### Frontend `.env` (Vite)

```env
VITE_APP_BASE_URL=http://localhost:4000
VITE_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

### Backend `.env`

```env
PORT=4000
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_JWT_SECRET
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
EMAIL_USER=YOUR_EMAIL_ADDRESS
EMAIL_PASS=YOUR_EMAIL_PASSWORD
GEN_AI_API_KEY=YOUR_API_KEY
```

> **Important:** Do not commit `.env` to Git. Use `.gitignore` and set environment variables in your cloud deployment.

---

## Running the Project Locally

1. Start **MongoDB** locally or connect via MongoDB Atlas.
2. Start the backend server:

```bash
cd backend
npm run dev
```

3. Start the frontend:

```bash
cd frontend
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

* Recommended deployment platforms: **Render**, **Vercel**, **Heroku**.
* Node.js version >= 22.x recommended.
* Set all environment variables in your cloud provider dashboard.
* Ensure all file imports match exact capitalization (important for Linux hosts).

---

## Usage

1. Sign up using **email & OTP** or **Google account**.
2. Log in to access the dashboard.
3. Create or delete notes.
4. All actions are secured with **JWT authentication**.
5. View proper validation and error messages during the process.

---



**Ayushmaan Gupta**
GitHub: [ayushmaangupta261](https://github.com/ayushmaangupta261)
