# wedsite

Wedding website for David and Michelle.

## Prerequisites

- [PostgreSQL](https://www.postgresql.org/) version 9.5 or higher

## Getting Started

This project uses [Dotenv](https://www.npmjs.com/package/dotenv) for workspace configuration. Before you begin, copy over the _.env.example_ file to a local _.env_ file (which git will ignore).

    cp .env.example .env

Wedsite will automatically load values from a local _.env_ file on boot, overriding any system-defined environment variables. If no _.env_ file is found local environment variables will work as expected.

### Environment Variables

* **NODE_ENV** Environment type in which the project is being run. One of `development`, `test` or `production`.
* **PORT** Port to run server on. Default value is `0` (any available port) if left blank.
* **PGUSER** PostgreSQL username for database connection.
* **PGPASSWORD** PostgreSQL username for database connection.
* **PGDATABASE** PostgreSQL database name for database connection.
* **PGHOST** PostgreSQL host name for database connection. Default value is `localhost` if left blank.

## Development

To run:

    npm start

To test:

    npm test

To run linter:

    npm run lint
