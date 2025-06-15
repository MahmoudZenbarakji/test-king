const express = require('express');
const connectdb = require('./database/connectdb');
const app = express()
const productRoute = require('./routes/productRoutes')
const categoryRoute = require('./routes/categoryRoutes')
const subcategoryRoute = require('./routes/subcategoryRoutes')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
const session = require('express-session');
const bodyParser = require('body-parser');
const isauth = require('./routes/authRoute')
const isAuthenticated = require('./middleware/session')
const cors = require('cors');
// At the top of your file
require('dotenv').config();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use('/api/product',productRoute)
app.use('/api/categories',categoryRoute)
app.use('/api/subcategory',subcategoryRoute)


app.get('/dashboard', isAuthenticated, (req, res) => {
  res.send('Welcome to the dashboard');
});


app.use(cors({
  origin: '*',  // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  // credentials: true  // Remove or comment out this line
}));
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  // Use relative path to frontend dist
  const frontendPath = path.join(__dirname, '../frontend/dist');
  
  console.log('Serving static files from:', frontendPath);
  
  app.use(express.static(frontendPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});
const PORT = process.env.PORT || 6000;
const startServer = async()=>{
    try{
        await connectdb(process.env.MONGODB_URI)
        app.listen(PORT,()=>{
            console.log(`the Server is running in http://localhost:${PORT}`)
        })
    }catch(error){
        console.log(error)
    }
}
startServer()