const {
    selectArticles,
    selectArticleById,
    updateArticleById,
    selectCommentsByArticleId,
    selectTopics,
    selectUsers,
} = require('../models/topics-models.js');


exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        articles.forEach((article) => {
            article.comment_count = Number(article.count);
            delete article.count;
        })
        res.status(200).send({ articles });
    })
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
        article.comment_count = Number(article.count);
        delete article.count;
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

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    selectCommentsByArticleId(article_id).then((comments) => {
        res.status(200).send({ comments });
    }).catch((err) => {
        next(err);
    });
};


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