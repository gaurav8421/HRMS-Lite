# HRMS Lite - Quick Start Guide

Get your HRMS Lite application up and running in minutes!

## Prerequisites

Install these before proceeding:
- Python 3.11+
- PostgreSQL 12+
- Git

## Quick Setup (5 Minutes)

### Step 1: Setup Database (1 min)

```bash
# Start PostgreSQL
# macOS: brew services start postgresql@14
# Linux: sudo systemctl start postgresql

# Create database
psql -U postgres -c "CREATE DATABASE hrms_db;"
```

### Step 2: Backend Setup (2 mins)

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

Backend is now running at `http://localhost:8000`

### Step 3: Frontend Setup (1 min)

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Start simple HTTP server
python -m http.server 5500
```

Frontend is now running at `http://localhost:5500`

### Step 4: Test the Application (1 min)

1. Open browser: `http://localhost:5500`
2. Go to "Employees" tab
3. Add a test employee:
   - Employee ID: `EMP001`
   - Name: `John Doe`
   - Email: `john@test.com`
   - Department: `IT`
4. Go to "Attendance" tab
5. Mark attendance for `EMP001`
6. Check Dashboard for statistics

## Troubleshooting

**Database Error?**
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"
```

**Port Already in Use?**
```bash
# Backend (port 8000)
lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Frontend (port 5500)
lsof -i :5500 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

**Module Not Found?**
```bash
# Ensure virtual environment is activated
source venv/bin/activate
pip install -r requirements.txt
```

## Default Configuration

The application comes with sensible defaults in `backend/.env`:

- Database: `hrms_db`
- User: `postgres`
- Password: `postgres`
- Backend Port: `8000`
- Frontend Port: `5500`

Edit `backend/.env` to change these settings.

## Next Steps

1. **Create Superuser** (Optional):
   ```bash
   cd backend
   python manage.py createsuperuser
   ```
   Access admin panel at: `http://localhost:8000/admin`

2. **Explore API**:
   - Dashboard: `http://localhost:8000/api/dashboard/`
   - Employees: `http://localhost:8000/api/employees/`
   - Attendance: `http://localhost:8000/api/attendance/`

3. **Deploy to Production**:
   - See `README.md` for detailed deployment instructions
   - Backend: Render.com
   - Frontend: Vercel
   - Database: Render PostgreSQL

## API Testing

Test the API using curl:

```bash
# Get all employees
curl http://localhost:8000/api/employees/

# Create employee
curl -X POST http://localhost:8000/api/employees/ \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP002",
    "full_name": "Jane Smith",
    "email": "jane@test.com",
    "department": "HR"
  }'

# Mark attendance
curl -X POST http://localhost:8000/api/attendance/ \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP002",
    "date": "2024-01-15",
    "status": "Present"
  }'
```

## Features Overview

- **Dashboard**: Real-time statistics and recent attendance
- **Employees**: Add, view, and manage employees
- **Attendance**: Mark and track attendance with filters

## Support

Need help? Check:
- Full documentation: `README.md`
- API documentation: See README.md → API Documentation section
- Issues: Open an issue on GitHub

---

Happy managing! 🚀
