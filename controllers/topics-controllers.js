const {
    selectTopics,
    selectArticleById,
    updateArticleById,
} = require('../models/topics-models.js');

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({ topics });
    });
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
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