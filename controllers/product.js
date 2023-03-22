const db = require("../models");

exports.getCreateProduct = async (req, res, next) => {
  await db.Product.findAll()
    .then((products) => {
      res.render("product/productOp", {
        pageTitle: "Products",
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCreateProduct = async (req, res, next) => {
  await db.Product.create({
    name: req.body.name,
    type: req.body.type_opt,
    quantity: req.body.quantity,
  });

  res.redirect("/product/");
};

exports.deleteProduct = async (req, res, next) => {
  const productID = req.body.productID;

  await db.Product.findById(productID)
    .then((product) => {
      product.destroy();
    })
    .then((result) => {
      console.log("Product Deleted");
      res.redirect("/product/");
    })
    .catch((err) => console.log(err));
};

exports.getUpdateProduct = async (req, res, next) => {
  const productID = req.body.productID;

  await db.Product.findById(productID)
    .then((product) => {
      res.render("product/updateProduct", {
        pageTitle: "Product Update",
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postUpdateProduct = async (req, res, next) => {
  const productID = req.body.productID;

  const name = req.body.name;
  const type = req.body.type;
  const quantity = req.body.quantity;

  await db.Product.update(
    {
      name: name,
      type: type,
      quantity: quantity,
    },
    { where: { id: productID } }
  )
    .then((product) => {
      console.log("Product Updated");
      res.redirect("/product/");
    })
    .catch((err) => console.log(err));
};
