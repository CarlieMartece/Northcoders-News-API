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
            .then((response) => {
                expect(response.body.topics).toEqual(expect.any(Array));
                expect(Object.keys(response.body.topics[0])).toEqual(
                    expect.arrayContaining(['slug', 'description'])
                );
            })
    });
});

describe('handles all bad URLs', () => {
    test('GET:404 bad path response for all bad urls', () => {
        return request(app)
            .get('/api/nonsense')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('bad path');
            });
    });
});