const userService = require('../service/user-service')

class UserController {
    async registration(req, res, next) {
        try {
            const { name, s_name, patronymic, login, password } = req.body;

            const userData = await userService.registration(name, s_name, patronymic, login, password);

            if (userData.code) {
                res.status(userData.code);
                res.send(userData.message)
            }

            return res.json(userData)
        } catch (e) {
            console.log(e)
        }
    }

    async login(req, res, next) {
        try {
            const { login, password } = req.body;
            const userData = await userService.login(login, password);
            if (userData.code) {
                res.status(userData.code);
                res.send(userData.message)
            }
            return res.json(userData)
        } catch (e) {
            console.log(e)
        }
    }

    async logout(req, res, next) {
        try {
            const token = await req.get("Authorization");
            await userService.logout(token);
            res.send('done')
        } catch (e) {
            console.log(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const token = await req.get("Authorization");
            const userData = await userService.refresh(token);
            res.send(userData)
        } catch (e) {
            console.log(e)
        }
    }

    async getUsersWithoutManager(req, res, next) {
        try {
            const users = await userService.getUsersWithoutManager();
            res.send(users);
        } catch (e) {
            console.log(e)
        }
    }

    async createManagerUserConnection(req, res, next) {
        try {
            const { user_id, employee_id } = req.body
            await userService.createManagerUserConnection(user_id, employee_id)
            res.send('done')
        } catch (e) {
            console.log(e)
        }
    }

    async getMyEmployeers(req, res, next) {
        try {
            const { manager } = req.body;
            const users = await userService.getMyEmployeers(manager)
            res.send(users)
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new UserController()