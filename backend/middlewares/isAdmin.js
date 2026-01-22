export const isAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin role required.' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error in admin verification' 
    });
  }
};