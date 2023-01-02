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

const getArticleById = catchAsync(async (req, res) => {
    const article = await articleService.getArticleById(req.params.id);
    res.send(article);
});

const updateArticle = catchAsync(async (req, res) => {
    const article = await articleService.updateArticle(
        req.user,
        req.params.id,
        req.body
    );
    res.send(article);
});

const deleteArticle = catchAsync(async (req, res) => {
    await articleService.deleteArticle(req.user, req.params.id);
    res.status(httpStatus.NO_CONTENT).send();
});

const publishArticle = catchAsync(async (req, res) => {
    const article = await articleService.publishArticle(
        req.user,
        req.params.id,
        req.body
    );
    res.send(article);
});

module.exports = {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    publishArticle,
    deleteArticle,
};
