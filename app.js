const express = require('express');
const app = express();
const { 
    getApi,
    getArticles,
    getArticleById,
    patchArticleById,
    getCommentsByArticleId,
    postComment,
    removeCommentById,
    getTopics,
    getUsers,
} = require('./controllers/topics-controllers');
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.get('/api', getApi)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchArticleById);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postComment);

app.delete('/api/comments/:comment_id', removeCommentById)

app.get('/api/topics', getTopics);

app.get('/api/users', getUsers);

app.all('*', (req, res) => {
    res.status(404).send({ msg: 'bad path' });
});


//////////////////////////////////


app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid ID' })
    } else if (err.code === '23503') {
        res.status(404).send({ msg: "ID does not exist" }) 
    } else {
        res.status(err.status).send({ msg: err.msg })
    }
})


module.exports = app;