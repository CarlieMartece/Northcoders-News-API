const db = require('../db/connection');


exports.selectArticles = (queries) => {
    const queryBaseOne = 'SELECT COUNT(comment_id), articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes FROM articles JOIN comments ON articles.article_id = comments.article_id';
    let filter = ' '
    let array = [];
    if (queries.topic) {
        filter = ' WHERE articles.topic = $1';
        array.push(queries.topic);
    }
    const queryBaseTwo =  ' GROUP BY articles.article_id, comments.article_id ORDER BY articles.';
    const sort = queries.sort_by || 'created_at';
    const order = queries.order_by || 'DESC;';
    const queryString = queryBaseOne + filter + queryBaseTwo + sort + ' ' + order;
    console.log(queryString)
    return db
        .query(queryString, array)
        .then(({ rows }) => {
            return rows;
        })
};

exports.selectArticleById = (article_id) => {
    return db
        .query('SELECT COUNT(comment_id), articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id, comments.article_id;', [article_id])
        .then(({ rows: [article] }) => {
            if (!article) {
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

exports.selectCommentsByArticleId = (article_id) => {
    return db
        .query('SELECT * FROM comments WHERE article_id=$1;', [article_id])
        .then(({ rows }) => {
            if (!rows[0]) {
                return Promise.reject({ status: 404, msg: "Article does not exist" })
            };
            return rows;
        });
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