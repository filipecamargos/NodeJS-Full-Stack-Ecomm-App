//PO04 Econ Project
const express = require('express');
const router = express.Router();

const path = require('path');

const econController = require("../controllers/econ-po04/econ");

const isAuth = require('../middleware/is-auth');

//Fist page with the products
router.get('/', econController.shop);

//Post method for adding a product to the cart
router.post('/shop-item', econController.addItemToCart);

//Display the cart this is the cart router
router.get('/cart', isAuth, econController.cartDisplay);

//Remove Item from the cart Post method
router.post('/cart/remove-item', isAuth, econController.removeItemFromCart)

//Add products router that will sent a post method
router.get('/add-product', isAuth, econController.addProduct);

//Post method for adding product
router.post('/add-product/add-item', isAuth, econController.postProduct);

//Admin Product Router to Edit or Delete it from the Data
router.get('/edit-products', isAuth, econController.editingProduct);

//Post methodo Router for an item to be edited
router.post('/edit-products/edit-item', isAuth, econController.editItem);

//Post to update the item on the database and redirect to the adming page
router.post('/edit-products/updated-item', isAuth, econController.updatedItem);

//Post methodo Router for an item that was deleted
router.post('/edit-products/delete-item', isAuth, econController.deleteItem);








module.exports = router;