# Dentgo – AI-Powered Dental Assistant Platform

Dentgo Frontend – a modern, Vite-powered React web application using TypeScript, Tailwind CSS, Stripe integration, and RESTful API routing for a dental service platform.
---

## 🚀 Features

- 🌐 Full-stack web architecture using **React + Next.js + Express.js**
- 🔐 Secure authentication via **Google** and **Apple OAuth**
- 🤖 AI chat powered by **OpenAI** with domain-specific filtering (dentistry)
- 💳 Payment processing and subscriptions with **Stripe**
- 🧾 Real-time chat, card, and subscription management via **REST APIs**
- 🌗 **Dark mode** support and persistent user preferences
- 📱 Responsive design for mobile-first usage

---

## 🏗️ Project Structure

### 🧠 Server (Backend)

#### `server.js`
Sets up an Express server with:
- Session and CORS middleware
- Google/Apple OAuth (Passport.js)
- Stripe endpoints (`/payment-intent`, `/subscribe`)
- AI chat endpoint with rate limiting
- Health check and error middleware

#### Routes

| File                      | Purpose                                                                 |
|---------------------------|-------------------------------------------------------------------------|
| `routes/cards.js`         | CRUD operations for user-associated cards via Prisma                    |
| `routes/chat.js`          | Dental AI chat endpoint using OpenAI with domain filtering              |
| `routes/notifications.js` | Notification listing and status update (seen)                           |
| `routes/subscriptions.js` | CRUD for user subscriptions via Stripe and Prisma                       |
| `routes/users.js`         | Full user CRUD operations with Prisma                                   |

---

### 💻 Frontend (React / Next.js)

#### `src/index.js`
Entry point for the React app. Wraps the app with `AuthProvider` and `DarkModeProvider`.

#### `src/App.js`
Routing setup with public and protected pages using `react-router-dom`.

#### Pages Overview

- **Authentication**: `LetsYouIn`, `ConfirmPaymentPin`, `NotificationAllow`
- **Subscription**: `PlusSubscription`, `CancelSubscription`, `SubscriptionPayment`
- **Chat**: `AmigoGptHome`, `AmigoChat`, `History`
- **Settings & Preferences**: `PersonalInfoUpdate`, `Security`, `MarketingPreferences`, `Language`, `Currency`
- **Cards & Payments**: `AddNewCard`, `BankCards`, `PaymentMethod`, `SelectPaymentMethod`
- **Account Management**: `DeleteDeactivate`, `Deactivate`, `Delete`, `ReasonUsing`
- **Support Pages**: `ContactUs`, `Faq`, `Feedback`, `AboutAmigo`
- **Utility**: `Splash`, `Confirmation`, `InviteFriends`

---

### 🧩 API Modules

Located in `src/api/`, these files interact with backend endpoints via Fetch:

- `auth.js`: Google/Apple login handling
- `cards.js`: Card CRUD
- `chat.js` / `chats.js`: AI conversation management
- `notifications.js`: Notification fetch/update
- `payments.js`: Stripe-based payment + subscription
- `subscriptions.js`: Subscription lifecycle operations

---

### 🧱 Core Libraries

- `stripeClient.js`: Handles Stripe client loading and checkout context
- `prismaClient.js`: Prisma client initialization
- `google.js` / `apple.js`: Identity SDK loaders for OAuth
- `DarkModeContext.jsx`: Dark mode toggle with persistent settings
- `AuthContext.jsx`: User authentication state and access hook

---

### 🧪 Testing & Metrics

- `App.test.js`: Unit test for rendering
- `reportWebVitals.js`: Web performance reporting
- `setupTests.js`: Extends Jest with DOM matchers

---

## 🛠️ Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | React, Next.js, Tailwind CSS  |
| Backend    | Express.js, Node.js           |
| Auth       | Passport.js (Google/Apple)    |
| Payments   | Stripe                        |
| ORM        | Prisma                        |
| AI Model   | OpenAI (GPT-4)                |
| Storage    | LocalStorage, Session         |
| Routing    | React Router, Express Router  |

---

## 🏁 Getting Started

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-org/dentgo.git
   cd dentgo
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Run the development server**  
   ```bash
   npm run dev       # frontend (Next.js)
   node server.js    # backend (Express)
   ```

4. **Set environment variables**  
   Create `.env` file with:
   ```
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   APPLE_CLIENT_ID=
   APPLE_TEAM_ID=
   STRIPE_SECRET_KEY=
   OPENAI_API_KEY=
   SESSION_SECRET=
   ```

---

## 📄 License

This project is licensed under the MIT License.

---

## 💬 Support

Need help? Open an issue or contact us at [support@dentgo.ai](mailto:support@dentgo.ai)