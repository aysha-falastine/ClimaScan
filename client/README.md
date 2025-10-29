# AI Climate Risk Detector For Real Estate 🌍🏠
A web application that generates localized, AI-powered climate risk reports and interactive maps for properties, helping buyers, developers, and investors make safer, more resilient real estate decisions.
Supporting UN SDG 13 (Climate Action) and SDG 11 (Sustainable Cities & Communities)
________________________________________

 ## Overview
The AI Climate Risk Detector addresses a critical gap in real estate decision-making: the lack of accessible, localized climate risk assessments. Homebuyers, developers, and investors often overlook detailed climate hazards like flooding, heat stress, coastal erosion, and drainage issues when evaluating properties.
This platform:
•	Aggregates fragmented public climate data
•	Generates AI-powered, plain-language risk reports
•	Provides interactive maps with hazard overlays
•	Offers actionable mitigation recommendations
•	Exports professional PDF reports for due diligence
________________________________________
## ✨ Features
### Core Functionality
- 🔐 User Authentication - JWT-based secure access with role-based permissions (buyer, agent, developer, admin)
- 🗺 Interactive Property Mapping - Visualize properties on Mapbox/Leaflet with hazard overlays
- 📊 Hazard Analysis - Real-time calculation of flood risk, slope stability, heat stress, and drainage proxies
- 🤖 AI Risk Reports - OpenAI-powered synthesis of climate data into actionable insights
- 📄 PDF Export - Professional reports for clients and stakeholders
- 📈 Analytics Dashboard - Admin view of risk trends and user activity
- 💾 Report Management - Save, compare, and retrieve historical assessments
### Hazard Types Analyzed
- Flooding - 100-year flood zones, elevation analysis, proximity to water bodies
- Slope Stability - Landslide risk based on terrain gradient
- Heat Stress - Urban heat island effects and temperature anomalies
- Drainage - Impervious surface analysis and stormwater risk
- Coastal Erosion - Sea-level rise projections and shoreline proximity
________________________________________
### 🛠 Tech Stack
#### Backend
- Framework: Flask (Python) with Flask-RESTful
- Database: PostgreSQL (with optional PostGIS extension)
- ORM: SQLAlchemy
- Validation: Marshmallow
- Authentication: Flask-JWT-Extended
- AI Integration: OpenAI API (GPT-4)
- Testing: Pytest
- API Docs: Swagger/OpenAPI
#### Frontend
- Framework: Next.js 14+ (React)
- Styling: TailwindCSS
- Mapping: Mapbox GL JS / Leaflet
- Charts: Recharts
- State Management: Context API
- HTTP Client: Axios
- Testing: Jest + React Testing Library
#### Data Sources
- NASA SEDAC Climate Data
- Copernicus Climate Data Store
- World Bank Climate Knowledge Portal
- SRTM Elevation Data
- NOAA Climate Normals
#### Deployment
- Backend: Render
- Frontend: Vercel
- CI/CD: GitHub Actions
________________________________________
## 🏗 Architecture
```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Next.js   │────────▶│  Flask API   │────────▶│ PostgreSQL  │
│  Frontend   │◀────────│   Backend    │◀────────│  Database   │
└─────────────┘         └──────────────┘         └─────────────┘
                               │
                               │
                        ┌──────▼──────┐
                        │  Huggingface │
                        └─────────────┘
                               │
                        ┌──────▼──────────┐
                        │ Climate Data    │
                        │ Sources (NASA,  │
                        │ Copernicus, WB) │
                        └─────────────────┘

```
### 🚀 Getting Started
#### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL 15+
- Git
- OpenAI API Key
- Mapbox Access Token (or Leaflet alternative)
________________________________________
#### Backend Setup
1.	Clone the repository
bash
git clone https://github.com/yourusername/ai-climate-risk-detector.git
cd ai-climate-risk-detector/backend
2.	Create virtual environment
bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
3.	Install dependencies
bash
pip install -r requirements.txt
4.	Set up environment variables
bash
cp .env.example .env
# Edit .env with your configuration
5.	Initialize database
bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
6.	Run the development server
bash
flask run
# Server runs on http://localhost:5000
7.	Access API documentation
http://localhost:5000/api/docs
________________________________________
Frontend Setup
1.	Navigate to frontend directory
bash
cd ../frontend
2.	Install dependencies
bash
npm install
3.	Set up environment variables
bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
4.	Run the development server
bash
npm run dev
# Server runs on http://localhost:3000
5.	Build for production
bash
npm run build
npm start
________________________________________
🔐 Environment Variables
Backend (.env)
bash
# Flask Configuration
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/climate_risk_db

# JWT
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ACCESS_TOKEN_EXPIRES=3600

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# API Rate Limiting
RATE_LIMIT_PER_USER=10
CACHE_EXPIRY_HOURS=24

# Data Sources (Optional)
NASA_SEDAC_API_KEY=your-nasa-key
COPERNICUS_API_KEY=your-copernicus-key
Frontend (.env.local)
bash
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your-mapbox-token

# App Configuration
NEXT_PUBLIC_APP_NAME=AI Climate Risk Detector
NEXT_PUBLIC_APP_URL=http://localhost:3000
________________________________________
### 📚 API Documentation
```
Authentication Endpoints
•	POST /api/auth/register - Register new user
•	POST /api/auth/login - Login and get JWT token
•	GET /api/users/me - Get current user profile
Property Endpoints
•	GET /api/properties?page=1&limit=10 - List properties (paginated)
•	POST /api/properties - Add new property
•	GET /api/properties/{id} - Get property details
•	PUT /api/properties/{id} - Update property
•	DELETE /api/properties/{id} - Delete property
Risk Analysis Endpoints
•	POST /api/properties/{id}/analyze - Generate AI risk report
•	POST /api/calc/hazard - Calculate hazard metrics (internal)
•	GET /api/hazard-layers - List available hazard layers
Report Endpoints
•	GET /api/reports?page=1&limit=10 - List saved reports
•	GET /api/reports/{id} - Get report details
•	POST /api/reports/{id}/export - Export report as PDF
Analytics Endpoints (Admin)
•	GET /api/reports/summary - Aggregated risk statistics
Full Swagger documentation available at: /api/docs

```
### 🗄 Database Schema
```
Users Table
sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'buyer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Properties Table
sql
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(200),
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    property_type VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
RiskReports Table
sql
CREATE TABLE risk_reports (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
    ai_output JSONB NOT NULL,
    overall_score INTEGER,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exported_pdf_url TEXT
);
HazardLayers Table
sql
CREATE TABLE hazard_layers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    source VARCHAR(200),
    last_updated TIMESTAMP,
    meta JSONB
);
PropertyHazards Table
sql
CREATE TABLE property_hazards (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
    hazard_id INTEGER REFERENCES hazard_layers(id),
    score INTEGER CHECK (score >= 0 AND score <= 100),
    details JSONB,
    UNIQUE(property_id, hazard_id)
);
Complete ERD available in: /docs/database-diagram.png

```
### 🤖 AI Integration
#### Risk Report Generation Workflow
1.	User Request → /api/properties/{id}/analyze
2.	Data Gathering: 
o	Fetch property coordinates and type
o	Calculate hazard metrics (flood, slope, heat, drainage)
o	Retrieve local climate context
3.	AI Prompt Construction:
python
prompt = f"""
You are an expert climate resilience consultant. 

Property: {property.address}
Coordinates: ({property.latitude}, {property.longitude})
Type: {property.property_type}

Hazard Scores:
- Flood Risk: {hazards['flood']} (0-100)
- Slope Stability: {hazards['slope']} (0-100)
- Heat Stress: {hazards['heat']} (0-100)
- Drainage: {hazards['drainage']} (0-100)

Provide:
1) 3-sentence plain-language summary of current risks
2) Top 3 prioritized mitigation steps (explain why + estimated cost)
3) Estimated urgency (low/medium/high)
4) One-sentence recommended next action

Return as JSON: {{"summary": "", "actions": [], "urgency": "", "next_step": ""}}
Keep response under 150 words.
"""
4.	OpenAI API Call → GPT-4 generates structured report
5.	Save to Database → Cache results in risk_reports table
6.	Return to Frontend → Display with charts and export option
Caching Strategy
•	AI results cached for 24 hours per property
•	Rate limit: 10 requests per user per hour
•	Re-analysis allowed after significant data updates
________________________________________
### 🧪 Testing
Backend Tests (Pytest)
bash
cd backend
pytest tests/ -v --cov=app
Test Coverage:
•	Unit tests for auth, property CRUD, hazard calculations
•	Integration tests for AI report generation workflow
•	Mock OpenAI responses to avoid API costs
Frontend Tests (Jest + RTL)
bash
cd frontend
npm test
Test Coverage:
•	Component rendering tests (forms, maps, reports)
•	User interaction flows (login, property add, report generation)
•	Mock API responses with MSW (Mock Service Worker)
CI/CD Pipeline
GitHub Actions runs tests on every PR:
yaml
- Lint code (ESLint, Black)
- Run backend tests (Pytest)
- Run frontend tests (Jest)
- Build Docker images
- Deploy to staging (on merge to develop)
________________________________________
### 🚀 Deployment
Backend Deployment (Render)
1.	Create Render account and connect GitHub repo
2.	New Web Service: 
o	Build Command: pip install -r requirements.txt
o	Start Command: gunicorn run:app
o	Environment: Python 3.9
3.	Add Environment Variables from .env
4.	Create PostgreSQL database in Render
5.	Run migrations: flask db upgrade
Live Backend: https://your-app.onrender.com
Frontend Deployment (Vercel)
1.	Connect GitHub repo to Vercel
2.	Framework Preset: Next.js
3.	Build Command: npm run build
4.	Environment Variables: Add from .env.local
5.	Deploy: Automatic on push to main
Live Frontend: https://your-app.vercel.app
Docker Deployment (Optional)
bash
#### Backend
docker build -t climate-risk-backend ./backend
docker run -p 5000:5000 climate-risk-backend

#### Frontend
docker build -t climate-risk-frontend ./frontend
docker run -p 3000:3000 climate-risk-frontend
________________________________________
### 📁 Project Structure
```
ai-climate-risk-detector/
├── backend/
│   ├── app/
│   │   ├── _init_.py          # Flask app factory
│   │   ├── config.py            # Configuration classes
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Marshmallow schemas
│   │   ├── auth.py              # Auth routes
│   │   ├── properties.py        # Property CRUD routes
│   │   ├── reports.py           # Report & AI routes
│   │   ├── hazards.py           # Hazard calculation logic
│   │   ├── ai_service.py        # OpenAI integration
│   │   └── utils.py             # Helper functions
│   ├── tests/
│   │   ├── test_auth.py
│   │   ├── test_properties.py
│   │   └── test_reports.py
│   ├── migrations/              # Alembic migrations
│   ├── requirements.txt
│   ├── .env.example
│   └── run.py                   # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js
│   │   │   ├── page.js          # Landing page
│   │   │   ├── login/page.js
│   │   │   ├── register/page.js
│   │   │   ├── dashboard/page.js
│   │   │   ├── properties/
│   │   │   │   ├── add/page.js
│   │   │   │   └── [id]/page.js
│   │   │   └── reports/
│   │   │       └── [id]/page.js
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── PropertyForm.js
│   │   │   ├── PropertyMap.js
│   │   │   ├── HazardOverlay.js
│   │   │   ├── RiskReport.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── lib/
│   │   │   ├── api.js           # Axios client
│   │   │   └── utils.js
│   │   └── styles/
│   │       └── globals.css
│   ├── public/
│   ├── .env.local.example
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── docs/
│   ├── database-diagram.png
│   ├── api-examples.md
│   ├── ai-prompt-templates.md
│   └── deployment-guide.md
│
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions
│
├── README.md
└── LICENSE
```
________________________________________
### 🤝 Contributing
We welcome contributions! Please follow these guidelines:
1.	Fork the repository
2.	Create a feature branch: git checkout -b feature/amazing-feature
3.	Commit changes: git commit -m 'Add amazing feature'
4.	Push to branch: git push origin feature/amazing-feature
5.	Open Pull Request
### Development Workflow
- Branch naming: feature/, bugfix/, hotfix/
- Commits: Use conventional commits (feat, fix, docs, etc.)
- Code style: Black (Python), ESLint (JavaScript)
- Tests: All new features must include tests
- Documentation: Update README and API docs
________________________________________
### ⚖ Disclaimers & Ethics
Important Legal Notice:
- AI-generated risk assessments are based on available public data and should NOT be used as the sole basis for legal, financial, or construction decisions
- Users are advised to consult licensed engineers, surveyors, and legal professionals for critical property evaluations
- Risk scores are estimates and may not reflect real-time conditions or localized microclimates
- Climate projections involve uncertainty; mitigation recommendations are suggestive, not prescriptive
### Privacy & Data:
- User data and property reports are access-controlled
- No personal data is shared with third parties without consent
- AI analysis logs are retained for quality improvement only
________________________________________
### 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
________________________________________
### 🌟 Acknowledgments
- UN SDG 13 & 11 for inspiring climate-resilient urban development
- NASA SEDAC, Copernicus, World Bank for open climate data
- Huggingface API
- Mapbox for mapping infrastructure
________________________________________
### 📞 Support
- Issues: GitHub Issues
- Discussions: GitHub Discussions
- Email: support@climateriskrisk.com
________________________________________
