# Event Management System - Frontend

A modern, responsive web application built with Next.js 16, React 19, and TypeScript. This frontend provides an intuitive user interface for discovering, joining, and managing events, with role-based dashboards for Users, Hosts, and Administrators.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Components](#components)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### User Experience

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode**: Theme switching with next-themes
- **Form Validation**: Zod schema validation with React Hook Form
- **Toast Notifications**: User feedback with Sonner
- **Image Optimization**: Next.js Image component with Cloudinary integration
- **Loading States**: Skeleton loaders and loading indicators

### Authentication & Authorization

- JWT-based authentication with cookie storage
- Role-based access control (USER, HOST, ADMIN)
- Protected routes and layouts
- Automatic token refresh
- Password reset flow

### User Features

- User registration and profile management
- Browse and search events with advanced filters
- Join events and manage participation
- View dashboard with statistics
- Review and rate hosts after events
- Payment processing with Stripe

### Host Features

- Host request submission
- Create and manage events
- View event participants
- Host dashboard with revenue tracking
- Event status management

### Admin Features

- Comprehensive admin dashboard
- User management (view, delete, status change)
- Host management and approval workflow
- Event moderation
- Platform statistics and analytics

## 🛠 Tech Stack

### Core Framework

- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety

### UI & Styling

- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **next-themes**: Dark mode support

### Forms & Validation

- **React Hook Form**: Form state management
- **Zod 4**: Schema validation
- **@hookform/resolvers**: Zod integration

### Data Visualization

- **Recharts**: Chart library for dashboards

### Utilities

- **date-fns**: Date manipulation
- **clsx & tailwind-merge**: Conditional class names
- **cookie**: Cookie parsing
- **jsonwebtoken**: JWT handling

### Additional Libraries

- **react-day-picker**: Date picker component
- **embla-carousel-react**: Carousel component
- **sonner**: Toast notifications
- **vaul**: Drawer component

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm**, **yarn**, **pnpm**, or **bun**
- **Git**

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd frontend-event-management-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Stripe (for payment processing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Optional: Analytics, etc.
# NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### Getting Environment Variables

- **API URL**: Should point to your backend server (default: `http://localhost:5000/api/v1`)
- **Stripe Publishable Key**: Get from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

## ▶️ Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:3000` with hot-reload enabled.

### Production Build

```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
frontend-event-management-system/
├── public/                      # Static assets
│   └── images/                  # Public images
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (commonLayout)/      # Public pages layout
│   │   │   ├── page.tsx         # Home page
│   │   │   ├── about/           # About page
│   │   │   ├── events/          # Events listing & details
│   │   │   └── profile/         # Public profile pages
│   │   ├── (dashboardLayout)/   # Protected dashboard layout
│   │   │   ├── dashboard/      # User/Host/Admin dashboards
│   │   │   ├── events/         # Event management
│   │   │   └── admin/          # Admin pages
│   │   ├── api/                # API routes (if any)
│   │   ├── assets/             # Images, fonts, etc.
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Global styles
│   │   └── not-found.tsx       # 404 page
│   ├── components/             # React components
│   │   ├── modules/            # Feature-specific components
│   │   │   ├── Home/          # Home page components
│   │   │   ├── Events/        # Event-related components
│   │   │   ├── Auth/          # Authentication components
│   │   │   ├── Dashboard/     # Dashboard components
│   │   │   └── Admin/        # Admin components
│   │   └── shared/            # Reusable components
│   │       ├── navbar.tsx     # Navigation bar
│   │       ├── footer.tsx       # Footer
│   │       └── ui/             # shadcn/ui components
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts         # Authentication hook
│   │   └── useApi.ts          # API call hook
│   ├── lib/                    # Utility libraries
│   │   ├── utils.ts           # Helper functions
│   │   └── api.ts             # API client configuration
│   ├── services/               # API service functions
│   │   ├── auth.service.ts     # Auth API calls
│   │   ├── user.service.ts    # User API calls
│   │   ├── event.service.ts   # Event API calls
│   │   ├── payment.service.ts # Payment API calls
│   │   └── ...
│   ├── zod/                    # Zod validation schemas
│   │   ├── auth.schema.ts     # Auth validation
│   │   ├── user.schema.ts     # User validation
│   │   └── event.schema.ts    # Event validation
│   └── proxy.ts               # API proxy configuration
├── components.json            # shadcn/ui configuration
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## 🗺 Pages & Routes

### Public Routes

| Route              | Description                        |
| ------------------ | ---------------------------------- |
| `/`                | Home/Landing page                  |
| `/about`           | About page                         |
| `/events`          | Events listing with search/filters |
| `/events/[id]`     | Event details page                 |
| `/profile/[id]`    | Public user profile                |
| `/login`           | Login page                         |
| `/register`        | Registration page                  |
| `/forgot-password` | Password reset request             |
| `/reset-password`  | Password reset form                |

### Protected Routes (User)

| Route                        | Description                    |
| ---------------------------- | ------------------------------ |
| `/dashboard`                 | User dashboard with statistics |
| `/dashboard/events`          | My joined events               |
| `/dashboard/events/upcoming` | Upcoming events                |
| `/dashboard/events/past`     | Past events                    |
| `/profile/edit`              | Edit my profile                |

### Protected Routes (Host)

| Route                                 | Description               |
| ------------------------------------- | ------------------------- |
| `/dashboard`                          | Host dashboard with stats |
| `/dashboard/events`                   | My hosted events          |
| `/dashboard/events/create`            | Create new event          |
| `/dashboard/events/[id]/edit`         | Edit event                |
| `/dashboard/events/[id]/participants` | View participants         |
| `/host/request`                       | Submit host request       |

### Protected Routes (Admin)

| Route               | Description         |
| ------------------- | ------------------- |
| `/admin/dashboard`  | Admin dashboard     |
| `/admin/users`      | User management     |
| `/admin/hosts`      | Host management     |
| `/admin/events`     | Event management    |
| `/admin/statistics` | Platform statistics |

## 🧩 Components

### Home Page Components

- **Hero**: Main hero section with CTA
- **EventCategories**: Browse events by category
- **WhyChooseUs**: Platform benefits
- **HowItWorks**: Step-by-step guide
- **FeaturedEvents**: Highlighted events
- **Testimonials**: User reviews and testimonials

### Shared Components

- **Navbar**: Responsive navigation with role-based menus
- **Footer**: Site footer with links
- **Button**: Reusable button component
- **Card**: Card container component
- **Dialog**: Modal dialogs
- **Form**: Form components with validation
- **Toast**: Notification toasts

### Feature Components

- **EventCard**: Event display card
- **EventFilters**: Search and filter sidebar
- **UserProfile**: User profile display
- **DashboardStats**: Statistics cards
- **PaymentForm**: Stripe payment integration
- **ReviewForm**: Review submission form

## 🔄 State Management

The application uses a combination of:

1. **Server Components**: Next.js 16 App Router with server components for data fetching
2. **React Hooks**: `useState`, `useEffect`, `useContext` for client-side state
3. **Custom Hooks**:
   - `useAuth`: Authentication state and user info
   - `useApi`: API call wrapper with loading/error states
4. **Cookies**: JWT tokens stored in HTTP-only cookies
5. **URL State**: Query parameters for filters and search

## 🌐 API Integration

### API Client Setup

API calls are made through service functions in `src/services/`. The base API URL is configured via `NEXT_PUBLIC_API_URL`.

### Example Service Function

```typescript
// src/services/event.service.ts
export const getEvents = async (params?: EventFilters) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/event?${new URLSearchParams(params)}`,
    {
      credentials: "include", // Include cookies
    }
  );
  return response.json();
};
```

### Authentication

- Tokens are stored in HTTP-only cookies
- Cookies are automatically included in requests with `credentials: 'include'`
- Token refresh is handled automatically

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS 4 with a custom configuration. Utility classes are used throughout for styling.

### Theme Configuration

- **Light Mode**: Default theme
- **Dark Mode**: Toggleable via next-themes
- **Custom Colors**: Defined in `tailwind.config.ts`

### Component Styling

Components use:

- **Tailwind utilities**: For layout and spacing
- **CSS Variables**: For theme colors
- **shadcn/ui**: Pre-styled accessible components

### Responsive Design

Breakpoints:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**

   ```bash
   git push origin main
   ```

2. **Import to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Configure environment variables
   - Deploy

3. **Environment Variables**
   Add all variables from `.env.local` in Vercel dashboard

### Other Platforms

The application can be deployed to:

- **Netlify**: Similar to Vercel
- **AWS Amplify**: AWS hosting
- **Docker**: Containerized deployment
- **Self-hosted**: Node.js server

### Build for Production

```bash
npm run build
```

The output will be in the `.next` directory.

## 🧪 Testing

### Manual Testing

1. **Authentication Flow**

   - Register new user
   - Login/logout
   - Password reset

2. **Event Management**

   - Browse events
   - Filter and search
   - Join/leave events
   - Create events (as host)

3. **Payment Flow**

   - Create payment intent
   - Complete Stripe checkout
   - Verify payment status

4. **Dashboard**
   - View statistics
   - Manage events
   - View participants

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add some amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Style Guidelines

- Use TypeScript for all new files
- Follow React best practices
- Use functional components with hooks
- Follow the existing folder structure
- Use Tailwind CSS for styling
- Validate forms with Zod schemas
- Handle loading and error states
- Make components accessible (ARIA labels, keyboard navigation)

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Alifa Ara Heya**

---

## 🆘 Troubleshooting

### Common Issues

**1. Module Not Found Errors**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. TypeScript Errors**

```bash
# Regenerate TypeScript types
npm run build
```

**3. Styling Issues**

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**4. API Connection Errors**

- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure backend server is running
- Check CORS configuration in backend

**5. Image Optimization Errors**

- Verify Cloudinary domain in `next.config.ts`
- Check image URLs are using HTTPS
- Ensure images are publicly accessible

**6. Authentication Issues**

- Clear browser cookies
- Check token expiration
- Verify backend authentication endpoints

---

For more information or support, please open an issue on the repository.
