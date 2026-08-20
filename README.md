Drishti — Disaster Intelligence

Offline-first disaster intelligence and emergency response platform.

Live Demo — Drishti

Drishti is a disaster-response platform designed to help people communicate, coordinate, and access critical information during emergencies — even when internet connectivity is unreliable or unavailable.

It focuses on making emergency assistance faster, more accessible, and resilient in real-world disaster scenarios.

🚨 Why Drishti?

During disasters, communication infrastructure can become unreliable. People may lose access to:

Internet connectivity
Reliable communication
Emergency information
Location-based assistance
Coordination with rescue teams

Drishti is built with an offline-first mindset so that critical functionality can continue working even when network connectivity is limited.

✨ Key Features
📴 Offline-first experience — designed for situations with poor or unavailable connectivity
🚨 Emergency assistance — helps users access and communicate critical information
📍 Location-aware response — supports location-based emergency coordination
🆘 SOS / emergency workflows — designed for quick access during emergencies
📊 Disaster intelligence dashboard — provides an organized view of emergency information
🔄 Real-time synchronization — synchronizes data when connectivity becomes available
📱 Responsive UI — works across desktop and mobile devices
⚡ Fast and lightweight — designed for quick interaction during high-pressure situations
🛠️ Tech Stack
Frontend
React
TypeScript
Vite
Tailwind CSS
Backend
Convex
Convex Functions
Real-time database
Authentication
Convex Authentication
Deployment
Vercel
🏗️ Architecture
                    ┌──────────────────┐
                    │      User        │
                    └────────┬─────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   Drishti Frontend  │
                  │ React + TypeScript   │
                  └──────────┬──────────┘
                             │
                  ┌──────────┴──────────┐
                  │                     │
                  ▼                     ▼
          ┌──────────────┐      ┌──────────────┐
          │ Offline      │      │ Convex       │
          │ Experience   │      │ Backend      │
          └──────────────┘      └──────┬───────┘
                                       │
                                       ▼
                              ┌────────────────┐
                              │ Disaster Data  │
                              │ & Coordination │
                              └────────────────┘
🚀 Getting Started
Prerequisites

Make sure you have:

Node.js
npm
A Convex account
Clone the repository
git clone https://github.com/sanskriti45-tech/drishti-offline-rescue.git


cd drishti-offline-rescue
Install dependencies
npm install
Configure environment variables

Create a .env.local file and add your Convex configuration:

VITE_CONVEX_URL=your_convex_url
VITE_CONVEX_SITE_URL=your_convex_site_url

Add any additional authentication/environment variables required by your Convex configuration.

Start the development server
npm run dev

The application will be available locally at:

http://localhost:5173
📦 Production Build

To create a production build:

npm run build

To preview the production build locally:

npm run preview
🌐 Live Demo

Try Drishti here:

https://drishti-offline-rescue-main.vercel.app/

🎯 Use Cases

Drishti can be useful in scenarios such as:

🌊 Floods
🌋 Natural disasters
🌪️ Severe weather events
🔥 Emergency situations
🏚️ Infrastructure failures
🚑 Community emergency response
📡 Low-connectivity environments
🔮 Future Improvements

Some possible future improvements include:

Mesh-network communication
SMS-based emergency fallback
Integration with local emergency services
AI-powered disaster prediction
Automated emergency alerts
Rescue-team coordination
Offline maps and navigation
Multilingual emergency assistance
IoT/sensor-based disaster monitoring
🤝 Contributing

Contributions, ideas, and feedback are welcome.

Fork the repository
Create a feature branch
git checkout -b feature/amazing-feature
Commit your changes
git commit -m "Add amazing feature"
Push the branch
git push origin feature/amazing-feature
Open a Pull Request
👩‍💻 Team

Drishti — Disaster Intelligence

Built with ❤️ to make emergency response more resilient, accessible, and intelligent.

📄 License

This project is intended for educational, research, and hackathon purposes. Add the appropriate license file if you plan to open-source the project formally.
