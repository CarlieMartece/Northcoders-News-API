const express = require('express');
const app = express();
const { 
    getTopics,
    getArticleById,
} = require('./controllers/topics-controllers');


app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById)

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