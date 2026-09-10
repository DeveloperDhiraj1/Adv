export const verifyAdmin = (req, res, next) => {
  try {

    if (req.user && req.user.role === 'ADMIN') {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }
  } catch (error) {
    console.error("Admin Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};