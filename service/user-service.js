const db = require('../db/knex')
const bcrypt = require('bcrypt')
const UserModel = require('../models/user-model');
const tokenService = require('./token-service')
const jwt_decode = require('jwt-decode')

class UserService {
    async registration(name, s_name, patronymic, login, password) {
        try {
            const loginCheck = await db('users_list').where('login', '=', login)
            if (loginCheck.length > 0) {
                return {
                    message: 'Пользователь с таким логином уже существует',
                    code: 400
                }
            }
            const hashPassword = await bcrypt.hash(password, 5)
            await db('users_list').insert({
                name,
                s_name,
                login,
                patronymic,
                password: hashPassword
            })
            const user = await db('users_list').where({
                login
            })
            const user_id = user[0].user_id
            const userModel = new UserModel(user_id, name, s_name, patronymic, login)
            const tokens = tokenService.generateTokens({ ...userModel });
            await tokenService.saveToken(userModel.user_id, tokens.refreshToken)
            return {
                accessToken: tokens.accessToken,
                user: userModel
            }
        } catch (e) {
            console.log(e)
        }
    }


    async login(loginIn, nonHashPassword) {
        const user = await db('users_list').where('login', '=', loginIn);
        if (user.length < 1) {
            return {
                message: 'Пользователь с таким логином не найден',
                code: 400
            }
        }
        const { user_id, name, s_name, patronymic, login, manager, password } = user[0]
        const isPassEquals = await bcrypt.compare(nonHashPassword, password)
        if (!isPassEquals) {
            return {
                message: 'Неверный пароль',
                code: 400
            }
        }
        const userModel = new UserModel(user_id, name, s_name, patronymic, login, manager)
        const tokens = tokenService.generateTokens({ ...userModel });
        await tokenService.saveToken(userModel.user_id, tokens.refreshToken);
        return {
            accessToken: tokens.accessToken,
            user: userModel
        }
    }

    async logout(token) {
        try {
            await tokenService.removeToken(token);
        } catch (e) {
            console.log(e)
        }
    }

    async refresh(token) {
        try {
            if (!token) {
                throw new Error
            }
            const userDataAccess = tokenService.validateAccessToken(token);
            if (userDataAccess !== null) {
                const user = await db('users_list').where('user_id', '=', userDataAccess.user_id)
                const { user_id, name, s_name, patronymic, login, manager } = user[0];
                const userModel = new UserModel(user_id, name, s_name, patronymic, login, manager);
                return {
                    accessToken: token,
                    user: userModel
                }
            }
            const decode = jwt_decode(token)
            const dbToken = await db('token').where('user_id', '=', decode.user_id)
            if (dbToken.length < 1) {
                throw new Error
            }
            const userDataRefresh = tokenService.validateRefreshToken(dbToken[0].token)
            if (userDataRefresh !== null) {
                const user = await db('users_list').where('user_id', '=', userDataRefresh.user_id)
                const { user_id, name, s_name, patronymic, login, manager } = user[0];
                const userModel = new UserModel(user_id, name, s_name, patronymic, login, manager);
                const tokens = tokenService.generateTokens({ ...userModel });
                await tokenService.saveToken(userModel.user_id, tokens.refreshToken);
                return {
                    accessToken: tokens.accessToken,
                    user: userModel
                }
            } else {
                throw new Error
            }
        } catch (e) {
            console.log(e)
        }
    }

    async getUsersWithoutManager() {
        try {
            const users = await db('users_list')
                .select('user_id', 'name', 's_name', 'login')
                .whereNull('manager')
            return users
        } catch (e) {
            console.log(e)
        }
    }

    async createManagerUserConnection(user_id, employee_id) {
        try {
            await db('users_list')
                .update({ manager: user_id })
                .where({ user_id: employee_id })
        } catch (e) {
            console.log(e)
        }
    }

    async getMyEmployeers(manager) {
        try {
            const users = await db('users_list')
                .select('user_id', 'name', 's_name', 'login')
                .where('manager', '=', manager)
            return users
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new UserService();