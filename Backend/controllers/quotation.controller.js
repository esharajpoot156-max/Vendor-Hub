import mongoose from 'mongoose';
import Quotation from '../models/quotation.model.js';

// Create a quotation request and assign it to one or more vendors
export const createQuotationRequest = async (req, res) => {
  try {
    const { title, description, vendorIds } = req.body;

    if (!vendorIds || !Array.isArray(vendorIds) || vendorIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Please select at least one vendor' });
    }

    // Unique group ID — links all quotations from this one request together
    const requestGroup = new mongoose.Types.ObjectId().toString();

    const quotationDocs = vendorIds.map((vendorId) => ({
      title,
      description,
      vendor: vendorId,
      requestGroup,
      status: 'Pending',
    }));

    const quotations = await Quotation.insertMany(quotationDocs);

    res.status(201).json({ success: true, data: quotations });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all quotations (with filters)
export const getQuotations = async (req, res) => {
  try {
    const { status, vendor, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (vendor) query.vendor = vendor;
    if (search) query.title = { $regex: search, $options: 'i' };

    const quotations = await Quotation.find(query)
      .populate('vendor', 'vendorName companyName email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: quotations.length, data: quotations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single quotation
export const getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id).populate(
      'vendor',
      'vendorName companyName email contactNumber'
    );
    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }
    res.status(200).json({ success: true, data: quotation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Vendor submits their response (amount + submission date)
export const submitQuotationResponse = async (req, res) => {
  try {
    const { amount, submissionDate } = req.body;

    if (amount === undefined || amount === null) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      {
        amount,
        submissionDate: submissionDate || new Date(),
        status: 'Submitted',
      },
      { new: true, runValidators: true }
    ).populate('vendor', 'vendorName companyName email');

    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }

    res.status(200).json({ success: true, data: quotation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update quotation status (e.g. Approved / Rejected)
export const updateQuotationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Submitted', 'Approved', 'Rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('vendor', 'vendorName companyName email');

    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }

    res.status(200).json({ success: true, data: quotation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a quotation
export const deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndDelete(req.params.id);
    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }
    res.status(200).json({ success: true, message: 'Quotation deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Compare all quotations belonging to the same request (same requestGroup)
export const compareQuotations = async (req, res) => {
  try {
    const { requestGroup } = req.params;

    const quotations = await Quotation.find({ requestGroup }).populate(
      'vendor',
      'vendorName companyName email contactNumber'
    );

    if (quotations.length === 0) {
      return res.status(404).json({ success: false, message: 'No quotations found for this request' });
    }

    // Find the lowest amount among quotations that have actually been submitted
    const submitted = quotations.filter((q) => q.amount !== null);
    let cheapestId = null;

    if (submitted.length > 0) {
      const cheapest = submitted.reduce((min, q) => (q.amount < min.amount ? q : min));
      cheapestId = cheapest._id.toString();
    }

    const data = quotations.map((q) => ({
      ...q.toObject(),
      isCheapest: q._id.toString() === cheapestId,
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get distinct request groups (used to list all "requests" for the comparison page)
export const getQuotationRequests = async (req, res) => {
  try {
    const requests = await Quotation.aggregate([
      {
        $group: {
          _id: '$requestGroup',
          title: { $first: '$title' },
          description: { $first: '$description' },
          vendorCount: { $sum: 1 },
          createdAt: { $first: '$createdAt' },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Vendor: get only their own quotations
export const getMyQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find({ vendor: req.vendor._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: quotations.length, data: quotations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Vendor: submit response to their own quotation only
export const vendorSubmitResponse = async (req, res) => {
  try {
    const { amount, submissionDate } = req.body;

    if (amount === undefined || amount === null) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const quotation = await Quotation.findById(req.params.id);

    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }

    // Security check — vendor can only respond to their OWN quotation
    if (quotation.vendor.toString() !== req.vendor._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied: not your quotation' });
    }

    quotation.amount = amount;
    quotation.submissionDate = submissionDate || new Date();
    quotation.status = 'Submitted';
    await quotation.save();

    res.status(200).json({ success: true, data: quotation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};