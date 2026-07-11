# InterviewAce – Smart Interview Preparation Tracker

InterviewAce is a full-stack web application designed to help students prepare for technical coding and computer science interviews. It monitors student progress across Data Structures & Algorithms (DSA) and Core CS subjects, provides detailed analytics dashboards, suggests personalized focus areas, plans customizable mock interviews, and supports company-specific interview experience databases.

---

## Project Structure

```text
InterviewAce/
├── backend/                  # Node.js + Express.js API
│   ├── config/               # DB connection helpers
│   ├── controllers/          # Business logic handlers
│   ├── middleware/           # Route guards (JWT & Role auth)
│   ├── models/               # Mongoose schemas and models
│   ├── routes/               # API Router endpoints mapping
│   ├── scripts/              # Database seeding scripts
│   ├── tests/                # Automated API verification suite
│   ├── server.js             # Express application entry
│   └── package.json
│
└── frontend/                 # React.js + Vite + Tailwind CSS v3
    ├── public/
    ├── src/
    │   ├── components/       # ProtectedRoute, Sidebar
    │   ├── context/          # Global AuthContext & Axios settings
    │   ├── pages/            # Dashboard, TopicTracker, MockPlanner, etc.
    │   ├── App.jsx           # Routing paths & Layout wraps
    │   ├── index.css         # CSS animations and Tailwind base
    │   └── main.jsx          # DOM rendering mount
    ├── tailwind.config.js    # Custom typography & colors config
    ├── postcss.config.js
    └── package.json
```

---

## Core Features

- **Personalized Dashboard**: Visual radial assessment for your **Interview Readiness Score**, study streaks, effort stats, and progress breakdowns.
- **Topic Tracker**: Dynamic progress tracking for 14 DSA topics and 6 Core Computer Science modules. Expanding any topic shows relevant problems and enables inline status updates.
- **Problem Manager**: Fully searchable repository of problems filterable by difficulty, topic area, and solving status. Allows custom tags and personal hints/notes.
- **Recommendation Engine**: Automatically generates study prioritizations based on accuracy metrics and topic coverage.
- **Company Preparation**: Specific interview prep sheets, difficulty benchmarks, and real experiences for 10 major corporate recruiters.
- **Mock Interview Simulator**: Full-length interactive exam boards featuring quantitative aptitude, core CS MCQs, and coding rooms complete with active timers and automatic feedback grading.
- **Notes Editor**: Dual-pane study note compiler with side drawer categorization and inline editor views.
- **Admin Panel**: Statistics interface, student registries, and corporate listing generator for moderators.

---

## Installation and Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (required)

### Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the default database seeds:
   ```bash
   npm run seed
   ```
4. Start the backend:
   ```bash
   npm start
   ```

The backend reads from MongoDB only. Set `MONGODB_URI` and, if needed, `MONGODB_DB_NAME` in `backend/.env` before starting the server.

### Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```

The application will be accessible at [http://localhost:5173](http://localhost:5173).

---

## Running Automated Tests
To run the automated API endpoint checks, execute:
```bash
cd backend
node tests/test_api.js
```
All tests verify endpoint registrations, logins, readiness updates, notes, and exam gradings, confirming a fully stable server build.
