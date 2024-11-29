const { Schema, model, default: mongoose} = require('mongoose');

const rolesSchema = Schema({

    name: {
        type: String,
        required: true,
    }

}, {
    timestamps: true,
})

module.exports = mongoose.model("Role", rolesSchema);