const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const conversationController = require('../controllers/conversationController');

router.use(auth);

router.post('/', conversationController.requestConversation);
router.get('/pending', conversationController.getPendingRequests);
router.post('/:conversationId/respond', conversationController.respondToRequest);
router.get('/', conversationController.getConversations);
router.get('/:conversationId/messages', conversationController.getConversationMessages);
router.post('/:conversationId/messages', conversationController.sendConversationMessage);

module.exports = router;
