# README todolist_back
## Не в репозитории


- # Конфиг knex
- /db/knex.js
Там находится следующая информация
##
    const knex = require('knex')({
        client: 'pg',
        connection: {
            host: 'localhost',
            port: 5432,
            user: 'user',
            password: 'password',
            database: 'database'
        }
    })


- # .env
Там находится следующая информация
##  
    PORT = *
    JWT_ACCESS_SECRET='*'
    JWT_REFRESH_SECRET='*'
