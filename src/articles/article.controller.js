const articleService = require("./article.service");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");

const getAllArticles = catchAsync(async (req, res) => {
    const articles = await articleService.getAllArticles();
    res.send(articles);
});

const createArticle = catchAsync(async (req, res) => {
    const article = await articleService.createArticle(req.user, req.body);
    res.status(httpStatus.CREATED).send(article);
});

const getArticleBySlug = catchAsync(async (req, res) => {
    const article = await articleService.getArticleBySlug(req.params.slug);
    res.send(article);
});

const updateArticleBySlug = catchAsync(async (req, res) => {
    const article = await articleService.updateArticleBySlug(
        req.user,
        req.params.slug,
        req.body
    );
    res.send(article);
});

const deleteArticle = catchAsync(async (req, res) => {
    await articleService.deleteArticle(req.user, req.params.slug);
    res.status(httpStatus.NO_CONTENT).send();
});

const publishArticle = catchAsync(async (req, res) => {
    const article = await articleService.publishArticle(
        req.user,
        req.params.slug,
        req.body
    );
    res.send(article);
});

module.exports = {
    createArticle,
    getAllArticles,
    getArticleBySlug,
    updateArticleBySlug,
    publishArticle,
    deleteArticle,
};
