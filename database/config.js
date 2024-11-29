const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const dbConnection = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_LOCAL)
        console.log('db connected')
    }catch(error){
        console.log(error)
        throw new Error('Error a la hora de inicializar la base de datos.');
    }
};


module.exports = {
    dbConnection
}