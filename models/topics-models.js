const db = require('../db/connection');


exports.selectArticles = () => {
    return db
        .query('SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes FROM articles JOIN comments ON articles.article_id = comments.article_id ORDER BY articles.created_at ASC;')
        .then(({ rows }) => {
            return rows;
        })
};

exports.selectArticleById = (article_id) => {
    return db
        .query('SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1;', [article_id])
        .then(({ rows }) => {
            if (!rows[0]) {
                return Promise.reject({ status: 404, msg: "Article does not exist" })
            };
            return rows;
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