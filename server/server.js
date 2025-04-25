const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
dotenv.config();
const app = express();
//only for deployment
// app.use(cors({
//   origin: 'https://expense-tracker-cse.vercel.app', // frontend origin
//   credentials: true               // allow cookies
// }));

//both development and deployment
const allowedOrigins = [
  'http://localhost:3000',
  'https://expense-tracker-cse.vercel.app', // frontend origin
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.log("❌ MongoDB Connection Failed:", err));

app.use('/auth', require('./routes/auth'));
app.use('/event', require('./routes/event'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
