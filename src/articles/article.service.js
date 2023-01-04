const httpStatus = require("http-status");
const userModel = require("../users/user.model");
const ApiError = require("../utils/ApiError");
const Articles = require("./article.model");

const isTitleTaken = async function (title) {
    const article = await Articles.findOne({ title });
    return !!article;
};

const calculateReadingTime = (lengthOfArticle) => {
	const wordsPerMinute = 180;
	const minutes = lengthOfArticle / wordsPerMinute;
	const readTime = Math.ceil(minutes);
	return readTime;
};

const getAllArticles = async () => {
    const articles = await Articles.find({state: 'published'});

    return articles;
};

const createArticle = async (user, articleBody) => {
    if (await isTitleTaken(articleBody.title)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Title is taken");
    }

    const newArticle = {
        ...articleBody,
        author: user.username,
        state: "draft",
        readingTime: calculateReadingTime(articleBody.body.match(/(\w+)/g).length),
    };
    const article = await Articles.create(newArticle);

    return article;
};

const getArticleBySlug = async (slug) => {
    let article = await Articles.find({slug, state: 'published'});

    if (article.length == 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "Article not found");
    }
    
    return updateArticleReadCount(slug, article);
}

const updateArticleReadCount = async (slug, article) => {

    const articleToUpdate = await Articles.findOneAndUpdate(
		{slug},
		{
			readCount: ++article[0].readCount,
		},
		{returnDocument: 'after'}
	)

    return articleToUpdate;
}

const updateArticleBySlug = async (user, slug, articleBody) => {
    let article = await Articles.find({slug});

    if (!article) {
        throw new ApiError(httpStatus.NOT_FOUND, "Article not found");
    }

    if (user.username !== article.author) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            "You are not authorized"
        );
    }

    articleBody.readingTime = calculateReadingTime(articleBody.body.match(/(\w+)/g).length);

    article = await Articles.findOneAndUpdate({slug}, articleBody, {
        returnDocument: 'after',
        runValidators: true,
    });

    return article;
};

const publishArticle = async (user, slug) => {
    let article = await Articles.find({slug});

    if (!article) {
        throw new ApiError(httpStatus.NOT_FOUND, "Article not found");
    }

    if (user.username !== article.author) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            "You are not authorized"
        );
    }

    article = await Articles.findOneAndUpdate(
        {slug},
        { state: "published" },
        { returnDocument: 'after' }
    );

    return article;
};

const deleteArticle = async (user, articleSlug) => {
    const article = await Articles.find({slug});

    if (!article) {
        throw new ApiError(httpStatus.NOT_FOUND, "Article not found");
    }

    if (user.username !== article.author) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            "You are not authorized"
        );
    }

    await Articles.findOneAndDelete({slug});
    return;
};

module.exports = {
    createArticle,
    getAllArticles,
    getArticleBySlug,
    updateArticleBySlug,
    publishArticle,
    deleteArticle,
};
