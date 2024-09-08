import UserModel from "../Models/UserModel.js";

export const verifyUser = async (req, res, next) => {
  try {
    if (!req.session.userId) throw { message: "Please Login to Your Account" };

    const user = await UserModel.findOne({
      where: {
        uuid: req.session.userId,
      },
    });
    if (!user) throw { message: "User Not Found" };

    req.userId = user.id;
    req.role = user.role;
    next();
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

export const adminOnly = async (req, res, next) => {
  try {
    if (user.role !== "Admin") throw { message: "Access Denied" };
    next();
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
