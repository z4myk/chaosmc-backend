
const express = require("express");
const { fetchServers, fetchCategoriesByServer, fetchProductsByServerAndCategory, fetchRandomProducts, fetchProductById, applyDiscountToAllProducts, updateProductDescription } = require("../controllers/servers.controller");

const router = express.Router();






router.get('/servers', fetchServers);
router.get('/products/server/:server', fetchCategoriesByServer);
router.get('/products/server/:server/category/:category', fetchProductsByServerAndCategory);
router.get('/products/random', fetchRandomProducts);
router.get('/products/:id', fetchProductById)
router.post('/products/apply-discount', applyDiscountToAllProducts);
router.post('/products/update-description', updateProductDescription);


module.exports = router;