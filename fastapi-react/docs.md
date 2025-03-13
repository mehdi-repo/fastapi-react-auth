







✅ Generate a Private Key Without a Passphrase
mkdir -p keys

To avoid passphrase issues, generate a private key without encryption:
openssl genpkey -algorithm RSA -out keys/private.pem

Then generate the public key:
openssl rsa -in keys/private.pem -pubout -out keys/public.pem













# React

/fastapi-react-auth
│── /src
│   ├── /components
│   │   ├── AuthRoute.js  (Protects routes based on role)
│   │   ├── Navbar.js     (Navigation Bar)
│   ├── /pages
│   │   ├── Login.js      (User Login Page)
│   │   ├── Register.js   (User Registration Page)
│   │   ├── AdminDashboard.js  (Dashboard for Admins)
│   │   ├── UserDashboard.js   (Dashboard for Users)
│   │   ├── ManagerDashboard.js (Dashboard for Managers)
│   ├── /services
│   │   ├── api.js  (Handles API requests)
│   │   ├── auth.js (Handles authentication logic)
│   ├── App.js      (Main app)
│   ├── index.js    (Entry point)
│── .env            (Environment variables)
│── package.json    (Dependencies & scripts)


npx create-react-app fastapi-react-auth
cd fastapi-react-auth
npm install react-router-dom axios
