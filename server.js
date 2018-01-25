const Hapi = require('hapi');
const Handlebars = require('handlebars');
const Vision = require('vision');
const Inert = require('inert');
const { Client } = require('pg');

const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8000,
});

server.pgClient = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'wedsite',
  password: 'postgres',
});

server.pgClient.connect();

server.register([Vision, Inert], () => {
  server.views({
    engines: {
      html: Handlebars,
    },
    relativeTo: __dirname,
    path: 'templates',
    isCached: false,
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => reply.view('index'),
  });

  server.route({
    method: 'GET',
    path: '/styles/{filename*}',
    handler: {
      directory: {
        path: 'styles',
      },
    },
  });

  server.route({
    method: 'POST',
    path: '/api/rsvp',
    handler: (request, reply) => {
      const attending = request.payload.attending === 'yes';
      server.pgClient.query(
        'INSERT INTO guests(name, response, allergies) VALUES($1, $2, $3)',
        [request.payload.guestName, attending, request.payload.allergies],
      ).then(() => {
        reply('rsvp accepted');
      });
    },
  });

  server.route({
    method: 'GET',
    path: '/api/admin/guests',
    handler: (request, reply) => {
      server.pgClient.query('SELECT * FROM guests').then((response) => {
        reply(response.rows);
      });
    },
  });

  if (process.env.NODE_ENV !== 'test') {
    server.start((serverErr) => {
      if (serverErr) {
        throw serverErr;
      }
      console.log('Server running at:', server.info.uri); // eslint-disable-line no-console
    });
  }
});

module.exports = server;
