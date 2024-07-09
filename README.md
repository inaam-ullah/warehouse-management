# Warehouse Management Web Application

This is a simple warehouse management web application built with a Node.js backend and a React frontend using Material UI. Users can perform CRUD (Create, Read, Update, Delete) operations on warehouse items and manage stock levels. The application also manages warehouse locations as a separate entity, which is referenced in the items.

## Features

- CRUD operations for warehouse items
- CRUD operations for warehouse locations
- User authentication (login and register)
- Low stock level alerts
- Responsive and user-friendly interface

## Requirements

- Node.js
- MongoDB

## Installation

### Backend

1. Clone the repository:
   ```sh
   git clone https://github.com/inaam-ullah/warehouse-management.git
   cd warehouse-management/backend``
2. Install dependencies:
``npm install``

3. Create a .env file in the backend directory on root and add the following variables:

```bash
# MongoDB connection URI
MONGODB_URI=mongodb://localhost:27017/warehouse-management

# JWT Secret for authentication
JWT_SECRET=your_jwt_secret

# Email credentials for sending notifications
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Recipient email for low stock alerts
NOTIFICATION_EMAIL=notification_recipient@gmail.com

# Stock threshold for low stock alerts
STOCK_THRESHOLD=5

# Port for the server to run on
PORT=5001

# Node environment
NODE_ENV=development
```

4. Create a .env.test file in the backend directory on root and add the following variables:

```bash
MONGODB_URI=mongodb://localhost:27017/warehouse-management-test
JWT_SECRET=your_jwt_secret
PORT=5001
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
NOTIFICATION_EMAIL=notification_recipient@gmail.com
```

5. Start the backend server: ``npm start``

### Frontend
 1. Navigate to the frontend directory:

```sh
cd ../frontend
```

2. Install dependencies: ``npm install``
3. Start the frontend development server: ``npm start``

## Testing

### Backend
To run backend tests:
1. ``cd backend``
2. ``npm test``

### Frontend

#### End-to-End Testing
To run end-to-end tests using Cypress:

```sh
cd frontend
npx cypress open
```

Happy Coding and Happy Learning!!!!
