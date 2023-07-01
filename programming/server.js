const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const mysql = require('mysql');
require("dotenv").config()


const route = require('./routes/route')

const app = express()


// Database connection
const sequelize = require('./database');
//{ force: true }
sequelize.sync().then(() => {
  console.log("Connected to database");
}).catch((error) => {
  console.log("Error connecting to database: ", error);
});


//middleware
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))

//route
app.use('/api',route)

app.get('/', (req, res) => {
  res.send('Hello World!')
});



const port = process.env.PORT || 8080
app.listen(port, () => console.log("start server in port " + port))
