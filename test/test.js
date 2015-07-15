var should = require('chai').should(),
    supertest = require('supertest'),
    request = require('superagent-bluebird-promise');

var HOST_URL = 'http://acsdemo-yuhuynh.c9.io/api';
before(function () {
  //TODO: change db server to test server
});

describe('GET /user/list', function() {
//   it('should load a list of user', function (done) {
//     request.get(HOST_URL + '/user/list')
//       .end(function (err, res) {
//         res.text.should.not.be.empty;
//         //console.log('Length: ' + res.body.length + '\n');
//         done(err);
//       });
//   })
// });

// describe('POST /auth', function() {
//   it('should display error if login information is wrong', function (done) {
//     request.post(HOST_URL + '/auth')
//       .send({ user_name: 'sillyusername'})
//       .send({ password: 'sillypassword' })
//       .end(function (err, res) {
//           res.status.should.equal(401);
//           res.text.should.include('invalid');
//           done();
//       });
//   })
  
  var agent1 = request.agent();
  
  it('should logged us in with correct login credential', function (done) {
    agent1.post(HOST_URL + '/auth')
      .send({ user_name: 'mike'}) 
      .send({ password: '123' })
      .end(function(err, res) {
          res.status.should.equal(200);
          res.text.should.include('authorized');
          done();
      })
  })
  
    it('should update an existing task', function (done) {
        agent1.post(HOST_URL + '/task/new')
        .send({ due_date: '1/1/2001', task_description: 'foo', assign_by: 1 })
        .then(function (res) {
            res.status.should.equal(201);
            res.text.should.include('success');
            done();
        })
        .catch(function (err) {
            console.log(err.message);
        })
        .finally(function() {
            
        })
    });  
});

// describe('POST /task/new', function() {
//   it('should display error if supplied with empty/invalid task entity', function (done) {
//     // logging in
//     request.post(HOST_URL + '/auth')
//     .send({ user_name: 'mike'}) 
//     .send({ password: '123' })
//     .end(function(err, res) {
//         // start posting various invalid request
//         request.post(HOST_URL + '/task/new')
//         .send({ foo: 'bar' })
//         .end(function(err, res){
//             res.status.should.equal(400);
//             res.text.should.include('invalid');
//         });
//         request.post(HOST_URL + '/task/new')
//         .send({})
//         .end(function(err, res){
//             res.status.should.equal(400);
//             res.text.should.include('invalid');
//         });
//         request.post(HOST_URL + '/task/new')
//         .send({ due_date: '1/1/2001', task_description: 'foo' })
//         .end(function(err, res){
//             res.status.should.equal(400);
//             res.text.should.include('invalid');
//             done();
//         });
//     })
//   });
  
//   it('should be able to post new task after logging in', function (done) {
//     // logging in
//     request.post(HOST_URL + '/auth')
//     .send({ user_name: 'mike'}) 
//     .send({ password: '123' })
//     .end(function(err, res) {
//         request.post(HOST_URL + '/task/new')
//         .send({ due_date: '1/1/2001', task_description: 'foo', assign_by: 1 })        
//         .end(function(err, res) {
//             res.status.should.equal(201);
//             res.text.should.include('success');
//             done(err);
//         });
//     })
//   });
// });

describe('POST /task/update', function() {

});
