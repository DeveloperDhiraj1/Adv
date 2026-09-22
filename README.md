# Advisory Group of India

An expert-advisory and consultation booking platform that connects users with verified professionals. Users can discover experts, check availability, book sessions, make payments, chat with experts and submit reviews.

## Features

### Users

- Browse and search experts by category, service and price
- View expert profiles, qualifications, ratings and services
- Check availability and book consultation sessions
- Razorpay payment checkout and payment verification
- User dashboard for bookings, sessions, payments and reviews
- Save favourite services/experts
- Notifications and chat support
- Contact form and newsletter subscription

### Experts

- Create and update an expert profile
- Add, update and deactivate consultation services
- Configure weekly availability
- Manage appointments and share meeting links
- View reviews, earnings and notifications

### Admin

- Dashboard statistics
- User activation/deactivation
- Expert verification and rejection
- Category management
- Transaction and dispute management

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- React Icons

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Firebase Authentication and email verification
- Razorpay payments
- bcrypt password hashing
- Helmet and CORS security middleware

## Project Structure

```text
Adv/
├── backend/
│   ├── config/          # Database and Firebase configuration
│   ├── controllers/     # Request and business logic
│   ├── middlewares/     # Authentication and admin authorization
│   ├── models/          # MongoDB/Mongoose schemas
│   ├── routes/          # REST API routes
│   ├── tests/           # Backend API tests
│   ├── app.js
│   └── index.js
└── frontend/
    ├── public/
    └── src/
        ├── components/  # Reusable UI components
        ├── layouts/     # Public and dashboard layouts
        ├── pages/       # Application pages
        ├── data/        # Presentational marketing content
        └── lib/         # API, Firebase and helper utilities
```

## Requirements

- Node.js 18 or later
- MongoDB database
- Firebase project for authentication
- Razorpay account for test or live payments

## Installation

Clone the repository and install dependencies:

```bash
git clone <your-repository-url>
cd Adv

cd backend
npm install

cd ../frontend
npm install
```

## Environment Variables

Create `backend/.env`:

```env
PORT=8082
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret

RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret

FRONTEND_URLS=http://localhost:5173
```

Create `frontend/.env`:

```env
VITE_API_BASE=
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

Never commit `.env` files, MongoDB credentials, JWT secrets or Razorpay secret keys to GitHub.

## Run Locally

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in the browser.

The Vite development server proxies API requests to the backend on port `8082`.

## Testing

Run backend tests:

```bash
cd backend
npm test
```

Create a production frontend build:

```bash
cd frontend
npm run build
```

## Payment Testing

Use Razorpay **Test Mode** keys during development. The payment flow creates a Razorpay order on the backend and verifies the returned payment signature before confirming the booking.

For test payments, use Razorpay's test payment details. Test transactions do not deduct real money.

## Authentication and Authorization

- Firebase verifies email/Google identity.
- The backend issues a JWT after successful login.
- Protected APIs require a `Bearer` token.
- Dashboard access is controlled by `USER`, `EXPERT` and `ADMIN` roles.
- Admin users should be created or promoted securely in the database, not through public signup.

## API Groups

```text
/auth
/experts
/services
/categories
/availability
/bookings
/payments
/reviews
/chat
/notifications
/user-dashboard
/expert-dashboard
/admin
/favorites
/public
```

## Future Improvements

- Real-time messaging with WebSockets
- Integrated video consultation
- Automated refunds and payment webhooks
- Admin inbox for contact messages
- Cloud image/document uploads
- Advanced search and recommendation system
- Mobile application

## License

This project is developed for educational and demonstration purposes.
