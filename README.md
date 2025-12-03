# Form Builder

FormCraft is a full-stack MERN application that allows administrators to create dynamic forms with custom fields, generate unique token-based links for guests, and track responses in real-time through an intuitive dashboard. Built with modern technologies and a focus on security, scalability, and user experience.

## Key Points:

- **Modern Glassmorphism UI** - Sleek black/white design with glass effects
- **Token-Based Security** - Unique, secure tokens for each guest-form combination
- **Real-Time Dashboard** - Track submissions, guests, and responses
- **Dynamic Form Builder** - Support for 6+ field types with validation
- **Duplicate Prevention** - One-time submission per guest per form
- **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- **Optimized Performance** - React Query for efficient data fetching

## Video Link:

## Tech Stack:

**Frontend**

- **Vite** - Build tool
- **React** - UI library
- **TailwindCSS** - Styling
- **React Query (TanStack Query)** - Data fetching & caching
- **React Router v6** - Routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

**Backend**

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **crypto** - Token generation
- **CORS** - Cross-origin support

## Installation

```bash
git clone  https://github.com/aninima01/form-builder.git
cd form-builder

cd backend
npm install
npm run dev

cd frontend
npm install
npm run dev

```

## Objectives:

```bash
 Build a secure form management system where:
 1. Admin can create dynamic forms.
 2. Admin generates unique token-based links for guests.
 3. Guest opens the link, fills the form, submits responses.
 4. Admin views responses in a dashboard
```

## Admin Panel:

- Create form with custom fields (text, textarea, number, dropdown, date, multiselect)
- View all forms with stats
- Add guests & generate unique form links
- View & export form responses
- Track submission status

## Guest Features:

- Open token link ( no lofin required)
- View assigned form
- Submit form with validations
- Prevent duplicate submissions
- Mobile optimised interface

## Security Measures:

```bash
1. Unique 64-character token per guest per form
2. Token validation API
3. Unauthorized access handling
4. One submission per guest enforcement
5. JWT authentication for admins
6. Password hashing with bcrypt
```

## Project Structure

```
form-builder/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── form.controller.js
│   │   │   └── guest.controller.js
│   │   ├── middleware/
│   │   │   └── protectRoute.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Form.js
│   │   │   ├── Guest.js
│   │   │   ├── FormGuest.js
│   │   │   └── FormResponse.js
│   │   ├── routes/
│   │   │   ├── auth.route.js
│   │   │   ├── form.route.js
│   │   │   └── guest.route.js
│   │   ├── lib/
│   │   │   └── db.js
│   │   └── index.js
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CreateForm.jsx
│   │   │   ├── ViewForm.jsx
│   │   │   ├── GuestForm.jsx
│   │   │   └── ResponsePage.jsx
│   │   ├── hooks/
│   │   │   ├── useAuthUser.js
│   │   │   ├── useSignup.js
│   │   │   └── useLogout.js
│   │   ├── lib/
│   │   │   ├── api.js
│   │   │   └── axios.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```
