# 📅 Subscription Reminder App

This is a full-stack Node.js application that allows users to create and manage their subscriptions and automatically sends reminder emails using Upstash QStash before renewal dates.

---

## 🔧 Features

- ✅ User authentication (Sign in / Sign out)
- 📬 Email reminders (1, 2, 5, and 7 days before renewal)
- 🔁 Supports **daily**, **weekly**, **monthly**, and **yearly** subscriptions
- 📊 Dashboard with upcoming reminders and active subscriptions
- ⏰ Scheduled workflows using **Upstash QStash**
- 💾 Data stored in **MongoDB** with **Mongoose**

---

## 🚀 Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Templating**: EJS + Tailwind CSS
- **Background Jobs**: Upstash QStash
- **Email Service**: Nodemailer
- **Authentication**: Cookie-based (middleware-protected routes)
- **ArcJet**: for bot and spam protection

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone
cd subscription-reminder
npm install

cp .env.example .env

npm run dev
