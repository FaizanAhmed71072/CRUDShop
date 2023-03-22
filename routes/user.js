const express = require("express");

const router = express.Router();
const userController = require("../controllers/user");

router.get("/", userController.getCreateUser);

router.post("/", userController.postCreateUser);

router.post("/delete", userController.deleteUser);

router.post("/update", userController.getUpdateUser);

router.post("/updated", userController.postUpdateUser);

module.exports = router;
