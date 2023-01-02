const express = require("express");
const protect = require("../middleware/auth");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const router = express.Router();
const articleController = require("./article.controller");
const articleValidation = require("./article.validation");

router
    .route("/")
    .post(
        protect,
        validate(articleValidation.createArticle),
        articleController.createArticle
    );
router.route("/").get(articleController.getAllArticles);
router.route("/:id").get(articleController.getArticleById);
router.route("/:id").patch(protect, articleController.publishArticle);
router.route("/:id").put(protect, articleController.updateArticle);
router.route("/:id").delete(protect, articleController.deleteArticle);

module.exports = router;
