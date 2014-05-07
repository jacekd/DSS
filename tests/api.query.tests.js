var should = require('chai').should(),
    server = require('../server'),
    app = server.app,
    http = require('http'),
    request = require('supertest');
    request = request('http://localhost:3003');

describe('API tests', function () {
    describe('query tests', function () {
        it('should respond to simple query', function () {
            request.get('/query/cloudservices')
                .expect(200)
                .end(function (err, res) {
                   if (err) throw err;
                });
        });
    });
});
