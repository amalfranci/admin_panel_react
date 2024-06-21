import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";

import router from './routes/routes.js';
import dbCon from './utlies/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:3000", // Set to your client URL
    credentials: true,
  })
);
app.use(cookieParser());

// Middleware to parse JSON
app.use(express.json());

// Database connection
dbCon();

// Routes
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server connected on port ${PORT}`);
});
