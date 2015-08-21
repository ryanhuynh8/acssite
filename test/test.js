var should = require('chai').should(),
    // request = require('superagent-bluebird-promise');
    supertest = require('supertest'),
    request = supertest('http://acsdemo-yuhuynh.c9.io/api');

var HOST_URL = 'http://acsdemo-yuhuynh.c9.io/api';

before(function() {
    //TODO: change db server to test server
});

describe('GET /user/list', function() {
    it('should load a list of user', function(done) {
        request.get('/user/list')
            .end(function(err, res) {
                res.text.should.not.be.empty;
                //console.log('Length: ' + res.body.length + '\n');
                done(err);
            });
    });
});

describe('POST /auth', function() {
    it('should display error if login information is wrong', function(done) {
        request.post('/auth')
            .send({
                user_name: 'sillyusername'
            })
            .send({
                password: 'sillypassword'
            })
            .end(function(err, res) {
                res.status.should.equal(401);
                res.text.should.include('invalid');
                done();
            });
    });

    var agent1 = supertest.agent(HOST_URL);

    it('should logged us in with correct login credential', function(done) {
        agent1.post('/auth')
            .send({
                user_name: 'mike'
            })
            .send({
                password: '123'
            })
            .end(function(err, res) {
                res.status.should.equal(200);
                res.text.should.include('authorized');
                done();
            });
    });
});

describe('POST /task/new', function() {

    var agent = supertest.agent(HOST_URL);

    it('should login', function(done) {
        agent.post('/auth')
            .send({
                user_name: 'mike'
            })
            .send({
                password: '123'
            })
            .end(function(err, res) {
                res.status.should.equal(200);
                res.text.should.include('authorized');
                done();
            });
    });

    it('should display error if supplied with empty/invalid task entity', function(done) {
        agent.post('/task/new')
            .send({
                foo: 'bar'
            })
            .end(function(err, res) {
                res.status.should.equal(400);
                res.text.should.include('invalid');
            });

        agent.post('/task/new')
            .send({
                foo: 'bar'
            })
            .end(function(err, res) {
                res.status.should.equal(400);
                res.text.should.include('invalid');
            });

        agent.post('/task/new')
            .send({})
            .end(function(err, res) {
                res.status.should.equal(400);
                res.text.should.include('invalid');
            });

        agent.post('/task/new')
            .send({
                due_date: '1/1/2001',
                task_description: 'foo'
            })
            .end(function(err, res) {
                res.status.should.equal(400);
                res.text.should.include('invalid');
                done();
            });
    });

    it('should be able to post new task after logging in', function(done) {
        agent.post('/task/new')
            .send({
                due_date: '1/1/2001',
                task_description: 'foo',
                assign_by: 1
            })
            .end(function(err, res) {
                res.status.should.equal(201);
                res.text.should.include('success');
                done(err);
            });
    });
});

describe('POST /task/update', function() {

});
