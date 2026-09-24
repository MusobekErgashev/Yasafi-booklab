const express = require("express");
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}))

app.use(express.json());
app.use(cookieParser());
app.use('/api', require('./routes/router'));

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});