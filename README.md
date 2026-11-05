
# Hotel Management System

**Group No: 24**

## Team Members

| S.No | Name                | Enrollment No. |
| ---- | ------------------- | -------------- |
| 1    | Sonu Jha            | 20252651056    |
| 2    | Aakash              | 20252651001    |
| 3    | Sahil Kumar         | 20252651044    |
| 4    | Manish Saxena       | 20252651033    |
| 5    | Vedansh Raghuwanshi | 20252651062    |

---

## About the Project

The Hotel Management System is a web-based application that helps manage hotel operations such as room management, customer bookings, check-in / check-out and billing in one place.

```
backend/            Express API, MVC
  models/           M: Mongoose schemas (User, Room, Guest, Booking, Service)
  controllers/      C: business logic (auth, bookings, stats, generic CRUD)
  routes/           URL to controller mapping, auth and role guards
  middleware/       JWT auth, error handling
frontend/           V: React (Vite) + Tailwind CSS
  src/pages/        screens: Dashboard, Rooms, Guests, Bookings, Staff
  src/components/   shared UI (tables, modal form, reusable CRUD page)
```



## Software & Technologies Used

| Purpose              | Software / Technology                         |
| -------------------- | --------------------------------------------- |
| Programming Language | javascript                                    |
| Backend Framework    | express.js                                    |
| Frontend             | HTML, CSS, JavaScript, react.js, tailwind css |
| Database             | mongoDB                                       |
| Code Editor          | Visual Studio Code                            |
| Version Control      | Git & GitHub                                  |
| Web Browser          | Google Chrome                                 |

## Run

1. Start MongoDB (local or Atlas).
2. Backend: `cd backend : npm install && npm run dev`
3. Frontend: `cd frontend : npm install && npm run dev`
4. Open http://localhost:5173

Vite proxies `/api` to port 5000, so no CORS setup is needed in development.

## Features

JWT login with admin/staff roles, staff accounts, rooms, guests, bookings with
overlap prevention and date-based room availability, extra charges, payments and
balances, check-in/out/cancel flow, dashboard with occupancy, revenue and monthly chart.
