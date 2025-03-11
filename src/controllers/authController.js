import User from "../models/user";

export const signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
};

export default { signup };
