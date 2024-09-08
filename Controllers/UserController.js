import UserModel from "../Models/UserModel.js";
import validateEmail from "../Utils/EmailValidator.js";
import bcrypt from "bcrypt";

export const getUser = async (req, res) => {
  try {
    const { uuid } = req.params;

    let user;
    const userAttributes = ["id", "uuid", "name", "email", "role"];
    if (uuid) {
      user = await UserModel.findOne({
        where: { uuid },
        attributes: userAttributes,
      });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User Not Found",
        });
      }
    } else {
      user = await UserModel.findAll({
        attributes: userAttributes,
      });
    }

    res.status(200).json({
      status: true,
      message: uuid ? "Success Get User" : "Success Get All User",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, role, password, confirmPassword } = req.body;
    if (!name) throw { message: "Please Input Name" };
    if (!email) throw { message: "Please Input Email" };
    if (!validateEmail(email)) throw { message: "Invalid Email Format" };
    if (!password) throw { message: "Please Input Password" };
    if (!confirmPassword) throw { message: "Please Input Confirm Password" };
    if (password !== confirmPassword)
      throw { message: "Password and Confirm Password is not same" };
    if (!role) throw { message: "Please Input Role" };

    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) throw { message: "Email is already in use" };

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name,
      email,
      role,
      password: hashPassword,
    });

    const userWithoutPassword = { ...user.toJSON() };
    delete userWithoutPassword.password;

    res.status(201).json({
      status: true,
      message: "Register Success",
      data: userWithoutPassword,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({
      where: {
        email,
      },
    });
    if (!user) throw { message: "User Not Found" };

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) throw { message: "Password Incorrect" };

    req.session.userId = user.uuid;

    const userInfo = {
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({
      status: true,
      message: "Login Successful",
      data: userInfo,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(400).json({
        status: false,
        message: "No active session. Please login first.",
      });
    }

    req.session.destroy((err) => {
      if (err) res.status(400).json({ message: "Logout Failed" });
      
    });

    res.clearCookie('connect.sid');
    return res.status(200).json({
      status: true,
      message: "Logout Successful",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

export const checkSession = async (req, res) => {
  try {
    if (!req.session.userId) throw { message: "Please Login to Your Account" };

    const user = await UserModel.findOne({
      where: {
        uuid: req.session.userId,
      },
      attributes: ["uuid", "name", "email", "role"],
    });
    if (!user) throw { message: "User Not Found" };

    return res.status(200).json({
      status: true,
      message: "Session is valid",
      data: user
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      where: {
        uuid: req.params.uuid,
      },
    });
    if (!user) throw { message: "User Not Found" };

    const { name, email, role, password, confirmPassword } = req.body;

    let hashPassword;
    if (password == "" || password == null) {
      hashPassword = user.password;
    } else {
      hashPassword = await bcrypt(password, 10);
    }
    if (password !== confirmPassword)
      throw { message: "Password and Confirm Password is not same" };

    await UserModel.update(
      {
        name,
        email,
        role,
        password: hashPassword,
      },
      {
        where: {
          uuid: req.params.uuid,
        },
      }
    );

    return res.status(200).json({
      status: true,
      message: "Success Update User",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.destroy({
      where: {
        uuid: req.params.uuid,
      },
    });

    if (!user) throw { message: "User Not Found" };
    return res.status(200).json({
      status: true,
      message: "Success Delete User",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
