const { response } = require("express");
const Payment = require("../models/payment");
const Order = require("../models/order");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes usar otros servicios como Outlook, SMTP personalizado, etc.
  auth: {
    user: 'carlosrmosquera@gmail.com', // Tu correo
    pass: 'ygjf ycnf mhtt aatq', // Tu contraseña o una app password si usas Gmail
  },
});

const createOrderNotified = async (req, res = response) => {
    try {
      const { paymentId, ...otherPaymentData } = req.body;
  
      // Verificar si el paymentId coincide con el _id de la orden
      const order = await Order.findById(paymentId);
  
      if (!order) {
        return res.status(404).json({
          ok: false,
          msg: "Orden no encontrada",
        });
      }
  
      // Verificar si ya existe un aviso de pago con el mismo paymentId
      const existingPayment = await Payment.findOne({ paymentId });
  
      if (existingPayment) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un informe de pago en este pedido, porfavor espere que un administrador actualize la orden.",
        });
      }
      // Cambiar el estado de la orden a "En Proceso de Confirmación"
      console.log(req.body)
      order.status = "En Proceso de Confirmación";
      // Guardar la orden actualizada
      await order.save();
  
      // Crear y guardar el aviso de pago
      const avisoPago = new Payment({ 
        paymentId,
        ...otherPaymentData,
      });
  
      await avisoPago.save();

        // Enviar correo electrónico al administrador
    const mailOptions = {
      from: 'carlosrmosquera@gmail.com', // Tu correo
      to: 'carlosrmosquera@gmail.com', // Correo del administrador
      subject: 'CHAOS MC NETWORK | Nuevo pedido en proceso de confirmación',
      text: `Hay un nuevo pedido en proceso de confirmación con el ID: ${order._id}`,
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h2 style="color: #0056b3;">Nuevo Pedido en Proceso de Confirmación</h2>
        <p>Estimado administrador,</p>
        <p>Le informamos que se ha registrado un nuevo pedido en la web con los siguientes detalles:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;">ID del Pedido:</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${order._id}</strong></td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd;">Cliente:</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${order.username}</strong></td>
          </tr>
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;">Monto Total:</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>$${order.totalPrice}USD</strong></td>
          </tr>
        </table>
  
        <p style="margin-top: 20px;">Por favor, revise el pedido en el panel de administración para confirmar el pago.</p>

        <p><hr></p>
        
        <p style="color: #777; font-size: 12px; margin-top: 20px;">
          Este es un correo generado automáticamente. Por favor, no responda a este mensaje.
        </p>
      </div>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error al enviar el correo:', error);
      } else {
        console.log('Correo enviado: ' + info.response);
      }
    });
  
      res.status(201).json({ ...avisoPago.toJSON() });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "Error para informar el pago",
        error,
      });
    }
  };
  
  const fetchOrderNotified = (_req, res) => {
    try {
      Payment.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ msg: error }));
    } catch (error) {
      console.log(error);
    }
  };
  
  
  const getOneOrderNotified = async (req, res = response) => {
    const paymentId = req.params.id;
    try {
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        return res.status(404).json({
          ok: false,
          msg: "No existe un informe de pago con esa id."
        });
      }
  
      res.status(200).json({
        ok: true,
        msg: payment
      })
  
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error interno, hable con un administrador.",
        error
      })
    }
  };
  
  const deleteOrderNotified = (req, res) => {
    
    try {
      const { id } = req.params;
      Payment
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
  
  module.exports = {
    createOrderNotified,
    fetchOrderNotified,
    getOneOrderNotified,
    deleteOrderNotified,
  
  };