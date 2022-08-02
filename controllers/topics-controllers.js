const {
    selectTopics,
    selectArticleById,
    updateArticleById,
    selectUsers,
    selectCommentsByArticle,
} = require('../models/topics-models.js');

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({ topics });
    });
};

exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
        res.status(200).send({ users });
    })
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const selectArticle = selectArticleById(article_id);
    const selectComments = selectCommentsByArticle(article_id);
    Promise.all([selectArticle, selectComments])
        .then((values) => {
            const articleWithoutCommentCount = values[0];
            const commentCount = values[1].length;
            const article = {
                ...articleWithoutCommentCount,
                comment_count: commentCount, 
            }
            res.status(200).send({ article });
        }).catch((err) => {
            next(err);
        });
};

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    if (inc_votes) {
        updateArticleById(inc_votes, article_id).then((article) => {
            res.status(200).send({ article });
        }).catch((err) => {
            next(err);
        })
    } else {
        res.status(400).send({
            'msg': 'Votes undefined'
        });
    }
};