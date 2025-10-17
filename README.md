# PhotoDiay - Marketplace Application

PhotoDiay is a full-stack marketplace application built with Angular (frontend) and Node.js/Express with Prisma (backend). It allows users to buy and sell articles with photo validation, featuring role-based access control for sellers, buyers, and administrators.

## 🏗️ Architecture

This project consists of two main parts:

- **Frontend**: Angular 20 application with standalone components
- **Backend**: Node.js/Express API with Prisma ORM and MySQL database

## 📋 Features

### User Roles
- **Seller (VENDEUR)**: Can create, manage, and sell articles
- **Buyer (ACHETEUR)**: Can browse, view, and purchase articles
- **Admin (ADMIN)**: Can validate articles, manage users, and view statistics

### Core Features
- **Article Management**: Create, edit, delete articles with photo validation
- **Photo Validation**: All articles must include photos taken with the app
- **Article Approval**: Admin validation system for published articles
- **Search & Filters**: Advanced filtering by category, price range, and sorting
- **Favorites**: Users can save favorite articles
- **Reporting**: Report inappropriate articles
- **Statistics**: Admin dashboard with platform statistics
- **Views Tracking**: Track article view counts
- **VIP System**: Premium seller features

### Article Status Flow
- `EN_ATTENTE` → `ACTIF` (approved by admin)
- `ACTIF` → `VENDU` (when purchased)
- `REFUSE` (rejected by admin with reason)
- `EXPIRE` (automatic expiration after 7 days)
- `SUPPRIME` (manually deleted)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MySQL database
- Angular CLI (for frontend development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd allphotoldiaye
   ```

2. **Backend Setup**
   ```bash
   cd photodiay
   npm install
   ```

3. **Database Setup**
   - Create a MySQL database
   - Set up your `.env` file with database credentials:
     ```
     DATABASE_URL="mysql://username:password@localhost:3306/photodiay"
     JWT_SECRET="your-secret-key"
     PORT=3000
     ```

4. **Run Database Migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Seed the Database (Optional)**
   ```bash
   npm run db:seed
   ```

6. **Start the Backend**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3000`

7. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

8. **Start the Frontend**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:4200`

## 📁 Project Structure

```
allphotoldiaye/
├── frontend/                 # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin-dashboard.component.ts    # Admin panel
│   │   │   ├── seller-dashboard.component.ts    # Seller dashboard
│   │   │   ├── home.component.ts               # Home page with articles
│   │   │   ├── login.component.ts              # Authentication
│   │   │   ├── register-seller.component.ts    # Seller registration
│   │   │   ├── article-detail/                 # Article detail page
│   │   │   └── services/                       # Angular services
│   │   └── assets/
│   └── package.json
└── photodiay/                # Node.js backend
    ├── src/
    │   ├── controller/       # Route controllers
    │   ├── service/          # Business logic
    │   ├── repository/       # Data access layer
    │   ├── middlewares/      # Authentication middleware
    │   ├── index.ts          # Server entry point
    │   └── routes.ts         # API routes
    ├── prisma/
    │   ├── schema.prisma     # Database schema
    │   ├── seed.ts           # Database seeding
    │   └── migrations/       # Database migrations
    ├── uploads/              # Uploaded article images
    └── package.json
```

## 🗄️ Database Schema

The application uses Prisma ORM with MySQL. Key entities:

- **Utilisateur**: Users with roles (VENDEUR, ACHETEUR, ADMIN)
- **Article**: Products with validation workflow
- **VueArticle**: Article view tracking
- **Favori**: User favorites
- **Signalement**: Article reports
- **StatistiquesAdmin**: Platform statistics

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Articles
- `GET /api/articles` - Get all active articles
- `POST /api/articles` - Create new article (authenticated)
- `PUT /api/articles/:id` - Update article (authenticated)
- `DELETE /api/articles/:id` - Delete article (authenticated)
- `GET /api/admin/articles/pending` - Get pending articles (admin)
- `PUT /api/admin/articles/:id/approve` - Approve article (admin)
- `PUT /api/admin/articles/:id/reject` - Reject article (admin)

### Users
- `GET /api/utilisateurs` - Get all users (admin)
- `PUT /api/utilisateurs/:id` - Update user (admin)
- `DELETE /api/utilisateurs/:id` - Delete user (admin)

### Other
- `POST /api/favoris` - Add to favorites
- `POST /api/signalements` - Report article
- `GET /api/statistiques` - Get platform statistics

## 🛠️ Development

### Backend Scripts
```bash
npm run dev      # Start development server with tsx
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm run db:seed  # Seed database with sample data
```

### Frontend Scripts
```bash
npm start        # Start development server
npm run build    # Build for production
npm test         # Run unit tests
```

### Database Management
```bash
npx prisma studio          # Open Prisma Studio
npx prisma migrate dev     # Run migrations in development
npx prisma generate        # Generate Prisma client
```

## 🔧 Technologies Used

### Frontend
- **Angular 20**: Framework for building the user interface
- **TypeScript**: Type-safe JavaScript
- **RxJS**: Reactive programming
- **Angular Router**: Client-side routing

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Prisma**: ORM for database management
- **MySQL**: Relational database
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing
- **multer**: File upload handling
- **CORS**: Cross-origin resource sharing

## 📱 Features Overview

### For Sellers
- Register as a seller
- Create articles with photo validation
- Manage their article listings
- View article statistics (views, interactions)
- Edit and delete their articles

### For Buyers
- Browse articles with advanced filters
- View article details
- Add articles to favorites
- Report inappropriate content

### For Admins
- Validate pending articles
- Manage user accounts
- View platform statistics
- Reject articles with reasons
- Delete inappropriate content

## 🚀 Deployment

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Build the backend**
   ```bash
   cd ../photodiay
   npm run build
   ```

3. **Set up production database**
   - Configure production DATABASE_URL
   - Run migrations: `npx prisma migrate deploy`

4. **Deploy both applications**
   - Frontend: Serve static files from `dist/frontend/browser/`
   - Backend: Run the built server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.