const { Schema, model, default: mongoose} = require('mongoose');

const discountSchema = Schema({
    discountPercentage: Number

}, {
    timestamps: true,
})

module.exports = mongoose.model("Discount", discountSchema);