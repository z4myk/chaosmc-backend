const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Role = require("../models/role")
const SECRET = process.env.SECRET_SEED;


const verifyToken = async (req, res, next) => {

  const token = req.headers["token"];
  if (!token) return res.status(403).json({ message: "No token provided" })

  try {
    const decoded = jwt.verify(token, SECRET)

    req.userId = decoded.id;
    const user = await User.findById(req.userId, { password: 0 })

    if (!user) return res.status(404).json({ message: "No user found" })
    next()

  } catch (error) {
    return res.status(401).json({ message: 'unathourized', error: error})
  }

}


const renewToken = async (req, res) => {
  try {
    const userId = req.userId; // Extrae el ID del usuario del token ya validado

    // Genera un nuevo token
    const newToken = jwt.sign({ id: userId }, SECRET, {
      expiresIn: "1h", // o la duración que prefieras
    });

    const user = await User.findById(userId, { password: 0 }).populate('roles');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ token: newToken, user }); // Envía el nuevo token y los datos del usuario
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const isAdmin = async (req, res, next) => {

  console.log(req);
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } })

  const isAdmin = roles.some(role => role.name === "administrador");

  if (isAdmin) {
    next();
  } else {
    return res.status(400).json({ message: "Require admin role" });
  }

}


const validateJWT = (req, res = response, next ) => {

  //x-token headers
  const token = req.header('x-token');

  if(!token) {
      return res.status(401).json({
          ok: false,
          msg: 'No hay token en la petición.'
      });
  }

  try {
      
      const {uid, username, role} = jwt.verify(
          token,
          SECRET
      );
      
      req.uid = uid;
      req.username = username;
      req.role = role;
      
  } catch (error) {
      return res.status(401).json({
          ok: false,
          msg: 'Token no válido'
      })
  }
  next();
}

module.exports = {
  verifyToken,
  renewToken,
  isAdmin,
  validateJWT,
}