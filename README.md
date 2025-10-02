📱 SpendSmart – Mobile Money Expense Tracker

SpendSmart is a full-stack expense tracker built to help students spend wisely.
It allows you to track daily transactions, categorize expenses (food, transport, airtime, etc.), and view reports on where your money goes.

🚀 Features

🔐 User Authentication – Sign up & log in securely

💰 Track Transactions – Record income & expenses with date, time & category

📊 Dashboard & Reports – Visual summaries of spending habits

📅 Budgets & Alerts – Set spending limits and get notified when overspending

🌗 Dark / Light Mode – Matches system preference

📱 Mobile Money Support – MTN Mobile Money, AirtelTigo Money, Telecel Cash

🔔 SMS Integration – Get alerts via SMS for spending activity

🇬🇭 Local Currency – Supports Ghanaian Cedi (GHS)

🛠 Tech Stack

Frontend: Vite + React + TailwindCSS

Backend: Node.js + Express + TypeScript

Database: PostgreSQL (via Drizzle ORM)

Auth & Session: Express-Session

Deployment Ready: Works with Render, Railway, or Vercel (frontend only)

⚙️ Installation & Setup
1. Clone the repo
git clone https://github.com/prolificdee99/spendsmart.git
cd spendsmart

2. Install dependencies
npm install

3. Configure environment variables

Create a .env file in the root:

DATABASE_URL=postgres://your_neon_or_postgres_url_here
SESSION_SECRET=supersecretkey
PORT=5000

4. Run database migrations
npx drizzle-kit migrate

5. Start development server
npm run dev


Frontend: http://localhost:3000

Backend API: http://localhost:5000

🚀 Deployment
On Render (Full-Stack)

Connect your GitHub repo

Add environment variables under Settings → Environment

Build Command:

npm install && npm run build


Start Command:

npm run start

On Vercel (Frontend Only)

Deploy only the client folder.

Backend must be hosted separately on Render or Railway.

📌 Roadmap

 Add push notifications

 Support multiple currencies

 Export reports to PDF/Excel

👨‍💻 Author

Prolific Dee
GitHub: @prolificdee99
