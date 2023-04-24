const jwt = require('jsonwebtoken')
const db = require('../db/knex')
const jwt_decode = require('jwt-decode')
require("dotenv").config();

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await db('token').where({
            user_id: userId
        })
        if (tokenData.length > 0) {
            await db('token')
                .where('user_id', '=', userId)
                .update({
                    token: refreshToken
                })
        }

        await db('token').insert({
            user_id: userId,
            token: refreshToken
        })


        return
    }

    async removeToken(token) {
        const decode = jwt_decode(token);
        await db('token').where('user_id', '=', decode.user_id).del()
        return
    }

}

module.exports = new TokenService();