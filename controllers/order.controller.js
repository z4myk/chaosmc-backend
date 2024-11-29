const { response } = require("express");
const Order = require('../models/order');
const nodemailer = require("nodemailer");



const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes usar otros servicios como Outlook, SMTP personalizado, etc.
  auth: {
    user: 'carlosrmosquera@gmail.com', // Tu correo
    pass: 'ygjf ycnf mhtt aatq', // Tu contraseña o una app password si usas Gmail
  },
});
const createOrderPublication = async (req, res = response) => {
    try {
    

      const orderPublication = Order({...req.body});

      
      await orderPublication.save();
     console.log(orderPublication)
      // Enviar la URL de la imagen junto con los demás datos del producto
      res.status(201).json({ ...orderPublication.toJSON()});
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: 'Error interno, hable con un administrador.',
        error,
      });
    }
  };

  

  const fetchOrdersPublications = (_req, res) => {
    try{
        Order
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ msg: error }));
    }catch(error){
      console.log(error)
    }
  }

  const getOneOrderPublication = async (req, res = response) => {
    const orderId = req.params.id;
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          ok: false,
          msg: "No existe un pedido con esa id."
        });
      }
  
      res.status(200).json({
        ok: true,
        msg: order
      })
  
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error interno, hable con un administrador.",
        error
      })
    }
  };

  const deleteOrderPublication = (req, res = response) => {
    try {
      const { id } = req.params;
      Order
        .deleteOne({ _id: id })
        .then((data) => res.json(data))
        .catch((error) => res.json({ msg: error }))
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error interno, hable con un administrador.",
        error
      })
    }
  }


  const updateOrderPublication = async (req, res = response) => {

    const orderId = req.params.id;
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          ok: false,
          msg: "No existe una orden con esa id."
        })
      }
  
      const updated = {
        ...req.body
      }
  
      const orderUpdate = await Order.findByIdAndUpdate(orderId, updated, { new: true });
  
      res.json({
        ok: true,
        order: orderUpdate,
      })
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error interno, hable con un administrador."
      })
    }
  };


  const updateOrderStatus = async (req, res) => {
    const orderId = req.params.id; 
    const { status, trackingCode } = req.body; 
  
    try {
      // Actualiza el estado del pedido solo si el campo "status" está presente
      if (status) {
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  
        if (!updatedOrder) {
          return res.status(404).json({ message: 'Pedido no encontrado' });
        }
  
        // Enviar correo al usuario si el estado cambia a "Confirmado"
        if (status === "Confirmado") {
          const mailOptions = {
            from: 'tucorreo@dominio.com', // Tu correo
            to: updatedOrder.email, // Correo del usuario
            subject: 'CHAOS MC NETWORK | Pedido confirmado',
            text: `Estimado/a ${updatedOrder.username}, tu compra con ID: ${updatedOrder._id} ha sido confirmado.`,
            html: `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
              <h2 style="color: #0056b3;">Confirmación de Pedido</h2>
              <p>Estimado/a ${updatedOrder.username},</p>
              <p>Nos complace informarte que tu pedido ha sido confirmado. Aquí están los detalles de tu compra:</p>
    
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr style="background-color: #f5f5f5;">
                  <td style="padding: 10px; border: 1px solid #ddd;">ID del Pedido:</td>
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>${updatedOrder._id}</strong></td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px; border: 1px solid #ddd;">Nickname:</td>
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>${updatedOrder.username}</strong></td>
                </tr>
                <tr style="background-color: #f5f5f5;">
                  <td style="padding: 10px; border: 1px solid #ddd;">Monto Total:</td>
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>$${updatedOrder.totalPrice}USD</strong></td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px; border: 1px solid #ddd;">Opción de Minecraft:</td>
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>${updatedOrder.minecraftOption}</strong></td>
                </tr>
                <tr style="background-color: #f5f5f5;">
                  <td style="padding: 10px; border: 1px solid #ddd;">País:</td>
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>${updatedOrder.country}</strong></td>
                </tr>
              </table>

              <p style="margin-top: 20px;">Si tienes alguna pregunta, no dudes en contactarnos a través de nuestro canal de Discord. Puedes crear un ticket haciendo clic en el siguiente enlace:</p>

              <p style="text-align: center; margin-top: 20px;">
                <a href="https://discord.com/invite/dnmPHcNcEY" style="background-color: #7289DA; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Crear un ticket en Discord</a>
              </p>
    
              <p>Gracias por tu compra. Esperamos que disfrutes tu experiencia en CHAOS MC NETWORK.</p>

              <hr>

              <p style="color: #777; font-size: 12px; margin-top: 20px;">
                Este es un correo generado automáticamente. Por favor, no respondas a este mensaje.
              </p>
            </div>
          `,
          };
  
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error al enviar el correo al usuario:', error);
            } else {
              console.log('Correo de confirmación enviado al usuario: ' + info.response);
            }
          });
        }
  
        return res.status(200).json(updatedOrder);
      } else {
        return res.status(400).json({ message: 'Se requiere el campo "status" en la solicitud' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
  

  module.exports = {
      createOrderPublication,
      fetchOrdersPublications,
      getOneOrderPublication,
      deleteOrderPublication,
      updateOrderPublication,
      updateOrderStatus,


  }