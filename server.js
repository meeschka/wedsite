const Hapi = require('hapi');
const handlebars = require('handlebars');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8000,
});

server.register(require('vision'), () => {
  server.views({
    engines: {
      html: handlebars,
    },
    relativeTo: __dirname,
    path: 'templates',
  });

  // Add the route
  server.route({
    method: 'GET',
    path: '/hello',
    handler: (request, reply) => reply('hello world'),
  });

  // Start the server
  server.start((ServerErr) => {
    if (ServerErr) {
      throw ServerErr;
    }
    console.log('Server running at:', server.info.uri); // eslint-disable-line no-console
  });
});
