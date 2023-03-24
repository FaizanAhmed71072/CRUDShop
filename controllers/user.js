const db = require("../models");
const url = require("url");
const querystring = require("querystring");

exports.postCreateUser = async (req, res, next) => {
  console.log("!");

  await db.User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  });

  res.redirect("/user/");

  console.log("!!!");
};

exports.getCreateUser = async (req, res, next) => {
  await db.User.findAll()
    .then((users) => {
      // console.log(users);
      res.render("user/userOp", {
        pageTitle: "User",
        users: users,
      });
    })
    .catch((err) => console.log(err));
};

exports.deleteUser = async (req, res, next) => {
  const userID = req.body.userID;
  console.log(userID);

  await db.User.findById(userID)
    .then((user) => {
      user.destroy();
    })
    .then((result) => {
      console.log("User Deleted");
      res.redirect("/user/");
    })
    .catch((err) => console.log(err));
};

exports.getUpdateUser = async (req, res, next) => {
  const userID = req.body.userID;
  console.log(userID);

  await db.User.findById(userID)
    .then((user) => {
      // console.log(users);
      res.render("user/updateUser", {
        pageTitle: "User Update",
        user: user,
      });
    })
    .catch((err) => console.log(err));
};

exports.postUpdateUser = async (req, res, next) => {
  const userID = req.body.userID;
  console.log(userID);

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  await db.User.update(
    {
      firstName: firstName,
      lastName: lastName,
      email: email,
    },
    { where: { id: userID } }
  )
    .then((user) => {
      console.log("User Updated");
      res.redirect("/user/");
    })
    .catch((err) => console.log(err));
};

exports.getUserProducts = async (req, res, next) => {
  await db.Product.findAll()
    .then((products) => {
      res.render("user/userProducts", {
        pageTitle: "User Products",
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.getUserCart = async (req, res, next) => {
  const query = url.parse(req.url).query;
  const queryParams = querystring.parse(query);
  const userID = queryParams.userID;

  console.log(userID);
  // , include: [{ model: db.Product }]
  await db.Cart.findAll({
    include: [{ model: db.Product }],
    where: {
      UserID: userID,
    },
  })
    .then(async (cart) => {
      if (cart.length === 0) {
        console.log("NOT CART");
        await db.Cart.create({
          UserId: userID,
        }).then(res.send("User Cart Created!"));
      } else {
        console.log(cart[0].dataValues.Products);
      }
    })
    .catch((err) => console.log(err));

  // await db.Cart.findOne({ where: { UserId: userID } })
  //   .then(async (cart) => {
  //     if (!cart) {
  //       await db.Cart.create({
  //         UserId: userID,
  //       });
  //       res.redirect("/user/cart");
  //     } else {
  //       res.render("user/userCart", {
  //         pageTitle: "User Cart",
  //         cart: cart,
  //       });
  //     }
  //   })
  //   .catch((err) => console.log(err));

  // await db.Cart.findOne({ where: { UserId: userID } })
  //   .then((cart) => {
  //     console.log(cart);
  //   })
  //   .catch((err) => console.log(err));
};

exports.postUserCart = async (req, res, next) => {
  const productID = req.body.productID;
  const productQty = req.body.productQty;

  console.log(productID, productQty);
  res.redirect("/user/cart");
  // await db.Product.findAll()
  //   .then((products) => {
  //     res.render("user/userProducts", {
  //       pageTitle: "User Products",
  //       products: products,
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

//   await db.CartItem.findAll({
//     where: { CartId: db.Cart.findOne({ where: { id: userID } }) },
//   })
//     .then(async (cart_items) => {
//       console.log(cart_items);
//       // res.render("user/userCart", {
//       //   pageTitle: "User Products",
//       //   cart_items: cart_items,
//       // });
//     })
//     .catch((err) => console.log(err));
// };

// exports.getCartUser = async (req, res, next) => {
//   await db.User.findAll()
//     .then((users) => {
//       // console.log(users);
//       res.render("user/userOp", {
//         pageTitle: "User",
//         users: users,
//       });
//     })
//     .catch((err) => console.log(err));
// };
