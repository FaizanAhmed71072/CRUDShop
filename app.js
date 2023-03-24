const express = require("express");
// const sequelize = require('./util/database');

const db = require("./models/");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// app.use('/', (req, res, next) => {
//     console.log("On /");
//     res.redirect('/user/create');
// })
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/user", userRoutes);
app.use("/product", productRoutes);

// db.User.belongsToMany(db.Product);
// db.Product.belongsTo(db.User);

db.Cart.belongsTo(db.User);
db.User.hasOne(db.Cart);

db.Cart.belongsToMany(db.Product, { through: db.CartItem });
db.Product.belongsToMany(db.Cart, { through: db.CartItem });

db.sequelize
  // .sync({ force: true })
  .sync()
  .then((res) => {
    console.log("res");
  })
  .catch((err) => console.log(err));

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
