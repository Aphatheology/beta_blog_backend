const httpStatus = require("http-status");
const userModel = require("../users/user.model");
const ApiError = require("../utils/ApiError");
const Articles = require("./article.model");

const isTitleTaken = async function (title) {
    const article = await Articles.findOne({ title });
    return !!article;
};

const getAllArticles = async () => {
    const articles = await Articles.find();

    return articles;
};

const createArticle = async (user, articleBody) => {
    if (await isTitleTaken(articleBody.title)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Title already taken");
    }
    const newArticle = {
        ...articleBody,
        author: user._id.toString(),
        state: "draft",
    };
    const article = await Articles.create(newArticle);

    return article;
};

const updateArticle = async (user, articleId, articleBody) => {
    let article = await Articles.findById(articleId);

    if (!article) {
        throw new ApiError(httpStatus.NOT_FOUND, "Article not found");
    }

    if (user._id.toString() !== article.author.toString()) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            "You are not authorize to update others article"
        );
    }

    article = await Articles.findByIdAndUpdate(articleId, articleBody, {
        new: true,
        runValidators: true,
    });

    return article;
};

const publishArticle = async (user, articleId) => {
    let article = await Articles.findById(articleId);

    if (!article) {
        throw new ApiError(httpStatus.NOT_FOUND, "Article not found");
    }

    if (user._id.toString() !== article.author.toString()) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            "You are not authorize to publish others article"
        );
    }

    article = await Articles.findByIdAndUpdate(
        articleId,
        { state: "published" },
        { new: true }
    );

    return article;
};

const deleteArticle = async (user, articleId) => {
    const article = await Articles.findById(articleId);

    if (!article) {
        throw new ApiError(httpStatus.NOT_FOUND, "Article not found");
    }

    if (user._id.toString() !== article.author.toString()) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            "You are not authorize to delete others article"
        );
    }

    return article;
};

module.exports = {
    createArticle,
    getAllArticles,
    updateArticle,
    publishArticle,
    deleteArticle,
};
