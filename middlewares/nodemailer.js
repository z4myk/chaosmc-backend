const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user:'carlosrmosquera@gmail.com',
        pass:'ygjf ycnf mhtt aatq',
    }
})


module.exports = {
    transporter
}