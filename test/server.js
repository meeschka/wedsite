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
    process.env.ADMIN_USER = 'admin';
    process.env.ADMIN_PASSWORD = 'password';

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
      rsvpRequest('Geri', 'yes', 'many').then((response) => {
        assert.isOk(response);
        assert.isOk(response.payload);
        done();
      });
    });

    describe('with a declined RSVP', () => {
      it('should reply with a success message', (done) => {
        rsvpRequest('Simon', 'no', null).then((response) => {
          assert.isOk(response);
          assert.isOk(response.payload);
          done();
        });
      });

      it('should persist the declined RSVP', (done) => {
        rsvpRequest('Timon', 'no', null).then(() => {
          assert(pgClient.query.calledWith(
            'INSERT INTO guests(name, response, allergies) VALUES($1, $2, $3)',
            ['Timon', false, null],
          ));
          done();
        });
      });
    });
  });

  describe('#GET /admin/guests', () => {
    it('should reject unauthorized requests', (done) => {
      server.inject({
        method: 'GET',
        url: '/admin/guests',
      }).then((response) => {
        assert.equal(response.statusCode, 401);
        done();
      });
    });

    it('should reject incorrect credentials', (done) => {
      const invalid = Buffer.from('foo:bar').toString('base64');
      server.inject({
        method: 'GET',
        url: '/admin/guests',
        headers: {
          Authorization: `Basic ${invalid}`,
        },
      }).then((response) => {
        assert.equal(response.statusCode, 401);
        done();
      });
    });

    it('should render a view with guest list', (done) => {
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
      const credentials = Buffer.from('admin:password').toString('base64');

      server.inject({
        method: 'GET',
        url: '/admin/guests',
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      }).then((response) => {
        assert.isOk(response.result);
        assert.include(response.result, 'Luke');
        assert.include(response.result, 'many');
        assert.include(response.result, 'Vader');
        done();
      });
    });
  });
});
