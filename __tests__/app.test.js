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
                expect(body.msg).toBe("inc_votes undefined")
            });
    });
});