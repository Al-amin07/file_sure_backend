# CreditHub Backend

https://file-sure-server.vercel.app

## Getting Started

Follow these steps to set up and run the project locally.

## 1. Clone the Repository

```bash
https://github.com/Al-amin07/file_sure_backend
```

## 2. Install Dependencies

Navigate to the project directory and install the necessary dependencies:

   ```bash
   cd file_sure_backend
   npm install
   ```

## 3. Set Up Environment Variables
Create a .env file in the root of the project to store environment variables, such as MongoDB URI or any secret keys. Here’s an example:
```bash
DB_URL=mongodb+srv://file_sure:Mf2kmWrdhyNWQ8LI@cluster0.pekpvn6.mongodb.net/filesure?retryWrites=true&w=majority&appName=Cluster0
PORT=5000

JWT_EXPIRES_IN='1d'
JWT_SECRET="svgbklnjbdfnhjbdflbndfbnfdkjbnvjkfdbnvjdbvfd"

```

## 4. Run the Project
- **Development Mode**
To start the project in development mode with hot reloading:
```bash
npm run dev
```
- **Production Mode**
If you prefer to run the project in production mode:
```bash
npm run build
```

5. Open [http://localhost:5000](http://localhost:5000) in your browser.

## 🔗 API Endpoint Overview

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | /api/auth/register   | Register a new user |
| POST   | /api/auth/login      | Authenticate user and return JWT |
| POST   | /api/order           | Make a order |
| GET    | /api/order/history   | Get history |

