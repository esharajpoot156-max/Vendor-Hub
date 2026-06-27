import jwt from 'jsonwebtoken';
import Vendor from '../models/vendor.model.js';

const generateToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const vendor = await Vendor.findOne({ email }).select('+password');
    if (!vendor) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await vendor.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(vendor._id, 'vendor');

    res.status(200).json({
      success: true,
      token,
      vendor: {
        id: vendor._id,
        vendorName: vendor.vendorName,
        companyName: vendor.companyName,
        email: vendor.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};