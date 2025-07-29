# FreshDel - Fresh Produce E-commerce Platform

FreshDel is a full-stack e-commerce platform specializing in fresh vegetables and fruits delivery. The platform connects local farmers directly with consumers, ensuring fresh, organic produce delivery right to your doorstep.

[FreshDel Live - click here](https://freshdel.vercel.app)

[FreshDel Admin - click here](https://freshdel-admin.vercel.app)

[FreshDel Backend - click here](https://freshdel-backend.vercel.app)

## 🌟 Features

### Customer Features
- Browse fresh produce with detailed descriptions
- Real-time cart management
- Multiple payment options (Razorpay, COD)
- Order tracking
- Address management
- User authentication
- Responsive design for all devices

### Admin Features
- Product management (Add/Remove)
- Order management
- Order status updates
- Sales tracking
- Inventory management

## 🛠️ Tech Stack

### Frontend
- React.js
- TailwindCSS
- React Router
- Axios
- React Toastify
- Cloudinary (Image optimization)

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Razorpay Integration
- Stripe Integration(coming soon)
- Multer
- Cloudinary

## 🚀 Project Structure

FreshDel/
├── frontend/ # Customer-facing application
├── admin/ # Admin dashboard
└── backend/ # API server

### Frontend Structure
frontend/
├── src/
│ ├── components/ # Reusable components
│ ├── pages/ # Page components
│ ├── context/ # Context providers
│ ├── assets/ # Static assets
│ └── App.jsx # Main application component

### Backend Structure
backend/
├── config/ # Database & service configurations
├── controllers/ # Request handlers
├── middleware/ # Custom middleware
├── models/ # Database models
├── routes/ # API routes
└── server.js # Entry point

## 🔧 Environment Variables

check .env.example file and create your own .env file


## 🚀 Getting Started

1. Clone the repository
2. check .env.example file and create your own .env file
3. Run the server - `npm install` && `npm run server`
4. Run the frontend - `npm install` && `npm run dev`
5. Run the admin - `npm install` && `npm run dev`



## 📱 Screenshots

### Customer Interface
![Home Page](./screenshots/HomePage.jpg)
*Homepage showcasing fresh produce listings*

![Products Page](./screenshots/productsPage.jpg)
*Products page showcasing all products*

![Product Details](./screenshots/productPage.jpg)
*Detailed view of vegetable/fruit with pricing and description*

![Shopping Cart](./screenshots/cartPage.jpg)
*Shopping cart with quantity adjustment*

![Checkout Page](./screenshots/orderPage.jpg)
*Checkout page with payment options*

![My Orders Page](./screenshots/myordersPage.jpg)
*My orders page with order details*

![Contact Us Page](./screenshots/contactusPage.jpg)
*Contact us page with form submission*

![About Us Page](./screenshots/aboutusPage.jpg)
*About us page with team members*

![Login Page](./screenshots/loginPage.jpg)
*Login page with email and password*

![Register Page](./screenshots/registerPage.jpg)
*Register page with name, email, password and confirm password*


### Admin Dashboard
![Admin Dashboard](./screenshots/adminPage.jpg)
*Admin dashboard with product management and order tracking*

## Future Features 
- Payment Gateway Integration (Stripe)
- user profile page
- Review System
- Admin panel enhancement

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License 
## 👥 Authors

- Balaji - Initial work - [codewithbalaji](https://github.com/codewithbalaji)

## 🙏 Acknowledgments

- Thanks to all contributors who helped with the project
- Special thanks to the React and Node.js communities



