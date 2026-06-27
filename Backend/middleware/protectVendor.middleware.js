import jwt from 'jsonwebtoken';
import Vendor from '../models/vendor.model.js';

export const protectVendor = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== 'vendor') {
      return res.status(403).json({ success: false, message: 'Access denied: vendors only' });
    }

    const vendor = await Vendor.findById(decoded.id);
    if (!vendor) {
      return res.status(401).json({ success: false, message: 'Vendor not found' });
    }

    req.vendor = vendor;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
  }
};