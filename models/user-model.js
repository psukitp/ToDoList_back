module.exports = class UserModel {
    user_id;
    name;
    s_name;
    patronymic;
    login;
    manager;

    constructor(user_id, name, s_name, patronymic, login, manager = null) {
        this.user_id = user_id
        this.name = name
        this.s_name = s_name
        this.patronymic = patronymic
        this.login = login
        this.manager = manager
    }
}