# Mini CRM Web Application

A full-stack Customer Relationship Management (CRM) system built with React, Tailwind CSS, Node.js, and MongoDB.  
It allows businesses to manage customer data, create targeted marketing campaigns, and analyze customer engagement.  
The application supports Google OAuth login, CSV-based customer ingestion, AI-powered rule generation, and campaign delivery logging.  

# ✨ Features

🔐 **Google OAuth 2.0 Authentication**: Secure login with Google accounts  
👥 **Customer Segmentation**: Define rules with dynamic builder or natural language AI prompts  
🧠 **AI Message Generator**: Uses LLM (via GROQ API) to create marketing messages  
📈 **Audience Preview**: View estimated audience size before saving a campaign  
📤 **Campaign Creation**: Save campaign details, dispatch via dummy vendor API  
📦 **CSV Upload**: Import customer and order data via structured CSV file  
🧾 **Campaign History**: List of campaigns with delivery stats and timestamps  
📊 **Dashboard**: Visual summary of total customers, active ones, and total turnover  
📁 **Consistent UI**: Built using Tailwind + custom sidebar layout with header/footer  

# 🔧 Folder Structure

📦 Mini CRM  
├── client/ # React frontend  
│ ├── components/ # UI Components (Header, Sidebar, CampaignForm, etc.)  
│ ├── App.jsx  
│ └── index.js  
├── server/ # Express backend  
│ ├── models/ # Mongoose models (Customer, Order, Campaign, Log)  
│ ├── routes/ # All API routes (auth, campaigns, customers, vendor)  
│ ├── utils/ # Passport config  
│ └── index.js # Main Express entry  
├── .env # API keys, DB URI, session secrets  
├── .gitignore  
└── README.md  

# 🧩 API Routes  

/api/auth/google           - Initiate Google OAuth login  
/api/auth/google/callback  - Google OAuth callback handler  
/api/auth/user             - Get current user info  
/api/auth/logout           - Logout and destroy session      

/api/customers/upload      - POST a CSV file to ingest customers and orders  
/api/customers/summary     - GET total customers, active customers, turnover  
/api/customers/preview     - POST audience rules to preview matching count      

/api/campaigns             - POST to create campaign with rules and message, GET for all campaigns    

/api/vendor/send           - Simulate delivery (90% success), then calls receipt endpoint  
/api/vendor/receipt        - Updates delivery status in communication log  


# 🚀 Installation

**Fork the repository**
Click on the Fork button in the top right  
GitHub will create a copy in your account, e.g.: https://github.com/your-username/Mini_CRM

**Clone the repository**  
git clone https://github.com/your-username/Mini_CRM.git  
cd Mini_CRM

**Install backend**  
cd server  
npm install

**Install frontend**  
cd ../client  
npm install

**Add .env files in both /client and /server**

# 📌 Usage

**Start backend**  
cd server  
npm run dev

**In another terminal, start frontend**  
cd client  
npm run dev

#
**Note: When logging in for the first time, please wait for 1-2 minutes to allow the backend to fully initialize on Render before proceeding with the login.**
