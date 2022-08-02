const express = require('express');
const app = express();
const { 
    getTopics,
    getArticleById,
    patchArticleById,
    getUsers,
} = require('./controllers/topics-controllers');

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/users', getUsers);

app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchArticleById);

app.all('*', (req, res) => {
    res.status(404).send({ msg: 'bad path' });
});


//////////////////////////////////


app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid ID' })
    } else {
        res.status(err.status).send({ msg: err.msg })
    }
})


module.exports = app;