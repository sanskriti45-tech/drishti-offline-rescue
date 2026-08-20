
# Drishti — Disaster Intelligence

> **An offline-first disaster intelligence and emergency response platform designed to help people stay informed, connected, and prepared when conventional communication infrastructure fails.**

**Live Demo:** [Drishti — Disaster Intelligence](https://drishti-offline-rescue-main.vercel.app/?utm_source=chatgpt.com)
**Repository:** [GitHub Repository](https://github.com/sanskriti45-tech/drishti-offline-rescue?utm_source=chatgpt.com)

---

## 🚨 About Drishti

**Drishti** is an offline-first disaster intelligence platform built to support communities during emergencies when internet connectivity and traditional communication infrastructure may be unreliable or unavailable.

During disasters such as **floods, earthquakes, cyclones, wildfires, and other large-scale emergencies**, access to timely information can become difficult. Drishti aims to bridge this gap by providing a centralized platform for **emergency information, location-based awareness, rescue coordination, and critical resources**.

The goal is simple:

> **When the network goes down, critical information shouldn't have to.**

---

## ✨ Key Features

### 🆘 Emergency Assistance

Provides users with access to critical emergency information and resources during disaster situations.

### 📍 Disaster Intelligence

Helps users understand their surroundings and access relevant disaster-related information.

### 🌐 Offline-First Architecture

Designed with unreliable connectivity in mind, allowing essential functionality to remain useful even when internet access is limited.

### 📡 Rescue & Communication Support

Facilitates the exchange of important information between people who need assistance and those coordinating rescue efforts.

### 🗺️ Location Awareness

Uses location-based information to help users identify relevant emergency resources and situations around them.

### ⚡ Fast & Simple Interface

Designed for stressful emergency environments where users need information quickly rather than navigating complicated interfaces.

### 📱 Responsive Design

Works across desktop and mobile devices so that users can access critical functionality from different devices.

---

## 🎯 Problem

During a disaster, communication infrastructure can become one of the first things to fail.

People may face:

* Loss of internet connectivity
* Overloaded cellular networks
* Difficulty contacting emergency services
* Lack of reliable local information
* Difficulty communicating their location
* Fragmented rescue coordination
* Limited access to verified disaster updates

Traditional emergency applications often assume that users have **stable internet connectivity**.

That assumption doesn't always hold during a disaster.

---

## 💡 Our Solution

Drishti approaches disaster response from an **offline-first perspective**.

Instead of relying entirely on continuous connectivity, the platform is designed around the principle that:

**Critical information should remain accessible even when connectivity is unreliable.**

Drishti brings together disaster intelligence, emergency assistance, location awareness, and rescue-oriented functionality into one platform.

---

## 🏗️ How It Works

```text
                    ┌───────────────────┐
                    │      User         │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │     Drishti       │
                    │   Web Platform    │
                    └─────────┬─────────┘
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
       ┌───────────┐    ┌────────────┐   ┌────────────┐
       │ Disaster  │    │ Emergency  │   │ Location &  │
       │Intelligence│   │ Assistance │   │   Rescue    │
       └───────────┘    └────────────┘   └────────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ Emergency-Ready   │
                    │    Information    │
                    └───────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### Backend

* Convex
* Convex Database
* Convex Functions

### Development

* Git
* GitHub
* Vercel

---

## 🧩 Architecture

Drishti follows a modern web architecture designed around a responsive frontend and reactive backend.

```text
┌─────────────────────────────┐
│         React + Vite        │
│          Frontend            │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│           Convex            │
│      Backend + Database     │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Disaster Data &       │
│      Emergency Services     │
└─────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

* Node.js 18+
* npm
* Git

### Clone the Repository

```bash
git clone https://github.com/sanskriti45-tech/drishti-offline-rescue.git

cd drishti-offline-rescue
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file and add the required Convex configuration:

```env
VITE_CONVEX_URL=your_convex_url
VITE_CONVEX_SITE_URL=your_convex_site_url
```

Add any additional environment variables required by your Convex authentication configuration.

### Start Development Server

```bash
npm run dev
```

The application should then be available at:

```text
http://localhost:5173
```

---

## 📦 Production Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 🌍 Deployment

Drishti is deployed using **Vercel**.

**Live Application:** [drishti-offline-rescue-main.vercel.app](https://drishti-offline-rescue-main.vercel.app/?utm_source=chatgpt.com)

For production deployment, make sure all required Convex environment variables are configured in the deployment platform.

---

## 🔐 Security & Reliability

Disaster-response applications handle potentially sensitive information.

Drishti is designed with the following principles:

* Minimize unnecessary data collection
* Keep emergency interactions simple
* Avoid unnecessary dependencies on connectivity
* Separate frontend and backend responsibilities
* Use environment variables for configuration and secrets
* Design for unreliable network conditions

> **Never use the platform as a replacement for official emergency services.**

---

## 🧪 Testing

Before deploying changes, run:

```bash
npm run build
```

You should verify:

* Application loads successfully
* Emergency features work correctly
* Location functionality behaves as expected
* Backend requests succeed
* Responsive layouts work on mobile and desktop
* Offline-related functionality behaves as intended

---

## 🔮 Future Roadmap

Drishti can evolve into a broader disaster-response ecosystem.

### 📡 Mesh Networking

Enable nearby devices to exchange emergency information without requiring traditional internet connectivity.

### 🤖 AI-Powered Disaster Intelligence

Use AI to analyze incoming reports, identify patterns, prioritize emergencies, and summarize disaster situations.

### 🛰️ Satellite Connectivity

Integrate satellite communication for areas where terrestrial networks are unavailable.

### 🗺️ Real-Time Disaster Mapping

Provide continuously updated maps showing:

* Affected areas
* Safe zones
* Shelters
* Blocked roads
* Rescue operations
* Emergency resources

### 🆘 SOS & Rescue Requests

Allow users to send structured emergency requests containing:

* Location
* Emergency type
* Number of people
* Severity
* Additional information

### 📲 Progressive Web App

Expand offline capabilities through PWA technologies, local caching, and background synchronization.

---

## 🤝 Contributing

Contributions are welcome!

### 1. Fork the repository

```bash
git fork https://github.com/sanskriti45-tech/drishti-offline-rescue
```

### 2. Create a branch

```bash
git checkout -b feature/your-feature
```

### 3. Make your changes

Implement and test your feature.

### 4. Commit your changes

```bash
git commit -m "Add: your feature"
```

### 5. Push your branch

```bash
git push origin feature/your-feature
```

### 6. Open a Pull Request

Describe your changes and explain why they are useful.

---

## 👥 Team

**Drishti — Disaster Intelligence**

Built with the goal of making emergency information more accessible, resilient, and useful when people need it most.

---

## 📄 License

This project is available under the license specified in the repository.

---

## ❤️ Why Drishti?

Disasters don't wait for a stable internet connection.

Drishti is built around a simple idea:

> **Resilience should be built into the technology people depend on during emergencies.**

**Built for resilience. Built for communities. Built for the moments that matter.**
