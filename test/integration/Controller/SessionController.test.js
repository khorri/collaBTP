var request = require('supertest');

describe('SessionController', function () {

    describe('#create()', function () {
        it('should redirect to /create', function (done) {
            request(sails.hooks.http.app)
                .post('/session/create')
                .send({
                    email: 'test',
                    password: 'test'
                })
                .expect(302)
                .expect('location', '/login', done);
        });

        it('should redirect to /myspace', function (done) {
            request(sails.hooks.http.app)
                .post('/session/create')
                .send({
                    email: 'admin@admin.com',
                    password: '12345'
                })
                .expect(302)
                .expect('location', '/myspace', done);
        });
    });

});