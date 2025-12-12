# 🎉 Event Management System

A full-stack event management platform that connects people through local events, activities, and shared interests. Whether it's a concert, hiking trip, board game night, or tech meetup, users can discover events, join activities, and connect with like-minded individuals.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Project Overview

The Event Management System is a comprehensive platform that bridges the gap between online discovery and offline participation. It enables:

- **Users** to discover and join local events based on their interests
- **Hosts** to create and manage events, track participants, and receive payments
- **Administrators** to oversee the platform, manage users, hosts, and events

### Key Objectives

- Build a social platform for connecting people based on events and activities
- Enable event creation and participant matching
- Provide secure, intuitive, and responsive UI/UX
- Implement role-based authentication and secure data handling
- Support payment processing for paid events

## ✨ Features

### 🔐 Authentication & Authorization

- JWT-based authentication with refresh tokens
- Role-based access control (USER, HOST, ADMIN)
- Password reset functionality
- Secure cookie-based session management

### 👤 User Management

- User registration and profile management
- Public user profiles
- Interest-based matching
- User dashboard with statistics

### 🎪 Event Management

- Create, read, update, and delete events
- Advanced search and filtering (type, location, date, price)
- Event participation system
- Event status management (UPCOMING, ONGOING, COMPLETED, CANCELLED)
- Host-specific event management

### 🏠 Host Management

- Host request submission and approval workflow
- Host profile management
- Host dashboard with revenue tracking
- Event participant management
- Host statistics and analytics

### 💳 Payment Integration

- Stripe payment processing
- Secure checkout flow
- Payment history tracking
- Webhook handling for payment status updates

### ⭐ Review & Rating System

- Post-event reviews and ratings (1-5 stars)
- Host rating aggregation
- Event-specific reviews
- Review filtering and pagination

### 👨‍💼 Admin Dashboard

- Comprehensive platform statistics
- User management (view, delete, status change)
- Host management and approval
- Event moderation
- Detailed analytics and reporting

## 🛠 Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma 7.x
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer + Cloudinary
- **Payment**: Stripe
- **Email**: Nodemailer
- **Validation**: Zod 4.x

### Frontend

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Components**: Radix UI + shadcn/ui
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Themes**: next-themes

## 📁 Project Structure

```
event-management-system/
├── backend-event-management/      # Backend API
│   ├── prisma/                    # Database schema & migrations
│   ├── src/
│   │   ├── app/
│   │   │   ├── modules/          # Feature modules
│   │   │   │   ├── auth/         # Authentication
│   │   │   │   ├── user/         # User management
│   │   │   │   ├── host/         # Host management
│   │   │   │   ├── event/        # Event management
│   │   │   │   ├── payment/      # Payment processing
│   │   │   │   ├── review/       # Reviews & ratings
│   │   │   │   └── admin/        # Admin dashboard
│   │   │   ├── middlewares/      # Express middlewares
│   │   │   ├── helpers/          # Utility functions
│   │   │   └── routes/           # Route aggregator
│   │   ├── config/               # Configuration
│   │   └── server.ts             # Server entry point
│   ├── package.json
│   └── README.md                  # Backend documentation
│
├── frontend-event-management-system/  # Frontend application
│   ├── src/
│   │   ├── app/                   # Next.js App Router
│   │   │   ├── (commonLayout)/    # Public pages
│   │   │   ├── (dashboardLayout)/ # Protected pages
│   │   │   └── api/               # API routes
│   │   ├── components/            # React components
│   │   │   ├── modules/           # Feature components
│   │   │   └── shared/            # Reusable components
│   │   ├── services/              # API service functions
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── lib/                   # Utility libraries
│   │   └── zod/                   # Validation schemas
│   ├── public/                    # Static assets
│   ├── package.json
│   └── README.md                  # Frontend documentation
│
└── README.md                      # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **npm**, **yarn**, or **pnpm**
- **Git**

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend-event-management
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend-event-management-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

Frontend will run on `http://localhost:3000`

## 📚 Documentation

### Backend Documentation

See [backend-event-management/README.md](./backend-event-management/README.md) for:

- API endpoint documentation
- Database schema
- Authentication flow
- Environment variables
- Testing guide

### Frontend Documentation

See [frontend-event-management-system/README.md](./frontend-event-management-system/README.md) for:

- Component structure
- Page routes
- State management
- Styling guide
- Deployment instructions

## 💻 Development

### Running Both Services

**Option 1: Separate Terminals**

```bash
# Terminal 1 - Backend
cd backend-event-management
npm run dev

# Terminal 2 - Frontend
cd frontend-event-management-system
npm run dev
```

**Option 2: Using a Process Manager**

```bash
# Install concurrently
npm install -g concurrently

# Run both
concurrently "cd backend-event-management && npm run dev" "cd frontend-event-management-system && npm run dev"
```

### Development Workflow

1. **Backend Changes**

   - Make changes in `backend-event-management/src/`
   - Server auto-reloads with `tsx watch`
   - Test API endpoints with Postman or frontend

2. **Frontend Changes**

   - Make changes in `frontend-event-management-system/src/`
   - Next.js hot-reloads automatically
   - Changes reflect immediately in browser

3. **Database Changes**
   ```bash
   cd backend-event-management
   npx prisma migrate dev --name migration_name
   ```

### Code Style

- **Backend**: TypeScript with Express.js patterns
- **Frontend**: TypeScript with React functional components
- **Validation**: Zod schemas for both frontend and backend
- **Formatting**: Follow existing code style in each module

## 🚢 Deployment

### Backend Deployment

**Recommended Platforms:**

- **Railway**: Easy PostgreSQL + Node.js deployment
- **Render**: Free tier available
- **Heroku**: Classic platform
- **AWS/DigitalOcean**: Self-managed VPS

**Steps:**

1. Set environment variables
2. Run database migrations
3. Build TypeScript: `npm run build`
4. Start server: `npm start`

### Frontend Deployment

**Recommended Platforms:**

- **Vercel**: Optimized for Next.js (recommended)
- **Netlify**: Alternative platform
- **AWS Amplify**: AWS integration

**Steps:**

1. Connect repository
2. Set environment variables
3. Deploy automatically on push

### Environment Variables

**Backend (.env):**

- Database URL
- JWT secrets
- Cloudinary credentials
- Stripe keys
- Email configuration

**Frontend (.env.local):**

- API URL
- Stripe publishable key

## 🧪 Testing

### Backend Testing

- Use Postman for API testing
- Test Stripe webhooks with Stripe CLI
- Test email functionality with Mailtrap

### Frontend Testing

- Manual testing through browser
- Test authentication flows
- Test payment integration
- Test responsive design

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Commit**: `git commit -m 'Add amazing feature'`
5. **Push**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style
- Write clear commit messages
- Update documentation if needed
- Test your changes thoroughly
- Ensure TypeScript types are correct

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Alifa Ara Heya**

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) for the amazing framework
- [Prisma](https://www.prisma.io) for the excellent ORM
- [shadcn/ui](https://ui.shadcn.com) for beautiful components
- [Stripe](https://stripe.com) for payment processing
- [Cloudinary](https://cloudinary.com) for image management

## 📞 Support

For questions, issues, or contributions:

- Open an issue on GitHub
- Check the documentation in each subdirectory
- Review the requirements document

---

**Happy Coding! 🚀**
