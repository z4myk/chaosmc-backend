const Role = require('../models/role')

const createRoles = async () => {

    try{
        const count = await Role.estimatedDocumentCount();

        if(count > 0 ) return;
    
        const values = await Promise.all([
            new Role({name: 'usuario'}).save(),
            new Role({name: 'administrador'}).save(),
        ])
        console.log(values)

    }catch(err){
        console.log(err)
    }

}

module.exports = {
    createRoles
}