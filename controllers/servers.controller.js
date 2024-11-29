const { response } = require("express");
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require("dotenv").config();

const TEBEX_API_URL = process.env.TEBEX_API_URL;
const TEBEX_SECRET = process.env.TEBEX_SECRET;

const fetchServers = async (_req, res) => {
    try {
        const response = await axios.get(TEBEX_API_URL, {
          headers: {
            'X-Tebex-Secret': TEBEX_SECRET
          }
        });
        const data = response.data;
    
         // Crear un conjunto para almacenar servidores únicos
    const uniqueServersSet = new Set();

    // Iterar sobre cada producto y agregar sus servidores al conjunto
    data.forEach(product => {
      product.servers.forEach(server => {
        uniqueServersSet.add(
           server.name);
      });
    });

    // Convertir el conjunto de vuelta a un array
    const uniqueServers = Array.from(uniqueServersSet);
    
        res.json(uniqueServers);
      } catch (error) {
        console.error('Error fetching data from Tebex API:', error);
        res.status(500).json({ error: 'Failed to fetch data from Tebex API' });
      }
};
    

const fetchCategoriesByServer = async (req, res) => {
  try {
  
    const response = await axios.get(TEBEX_API_URL, {
      headers: {
        'X-Tebex-Secret': TEBEX_SECRET
      }
    });
    const data = response.data;

    // Obtener el nombre del servidor desde los parámetros de la URL
    const serverName = req.params.server;

    // Filtrar los productos según el servidor especificado
    const filteredProducts = data.filter(product =>
      product.servers.some(server => server.name === serverName)
    );

    // Extraer las categorías únicas de los productos filtrados
    const categoriesSet = new Set();
    filteredProducts.forEach(product => {
      if (product.category && product.category.name) {
        categoriesSet.add(product.category.name);
      }
    });

    // Convertir el conjunto de categorías únicas a un array
    const categories = Array.from(categoriesSet);

    res.json(categories);
  } catch (error) {
    console.error('Error fetching data from Tebex API:', error);
    res.status(500).json({ error: 'Failed to fetch data from Tebex API' });
  }
};
  

const fetchProductsByServerAndCategory = async (req, res) => {
  try {
    const response = await axios.get(TEBEX_API_URL, {
      headers: {
        'X-Tebex-Secret': TEBEX_SECRET
      }
    });
    const data = response.data;

    // Obtener el nombre del servidor y la categoría desde los parámetros de la URL
    const serverName = decodeURIComponent(req.params.server);
    const categoryName = decodeURIComponent(req.params.category);

    // Filtrar los productos según el servidor especificado
    const filteredByServer = data.filter(product =>
      product.servers.some(server => server.name === serverName)
    );

    // Filtrar los productos según la categoría especificada
    const filteredByCategory = filteredByServer.filter(product =>
      product.category && product.category.name === categoryName
    );

    res.json(filteredByCategory);
  } catch (error) {
    console.error('Error fetching data from Tebex API:', error);
    res.status(500).json({ error: 'Failed to fetch data from Tebex API' });
  }
};


const fetchRandomProducts = async (req, res) => {
  try {
    const response = await axios.get(TEBEX_API_URL, {
      headers: {
        'X-Tebex-Secret': TEBEX_SECRET
      }
    });
    const data = response.data;

    // Filtrar productos que cuesten más de 20 dólares y obtener los primeros 5
    const expensiveProducts = data.filter(product => parseFloat(product.price) > 5).slice(3, 13);

    res.json(expensiveProducts);
  } catch (error) {
    console.error('Error fetching data from Tebex API:', error);
    res.status(500).json({ error: 'Failed to fetch data from Tebex API' });
  }
};



const fetchProductById = async (req, res) => {
  try {
    const response = await axios.get(TEBEX_API_URL, {
      headers: {
        'X-Tebex-Secret': TEBEX_SECRET
      }
    });
    const data = response.data;

    // Obtener el ID del producto desde los parámetros de la URL
    const productId = req.params.id;

    // Encontrar el producto con el ID especificado
     const product = data.find(product => product.id.toString() === productId.toString());

    if (product) {
      // Leer el archivo JSON de descripciones
      const descriptionsPath = path.join(__dirname, 'productDescriptions.json');
      const descriptions = JSON.parse(fs.readFileSync(descriptionsPath, 'utf8'));

      // Añadir la descripción al producto
      const productDetails = descriptions[productId] || { description: 'Descripción no disponible' };
      product.description = productDetails.description;
      product.imageUrl = productDetails.imageUrl || null;


      // Filtrar los servidores no deseados 
      const filteredServers = product.servers.filter(server => {
        const cleanedServerName = server.name.trim().toLowerCase();
        return cleanedServerName !== 'chaosmc discord' &&
               cleanedServerName !== 'void gens 2' &&
               cleanedServerName !== 'chaosmc gens 2';
      });

      // Reemplazar la lista de servidores con la lista filtrada
      product.servers = filteredServers;

      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching data from Tebex API:', error);
    res.status(500).json({ error: 'Failed to fetch data from Tebex API' });
  }
};


// Ruta para agregar o actualizar la descripción de un producto
const updateProductDescription = (req, res) => {
  try {
    // Obtener el ID del producto, descripción y URL de la imagen desde el cuerpo de la solicitud
    const { productId, description, imageUrl } = req.body;

    if (!productId || !description || !imageUrl) {
      return res.status(400).json({ error: 'Faltan datos: productId, description, y imageUrl son requeridos.' });
    }

    // Leer el archivo JSON de descripciones
    const descriptionsPath = path.join(__dirname, 'productDescriptions.json');
    const descriptions = JSON.parse(fs.readFileSync(descriptionsPath, 'utf8'));

    // Actualizar o añadir la nueva descripción e imagen al producto
    descriptions[productId] = {
      description: description,
      imageUrl: imageUrl
    };

    // Guardar el archivo JSON actualizado
    fs.writeFileSync(descriptionsPath, JSON.stringify(descriptions, null, 2), 'utf8');

    res.status(200).json({ message: 'Descripción actualizada correctamente.' });
  } catch (error) {
    console.error('Error al actualizar la descripción del producto:', error);
    res.status(500).json({ error: 'Error al actualizar la descripción del producto.' });
  }
};









const applyDiscountToAllProducts = async (req, res) => {
  try {
    const { discountPercentage } = req.body;

    // Validar que el porcentaje de descuento sea un número entre 0 y 100
    if (!discountPercentage || discountPercentage < 0 || discountPercentage > 100) {
      return res.status(400).json({ error: 'Porcentaje de descuento inválido' });
    }

    const response = await axios.get(TEBEX_API_URL, {
      headers: {
        'X-Tebex-Secret': TEBEX_SECRET
      }
    });
    const data = response.data;

    // Aplicar el descuento a cada producto
    const updatedProducts = data.map(product => {
      const originalPrice = parseFloat(product.price);
      const discountedPrice = originalPrice - (originalPrice * (discountPercentage / 100));
      return {
        ...product,
        originalPrice: originalPrice.toFixed(2),
        discountedPrice: discountedPrice.toFixed(2)
      };
    });

    res.json(updatedProducts);
  } catch (error) {
    console.error('Error applying discount to products:', error);
    res.status(500).json({ error: 'Failed to apply discount to products' });
  }
};

  module.exports = {
  fetchServers,
  fetchCategoriesByServer,
  fetchProductsByServerAndCategory,
  fetchRandomProducts,
  fetchProductById,
  applyDiscountToAllProducts,
  updateProductDescription,
}