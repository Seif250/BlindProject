const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const searchController = require('../controllers/searchController');

// البحث المتقدم
router.get('/teams', auth, searchController.advancedTeamSearch);
router.get('/users', auth, searchController.advancedUserSearch);

// الاقتراحات
router.get('/suggestions', auth, searchController.getSearchSuggestions);

// خيارات الفلترة
router.get('/filter-options', auth, searchController.getFilterOptions);

module.exports = router;
