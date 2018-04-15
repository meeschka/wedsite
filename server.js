const Hapi = require('hapi');
const Handlebars = require('handlebars');
const Vision = require('vision');
const Inert = require('inert');
const AuthBasic = require('hapi-auth-basic');
const { Client } = require('pg');

require('dotenv').config();

const server = new Hapi.Server();
server.connection({
  port: process.env.PORT,
});

new Promise((resolve, reject) => {
  server.pgClient = new Client();
  server.pgClient.connect((err) => {
    if (err) reject(err);

    resolve();
  });
}).then(() => new Promise((resolve, reject) => {
  server.register([Vision, Inert, AuthBasic], (err) => {
    if (err) reject(err);

    resolve();
  });
})).then(() => {
  server.auth.strategy('simple', 'basic', {
    validateFunc: (request, username, password, callback) => {
      const valid = username === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD;
      callback(null, valid, {});
    },
  });

  return Promise.resolve();
}).then(() => {
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
    path: '/{templateName?}',
    handler: (request, reply) => {
      const viewName = request.params.templateName || 'index';
      reply.view(viewName, { GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY });
    },
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
    method: 'GET',
    path: '/scripts/{filename*}',
    handler: {
      directory: {
        path: 'scripts',
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
    path: '/admin/guests',
    config: { auth: 'simple' },
    handler: (request, reply) => {
      server.pgClient.query('SELECT * FROM guests').then((response) => {
        reply.view('admin/guests', {
          attending: response.rows.filter(guest => guest.response),
          absent: response.rows.filter(guest => !guest.response),
          total: response.rows.length,
        });
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
})
  .catch((err) => {
    console.error(err); // eslint-disable-line no-console
    process.exit(1);
  });

module.exports = server;
