var should = require('chai').should(),
    supertest = require('supertest'),
    api = supertest('http://localhost:8080');

describe('POST /auth', function() {
  it('should display error if login information is wrong', function(done) {
    api
      .post('/api/')
      .set('user')
  });
});


