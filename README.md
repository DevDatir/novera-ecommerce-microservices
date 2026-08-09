# 🛒 Novera - E-Commerce Microservices Application

A production-inspired **Spring Boot Microservices E-Commerce Application** built using **Java 21**, **Spring Boot 3**, **Spring Security**, **JWT Authentication**, **React + TypeScript**, **PostgreSQL**, **Docker**, and **Kubernetes**.

The project demonstrates how modern enterprise-scale e-commerce applications are designed using independently deployable microservices, secure authentication, inter-service communication, payment gateway integration, and cloud-native deployment practices.

---

# 📸 Screenshots

> *(Add screenshots here once the frontend is complete.)*

- Home Page
- Product Listing
- Product Details
- Shopping Cart
- Checkout
- Payment Gateway
- Order History

---

# 🚀 Features

## 👤 Authentication

- User Registration
- User Login
- JWT Authentication
- BCrypt Password Encryption
- Spring Security
- Protected APIs
- Role-based architecture (Extensible)

---

## 👟 Product Management

- Browse Products
- Product Details
- Category Filtering
- Search Products
- Pagination
- Product Images
- Stock Management
- Ratings

---

## 🛒 Shopping Cart

- Add Product to Cart
- Update Quantity
- Remove Product
- Clear Cart
- Persistent User Cart
- Real-time Cart Updates using React Query

---

## 📍 Address Management

- Add Address
- Edit Address
- Delete Address
- Default Address
- Multiple Saved Addresses

---

## 📦 Checkout

- Select Shipping Address
- Review Order
- Dynamic Order Summary
- Place Order

---

## 💳 Payments

- Razorpay Payment Gateway Integration
- Secure Payment Verification
- Signature Verification
- Payment Status Tracking
- Sandbox Testing Support

---

## 📃 Orders

- Place Orders
- View Order History
- Order Details
- Cancel Orders
- Payment Status
- Order Status Tracking

---

# 🏗️ Microservices Architecture

```
                        +----------------+
                        | React Frontend |
                        +--------+-------+
                                 |
                                 |
                          API Gateway
                                 |
       ---------------------------------------------------
       |         |         |          |                 |
       |         |         |          |                 |
 Authentication  Product   Cart     Order          Payment
    Service      Service   Service   Service        Service
       |           |         |          |               |
       ---------------- PostgreSQL Databases ----------
```

Each service owns its own database and communicates independently.

---

# 🛠️ Tech Stack

## Backend

- Java 21
- Spring Boot 3
- Spring Security
- Spring Data JPA
- Hibernate
- PostgreSQL
- JWT Authentication
- Maven
- REST APIs

---

## Frontend

- React
- TypeScript
- React Router
- React Query (TanStack Query)
- Axios
- React Hook Form
- Zod
- Tailwind CSS
- Lucide Icons

---

## Payment

- Razorpay Sandbox
- HMAC Signature Verification

---

## DevOps

- Docker
- Docker Compose
- Kubernetes
- ConfigMaps
- Secrets
- Health Checks

---

# 📂 Project Structure

```
Novera-Ecommerce-Microservices-Application
│
├── authentication-service
│
├── product-service
│
├── cart-service
│
├── order-service
│
├── payment-service
│
├── frontend
│
├── docker
│
└── kubernetes
```

---

# 📊 Database Design

The application follows a distributed database architecture.

Each microservice owns its own schema.

### Authentication Service

- Users

---

### Product Service

- Products
- Categories
- Product Images

---

### Cart Service

- Cart
- Cart Items

---

### Order Service

- Orders
- Order Items
- Shipping Addresses

---

### Payment Service

- Payments

---

# 🔐 Authentication Flow

```
User Login
      │
      ▼
Authentication Service
      │
      ▼
Generate JWT
      │
      ▼
Frontend stores JWT
      │
      ▼
Every Request
      │
Authorization: Bearer <JWT>
      │
      ▼
Spring Security JWT Filter
      │
      ▼
Protected APIs
```

---

# 🛍️ Order Flow

```
Browse Products
        │
        ▼
Add to Cart
        │
        ▼
Checkout
        │
        ▼
Select Address
        │
        ▼
Create Order
        │
        ▼
Payment Gateway
        │
        ▼
Verify Payment
        │
        ▼
Order Confirmed
```

---

# 🔄 Microservice Communication

Services communicate internally using REST APIs.

### Product Service

Provides

- Product Details
- Product Availability

---

### Cart Service

Consumes Product Service.

---

### Order Service

Consumes

- Cart Service
- Product Service
- Address Service

---

### Payment Service

Consumes

- Order Service

---

# 📦 REST APIs

## Authentication

- Register
- Login
- Validate JWT

---

## Products

- Get Products
- Search Products
- Filter Products
- Product Details

---

## Cart

- Add Item
- Update Quantity
- Remove Item
- Clear Cart

---

## Addresses

- Add Address
- Update Address
- Delete Address
- Get Addresses

---

## Orders

- Place Order
- Get Orders
- Get Order Details
- Cancel Order

---

## Payments

- Create Razorpay Order
- Verify Payment

---

# 🧪 Testing

The project has been tested using

- Swagger UI
- Postman
- Razorpay Sandbox

---

# 🐳 Docker

Each microservice contains its own Dockerfile.

Run using

```bash
docker-compose up --build
```

---

# ☸️ Kubernetes

Deployment includes

- Deployments
- Services
- ConfigMaps
- Secrets

Deploy using

```bash
kubectl apply -f kubernetes/
```

---

# 🔮 Future Enhancements

- API Gateway
- Service Discovery (Eureka)
- Distributed Tracing
- Centralized Logging
- Email Notifications
- Wishlist
- Product Reviews
- Inventory Service
- Recommendation Engine
- Admin Dashboard
- CI/CD Pipeline
- AWS Deployment

---

# 🎯 Learning Outcomes

This project demonstrates practical implementation of:

- Microservices Architecture
- REST API Design
- JWT Authentication
- Spring Security
- React + TypeScript
- React Query
- PostgreSQL
- Docker
- Kubernetes
- Payment Gateway Integration
- Distributed System Design

---

# 👨‍💻 Author

**Dev Datir**

Computer Engineering | Java Backend Developer | Spring Boot | Microservices | React | Docker | Kubernetes

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!
