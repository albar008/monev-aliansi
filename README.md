# CEC Sekolah Admin Panel

Full-stack admin panel application with React frontend and Laravel backend.

## Tech Stack

- **Frontend**: React 18+ (Vite), Bootstrap 5, DataTables, Chart.js
- **Backend**: Laravel 12+, MySQL, Laravel Sanctum
- **Authentication**: JWT tokens with CAPTCHA

## Features

- User authentication with CAPTCHA
- Role-Based Access Control (Admin/User)
- Dashboard with charts (Bar chart, Doughnut chart)
- Data Tables with Export (Excel, PDF, Print)
- CRUD operations for Projects, Users, Penanggung Jawab, Porsi Perusahaan

## Folder Structure

```
cec-sekolah/
├── backend/                    # Laravel Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/  # API Controllers
│   │   │   └── Middleware/       # Custom Middleware
│   │   └── Models/               # Eloquent Models
│   ├── database/
│   │   ├── migrations/          # Database Migrations
│   │   └── sample_data.sql      # Sample Data
│   └── routes/
│       └── api.php              # API Routes
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable Components
│   │   ├── context/            # React Context
│   │   ├── pages/              # Page Components
│   │   ├── services/           # API Service
│   │   └── App.jsx             # Main App Component
│   └── vite.config.js          # Vite Configuration
│
└── README.md                   # This file
```

## Setup Instructions

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+
- XAMPP/WAMP/MAMP (optional)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   composer install
   ```

3. **Configure database:**
   - Copy `.env.example` to `.env`
   - Update MySQL credentials:
     ```
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=cec_sekolah
     DB_USERNAME=root
     DB_PASSWORD=
     ```

4. **Create database:**
   ```bash
   mysql -u root -p -e "CREATE DATABASE cec_sekolah CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```

5. **Generate application key:**
   ```bash
   php artisan key:generate
   ```

6. **Run migrations:**
   ```bash
   php artisan migrate
   ```

7. **Import sample data (optional):**
   ```bash
   mysql -u root -p cec_sekolah < database/sample_data.sql
   ```

8. **Start the development server:**
   ```bash
   php artisan serve
   ```
   Server will run at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Frontend will run at `http://localhost:3000`

## Default Login Credentials

| Username | Password   | Role  |
|----------|------------|-------|
| admin    | admin123   | admin |
| user     | admin123   | user  |

## Authentication Flow

1. User visits the application
2. If not authenticated → redirected to Login page
3. Login page displays:
   - Username field
   - Password field
   - Server-generated CAPTCHA image
   - User must enter correct CAPTCHA
4. On successful login:
   - JWT token stored in localStorage
   - User redirected to Dashboard
5. On failed login:
   - Error message displayed
   - CAPTCHA refreshed

## Role-Based Access Control

### Roles
- **Admin**: Full access to all pages including Users management
- **User**: Access to Dashboard, Daftar Proyek, and Data Proyek

### Backend Protection
- API routes protected by `auth:sanctum` middleware
- Role validation in UserController (admin-only endpoints)
- Returns 403 Forbidden for unauthorized access

### Frontend Protection
- ProtectedRoute component wraps authenticated routes
- Sidebar menu items hidden based on user role
- Direct URL access prevented for unauthorized routes

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user
- `GET /api/captcha` - Get CAPTCHA image

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/projects-per-month` - Get projects per month data
- `GET /api/dashboard/porsi-distribution` - Get porsi distribution data

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/{id}` - Get project details
- `POST /api/projects` - Create project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Users (Admin only)
- `GET /api/users` - List all users
- `GET /api/users/{id}` - Get user details
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Penanggung Jawab
- `GET /api/penanggung-jawab` - List all penanggung jawab
- `GET /api/penanggung-jawab/{id}` - Get details
- `POST /api/penanggung-jawab` - Create
- `PUT /api/penanggung-jawab/{id}` - Update
- `DELETE /api/penanggung-jawab/{id}` - Delete

### Porsi Perusahaan
- `GET /api/porsi-perusahaan` - List all porsi perusahaan
- `GET /api/porsi-perusahaan/{id}` - Get details
- `POST /api/porsi-perusahaan` - Create
- `PUT /api/porsi-perusahaan/{id}` - Update
- `DELETE /api/porsi-perusahaan/{id}` - Delete

## Design Specifications

### Color Palette
- Primary: #0d6efd (Bootstrap Blue)
- Background: #f8f9fa (Light Gray)
- Card Background: #ffffff (White)
- Text: #212529 (Dark Gray)
- Accent: Soft blue tones

### UI Components
- Light theme only
- Soft shadows (shadow-sm)
- Rounded corners (rounded-3)
- Clean, modern, minimalist interface
- Bootstrap 5 utility classes

### Charts
- Bar chart: Total projects per month
- Doughnut chart: Company portion distribution
- Light theme with soft colors
- Responsive layout

### DataTables
- Pagination
- Search
- Sorting
- Responsive
- Export to Excel
- Export to PDF
- Print functionality

## License

MIT License
