const { User } = require("../models/users");
const bcrypt = require("bcrypt");
const { initializeBoard } = require("./tasks");
const login = async (req, res) => {
  const { email, password } = req.body;
  //   console.log(email, password);
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).json({ error: "User not found" });
    }
    // console.log(user);
    const decodedPassword = await bcrypt.compare(password, user.password);

    if (decodedPassword) {
      res.status(200).json({ message: "Successful", user });
    } else {
      res.status(400).json({ error: "Invalid password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const signUp = async (req, res) => {
  //   console.log(req.body);
  const { fullname, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const existingUser = await User.findOne({ email: email });
    // console.log(user);
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
    } else {
      const newUser = await User.create({
        fullname: fullname,
        email: email,
        password: hashedPassword,
      });
      initializeBoard(newUser._id);
      res.status(200).json({ message: "User created successfully", newUser });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { login, signUp };
