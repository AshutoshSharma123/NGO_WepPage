import jwt from "jsonwebtoken";

export function requireAdminAuth(req, res, next) {
  const token = req.cookies?.adminToken;

  if (!token) {
    return res.redirect("/admin/login");
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    res.clearCookie("adminToken");
    return res.redirect("/admin/login");
  }
}
