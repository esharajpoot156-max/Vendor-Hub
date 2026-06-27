import Vendor from '../models/vendor.model.js';
import Quotation from '../models/quotation.model.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalVendors = await Vendor.countDocuments();

    const pendingQuotations = await Quotation.countDocuments({ status: 'Pending' });
    const submittedQuotations = await Quotation.countDocuments({ status: 'Submitted' });
    const approvedQuotations = await Quotation.countDocuments({ status: 'Approved' });
    const rejectedQuotations = await Quotation.countDocuments({ status: 'Rejected' });

    const activeQuotations = pendingQuotations + submittedQuotations;

    const recentActivities = await Quotation.find()
      .populate('vendor', 'vendorName companyName')
      .sort({ updatedAt: -1 })
      .limit(8);

    const topVendors = await Quotation.aggregate([
      { $match: { status: 'Approved' } },
      { $group: { _id: '$vendor', approvedCount: { $sum: 1 } } },
      { $sort: { approvedCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'vendors',
          localField: '_id',
          foreignField: '_id',
          as: 'vendorInfo',
        },
      },
      { $unwind: '$vendorInfo' },
      {
        $project: {
          _id: 0,
          vendorName: '$vendorInfo.vendorName',
          companyName: '$vendorInfo.companyName',
          approvedCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalVendors,
        activeQuotations,
        pendingQuotations,
        submittedQuotations,
        approvedQuotations,
        rejectedQuotations,
        recentActivities,
        topVendors,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};