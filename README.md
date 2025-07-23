# CRICSTORE - ADMIN DASHBOARD

Cricstore Admin Dashboard is a comprehensive and intuitive interface for managing the Cricstore e-commerce platform. Built with React, TypeScript, and Vite, this dashboard provides administrators and store managers with the tools they need to oversee products, orders, users, and more.

## Project Overview

The Cricstore Admin Dashboard is a vital component of the Cricstore microservices ecosystem. It serves as the central hub for managing all aspects of the e-commerce platform, from adding new products and categories to tracking orders and managing user roles. The dashboard is designed to be a fast, efficient, and user-friendly tool that communicates with a backend API gateway to perform all administrative tasks.

### Key Features

* **Dashboard Analytics:** A comprehensive overview of key metrics, including total sales, orders, and user distribution, providing valuable insights at a glance.
* **User Management:** A complete solution for managing users, including creating, editing, and deleting user accounts, as well as assigning roles and permissions.
* **Store Management:** Functionality for adding, updating, and managing multiple store locations.
* **Product Management:** A robust system for managing products, including adding new items, editing existing ones, and setting product visibility.
* **Category Management:** Easily create, update, and delete product categories to keep the store organized.
* **Order Management:** A real-time order tracking system that allows administrators to view and manage all incoming orders, update order statuses, and view order details.
* **Promotions and Coupons:** A dedicated section for creating and managing promotional codes and discounts.
* **Dark Mode:** A sleek and modern dark mode for a comfortable user experience in low-light environments.
* **Responsive Design:** A fully responsive layout that ensures a seamless experience across all devices, from desktops to mobile phones.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18.0.0 or later)
* npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/adarsh-naik-2004/bats-admin_dashboard.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd bats-admin_dashboard
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Create a `.env` file** in the root of the project and add the necessary environment variables:
    ```env
    VITE_API_GATEWAY=http://your-backend-api-gateway-url
    VITE_SOCKET_SERVICE_URL=http://your-socket-service-url
    ```
5.  **Run the development server:**
    ```sh
    npm run dev
    ```
6.  Open [http://localhost:5173](http://localhost:5173) (or the port specified in your terminal) with your browser to see the result.

## Technologies Used

* **Framework:** [React](https://reactjs.org/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **UI Library:** [Ant Design](https://ant.design/)
* **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
* **Data Fetching:** [TanStack Query](https://tanstack.com/query/v4) (React Query)
* **HTTP Client:** [Axios](https://axios-http.com/)
* **Routing:** [React Router DOM](https://reactrouter.com/)
* **Real-time Communication:** [Socket.IO Client](https://socket.io/docs/v4/client-installation/)
* **Charting:** [Recharts](https://recharts.org/)

### Key Components and Functionality

* **`pages/`**: Contains all the pages of the application, such as the login page, dashboard home, and management pages for users, products, and orders.
* **`components/`**: Contains reusable UI components, including custom logos and UI elements like modals.
* **`hooks/`**: Custom React hooks for handling permissions and other logic.
* **`http/`**: The Axios instance and API functions for making requests to the backend.
* **`layouts/`**: The main layout components for the dashboard and non-authenticated pages.
* **`store.ts`**: The Zustand store for managing global state, such as authentication and theme.
* **`router.tsx`**: The main router configuration for the application.
* **`types.ts`**: TypeScript type definitions for the application's data structures.

## Deployment

The project can be easily deployed to any static site hosting service. For Vercel, a `vercel.json` file is included to handle client-side routing correctly.

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
