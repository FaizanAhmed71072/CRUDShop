const express = require("express");

const router = express.Router();
const productController = require("../controllers/product");

router.get("/", productController.getCreateProduct);

router.post("/", productController.postCreateProduct);

router.post("/delete", productController.deleteProduct);

router.post("/update", productController.getUpdateProduct);

router.post("/updated", productController.postUpdateProduct);

module.exports = router;
