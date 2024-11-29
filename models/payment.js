const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    bank: {
        type: String,
        required: true,
    },
    numberOperation: {
        type: Number,
      
    },
    transferred: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    comments:{
        type: String,
    },
    date:{
        type: Date,
        default: Date.now,
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId, // Cambia el tipo de dato a ObjectId
        ref: 'Order', 
        required: true,
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);