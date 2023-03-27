const express = require("express");

const router = express.Router();
const userController = require("../controllers/user");

router.get("/", userController.getUsers);

router.post("/", userController.postCreateUser);

router.post("/delete", userController.deleteUser);

router.post("/update", userController.getUpdateUser);

router.post("/updated", userController.postUpdateUser);

router.get("/products", userController.getUserProducts);

router.post("/products", userController.postUserCart);

router.get("/cart", userController.getUserCartProducts);

router.post("/cart/remove", userController.postCartProductRemove);

// router.get("/cart/update", userController.);

module.exports = router;
