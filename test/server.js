const { assert } = require('chai');
const server = require('../server');

describe('Server', () => {
  describe('#POST /api/rsvp', () => {
    it('should persist rsvp details', (done) => {
      const promise = server.inject({
        method: 'POST',
        url: '/api/rsvp',
        payload: {
          attending: true,
          guestName: 'Luke Skywalker',
          allergies: 'Many',
        },
      });
      promise.then(() => {
        assert(server.rsvpList.length, 1);
        done();
      });
    });

    it('should reply with success message', (done) => {
      const promise = server.inject({
        method: 'Post',
        url: '/api/rsvp',
        payload: {
          attending: true,
          guestName: 'Luke Skywalker',
          allergies: 'Many',
        },
      });
      promise.then((response) => {
        assert.isOk(response);
        assert.isOk(response.payload);
        done();
      });
    });
  });
});
