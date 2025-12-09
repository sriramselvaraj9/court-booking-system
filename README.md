# 🏸 Court Booking System

A full-stack web application for managing sports facility court bookings with multi-resource scheduling and dynamic pricing.

![Court Booking System](https://img.shields.io/badge/Status-Production%20Ready-green)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Design](#database-design)
- [Pricing Engine](#pricing-engine)
- [Deployment](#deployment)
- [Demo Credentials](#demo-credentials)

## ✨ Features

### Multi-Resource Booking
- **Court Selection**: 4 badminton courts (2 indoor, 2 outdoor)
- **Equipment Rental**: Rackets, shoes, shuttlecocks with quantity tracking
- **Coach Booking**: 3 coaches with individual availability and specializations
- **Atomic Transactions**: Either all resources are booked or none (prevents partial bookings)

### Dynamic Pricing Engine
- **Rule-Based Pricing**: Configurable rules that stack
- **Peak Hour Rates**: Higher prices during 6-9 PM
- **Weekend Surcharges**: Additional fees for Saturday/Sunday
- **Indoor Premium**: Premium pricing for indoor courts
- **Early Bird Discounts**: Reduced rates for morning slots
- **Holiday Pricing**: Special rates for specific dates

### Admin Dashboard
- Full CRUD operations for Courts, Coaches, Equipment
- Create/Edit/Toggle pricing rules
- View all bookings across users
- Enable/Disable resources

### User Features
- User registration and authentication (JWT)
- Visual slot selection with real-time availability
- Live price breakdown as options are selected
- Booking history with cancellation option
- Waitlist functionality for full slots

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: React Icons

## 📁 Project Structure

```
court-booking-system/
├── backend/
│   ├── config/
│   │   ├── db.js              # Database connection
│   │   └── seed.js            # Seed data script
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── coachController.js
│   │   ├── courtController.js
│   │   ├── equipmentController.js
│   │   └── pricingRuleController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Coach.js
│   │   ├── Court.js
│   │   ├── Equipment.js
│   │   ├── PricingRule.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── coachRoutes.js
│   │   ├── courtRoutes.js
│   │   ├── equipmentRoutes.js
│   │   └── pricingRuleRoutes.js
│   ├── utils/
│   │   ├── availabilityChecker.js  # Multi-resource availability
│   │   └── pricingEngine.js        # Dynamic pricing calculator
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CoachCard.jsx
│   │   │   ├── CourtCard.jsx
│   │   │   ├── EquipmentSelector.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PriceBreakdown.jsx
│   │   │   └── TimeSlotGrid.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MyBookingsPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── dataService.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── vercel.json
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd court-booking-system
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**

   Backend (`backend/.env`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/court-booking?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   ```

   Frontend (`frontend/.env`):
   ```env
   VITE_API_URL=/api
   ```

4. **Seed the database**
   ```bash
   cd backend
   npm run seed
   ```

5. **Run the application**
   ```bash
   # From root directory
   npm run dev

   # Or run separately:
   # Terminal 1 (Backend)
   cd backend && npm run dev

   # Terminal 2 (Frontend)
   cd frontend && npm run dev
   ```

6. **Open the app**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get current user profile |

### Courts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courts` | List all courts |
| GET | `/api/courts/:id` | Get single court |

### Coaches
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/coaches` | List all coaches |
| GET | `/api/coaches/:id` | Get single coach |

### Equipment
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/equipment` | List all equipment |
| GET | `/api/equipment/:id` | Get single equipment |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings/slots/:courtId/:date` | Get available slots |
| POST | `/api/bookings/check-availability` | Check resource availability |
| POST | `/api/bookings/calculate-price` | Calculate price preview |
| POST | `/api/bookings` | Create booking (Auth required) |
| GET | `/api/bookings/my-bookings` | Get user's bookings |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking |

### Admin Routes (Admin role required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/courts` | Create court |
| PUT | `/api/admin/courts/:id` | Update court |
| DELETE | `/api/admin/courts/:id` | Delete court |
| PATCH | `/api/admin/courts/:id/toggle` | Toggle court status |
| POST | `/api/admin/pricing-rules` | Create pricing rule |
| ... | Similar endpoints for coaches, equipment, pricing rules |

## 🗃️ Database Design

### Collections

**Users**
- Stores user information with roles (user/admin)
- Password hashing with bcrypt

**Courts**
- 4 courts: 2 indoor, 2 outdoor
- Base price, amenities, active status

**Coaches**
- Name, specialization, experience, hourly rate
- Availability map for each day of week

**Equipment**
- Type (racket, shoes, shuttlecock, other)
- Total quantity for availability tracking
- Price per hour

**PricingRules**
- Flexible rule types: peak_hour, weekend, holiday, indoor_premium, early_bird
- Modifier types: multiplier, fixed_addition, fixed_subtraction, percentage
- Priority for rule application order

**Bookings**
- Links user, court, optional equipment array, optional coach
- Date, start time, end time
- Pricing breakdown (court fee, equipment fee, coach fee, applied rules, total)
- Status: confirmed, cancelled, completed, waitlist

### Key Design Decisions

1. **Denormalized Pricing Breakdown**: Store the full breakdown in each booking for transparency and audit trail
2. **Flexible Equipment Array**: Supports multiple equipment items with quantities
3. **Map-based Coach Availability**: Allows complex availability patterns per day
4. **Indexed Queries**: Compound indexes on court+date, coach+date for efficient availability checks

## 💰 Pricing Engine

The pricing engine (`utils/pricingEngine.js`) implements a rule-based calculation:

```javascript
// Calculation Flow:
1. Base court price × duration
2. Apply each active rule in priority order:
   - Check if rule applies (time, day, court type)
   - Calculate adjustment based on modifier type
   - Add to running total
3. Add equipment fees (price × quantity × duration)
4. Add coach fee (hourly rate × duration)
5. Return complete breakdown
```

### Rule Stacking Example
For an indoor court booking on Saturday at 7 PM:
- Base: $30/hr
- Peak Hour (1.5x): +$15
- Weekend (+$10): +$10
- Indoor Premium (+$5): +$5
- **Total: $60/hr**

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret key
     - `NODE_ENV`: production

3. **Deploy**
   - Vercel will automatically detect the configuration from `vercel.json`
   - The app will be deployed at your Vercel URL

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret
NODE_ENV=production
```

## 🔑 Demo Credentials

After running the seed script:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@courtbooking.com | admin123 |
| User | john@example.com | user123 |

## 📝 Assumptions Made

1. **Operating Hours**: Courts operate from 6 AM to 10 PM daily
2. **Slot Duration**: Default 1-hour slots
3. **Same-day Booking**: Users can book slots for today onwards (up to 14 days)
4. **Equipment Sharing**: Equipment is shared across all courts
5. **Coach Assignment**: One coach can only be at one place at a time
6. **No Partial Hours**: Bookings are in full-hour increments

## 🔮 Future Enhancements

- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications for bookings
- [ ] Push notifications for waitlist
- [ ] Recurring booking patterns
- [ ] Court maintenance scheduling
- [ ] Analytics dashboard for admins
- [ ] Mobile app (React Native)

## 📄 License

MIT License - feel free to use this project for learning or building upon.

---

Built with ❤️ for the Acorn Globus Full Stack Developer Assignment
#   T r i g g e r   r e b u i l d  
 