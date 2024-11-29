const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET_SEED;

const newToken = (id) => {
    
    return new Promise((resolve, reject) => {
        jwt.sign({ id: id }, SECRET, {
            expiresIn: '1h'
        }, (err, res) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            resolve(res);
        })

    })
}

module.exports = {
    newToken
}