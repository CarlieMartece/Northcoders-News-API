const db = require('../db/connection');

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;').then((result) => {
        return result.rows;
    });
};

exports.selectUsers = () => {
    return db.query('SELECT * FROM users;').then((result) => {
        return result.rows;
    });
}

exports.selectArticleById = (article_id) => {
    return db
        .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
        .then(({ rows: [article] }) => {
            if (article === undefined) {
                return Promise.reject({ status: 404, msg: "Article does not exist" })
            };
            return article;
        })
};

exports.updateArticleById = (inc_votes, article_id) => {
    return db
        .query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;', [inc_votes, article_id])
        .then(({ rows: [article] }) => {
            if (article === undefined) {
                return Promise.reject({ status: 404, msg: "Article does not exist" })
            };
            return article;
        })
};