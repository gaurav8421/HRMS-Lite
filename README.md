# HRMS Lite - Modern Human Resource Management System

A production-ready, full-stack HRMS (Human Resource Management System) built with **Django** backend, **PostgreSQL** database, and a fancy modern UI using **HTML**, **CSS**, and **Vanilla JavaScript**.

## Features

### Employee Management
- Add new employees with validation
- View all employees in a beautiful table
- Delete employees with confirmation
- Unique employee ID and email validation
- Department categorization

### Attendance Management
- Mark attendance (Present/Absent)
- Filter attendance by employee, date, and status
- Prevent duplicate attendance for same employee on same date
- View attendance history
- Delete attendance records

### Dashboard
- Real-time statistics
- Total employees count
- Today's attendance summary (Present/Absent)
- Attendance rate calculation
- Recent attendance records display

## Tech Stack

### Backend
- **Python 3.11+**
- **Django 4.2** - Web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Database
- **Gunicorn** - Production server
- **WhiteNoise** - Static file serving

### Frontend
- **HTML5** - Structure
- **CSS3** - Fancy modern styling with gradients and animations
- **Vanilla JavaScript** - No frameworks, pure JavaScript
- **Fetch API** - REST API communication

### Production & Deployment
- **Render** - Backend hosting
- **Vercel** - Frontend hosting
- **PostgreSQL** - Production database

## Project Structure

```
HRMS-Lite/
│
├── backend/                    # Django Backend
│   ├── hrms/                   # Main project directory
│   │   ├── settings.py         # Django settings
│   │   ├── urls.py             # URL routing
│   │   ├── wsgi.py             # WSGI config
│   │   └── asgi.py             # ASGI config
│   │
│   ├── core/                   # Core app (Employee & Attendance)
│   │   ├── models.py           # Database models
│   │   ├── serializers.py      # DRF serializers
│   │   ├── views.py            # API views
│   │   ├── urls.py             # API URLs
│   │   ├── admin.py            # Admin configuration
│   │   └── exceptions.py       # Custom exception handler
│   │
│   ├── manage.py               # Django management
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables
│   ├── .env.example            # Environment template
│   ├── build.sh                # Build script for Render
│   ├── render.yaml             # Render deployment config
│   └── runtime.txt             # Python version
│
├── frontend/                   # Frontend
│   ├── css/
│   │   └── style.css           # Modern fancy styles
│   ├── js/
│   │   ├── api.js              # API service layer
│   │   ├── utils.js            # Utility functions
│   │   ├── dashboard.js        # Dashboard logic
│   │   ├── employees.js        # Employee management
│   │   └── attendance.js       # Attendance management
│   ├── index.html              # Dashboard page
│   ├── employees.html          # Employees page
│   ├── attendance.html         # Attendance page
│   └── vercel.json             # Vercel deployment config
│
└── README.md                   # This file
```

## Local Development Setup

### Prerequisites
- Python 3.11 or higher
- PostgreSQL 12 or higher
- Git

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd HRMS-Lite
```

### Step 2: PostgreSQL Database Setup

#### Install PostgreSQL
```bash
# macOS
brew install postgresql@14
brew services start postgresql@14

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

#### Create Database
```bash
# Login to PostgreSQL
psql -U postgres

# Inside PostgreSQL shell
CREATE DATABASE hrms_db;
CREATE USER hrms_user WITH PASSWORD 'your_secure_password';
ALTER ROLE hrms_user SET client_encoding TO 'utf8';
ALTER ROLE hrms_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE hrms_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE hrms_db TO hrms_user;
\q
```

### Step 3: Backend Setup

#### Create Virtual Environment
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate
```

#### Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### Configure Environment Variables
```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your settings
nano .env
```

Update the following in `.env`:
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_NAME=hrms_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_HOST=localhost
DATABASE_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
```

#### Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

#### Run Development Server
```bash
python manage.py runserver
```

Backend will be running at `http://localhost:8000`

### Step 4: Frontend Setup

#### Open Frontend
Simply open the HTML files in your browser using a local server:

**Option 1: Using VS Code Live Server**
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` in the `frontend` folder
3. Select "Open with Live Server"

**Option 2: Using Python HTTP Server**
```bash
cd frontend
python -m http.server 5500
```

Frontend will be running at `http://localhost:5500`

### Step 5: Test the Application

1. Open `http://localhost:5500` in your browser
2. Navigate to Employees page and add some employees
3. Navigate to Attendance page and mark attendance
4. Check the Dashboard for statistics

## API Documentation

### Base URL
- **Development:** `http://localhost:8000/api`
- **Production:** `https://your-backend.onrender.com/api`

### Endpoints

#### Dashboard
```
GET /dashboard/
Response: {
  "success": true,
  "data": {
    "total_employees": 10,
    "present_today": 8,
    "absent_today": 2,
    "attendance_rate": 80.0,
    "today_date": "2024-01-15",
    "recent_attendance": [...]
  }
}
```

#### Employees
```
GET    /employees/              # List all employees
POST   /employees/              # Create employee
GET    /employees/{id}/         # Get employee by ID
PUT    /employees/{id}/         # Update employee
DELETE /employees/{id}/         # Delete employee
GET    /employees/{emp_id}/stats/  # Get employee attendance stats
```

**Create Employee Request:**
```json
{
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john@company.com",
  "department": "IT"
}
```

#### Attendance
```
GET    /attendance/             # List all attendance (with filters)
POST   /attendance/             # Mark attendance
GET    /attendance/{id}/        # Get attendance by ID
PUT    /attendance/{id}/        # Update attendance
DELETE /attendance/{id}/        # Delete attendance
```

**Query Parameters for List:**
- `employee_id` - Filter by employee ID
- `date` - Filter by date (YYYY-MM-DD)
- `status` - Filter by status (Present/Absent)

**Mark Attendance Request:**
```json
{
  "employee_id": "EMP001",
  "date": "2024-01-15",
  "status": "Present"
}
```

### Error Responses
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "field_name": ["Error details"]
  }
}
```

## Production Deployment

### Backend Deployment (Render)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up or login

2. **Create PostgreSQL Database**
   - Click "New" → "PostgreSQL"
   - Name: `hrms-lite-db`
   - Region: Choose closest to your users
   - Plan: Free
   - Click "Create Database"
   - Copy the **Internal Database URL**

3. **Deploy Backend**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** `hrms-lite-backend`
     - **Environment:** Python 3
     - **Build Command:** `./build.sh`
     - **Start Command:** `gunicorn hrms.wsgi:application`

4. **Set Environment Variables**
   ```
   DEBUG=False
   SECRET_KEY=<generate-strong-secret-key>
   DATABASE_URL=<paste-internal-database-url>
   ALLOWED_HOSTS=.onrender.com
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```

5. **Make build.sh executable**
   ```bash
   chmod +x backend/build.sh
   git add .
   git commit -m "Make build script executable"
   git push
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your backend URL: `https://hrms-lite-backend.onrender.com`

### Frontend Deployment (Vercel)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or login

2. **Deploy Frontend**
   - Click "New Project"
   - Import your Git repository
   - Configure:
     - **Framework Preset:** Other
     - **Root Directory:** `frontend`
     - Click "Deploy"

3. **Update API Base URL**
   - After deployment, go to your Vercel project settings
   - Add environment variable:
     ```
     API_BASE_URL=https://hrms-lite-backend.onrender.com/api
     ```
   - Or update directly in `index.html`, `employees.html`, and `attendance.html`:
     ```javascript
     const API_BASE_URL = 'https://hrms-lite-backend.onrender.com/api';
     ```

4. **Update CORS in Backend**
   - Go to Render dashboard
   - Update `CORS_ALLOWED_ORIGINS` with your Vercel URL:
     ```
     CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
     ```

## Database Schema

### Employee Table
```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Attendance Table
```sql
CREATE TABLE attendances (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(10) CHECK (status IN ('Present', 'Absent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, date)
);

CREATE INDEX idx_attendance_employee_date ON attendances(employee_id, date);
CREATE INDEX idx_attendance_date ON attendances(date);
```

## Key Features Explained

### Backend Features

1. **Production-Ready Settings**
   - Environment-based configuration
   - Secure secret key management
   - CORS configured for cross-origin requests
   - WhiteNoise for static file serving
   - Security settings for HTTPS

2. **Database Optimization**
   - Proper indexes on frequently queried fields
   - Unique constraints for data integrity
   - Foreign key relationships with CASCADE delete
   - Efficient query optimization with `select_related`

3. **API Validation**
   - Server-side validation for all inputs
   - Unique constraint checks
   - Email format validation
   - Date validation (no future dates)
   - Meaningful error messages

4. **Error Handling**
   - Custom exception handler
   - Consistent error response format
   - HTTP status codes
   - Detailed error messages

### Frontend Features

1. **Modern UI/UX**
   - Gradient backgrounds with blur effects
   - Smooth animations and transitions
   - Responsive design for all devices
   - Loading states for better UX
   - Empty states with helpful messages
   - Toast notifications for user feedback

2. **Performance**
   - No external framework dependencies
   - Optimized vanilla JavaScript
   - Efficient DOM manipulation
   - Debounced filter inputs

3. **User Experience**
   - Form validation before submission
   - Loading indicators during API calls
   - Success/error notifications
   - Confirmation dialogs for destructive actions
   - Auto-refresh after CRUD operations

## Troubleshooting

### Backend Issues

**Database Connection Error:**
```
Solution: Verify PostgreSQL is running and credentials in .env are correct
```

**Port Already in Use:**
```bash
# Find process using port 8000
lsof -i :8000
# Kill the process
kill -9 <PID>
```

**Migration Errors:**
```bash
# Delete all migration files except __init__.py
# Then run:
python manage.py makemigrations
python manage.py migrate
```

### Frontend Issues

**API Connection Error:**
```
Solution: Ensure backend is running and API_BASE_URL is correct
```

**CORS Error:**
```
Solution: Add your frontend URL to CORS_ALLOWED_ORIGINS in backend .env
```

**Live Server Not Working:**
```
Solution: Use Python HTTP server instead:
python -m http.server 5500
```

## Security Best Practices

1. **Never commit `.env` file** - Use `.env.example` as template
2. **Generate strong SECRET_KEY** in production
3. **Use HTTPS** in production (Render and Vercel provide this)
4. **Validate all user inputs** on both frontend and backend
5. **Use environment variables** for sensitive data
6. **Enable Django security settings** in production
7. **Regular security updates** for dependencies

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Contact: your-email@example.com

## Acknowledgments

- Django Framework
- Django REST Framework
- PostgreSQL
- Render.com
- Vercel

---

**Built with ❤️ for modern HR management**