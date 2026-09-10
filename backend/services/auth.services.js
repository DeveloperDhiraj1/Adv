import bcrypt from "bcrypt";
import User from "../models/user.model.js";

export const registerUser = async (userData) => {
  const { name, email, password, phone } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role: "USER",
  });

  const userResponse = user.toObject();

  delete userResponse.password;

  return userResponse;
};