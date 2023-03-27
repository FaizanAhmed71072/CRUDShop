const db = require("../models");
const url = require("url");
const querystring = require("querystring");

exports.postCreateUser = async (req, res, next) => {
  try {
    const newUser = await db.User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    });

    const newUserCart = await db.Cart.create({
      UserId: newUser.id,
    });

    if (!newUser || !newUserCart) {
      throw new Error("Unable to set new user record");
    }
  } catch (error) {
    res.json(error.message);
  }

  res.redirect("/user/");
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await db.User.findAll();

    if (!users) {
      throw new Error("Users not found");
    }
    // res.json({
    //   pageTitle: "User",
    //   users: users,
    // });
    // console.log(users);
    res.render("user/userOp", {
      pageTitle: "User",
      users,
    });
  } catch (error) {
    res.json(error.message);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userID = req.body.userID;
    const user = await db.User.findById(userID);
    if (!user) {
      throw new Error("User Not Found!");
    }

    await user.destroy();
    console.log("User Deleted");
    res.redirect("/user/");
  } catch (error) {
    res.json(error.message);
  }
};

exports.getUpdateUser = async (req, res, next) => {
  const userID = req.body.userID;

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
  try {
    const userID = req.body.userID;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const updatedUser = await db.User.update(
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
      },
      { where: { id: userID } }
    );
    if (!updatedUser) {
      throw new Error("User not updated!");
    }

    console.log("User Updated");
    res.redirect("/user/");
  } catch (error) {
    res.json(error.message);
  }
};

exports.getUserProducts = async (req, res, next) => {
  try {
    const userID = req.query.userID;
    if (userID === null || userID === undefined) {
      throw new Error("User ID is null or undefined");
    }
    const products = await db.Product.findAll();

    if (!products) {
      throw new Error("Unable to find products");
    }
    res.render("user/userProducts", {
      pageTitle: "User Products",
      products: products,
      userID: userID,
    });
  } catch (error) {
    res.json(error.message);
  }
};

exports.getUserCartProducts = async (req, res, next) => {
  try {
    const { userID } = req.query;
    if (!userID) {
      throw new Error("Unable to find User ID");
    }
    const userCart = await db.Cart.findOne({
      where: {
        UserId: userID,
      },
    });

    if (!userCart) {
      throw new Error("User cart does not exist");
    }

    const cartProducts = await db.Cart.findAll({
      subQuery: false,
      include: [
        {
          model: db.Product,
          through: {
            attributes: ["ProductId", "quantity"],
          },
        },
      ],
      where: {
        UserId: userID,
      },
    });
    if (!cartProducts) {
      throw new Error("Unable to fetch cart products");
    }

    res.render("user/userCart", {
      pageTitle: "User Cart",
      cart: cartProducts[0].Products,
    });
    // res.json(cartProducts[0].Products);
  } catch (error) {
    res.json(error.message);
  }
};

exports.postUserCart = async (req, res, next) => {
  const productID = req.body.productID;
  const productQty = req.body.productQty;
  const userID = req.body.userID;
  try {
    const userCart = await db.Cart.findOne({
      where: {
        UserId: userID,
      },
    });

    if (!userCart) {
      throw new Error("User cart does not exist");
    }
    const prodInfo = await db.Product.findById(productID);

    if (!prodInfo) {
      throw new Error("Product not found");
    }
    if (productQty <= prodInfo.quantity) {
      const productAdded = await db.CartItem.create({
        ProductId: productID,
        quantity: productQty,
        CartId: userCart.id,
      });

      if (productAdded) {
        res.redirect(
          url.format({
            pathname: "/user/cart",
            query: {
              userID: userID,
            },
          })
        );
        // json({
        //   sucess: true,
        //   message: "product added successfully",
        // });
      }
    } else {
      throw new Error("Cart product quantity exceeds product quantity");
    }
  } catch (error) {
    res.json({ error: error.message });
  }
};

// .then(async (cart) => {
//   // console.log(cart);
//   if (cart.length === 0) {
//     console.log("NOT CART");
//     await db.Cart.create({
//       UserId: userID,
//     }).then((result) => {
//       console.log("Cart Created");
//     });
//   }

//   await db.CartItem.create({
//     ProductId: productID,
//     quantity: productQty,
//     CartId: cart[0].id,
//   });
// })
// .then((result) => res.redirect("/user/cart"))
// .catch((err) => console.log(err));

// res.redirect("/user/cart");
// await db.Product.findAll()
//   .then((products) => {
//     res.render("user/userProducts", {
//       pageTitle: "User Products",
//       products: products,
//     });
//   })
//   .catch((err) => console.log(err));

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

// .then(async (cart) => {
//   // console.log(cart);
//   if (cart.length === 0) {
//     console.log("NOT CART");
//     await db.Cart.create({
//       UserId: userID,
//     }).then(res.send("User Cart Created!"));
//   } else {
//     console.log("PQ");
//     console.log(cart[0]);
//   }
// })
// .catch((err) => console.log(err));

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

/* <!-- <td style="display: flex; justify-content: space-evenly;">
            <form action="/cart/delete" method="POST">
              <input type="hidden" value="<%= user.dataValues.id %>" name="userID">
              <input type="hidden" value="DELETE" name="_method">
              <button style="margin-right: 5px;">Delete</button>
            </form>

            <form action="/user/update" method="POST">
              <input type="hidden" value="<%= user.dataValues.id %>" name="userID">
              <button>Update</button>
            </form>

            <form action="/user/products" method="GET">
              <input type="hidden" value="<%= user.dataValues.id %>" name="userID">
              <button>Show Products</button>
            </form>

            <form action="/user/cart" method="GET">
              <input type="hidden" value="<%= user.dataValues.id %>" name="userID">
              <button>Cart</button>
            </form>
            
          </td> -->*/
