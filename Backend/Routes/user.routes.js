const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../Model/Usermodel");
// const { empModel } = require("../Model/employee.model");
require("dotenv").config();
const userRoutes = Router();

userRoutes.post("/signup", async (req, res) => {
  const { name, email, password, address } = req.body;

  try {
    const isUserPresent = await UserModel.findOne({ email });

    if (isUserPresent) {
      return res.send({ msg: "user already register please login" });
    }

    const hashPassword = await bcrypt.hashSync(password, 8);

    const registerUser = new UserModel({
      name,
      email,
      password: hashPassword,
      address,
    });
    console.log(registerUser);
    await registerUser.save();
    console.log("hhe");
    return res.send("user registered successfully");
  } catch (error) {
    return res.send({ msg: error.message });
  }
});

userRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const isUserPresent = await UserModel.findOne({ email: email });

    if (!isUserPresent) {
      return res
        .status(201)
        .send({ msg: "User does not  exists Please Register" });
    }

    const isUserpassword = await bcrypt.compare(
      password,
      isUserPresent.password
    );

    if (!isUserpassword) {
      return res.send("Invalid username and password");
    }
    const token = jwt.sign(
      { userId: isUserPresent._id, email: isUserPresent.email },
      process.env.skey
    );
    return res.send({ msg: "Login sucessfull", token: token });
  } catch (error) {
    return res.status(201).send({ msg: error.message });
  }
});









module.exports = { userRoutes };
