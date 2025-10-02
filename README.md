# 🌍 AeroLens Backend

The **AeroLens Backend** is a Node.js + Express.js server powering aerial image AI workflows.  
It provides a scalable REST API, modular routing, and environment-driven configuration, making it easy to integrate with frontend applications and cloud deployments.

---

##  Features
-  REST API with **Express.js**
-  Environment variables via **dotenv**
-  Modular routing system
-  Ready for containerization (Docker-friendly)
-  Git/GitHub integration for version control
-  ES Modules support (`"type": "module"`)

---

##  Tech Stack
- **Node.js** (v20 LTS)
- **npm** (v10+)
- **Express.js**
- **dotenv**
- (Optional) **nodemon** for development

---

##  Project Structure
```
aerolens-backend/
├── src/
│   ├── index.js        # Application entry point
│   ├── routes.js       # Express routes
│   └── controllers/    # (Future) Request handlers
├── .env                # Environment variables
├── package.json        # Project metadata + dependencies
├── README.md           # Documentation
└── node_modules/       # Installed dependencies
```

---

##  Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/aerolens-backend.git
cd aerolens-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root:
```env
PORT=3000
```

---

##  Running the Server

### Start normally
```bash
npm start
```
 Server will run at: [http://localhost:3000](http://localhost:3000)

### Start with auto-reload (development mode)
```bash
npm install -g nodemon
nodemon src/index.js
```

---

##  Example Code

### **src/index.js**
```js
import express from "express";
import dotenv from "dotenv";
import routes from "./routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api", routes);

// Start server
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
```

---

### **src/routes.js**
```js
import express from "express";
const router = express.Router();

// Sample route
router.get("/", (req, res) => {
  res.json({ message: "Welcome to AeroLens Backend API " });
});

// Add more routes here
// router.post("/upload", controllerFunction);

export default router;
```

---

##  Troubleshooting

### Warning: `MODULE_TYPELESS_PACKAGE_JSON`
If you see:
```
Warning: Module type of file is not specified...
```
 Add `"type": "module"` in `package.json`:
```json
{
  "name": "aerolens-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/index.js"
  }
}
```

---

### Error: `TypeError: argument handler must be a function`
This happens if your routes are exported/imported incorrectly.  
 Use **default export** in `routes.js` and default import in `index.js`.

---

##  License
MIT License © 2025 [Your Name / AeroLens Team]

---

##  Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.

---

## Future Improvements
- API documentation with Swagger / Postman
- Database integration (PostgreSQL / MongoDB)
- Authentication & authorization
- Docker support
- Cloud deployment (AWS, Azure, GCP)
