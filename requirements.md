# 🎯 Events & Activities

## 1. Project Overview

The Events & Activities Platform connects individuals who want to participate in local events, sports or hobbies but lack companions. Whether it’s a concert, a hiking trip, a board game night or a tech meetup, users can find like-minded people to join them. The platform fosters real-world social interactions based on shared interests and activities.

This project bridges the gap between online discovery and offline participation, ensuring no one has to miss out on an event just because they don't have someone to go with.

## 2. Objectives

- Build a social platform for connecting people based on events and activities.
- Enable event creation and participant matching.
- Allow users to build profiles showcasing their hobbies and interests.
- Provide a secure, intuitive and responsive UI/UX.
- Implement role-based authentication and secure data handling.

## 3. Core Features Breakdown

### 3.1 User Authentication & Roles

- **Register / Login**:
  - Email & Password
- **Roles**:
  - **User**: Can join events, view events, manage their profile.
  - **Host**: Can create events, manage their own events, view participants, receive payments.
  - **Admin**: Can manage users, events, hosts, moderate content.
- **Security**: JWT-based Auth, secure password hashing.

### 3.2 User Profile Management (CRUD)

- **Create & Edit Profile**:
  - Full Name
  - Profile Image (via Cloudinary)
  - Bio / About
  - Interests (e.g., Music, Sports, Gaming, Art)
  - Location (City/Area)
- **Public View**: Users can view other's profiles to find compatible activities.

### 3.3 Event & Activity Management (CRUD)

- **Manage Events**:
  - Event Name & Type (e.g., Concert, Hike, Dinner)
  - Date & Time
  - Location
  - Required Participants (Min/Max)
  - Description
  - Image (Cloudinary/ImgBB)
  - Joining Fee
  - Status (Open, Full, Cancelled, Completed)
- **Visibility**: Events are searchable by other users.

### 3.4 Search & Matching System

- **Search Criteria**:
  - Event Type / Category
  - Date & Time
  - Location

### 3.5 Review & Rating System

- **Users**: Rate and review hosts after attending events (1–5 stars).
- **Display**: Ratings visible on host profiles.

### 3.6 Payment Integration

- **Hosts**: Set ticket/joining fees for events.
- **Users**: Secure payment processing when joining paid events.
- **Payment Gateways**: Stripe / SSLCommerz / AmarPay or similar.

## 4. Pages & Functional Requirements

> **Note:** The pages listed below are examples to guide implementation. You must add additional pages and features as needed to meet all project requirements and create a complete, functional platform.

### 4.1 Navbar

- **When Logged Out**:
  - Logo (links to Home)
  - Explore Events
  - Become a Host
  - Login
  - Register
- **When Logged In (User)**:
  - Logo (links to Home)
  - Explore Events
  - My Events
  - Profile
  - Logout
- **When Logged In (Host)**:
  - Logo (links to Home)
  - Explore Events
  - My Events (Hosted)
  - Create Event
  - Profile
  - Logout
- **When Logged In (Admin)**:
  - Logo (links to Home)
  - Admin Dashboard
  - Manage Users
  - Manage Hosts
  - Manage Events
  - Profile
  - Logout

> **Note:** Feel free to add other navigation options as needed.

### 4.2 Authentication Pages

- **`/register`**: Sign up with default role User.
- **`/login`**: Standard secure login.

### 4.3 Home / Landing Page (`/`)

- Hero section explaining the concept.
- "Find Activities" or "Create Event" CTAs.
- Featured or upcoming events near the user.
  > **Note:** Must have a minimum of 6 sections on the home page. Add other necessary sections as needed (e.g., How It Works, Popular Events, Top-Rated Hosts, Testimonials/Reviews, Why Choose Us, Event Categories).

### 4.4 Profile Page (`/profile/[id]`)

- User details, interest tags, rating summary.
- List of hosted events and joined events.
- Actions: Edit Profile (self).

### 4.5 Dashboard (`/dashboard`)

- **For Users**: Upcoming joined events, Past events, Saved events.
- **For Hosts**: Hosted events (upcoming/past), Participants management, Revenue/Payment tracking.
- **For Admin**: User Management, Host Management, Event Management.

### 4.6 Create/Edit Event Page (`/events/create` or `/events/edit/[id]`)

- Form to input event details.
- Date/Time picker.
- Location input.
- Image upload for event banner.

### 4.7 Event Listing & Search Page (`/events`)

- Grid/List view of available events.
- Filters: Category, Date, Location.
- Search bar for keywords.

### 4.8 Event Details Page (`/events/[id]`)

- Full event info: Description, Time, Location, Cost/Joining Fee.
- Host profile summary.
- List of current participants.
- **Action**: "Join Event" / "Leave Event" button.

## 5. Optional Features

| Feature          | Description                                |
| :--------------- | :----------------------------------------- |
| 📅 Calendar View | Visual calendar of upcoming joined events  |
| 📍 Map View      | Browse events on an interactive map        |
| 🤝 Friend System | Follow/Add friends to see their activities |

## 6. Folder & API Structure

> **Note:** The folder structure below is a suggested starting point to organize your code. You can modify the structure add new folders or reorganize as needed to fit your implementation approach.

### 🗂 Folder Structure

```
frontend/
 ├── app/
 │   ├── (auth)/login, register
 │   ├── (main)/events, profile
 │   ├── components/
 │   ├── utils/
 │   └── styles/
backend/
 ├── src/
 │   ├── modules/
 │   │   ├── users/
 │   │   ├── events/
 │   └── ...
```

### 🌐 API Endpoints

> **Note:** These are suggested API endpoints to implement core features. You must add, modify or remove endpoints as needed to support all functionality in your application.

| Method | Endpoint                      | Description                   |
| :----- | :---------------------------- | :---------------------------- |
| POST   | `/api/auth/register`          | Register new user             |
| POST   | `/api/auth/login`             | Login user                    |
| GET    | `/api/users/:id`              | Get user profile              |
| POST   | `/api/events`                 | Create new event              |
| GET    | `/api/events`                 | Get all events (with filters) |
| GET    | `/api/events/:id`             | Get single event details      |
| POST   | `/api/events/:id/join`        | Join an event                 |
| POST   | `/api/payments/create-intent` | Process ticket payment        |
