# VulnScan — Full Stack Web Fuzzing Tool

A full-stack web security testing tool built to scan websites for common vulnerabilities like SQL Injection, XSS, and more.

This project was built as a practical learning + real-world implementation of how fuzzing tools work behind the scenes.

---

## 🚀 What this project does

* Scan websites for vulnerabilities
* Show live scan progress
* Generate reports with findings
* Simulate scans even without backend (demo mode)

---

## 🛠️ Tech Stack

* Frontend: React + Vite + Tailwind
* Backend: Node.js + Express
* Database: MongoDB
* Auth: JWT

---

## 📂 Project Structure

```
frontend/   → React app (UI + scanner)
backend/    → API + fuzzing engine
```

---

## ⚡ Getting Started

### 1. Install dependencies

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

---

### 2. Setup environment

Create `.env` in backend:

```env
PORT=5000
MONGO_URI=your_mongo_url
JWT_SECRET=your_secret
```

---

### 3. Run project

```bash
npm run dev
```

* Frontend → http://localhost:5173
* Backend → http://localhost:5000

---

## 🧠 How it works (simple)

1. User enters target URL
2. Backend starts scanning using payloads
3. Requests are sent to target
4. Responses are analyzed
5. Vulnerabilities are detected
6. Results are stored and shown in dashboard

---

## 🧪 Vulnerabilities covered

* SQL Injection
* XSS
* LFI / RFI
* SSRF
* Command Injection
* Sensitive file exposure

---

## ⚠️ Important

This tool is made for **learning and authorized testing only**.
Do NOT use it on websites without permission.

---

## 💡 Why I built this

I wanted to understand how real security tools like Burp Suite or scanners work internally, so I built my own simplified version from scratch.

---

## 📌 Future improvements

* Better scanning engine
* More payloads
* Performance optimization
* UI improvements

---

## ⭐ If you like this project

Give it a star ⭐ and feel free to contribute!
