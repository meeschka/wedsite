const { assert } = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('Server', () => {
  let rsvpRequest;
  let server;
  let pgClient;

  beforeEach(() => {
    pgClient = {
      connect: sinon.stub().yields(),
      end: sinon.stub(),
      query: sinon.stub().returns(Promise.resolve()),
    };
    const pg = {
      Client: sinon.stub().returns(pgClient),
    };
    server = proxyquire('../server', {
      pg,
    });

    rsvpRequest = (guestName, attending, allergies) =>
      server.inject({
        method: 'POST',
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
      rsvpRequest('Chris', 'yes', 'many').then(() => {
        assert(pgClient.query.calledWith(
          'INSERT INTO guests(name, response, allergies) VALUES($1, $2, $3)',
          ['Chris', true, 'many'],
        ));
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
      pgClient.query.withArgs('SELECT * FROM guests').returns(Promise.resolve({
        rows: [
          {
            id: 1, name: 'Luke', response: true, allergies: 'many',
          },
          {
            id: 2, name: 'Vader', response: false, allergies: 'none',
          },
        ],
      }));

      server.inject({
        method: 'GET',
        url: '/api/admin/guests',
      }).then((response) => {
        assert.isOk(response.result);
        assert.equal(response.result.length, 2);
        assert.deepEqual(response.result[0], {
          id: 1,
          name: 'Luke',
          response: true,
          allergies: 'many',
        });
        done();
      });
    });
  });
});
