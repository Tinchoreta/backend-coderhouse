import chai from 'chai';
import app from '../../app.js';
import supertest from 'supertest';

const { expect } = chai;
const request = supertest(app);

describe('Session Router Tests', () => {
    it('should get session information', async () => {
        const res = await request.get('/api/sessions/info');
        expect(res.status).to.equal(401);
        expect(res.body).to.be.an('object');
        
    });
});
