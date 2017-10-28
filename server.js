const Hapi = require('hapi');
const Handlebars = require('handlebars');
const Vision = require('vision');
const Inert = require('inert');

const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8000,
});

server.register([Vision, Inert], () => {
  server.views({
    engines: {
      html: Handlebars,
    },
    relativeTo: __dirname,
    path: 'templates',
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

  server.start((serverErr) => {
    if (serverErr) {
      throw serverErr;
    }
    console.log('Server running at:', server.info.uri); // eslint-disable-line no-console
  });
});
