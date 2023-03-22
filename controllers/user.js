const db = require("../models");

exports.postCreateUser = async (req, res, next) => {
  console.log("!");

  let user = await db.User.create({
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
