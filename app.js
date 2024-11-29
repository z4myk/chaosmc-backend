const express = require('express');
require("dotenv").config();
const cors = require("cors");
const bodyParser = require('body-parser');
const serverRoutes = require('./routes/servers');
const { dbConnection } = require('./database/config');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order')
const paymentRoutes = require('./routes/payment')
const discountRoutes = require('./routes/discount')
const {createRoles} = require('./libs/initialSetup');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
createRoles();
dbConnection();
//CORS

const corsOptions ={
    origin:'http://localhost:5173', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(cors(corsOptions));

app.use('/api', orderRoutes);
app.use('/api', paymentRoutes);
app.use('/api', serverRoutes);
app.use('/api', authRoutes);
app.use('/api', discountRoutes); 






app.get('/', (req, res) => {
    res.send("chaosmc api")
})




app.listen("9000", () => {
    console.log('Servidor abierto en puerto', "9000")
})