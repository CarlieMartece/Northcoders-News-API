const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/development-data/');

afterAll (() => {
    return db.end();
})

beforeEach(() => {
    return seed(data);
})


describe('handles all bad URLs', () => {
    test('GET:404 sends bad path response for all bad urls', () => {
        return request(app)
            .get('/api/nonsense')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('bad path');
            });
    });
});


describe('/api', () => {
    test('GET: 200 sends JSON describing all available endpoints', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
                const { apiEndpoints } = body;
                expect(apiEndpoints).toEqual(
                    expect.objectContaining({
                        'GET /api': expect.any(Object),
                        'GET /api/articles': expect.any(Object),
                        'GET /api/articles/:article_id': expect.any(Object),
                        'PATCH /api/articles/:article_id': expect.any(Object),
                        'GET /api/articles/:article_id/comments': expect.any(Object),
                        'POST /api/articles/:article_id/comments': expect.any(Object),
                        'DELETE /api/comments/:comment_id': expect.any(Object),
                        'GET /api/topics': expect.any(Object),
                        'GET /api/users': expect.any(Object),
                    })
                );
            });
    });
});


describe('/api/articles', () => {
    test('GET:200 sends an array of article objects with required properties', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles).toEqual(expect.any(Array));
                expect(articles[0]).toEqual(
                    expect.objectContaining({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number),
                    })
                );
                expect(articles).toBeSortedBy('created_at', {
                    descending: true,
                });
            })
    });
    test('GET:200 sends an array of article objects with sort-by query', () => {
        return request(app)
            .get('/api/articles?sort_by=author')
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;                
                expect(articles).toBeSortedBy('author', {
                    descending: true,
                });
            });
    });
    test('GET:200 sends an array of article objects with order-by query', () => {
        return request(app)
            .get('/api/articles?sort_by=author&order_by=asc')
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;                
                expect(articles).toBeSortedBy('author', {
                    ascending: true,
                });
            });
    });
    test('GET:200 sends an array of article objects with topic query', () => {
        return request(app)
            .get('/api/articles?topic=coding')
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;                
                expect(articles).toBeInstanceOf(Array);
                if(articles.length > 0) {
                    articles.forEach((article) => {
                        expect(article).toEqual(
                            expect.objectContaining({
                                author: expect.any(String),
                                title: expect.any(String),
                                article_id: expect.any(Number),
                                topic: 'coding',
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                comment_count: expect.any(Number),
                            })
                        );
                    });
                };
            });
    });
    test('GET:400 sends error response for invalid column', () => {
        return request(app)
            .get('/api/articles?sort_by=not_a_column')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Invalid sort column');
            });
    });
    test('GET:400 sends error response for invalid order', () => {
        return request(app)
            .get('/api/articles?sort_by=author&order_by=cats')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Invalid order');
            });
    });
    test('GET:400 sends error response for invalid topic', () => {
        return request(app)
            .get('/api/articles?topic=not-a-topic')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('No articles on this topic');
            });
    });
});

describe('/api/articles/:article_id', () => {
    test('GET:200 sends a single article to the client', () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
                const { article } = body;
                expect(article).toEqual(
                    expect.objectContaining({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        body: expect.any(String),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                    })
                );
            });
    });
    test('GET:200 responds with object containing comment count', () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                expect(response.body.article).toEqual(
                    expect.objectContaining({
                        comment_count: expect.any(Number),
                    })
                );
            });
    });
    test('GET:400 sends appropriate status and error message when given an invalid id', () => {
        return request(app)
            .get('/api/articles/not-an-article')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Invalid ID');
            });
    });
    test('GET:404 sends appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
            .get('/api/articles/3141')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Article does not exist')
            })
    });
    test('PATCH:200 updates votes property and responds with updated article', () => {
        const newVotes = {
            'inc_votes': 6
        };
        return request(app)
            .patch('/api/articles/5')
            .send(newVotes)
            .expect(200)
            .then(({body}) => {
                const { article } = body;
                expect(article).toEqual(
                    expect.objectContaining({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        body: expect.any(String),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: 6,
                    })
                );
            })
    });
    test('PATCH:400 sends error message when given empty object', () => {
        const blankUpdate = {};
        return request(app)
            .patch('/api/articles/3')
            .send(blankUpdate)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("Votes undefined")
            });
    });
    test('PATCH:400 sends error message when given an invalid id', () => {
        const newVotes = {
            'inc_votes': 6
        };
        return request(app)
            .patch('/api/articles/not-an-article')
            .send(newVotes)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Invalid ID');
            });
    });
    test('PATCH:404 sends error message when given a valid but non-existent id', () => {
        const newVotes = {
            'inc_votes': 6
        };
        return request(app)
            .patch('/api/articles/3141')
            .send(newVotes)
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Article does not exist')
            })
    });
});


describe('/api/articles/:article_id/comments', () => {
    test('GET:200 responds with an array of comment objects with required properties', () => {
        return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                expect(comments).toBeInstanceOf(Array);
                expect(comments).toHaveLength(8);
                comments.forEach((comment) => {
                    expect(comment).toEqual(
                        expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        })
                    );
                });
            });
    });
    test('GET:400 sends appropriate status and error message when given an invalid id', () => {
        return request(app)
            .get('/api/articles/not-an-article/comments')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Invalid ID');
            });
    });
    test('GET:404 sends appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
            .get('/api/articles/3141/comments')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Article does not exist')
            });
    });
    test('POST:200 adds comment and responds with posted comment', () => {
        const newComment = {
            'username': 'jessjelly',
            'body': 'It were reet'
        };
        return request(app)
            .post('/api/articles/3/comments')
            .send(newComment)
            .expect(201)
            .then(({body}) => {
                expect(body.comment[0]).toEqual(
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        body: 'It were reet',
                        votes: expect.any(Number),
                        author: 'jessjelly',
                        article_id: 3,
                        created_at: expect.any(String),
                    })
                );
            });
    });
    test('POST:400 sends error message when given an invalid article id', () => {
        const newComment = {
            'username': 'jessjelly',
            'body': 'It were reet'
        };
        return request(app)
            .post('/api/articles/not-an-article/comments')
            .send(newComment)
                .expect(400)
                .then((response) => {
                    expect(response.body.msg).toBe('Invalid ID');
                });
    });
    test('POST:400 sends error message when no comment provided', () => {
        const blankBody = {
            'username': 'jessjelly',
        };
        return request(app)
            .post('/api/articles/3/comments')
            .send(blankBody)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("Insufficient info")
            });
    });
    test('POST:400 sends error message when no username provided', () => {
        const blankUser = {
            'body': 'Ey up!',
        };
        return request(app)
            .post('/api/articles/3/comments')
            .send(blankUser)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("Insufficient info")
            });
    });
    test('POST:404 sends error message when given a valid but non-existent id', () => {
        const newComment = {
            'username': 'jessjelly',
            'body': 'It were reet'
        };
        return request(app)
            .post('/api/articles/3141/comments')
            .send(newComment)
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('ID does not exist')
            })
    });
    test('POST:404 sends error message when given non-existent username', () => {
        const newComment = {
            'username': 'nookapocalypse',
            'body': 'It were reet'
        };
        return request(app)
            .post('/api/articles/3/comments')
            .send(newComment)
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('ID does not exist')
            })
    });
});


describe('/api/comments/:comment_id', () => {
    test('DELETE:204 deletes comment and responds with no content', () => {
        return request(app)
            .delete('/api/comments/42')
            .expect(204)
            .then(({ body }) => {
                const { content } = body;
                expect(content).toBe(undefined)
            });
    });
    test('DELETE:400 responds with error message for invalid comment id', () => {
        return request(app)
            .delete('/api/comments/banana')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Invalid ID")
            });
    });
    test('DELETE:404 responds with error message for valid but non-existent comment id', () => {
        return request(app)
            .delete('/api/comments/3141')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("Comment does not exist")
            });
    });
});


describe('/api/topics', () => {
    test('GET:200 sends an array of topic objects with required properties', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                const { topics } = body;
                expect(topics).toEqual(expect.any(Array));
                expect(topics[0]).toEqual(
                    expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String),
                    })
                );
            });
    });
});


describe('/api/users', () => {
    test('GET:200 responds with an array of user objects with required properties', () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
                const { users } = body;
                expect(users).toEqual(expect.any(Array));
                expect(users[0]).toEqual(
                    expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String),
                    })
                );
            });
    });
});