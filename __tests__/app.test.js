const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/development-data/');
const { response } = require('../app.js');

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
                if(comments.length > 0) {
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
                };
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