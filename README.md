# UrbanMesh

**UrbanMesh** is a full-stack smart city infrastructure platform that transforms citizen reports into actionable geospatial data. Users can report local issues — potholes, broken streetlights, water leaks — directly on an interactive map, while authenticated users track their submissions through dedicated dashboards.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js (App Router), React, Tailwind CSS, Leaflet & React-Leaflet, React Context API |
| **Backend** | Python, FastAPI, SQLModel, Pydantic |
| **Database & Security** | PostgreSQL, PostGIS, JWT, Bcrypt |
| **DevOps & Tooling** | Docker, Uvicorn |

---

## Key Features

### Geospatial Mapping
- Interactive map powered by OpenStreetMap and Leaflet
- Smart marker clustering to group overlapping reports and prevent map clutter
- Custom map controls (zoom, locate) with glassmorphism styling
- Integrated location search via the OpenStreetMap Nominatim API

### Authentication & Authorization
- Full JWT-based authentication flow (Sign In, Sign Up)
- Protected API routes — issue submission requires a valid token
- Protected frontend routes — Profile, Reports, and Settings require authentication
- Global state management for session persistence across page reloads

### User Dashboards
- **Profile** — Edit account details, upload and crop profile avatars (saved to database), view account statistics
- **My Reports** — Dashboard displaying submitted reports with summary cards, status badges, and empty states
- **Settings** — Update account information, manage notification preferences, and handle account deletion (Danger Zone)

### Report Submission Flow
- Click-to-pin interface on the map
- Dynamic category selection (Road, Water, Streetlight, Traffic, etc.)
- Form data preservation: if an unauthenticated user attempts to submit a report, form data is saved to local storage and restored seamlessly after login


---

## Getting Started

### Prerequisites

Ensure the following are installed on your machine:

- [Node.js and npm](https://nodejs.org/)
- [Python 3.10+](https://www.python.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

### 1. Database Setup

The project uses PostgreSQL with the PostGIS extension. A `docker-compose.yml` file is provided in the project root.

```bash
# From the project root directory
docker compose up -d
```

---

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlmodel psycopg2-binary passlib[bcrypt] python-jose[cryptography] bcrypt

# Start the backend server
uvicorn main:app --reload
```

The backend API will be available at **http://127.0.0.1:8000**  
Interactive API docs can be viewed at **http://127.0.0.1:8000/docs**

---

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at **http://localhost:3000**

---

## Project Structure

```
urban-mesh/
├── backend/                  # FastAPI application
│   ├── main.py               # API routes and logic
│   ├── models.py             # SQLModel database schemas
│   ├── auth.py               # JWT and password hashing utilities
│   └── database.py           # Database connection engine
├── frontend/                 # Next.js application
│   └── app/
│       ├── components/       # React components (Map, Header, Forms)
│       ├── context/          # React Context for auth state
│       ├── profile/          # User profile dashboard
│       ├── reports/          # User reports dashboard
│       ├── settings/         # User settings dashboard
│       ├── map/              # Main map application route
│       └── page.tsx          # Landing page
├── docker-compose.yml        # PostgreSQL/PostGIS container config
└── README.md
```

## Future Work
 
| Feature | Description |
|---|---|
| **Google OAuth Integration** | Implement the "Continue with Google" button using OAuth 2.0 to allow seamless sign-in and sign-up via Google accounts |
| **Admin Dashboard** | A dedicated dashboard for city officials to review reports, update statuses (Pending, In Progress, Resolved), and manage submissions |
| **Advanced Image Cropping** | Integrate a client-side cropping library (e.g., Cropper.js) to enforce exact 1:1 aspect ratios before upload for avatars and report images |
| **Real-time Notifications** | Use server-sent events (SSE) or WebSockets to push live status updates to users when their reports are acted upon |
| **Report Filtering & Pagination** | Add advanced search, date-range filtering, and infinite scroll to the My Reports dashboard |
| **Map Heatmaps** | Introduce a heatmap layer to visualize high-density issue areas across the city |
| **Theme Toggling** | Fully implement Light/Dark mode toggles in the settings page across the entire application using Next.js themes |
| **Mobile Application** | Develop a React Native version of the app for on-the-go reporting with native camera and GPS integration |
