const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    minecraftOption: {
        type: String,
        required: true,
    },
    details:{
        type: Array,
        required: true,
    },
    totalPrice:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);