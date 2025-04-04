require("dotenv").config();
const PORT = process.env.PORT || 5001;
const express = require("express");
const cors = require("cors");
require("./Models/db");

const app = express();
const authRoutes = require("./routes/authRoutes");

const testRoutes = require('./routes/testRoutes');

const courseRoutes=require("./routes/courseRoutes");

const ensureAuth = require("./Middleware/Auth");
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
// app.use("/course",ensureAuth, courseRoutes);

app.use('/api', testRoutes);


app.get('/hello',(req,res)=>{
  res.send('World');
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
