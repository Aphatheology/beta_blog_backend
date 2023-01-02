const httpStatus = require("http-status");
const userModel = require("../users/user.model");
const ApiError = require("../utils/ApiError");
const Articles = require("./article.model");

const isTitleTaken = async function (title) {
    const article = await Articles.findOne({ title });
    return !!article;
};

const calculateReadingTime = (lengthOfArticle) => {
	const wordsPerMinute = 200;
	const minutes = lengthOfArticle / wordsPerMinute;
	const readTime = Math.ceil(minutes);
	return readTime;
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
        author: user.username,
        state: "draft",
        readingTime: calculateReadingTime(articleBody.body.length),
    };
    const article = await Articles.create(newArticle);

    return article;
};

const getArticleById = async (articleId) => {
    let article = await Articles.find({id: articleId, state: 'published'});

    if (article.length == 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "Article not found");
    }
    
    return updateArticleReadCount(articleId, article);
}

const updateArticleReadCount = async (articleId, article) => {

    const articleToUpdate = await Articles.findByIdAndUpdate(
		articleId,
		{
			readCount: ++article[0].readCount,
		},
		{ new: true }
	)

    return articleToUpdate;
}

const updateArticle = async (user, articleId, articleBody) => {
    let article = await Articles.findById(articleId);

    if (!article) {
        throw new ApiError(httpStatus.NOT_FOUND, "Article not found");
    }

    if (user.username !== article.author) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            "You are not authorize to update others article"
        );
    }

    articleBody.readingTime = calculateReadingTime(articleBody.body.length);

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

    if (user.username !== article.author) {
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

    if (user.username !== article.author) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            "You are not authorize to delete others article"
        );
    }

    await Articles.findByIdAndDelete(articleId);
    return;
};

module.exports = {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    publishArticle,
    deleteArticle,
};
