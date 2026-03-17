import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
const register = async (req, res) => {
  const {name, email, password } = req.body
  
  // check if user exists
  const userExists = await prisma.user.findUnique({
    where: {email : email},
  });
  if (userExists) {
    return res.status(409).json({ error: "User with this email already exists"})
  }

  // hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  });

  // generate jwt token
  const token = generateToken(user.id, res)

  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: name,
        email: email
      },
      token,
    }
  })
}

const login = async (req, res) => {
  const { email, password } = req.body;
  // check if the user email exist in the user table
  const user = await prisma.user.findUnique({
    where: {email : email},
  });
  if (!user) {
    return res.status(401).json({ error: "invalid email or password"})   
  }
  // verify password
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return res.status(401).json({ error: "invalid email or password"})   
  }
  
  // generate jwt token
  const token = generateToken(user.id, res)

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: email
      },
      token,
    }
  })
}
const logout = async (req, res) => {
  res.cookie("jwt","", {
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(200).json({
    status: "success",
    message: "Logged out successfully"
  })
}
const getUser = async (req, res, next) => {
  try {
    // req.user is already set by authMiddleware (without password)
    res.status(200).json({ status: "success", data: { user } });
  } catch (error) {
    next(error);
  }
};

export {register, login, logout, getUser };
