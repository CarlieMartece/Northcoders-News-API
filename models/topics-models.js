const db = require('../db');


exports.selectArticles = (queries) => {
    let filter = ' '
    let array = [];
    if (queries.topic) {
        filter = ' WHERE articles.topic = $1';
        array.push(queries.topic);
    }
    const sort = queries.sort_by || 'created_at';
    const validSorts = ['article_id', 'title', 'topic', 'author', 'created_at', 'votes']
    if (validSorts.indexOf(sort) === -1) {
        return Promise.reject({ status: 400, msg: "Invalid sort column" })
    };
    const getOrder = queries.order_by || 'DESC';
    const order = getOrder.toUpperCase();
    const validOrders = ['ASC', 'DESC']
    if (validOrders.indexOf(order) === -1) {
        return Promise.reject({ status: 400, msg: "Invalid order" })
    }
    const queryString = `SELECT COUNT(comment_id), articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes FROM articles JOIN comments ON articles.article_id = comments.article_id ${filter} GROUP BY articles.article_id, comments.article_id ORDER BY articles.${sort} ${order};`;
    return db
        .query(queryString, array)
        .then(({ rows }) => {
            if (!rows[0]) {
                return Promise.reject({ status: 400, msg: "No articles on this topic" })
            };
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

exports.insertComment = (newComment) => {
    const { username, body, article_id } = newComment;
    if(!username || !body){
        return Promise.reject({ status: 400, msg: "Insufficient info" })
        }
    return db
        .query('INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;', [username, body, article_id])
        .then(({ rows }) => {
            return rows;
        });
};


exports.deleteCommentById = (comment_id) => {
    return db
        .query('DELETE FROM comments WHERE comment_id=$1 RETURNING*;', [comment_id])
        .then(({rows}) => {
            if (!rows[0]) {
                return Promise.reject({ status: 404, msg: "Comment does not exist" })
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