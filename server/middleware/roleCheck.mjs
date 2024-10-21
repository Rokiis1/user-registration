export function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res
    .status(403)
    .json({ error: "You do not have permission to perform this action." });
}

export function isStudent(req, res, next) {
  if (req.user && (req.user.role === "student" || req.user.role === "admin")) {
    return next();
  }

  res
    .status(403)
    .json({ error: "You do not have permission to perform this action." });
}
