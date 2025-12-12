# Event Management System - Backend API

A comprehensive RESTful API backend for an event management platform built with Node.js, Express.js, TypeScript, and PostgreSQL. This system enables users to discover, join, and manage events, hosts to create and manage their events, and administrators to oversee the entire platform.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Contributing](#contributing)

## ✨ Features

### User Management

- User registration and authentication (JWT-based)
- Role-based access control (USER, HOST, ADMIN)
- Profile management with file uploads (Cloudinary)
- Password reset functionality
- User dashboard with statistics

### Host Management

- Host request submission and approval workflow
- Host profile management
- Host dashboard with event statistics and revenue tracking
- Host-specific event management

### Event Management

- Create, read, update, and delete events
- Event search and filtering (by type, location, date, status)
- Event participation system
- Event status management (UPCOMING, ONGOING, COMPLETED, CANCELLED)
- Host-specific event management

### Payment Integration

- Stripe payment processing
- Payment intent creation
- Webhook handling for payment status updates
- Payment history tracking

### Review & Rating System

- Post-event reviews and ratings
- Host rating aggregation
- Event-specific reviews
- Review filtering and pagination

### Admin Dashboard

- Comprehensive platform statistics
- User management (view, delete, status change)
- Host management
- Event management and moderation
- Detailed analytics and reporting

## 🛠 Tech Stack

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
- **Password Hashing**: bcryptjs

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Git**

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
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

4. **Set up the database**

   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # (Optional) Seed the database
   # npx prisma db seed
   ```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/event_management?schema=public"

# Password Hashing
BCRYPT_SALT_ROUND=12

# JWT Configuration
JWT_ACCESS_SECRET=your_access_secret_key
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES=90d
RESET_PASS_TOKEN=your_reset_password_secret
RESET_PASS_TOKEN_EXPIRES_IN=1h
RESET_PASS_LINK=http://localhost:5173/reset-password

# Cloudinary (File Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Nodemailer)
EMAIL=your_email@gmail.com
APP_PASS=your_app_password

# Stripe Payment
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Getting Environment Variables

- **Cloudinary**: Sign up at [cloudinary.com](https://cloudinary.com) and get your credentials from the dashboard
- **Stripe**: Sign up at [stripe.com](https://stripe.com) and get your API keys from the dashboard
- **Email**: For Gmail, generate an App Password from your Google Account settings
- **JWT Secrets**: Generate strong random strings (you can use `openssl rand -base64 32`)

## 🗄 Database Setup

### Using Prisma Migrate

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

### Prisma Studio (Database GUI)

```bash
npx prisma studio
```

This opens a visual database browser at `http://localhost:5555`

### Database Schema

The database schema is defined in the `prisma/schema/` directory:

- `user.prisma` - User, Host, Admin, HostRequest models
- `event.prisma` - Event, EventParticipant models
- `payment.prisma` - Payment model
- `review-rating.prisma` - Review model
- `enum.prisma` - All enums used across the application

## ▶️ Running the Application

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

### Production Mode

```bash
# Build the TypeScript code
npm run build

# Run the production server
npm start
```

## 📚 API Documentation

### Base URL

All API endpoints are prefixed with `/api/v1`

```
http://localhost:5000/api/v1
```

### Authentication Endpoints

| Method | Endpoint                | Description               | Auth Required   |
| ------ | ----------------------- | ------------------------- | --------------- |
| `POST` | `/auth/login`           | User login                | No              |
| `POST` | `/auth/refresh-token`   | Refresh access token      | No              |
| `GET`  | `/auth/me`              | Get current user info     | No              |
| `POST` | `/auth/change-password` | Change password           | Yes (All roles) |
| `POST` | `/auth/forgot-password` | Request password reset    | No              |
| `POST` | `/auth/reset-password`  | Reset password with token | No              |

### User Endpoints

| Method   | Endpoint                   | Description                  | Auth Required   |
| -------- | -------------------------- | ---------------------------- | --------------- |
| `POST`   | `/user`                    | Create new user              | No              |
| `POST`   | `/user/create-admin`       | Create admin user            | Yes (ADMIN)     |
| `POST`   | `/user/create-host`        | Create host user             | No              |
| `GET`    | `/user/me`                 | Get my profile               | Yes (All roles) |
| `GET`    | `/user/:id/profile`        | Get public user profile      | No              |
| `PATCH`  | `/user/update-my-profile`  | Update my profile            | Yes (All roles) |
| `GET`    | `/user/my/events`          | Get my joined events         | Yes (USER)      |
| `GET`    | `/user/my/events/upcoming` | Get my upcoming events       | Yes (USER)      |
| `GET`    | `/user/my/events/past`     | Get my past events           | Yes (USER)      |
| `GET`    | `/user/my/dashboard`       | Get my dashboard stats       | Yes (USER)      |
| `GET`    | `/user`                    | Get all users (with filters) | Yes (ADMIN)     |
| `DELETE` | `/user/:id`                | Delete user (soft delete)    | Yes (ADMIN)     |
| `PATCH`  | `/user/:id/status`         | Change user status           | Yes (ADMIN)     |

### Host Endpoints

| Method   | Endpoint                     | Description            | Auth Required |
| -------- | ---------------------------- | ---------------------- | ------------- |
| `POST`   | `/host/request`              | Submit host request    | Yes (USER)    |
| `GET`    | `/host/requests`             | Get all host requests  | Yes (ADMIN)   |
| `PATCH`  | `/host/requests/:id/approve` | Approve host request   | Yes (ADMIN)   |
| `PATCH`  | `/host/requests/:id/reject`  | Reject host request    | Yes (ADMIN)   |
| `GET`    | `/host/my/stats`             | Get my host statistics | Yes (HOST)    |
| `GET`    | `/host`                      | Get all hosts          | Yes (ADMIN)   |
| `GET`    | `/host/:id`                  | Get host by ID         | No            |
| `PATCH`  | `/host/:id/status`           | Update host status     | Yes (ADMIN)   |
| `DELETE` | `/host/:id`                  | Delete host            | Yes (ADMIN)   |

### Event Endpoints

| Method   | Endpoint                                 | Description                          | Auth Required |
| -------- | ---------------------------------------- | ------------------------------------ | ------------- |
| `POST`   | `/event`                                 | Create event                         | Yes (HOST)    |
| `GET`    | `/event`                                 | Get all events (with search/filters) | No            |
| `GET`    | `/event/:id`                             | Get event by ID                      | No            |
| `GET`    | `/event/my/events`                       | Get my hosted events                 | Yes (HOST)    |
| `PATCH`  | `/event/:id`                             | Update event                         | Yes (HOST)    |
| `PATCH`  | `/event/:id/status`                      | Update event status                  | Yes (HOST)    |
| `DELETE` | `/event/:id`                             | Delete event (soft delete)           | Yes (HOST)    |
| `GET`    | `/event/:id/participants`                | Get event participants               | Yes (HOST)    |
| `DELETE` | `/event/:id/participants/:participantId` | Remove participant                   | Yes (HOST)    |

**Query Parameters for `/event` (GET):**

- `searchTerm` - Search in event name, description, location
- `type` - Filter by event type (CONCERT, HIKE, DINNER, etc.)
- `location` - Filter by location
- `status` - Filter by status (UPCOMING, ONGOING, COMPLETED, CANCELLED)
- `minPrice` / `maxPrice` - Filter by price range
- `dateFrom` / `dateTo` - Filter by date range
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort order (asc/desc)

### Payment Endpoints

| Method   | Endpoint                 | Description                  | Auth Required         |
| -------- | ------------------------ | ---------------------------- | --------------------- |
| `POST`   | `/payment/create-intent` | Create Stripe payment intent | Yes (USER)            |
| `GET`    | `/payment/:id`           | Get payment by ID            | Yes (USER)            |
| `GET`    | `/payment/my/payments`   | Get my payments              | Yes (USER)            |
| `DELETE` | `/payment/:id`           | Cancel unpaid payment        | Yes (USER)            |
| `POST`   | `/webhook`               | Stripe webhook endpoint      | No (Stripe signature) |

### Review Endpoints

| Method | Endpoint                 | Description                    | Auth Required |
| ------ | ------------------------ | ------------------------------ | ------------- |
| `POST` | `/review`                | Create review                  | Yes (USER)    |
| `GET`  | `/review`                | Get all reviews (with filters) | No            |
| `GET`  | `/review/host/:hostId`   | Get reviews for a host         | No            |
| `GET`  | `/review/event/:eventId` | Get reviews for an event       | No            |

**Query Parameters for `/review` (GET):**

- `reviewerEmail` - Filter by reviewer email
- `hostEmail` - Filter by host email
- `eventId` - Filter by event ID
- `page` - Page number
- `limit` - Items per page
- `sortBy` - Sort field
- `sortOrder` - Sort order

### Admin Endpoints

| Method   | Endpoint                   | Description                 | Auth Required |
| -------- | -------------------------- | --------------------------- | ------------- |
| `GET`    | `/admin/dashboard/stats`   | Get dashboard statistics    | Yes (ADMIN)   |
| `GET`    | `/admin/events`            | Get all events (admin view) | Yes (ADMIN)   |
| `PATCH`  | `/admin/events/:id`        | Update any event            | Yes (ADMIN)   |
| `PATCH`  | `/admin/events/:id/status` | Update event status         | Yes (ADMIN)   |
| `DELETE` | `/admin/events/:id`        | Delete event                | Yes (ADMIN)   |
| `GET`    | `/admin/statistics/events` | Get event statistics        | Yes (ADMIN)   |
| `GET`    | `/admin/statistics/users`  | Get user statistics         | Yes (ADMIN)   |
| `GET`    | `/admin/statistics/hosts`  | Get host statistics         | Yes (ADMIN)   |

## 🔒 Authentication

### JWT Token Structure

The API uses JWT tokens for authentication. Tokens are stored in HTTP-only cookies.

**Access Token:**

- Stored in `accessToken` cookie
- Expires in 1 day (configurable)
- Contains: `{ email, role }`

**Refresh Token:**

- Stored in `refreshToken` cookie
- Expires in 90 days (configurable)
- Used to generate new access tokens

### Authentication Flow

1. **Login**: `POST /api/v1/auth/login`

   - Returns access and refresh tokens in cookies
   - Returns `needPasswordChange` flag

2. **Protected Routes**: Include authentication middleware

   - Tokens are automatically read from cookies
   - Or send `Authorization: Bearer <token>` header

3. **Refresh Token**: `POST /api/v1/auth/refresh-token`
   - Use when access token expires
   - Returns new access token

### Role-Based Access Control

- **USER**: Can join events, make payments, write reviews
- **HOST**: Can create/manage events, view participants, see host stats
- **ADMIN**: Full access to all endpoints, user/host/event management

## 📁 Project Structure

```
backend-event-management/
├── prisma/
│   ├── schema/
│   │   ├── user.prisma          # User, Host, Admin models
│   │   ├── event.prisma         # Event, EventParticipant models
│   │   ├── payment.prisma       # Payment model
│   │   ├── review-rating.prisma # Review model
│   │   └── enum.prisma          # All enums
│   └── migrations/              # Database migrations
├── src/
│   ├── app/
│   │   ├── errors/              # Custom error classes
│   │   ├── helpers/             # Utility functions
│   │   │   ├── fileUploader.ts  # Cloudinary upload helper
│   │   │   ├── jwtHelper.ts    # JWT utilities
│   │   │   ├── paginationHelper.ts # Pagination utilities
│   │   │   └── emailSender.ts   # Email sending helper
│   │   ├── middlewares/         # Express middlewares
│   │   │   ├── validateRequest.ts # Auth & validation middleware
│   │   │   └── globalErrorHandler.ts # Error handling
│   │   ├── modules/             # Feature modules
│   │   │   ├── auth/            # Authentication module
│   │   │   ├── user/            # User management module
│   │   │   ├── host/            # Host management module
│   │   │   ├── event/           # Event management module
│   │   │   ├── payment/         # Payment processing module
│   │   │   ├── review/          # Review & rating module
│   │   │   └── admin/           # Admin dashboard module
│   │   ├── routes/              # Route aggregator
│   │   ├── shared/              # Shared utilities
│   │   │   └── prisma.ts        # Prisma client instance
│   │   └── types/               # TypeScript type definitions
│   ├── config/                  # Configuration files
│   │   └── index.ts             # Environment config
│   ├── app.ts                   # Express app setup
│   └── server.ts                # Server entry point
├── uploads/                     # Temporary file uploads
├── .env                         # Environment variables (not in git)
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

### Module Structure

Each module follows a consistent structure:

```
module-name/
├── module-name.controller.ts    # Request handlers
├── module-name.service.ts        # Business logic
├── module-name.routes.ts         # Route definitions
├── module-name.validation.ts    # Zod validation schemas
└── module-name.constant.ts      # Constants (if needed)
```

## 🧪 Testing

### Manual Testing with Postman

1. **Import Collection**: Create a Postman collection with all endpoints
2. **Set Base URL**: `http://localhost:5000/api/v1`
3. **Authentication**:
   - Login first to get cookies
   - Postman will automatically include cookies in subsequent requests

### Testing Stripe Webhooks Locally

1. **Install Stripe CLI**: [stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)

2. **Login to Stripe**:

   ```bash
   stripe login
   ```

3. **Forward webhooks to local server**:

   ```bash
   stripe listen --forward-to localhost:5000/webhook
   ```

4. **Get webhook secret** from the CLI output and add to `.env`:

   ```env
   WEBHOOK_SECRET=whsec_...
   ```

5. **Trigger test events**:
   ```bash
   stripe trigger checkout.session.completed
   ```

### Testing Email Functionality

For development, you can use services like:

- **Mailtrap** (recommended for testing)
- **Ethereal Email** (generates test accounts)
- **Gmail App Password** (for production)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add some amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Style Guidelines

- Use TypeScript for type safety
- Follow the existing module structure
- Use Zod for validation
- Handle errors with custom `ApiError` class
- Use Prisma transactions for multi-step operations
- Add comments for complex logic
- Keep functions focused and single-purpose

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Alifa Ara Heya**

---

## 🆘 Troubleshooting

### Common Issues

**1. Database Connection Error**

- Verify `DATABASE_URL` in `.env` is correct
- Ensure PostgreSQL is running
- Check database credentials

**2. Prisma Client Not Generated**

```bash
npx prisma generate
```

**3. Migration Errors**

```bash
# Reset database (WARNING: Deletes data)
npx prisma migrate reset

# Or manually fix migrations
npx prisma migrate dev
```

**4. Port Already in Use**

- Change `PORT` in `.env`
- Or kill the process using the port

**5. Cloudinary Upload Fails**

- Verify Cloudinary credentials in `.env`
- Check file size limits
- Ensure correct file format

**6. Stripe Webhook Not Working**

- Verify `WEBHOOK_SECRET` matches Stripe CLI output
- Ensure webhook endpoint is accessible
- Check Stripe dashboard for webhook events

---

For more information or support, please open an issue on the repository.
