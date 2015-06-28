var should = require('chai').should(),
    supertest = require('supertest'),
    request = supertest('http://acsdemo-yuhuynh.c9.io/api');

describe('GET /user/list', function() {
  it('should load a list of user', function (done) {
    request.get('/user/list')
      .end(function (err, res) {
        res.text.should.not.be.empty;
        console.log(res.body.length);
        done(err);
      })
  })  
});

describe('POST /auth', function() {
  it('should display error if login information is wrong', function (done) {
    request.post('/auth')
      .send({ user_name: 'sillyusername'})
      .send({ password: 'sillypassword' })
      .end(function (err, res) {
          res.status.should.equal(401);
          res.text.should.include('invalid');
          done();
      });
  })
  
  it('should logged us in with correct login credential', function (done) {
    request.post('/auth')
      .send({ user_name: 'mike'})
      .send({ password: '123' })
      .end(function(err, res) {
          res.status.should.equal(200);
          res.text.should.include('authorized');
          console.log(res.headers['set-cookie']);
          done(err);
      })
  })
});

describe('POST /task/new', function() {
  it('should login and retrieve a session id', function(done) {
    request.post('/auth')
      .send({ user_name: 'mike'})
      .send({ password: '123' })
      .end(function(err, res) {
        console.log(res.headers['set-cookie']);
        done(err);
      })
  })
});
  
