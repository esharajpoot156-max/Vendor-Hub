import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quotation title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: [true, 'Vendor reference is required'],
    },
    requestGroup: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      default: null,
      min: [0, 'Amount cannot be negative'],
    },
    submissionDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['Pending', 'Submitted', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const Quotation = mongoose.model('Quotation', quotationSchema);

export default Quotation;