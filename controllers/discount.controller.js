const Discount = require('../models/Discount'); // Asegúrate de importar el modelo

// Controlador para actualizar o crear el descuento
const updateDiscount = async (req, res) => {
  const { discountPercentage } = req.body; // Obtenemos el descuento desde el body

  if (discountPercentage < 0 || discountPercentage > 100) {
    return res.status(400).json({ message: 'El porcentaje de descuento debe estar entre 0 y 100' });
  }

  try {
    // Verificar si ya existe un descuento
    let discount = await Discount.findOne();

    if (!discount) {
      // Si no existe, creamos uno nuevo
      discount = new Discount({ discountPercentage });
    } else {
      // Si ya existe, actualizamos el porcentaje
      discount.discountPercentage = discountPercentage;
    }

    // Guardamos el descuento en la base de datos
    await discount.save();

    res.status(200).json({ message: 'Descuento actualizado correctamente', discount });
  } catch (error) {
    console.error('Error al actualizar el descuento:', error);
    res.status(500).json({ message: 'Error al actualizar el descuento' });
  }
};



const getDiscount = async (req, res) => {
    try {
      // Busca el descuento más reciente
      const discount = await Discount.findOne().sort({ createdAt: -1 });
  
      if (!discount) {
        return res.status(404).json({ message: "No se encontró ningún descuento" });
      }
  
      return res.status(200).json({ discountPercentage: discount.discountPercentage });
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener el descuento", error: error.message });
    }
  };
  
 

module.exports = {
  updateDiscount,
  getDiscount,
};