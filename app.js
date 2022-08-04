const express = require('express');
const app = express();
const { 
    getArticles,
    getArticleById,
    patchArticleById,
    getCommentsByArticleId,
    getTopics,
    getUsers,
} = require('./controllers/topics-controllers');

app.use(express.json());

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchArticleById);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.get('/api/topics', getTopics);

app.get('/api/users', getUsers);

app.all('*', (req, res) => {
    res.status(404).send({ msg: 'bad path' });
});


//////////////////////////////////


app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid ID' })
    } else if (err.code === '42703') {
        res.status(400).send({ msg: 'Invalid column' });
    } else {
        res.status(err.status).send({ msg: err.msg })
    }
})


module.exports = app;