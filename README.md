# 🛡️ SafeFlow

**“AI-Powered Stampede Detection & Crowd Safety”**  


## 🚀 Overview

Large gatherings like festivals, rallies, and concerts often face stampede risks.  
Traditional CCTV systems only monitor without predicting, leading to delayed responses and potential loss of life.

**SafeFlow** is a React + TypeScript dashboard for real-time crowd monitoring and safety.  
It is designed to integrate with AI-powered services that analyze live feeds, predict risk levels, and alert authorities in time.

---

## ✨ Features
- Real-time video feed monitoring
- Crowd analysis dashboard
- Source selection (live / file)
- Clean and modular component design
- Ready to integrate with backend AI services

---

## 📦 Tech Stack
- **Frontend:** React 18, TypeScript, Vite
- **Styling:** TailwindCSS (optional if added)
- **State Management:** React Hooks (`useState`, `useEffect`, `useRef`, `useCallback`)
- **Services:** Custom AI integration point (`geminiService`)

---

## 🔧 Setup & Installation


**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

📂 Project Structure

pgsql

Copy code
├── components/
│   ├── Header.tsx
│   ├── CameraView.tsx
│   ├── AnalysisDashboard.tsx
│   └── SourceSelector.tsx
├── services/
│   └── geminiService.ts
├── types.ts
├── App.tsx
├── index.tsx
├── vite.config.ts
└── tsconfig.json
⚡ Deployment
Build and deploy with:

'''
Copy code
npm run build
'''