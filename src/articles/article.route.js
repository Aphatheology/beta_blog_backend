const express = require("express");
const protect = require("../middleware/auth");
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
    )
    .get(articleController.getAllArticles);

router
    .route("/:slug")
    .get(articleController.getArticleBySlug)
    .patch(protect, articleController.publishArticle)
    .put(protect, articleController.updateArticleBySlug)
    .delete(protect, articleController.deleteArticle);

module.exports = router;
