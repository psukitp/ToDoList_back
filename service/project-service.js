const db = require('../db/knex')

class ProjectService {
    async createNewProject(title, creator) {
        try {
            await db('project').insert({
                title, creator
            })
        } catch (e) {
            console.log(e)
        }
    }

    async GetMyProjects(id) {
        try {
            const projects = await db.select('project_id', 'title', 'creator', 'name', 's_name', 'patronymic', 'login')
                .from('project')
                .innerJoin('users_list', 'project.creator', 'users_list.user_id')
                .where('creator', '=', id)
            return projects
        } catch (e) {
            console.log(e)
        }
    }

    async GetOneProject(id) {
        try {
            console.log('Начал')
            const project = await db('project as p')
                .select('p.project_id', 'p.title as project_title', 'p.creator', 't.task_id', 't.title as task_title', 't.text', 't.date_create', 't.date_end', 't.date_update', 't.priority', 't.status', 't.responsible', 'u.name', 'u.s_name', 'u.patronymic')
                .innerJoin('project_task_con as pc', 'p.project_id', 'pc.project_id')
                .innerJoin('task as t', 'pc.task_id', 't.task_id')
                .innerJoin('users_list as u', 't.responsible', 'u.user_id')
                .where('p.project_id', '=', id)
            if (project.length > 0) {
                return project
            } else {
                const emptyProject = await db('project').where('project_id', '=', id)
                return emptyProject
            }

        } catch (e) {
            console.log(e)
        }
    }

    async CreateTaskToProject(title, text, date_create, date_end, priority, responsible, project_id) {
        console.log(date_create)
        const newTask = await db('task').insert({
            title,
            text,
            date_create,
            date_end,
            priority,
            status: 'К выполнению',
            responsible
        })
        const lastvalue = await db('task')
            .max('task_id');
        const task_id = await db('task')
            .where('task_id', '=', lastvalue[0].max)
        await db('project_task_con')
            .insert({
                project_id,
                task_id: task_id[0].task_id
            })
    }

    async UpdateTaskStatus(task_id, status, day_update) {
        try {
            await db('task').update({ status, date_update: day_update }).where('task_id', '=', task_id)
        } catch (e) {
            console.log(e)
        }
    }

    async GetMyTasks(responsible) {
        try {
            const tasks = await db('task as t')
                .select('t.task_id', 't.title', 'p.creator', 'p.project_id', 'u.name', 'u.s_name')
                .innerJoin('project_task_con as pc', 't.task_id', 'pc.task_id')
                .innerJoin('project as p', 'pc.project_id', 'p.project_id')
                .innerJoin('users_list as u', 'p.creator', 'u.user_id')
                .where('t.responsible', '=', responsible)
                .whereNotIn('t.status', ['Выполнено', 'Отменено']);
            return tasks
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new ProjectService();