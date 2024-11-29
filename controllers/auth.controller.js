const User = require("../models/user");
const Role = require("../models/role");
const { newToken } = require("../helpers/jwt");
const base64url = require('base64url');
const {transporter} = require("../middlewares/nodemailer");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = process.env.SECRET_SEED;
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const role = await Role.findOne({name: "usuario"})

    const user = new User({
      email,
      password: await User.encryptPassword(password),
      roles:role._id
    });

    const savedUser = await user.save();
    const token = await newToken(savedUser._id);

    res.status(201).json({ token, user: savedUser, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userFound = await User.findOne({email}).populate("roles");

    if(!userFound) return res.status(400).json({message: "Email no encontrado"})

    console.log(userFound)
    
    const matchPassword = await User.comparePassword(password, userFound.password)
    if(!matchPassword) return res.status(401).json({token: null, message: "La contraseña es invalida" });
    
    const token = await newToken(userFound._id);

    res.json({ 
      user: userFound,
      token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const revalidateToken = async (req, res) => {

  const { uid, email, role } = req;
  //Generar un nuevo JWT y retornarlo en esta petición
  const token = await generateJWT(uid, email, role);
  const user = await User.findById(uid).populate('role', 'name');
  res.json({
      ok: true,
      user: user,
      token
  })
}




const forgotPassword = async (req, res) => {
  try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).json({
              ok: false,
              msg: "No pudimos encontrar tu cuenta de Chaos MC."
          })
      }

      const token = jwt.sign({ id: user._id, email: user.email, role: user.role },
        SECRET,
          { expiresIn: '15m' })

      const encodedToken = base64url.encode(token);

      await transporter.sendMail({
        from: 'carlosrmosquera@gmail.com',
        to: user.email,
        subject: 'CHAOS MC NETWORK | Restablecimiento de contraseña',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <div style="text-align: center;">
              <img src="https://dunb17ur4ymx4.cloudfront.net/webstore/logos/77d1a40e40432a9e60323a9a46cec681a5678ade.png" alt="CHAOS MC NETWORK" style="max-width: 150px; margin-bottom: 20px;" />
            </div>
            <h2 style="color: #333; text-align: center;">¿Olvidaste tu contraseña?</h2>
            <p style="color: #555; font-size: 16px; text-align: center;">No te preocupes, hemos recibido una solicitud para restablecer la contraseña de tu cuenta en CHAOS MC NETWORK.</p>
            <p style="color: #555; font-size: 16px; text-align: center;">Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="http://localhost:5173/reiniciar-contraseña/${encodedToken}" style="background-color: #ff5f5f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer contraseña</a>
            </div>
            <p style="color: #555; font-size: 14px; text-align: center;">Si no solicitaste este cambio, simplemente ignora este correo.</p>
            <div style="text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
              <p style="color: #777; font-size: 12px;">CHAOS MC NETWORK | Todos los derechos reservados © 2024</p>
              <p style="color: #777; font-size: 12px;">¿Necesitas ayuda? <a href="https://discord.com/invite/dnmPHcNcEY" target="_blank" style="color: #7289da; text-decoration: none;">Contáctanos</a></p>
            </div>
          </div>
        `
      });

      res.status(200).json({
          ok: true,
          msg: 'Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico.'
      });

  } catch (error) {
      res.status(500).json({
          ok: false,
          msg: 'Error interno, hable con el administrador.',
          error,
      })
  }
}

const resetPassword = async (req, res) => {
  try {
      const { password, token } = req.body;
      jwt.verify(token, SECRET, async (err, decoded) => {
          if (err) {
              return res.status(401).json({
                  ok: false,
                  msg: 'El Token inválido o ha expirado.'
              });
          }
          const userId = decoded.id;

          let user = await User.findById(userId);
          if (!user) {
              return res.status(404).json({
                  ok: false,
                  msg: "No pudimos encontrar tu cuenta de AINTECH Online.",
              })
          }

          const salt = bcrypt.genSaltSync();
          user.password = bcrypt.hashSync(password, salt);

          await user.save();

          res.status(200).json({
              ok: true,
              msg: "La contraseña se ha cambiado exitosamente.",
          })
      })


  } catch (error) {
      res.status(500).json({
          ok: false,
          msg: 'Error interno, hable con el administrador.',
          error,
      })
  }
}


module.exports = {
    loginUser,
    registerUser,
    revalidateToken,
    resetPassword,
    forgotPassword,
}