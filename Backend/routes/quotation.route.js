import express from 'express';
import {
  createQuotationRequest,
  getQuotations,
  getQuotationById,
  submitQuotationResponse,
  updateQuotationStatus,
  deleteQuotation,
  compareQuotations,
  getQuotationRequests,
  getMyQuotations,
  vendorSubmitResponse,
} from '../controllers/quotation.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { protectVendor } from '../middleware/protectVendor.middleware.js';

const router = express.Router();

// Vendor-only routes (must come before admin's generic /:id routes)
router.get('/vendor/mine', protectVendor, getMyQuotations);
router.put('/vendor/:id/respond', protectVendor, vendorSubmitResponse);

// Admin-only routes below
router.use(protect);

router.get('/requests', getQuotationRequests);
router.get('/compare/:requestGroup', compareQuotations);
router.get('/', getQuotations);
router.get('/:id', getQuotationById);
router.post('/', createQuotationRequest);
router.put('/:id/respond', submitQuotationResponse);
router.put('/:id/status', updateQuotationStatus);
router.delete('/:id', deleteQuotation);

export default router;