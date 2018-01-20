const { assert } = require('chai');
const server = require('../server');

describe('Server', () => {
  let rsvpRequest;
  beforeEach(() => {
    server.rsvpList = [];

    rsvpRequest = (guestName, attending, allergies) =>
      server.inject({
        method: 'Post',
        url: '/api/rsvp',
        payload: {
          attending,
          guestName,
          allergies,
        },
      });
  });

  describe('#POST /api/rsvp', () => {
    it('should persist rsvp details', (done) => {
      rsvpRequest('Chris', true, 'many').then(() => {
        assert(server.rsvpList.length, 1);
        done();
      });
    });

    it('should reply with success message', (done) => {
      rsvpRequest('Geri', true, 'many').then((response) => {
        assert.isOk(response);
        assert.isOk(response.payload);
        done();
      });
    });
  });

  describe('#GET /api/admin/guests', () => {
    it('should respond with guest list', (done) => {
      rsvpRequest('Luke', true, 'many')
        .then(() => rsvpRequest('Vader', false, 'none'))
        .then(() =>
          server.inject({
            method: 'GET',
            url: '/api/admin/guests',
          }))
        .then((response) => {
          assert.isOk(response.result);
          assert.equal(response.result.length, 2);
          assert.deepEqual(response.result[0], {
            attending: true,
            guestName: 'Luke',
            allergies: 'many',
          });
          done();
        });
    });
  });
});
