import User from "../models/User.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const jwtSecret = process.env.JWT_SECRET;

class UserController {
  //gerar token
  static gerarToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
      expiresIn: "7d",
    });
  };

  //registrar usuario e fazer login
  static registrarUsuario = async (req, res) => {
    const { name, email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });

    if (user) {
      res.status(422).json({ errors: ["Por favor, utilize outro e-mail."] });
      return;
    }

    // Generate password hash
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: passwordHash,
    });

    if (!newUser) {
      res.status(422).json({
        errors: ["Houve um erro, por favor tente novamente mais tarde."],
      });
      return;
    }

    res.status(201).json({
      _id: newUser._id,
      token: generateToken(newUser._id),
    });
  };
}

export default UserController;
