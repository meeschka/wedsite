const Hapi = require('hapi');
const Hoek = require('hoek');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8000,
});

server.register(require('vision'), (err) => {

    Hoek.assert(!err, err);

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'templates'
    });

    // Add the route
    server.route({
        method: 'GET',
        path:'/hello', 
        handler: function (request, reply) {
            return reply('hello world');
        }
    });

    // Start the server
    server.start((err) => {

        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
});
