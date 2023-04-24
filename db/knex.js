const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'Qweasdzxcrfv22',
        database: 'todolist'
    }
})

module.exports = knex;