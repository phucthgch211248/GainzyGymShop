const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.get("/", blogController.getAll);
router.get("/:slug", blogController.getBySlug);
router.post("/", blogController.create);
router.put("/:id", blogController.update);
router.delete("/:id", blogController.delete);

module.exports = router;