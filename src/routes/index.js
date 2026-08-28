/**
 * Main API Router Aggregator
 * OmniCommerce Enterprise
 */

const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');
const paymentRoutes = require('./paymentRoutes');
const reviewRoutes = require('./reviewRoutes');
const adminRoutes = require('./adminRoutes');
const analyticsRoutes = require('./analyticsRoutes');

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/admin', adminRoutes);
router.use('/analytics', analyticsRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    system: 'OmniCommerce Enterprise API Engine',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
