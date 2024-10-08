# Secure, Passwordless Web Authentication with MongoDB, Express.js, Node.js, and React (Vite)

Hey everyone! In this video, we’ll explore how to implement secure, passwordless web authentication in your application using:

- **MongoDB**
- **Express.js**
- **Node.js**
- **React** frontend with **Vite**

We’ll dive into using **Passkeys, including Fingerprint and Face ID**, to enhance security through Web Authentication.

Let’s get started!

---

## Table of Contents

1. [Introduction](#introduction)
2. [Technologies Used](#technologies-used)
3. [Features](#features)
4. [Getting Started](#getting-started)
5. [Client Setup Instructions](#client-setup-instructions)
6. [Server Setup Instructions](#server-setup-instructions)
7. [Implementing Passkeys](#implementing-passkeys)
8. [Contributing](#contributing)


## Introduction

This project demonstrates how to set up passwordless authentication using modern web technologies. We'll implement Passkeys for Fingerprint and Face ID authentication to ensure a secure and user-friendly login experience.

## Technologies Used

- **MongoDB**: For database management.
- **Express.js**: As the web application framework.
- **Node.js**: To run the server-side code.
- **React with Vite**: For building the frontend.

## Features

- Secure passwordless authentication
- Support for Passkeys including Fingerprint and Face ID
- Easy setup and integration with MongoDB, Express.js, Node.js, and React

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- Node.js installed
- MongoDB instance running
- Basic knowledge of JavaScript and React

## Client Setup Instructions

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Nagakumar2402/web_auth.git
    ```

2. **Navigate to the client directory:**

    ```bash
    cd web_auth/client
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Run the development server:**

    ```bash
    npm run dev
    ```

## Server Setup Instructions

1. **Navigate to the server directory:**

    ```bash
    cd web_auth/server
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Run the server:**

    ```bash
    npm run dev
    ```
4. **Configure environment variables:** Create a `.env` file in the root directory and add your MongoDB connection string and any other required environment variables.
```
PORT=9032
# MONGODB_URI=mongodb://localhost:27017
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.fwk1ng2.mongodb.net/
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=ee881330e89183a4e6f944fcaab9df45af2135b6
ACCESS_TOKEN_LIFE=1d
REFRESH_TOKEN_SECRET=096bb11fc159ad853769b9fd6d96e7d5bef5b373
REFRESH_TOKEN_LIFE=10d
```
**Replace `<password>` in `MONGODB_URI`** with your actual MongoDB password.
## Implementing Passkeys

We'll implement Passkeys by integrating Web Authentication APIs that allow users to log in using biometrics like Fingerprint and Face ID.

1. **Set up the backend with Node.js and Express to handle authentication requests.**
2. **Configure MongoDB for storing user credentials securely.**
3. **Build the frontend using React and Vite, implementing the Web Authentication API for biometric logins.**



## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss any changes.


