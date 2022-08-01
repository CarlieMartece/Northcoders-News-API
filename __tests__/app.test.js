const request = require('supertest');
const app = require('../app');

describe('/api/topics', () => {
    test('GET:200 sends an array of topic objects', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
    });
});