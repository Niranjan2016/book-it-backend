const express = require('express');
const router = express.Router();
const {
  getReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

router.route('/')
  .get(getReviews)
  .post(createReview);

router.route('/:id')
  .get(getReview)
  .put(updateReview)
  .delete(deleteReview);

module.exports = router;