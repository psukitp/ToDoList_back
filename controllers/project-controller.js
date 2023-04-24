const projectService = require('../service/project-service')

class ProjectController {
    async createNewProject(req, res, next) {
        try {
            const { title, creator } = req.body;
            const newProject = await projectService.createNewProject(title, creator);
            res.send('created')
        } catch (e) {
            console.log(e)
        }
    }

    async GetMyProjects(req, res, next) {
        try {
            const id = req.params.id;
            const projects = await projectService.GetMyProjects(id);
            res.send(projects)
        } catch (e) {
            console.log(e)
        }
    }

    async GetOneProject(req, res, next) {
        try {
            const id = req.params.id;
            const project = await projectService.GetOneProject(id);
            res.send(project)
        } catch (e) {
            console.log(e)
        }
    }

    async CreateTaskToProject(req, res, next) {
        try {
            const { title, text, date_create, date_end, priority, responsible, project_id } = req.body
            await projectService.CreateTaskToProject(title, text, date_create, date_end, priority, responsible, project_id)
            res.send('done')
        } catch (e) {
            console.log(e)
        }
    }

    async UpdateTaskStatus(req, res, next) {
        try {
            const { task_id, status, day_update } = req.body
            await projectService.UpdateTaskStatus(task_id, status, day_update)
            res.send('done')
        } catch (e) {
            console.log(e)
        }
    }

    async GetMyTasks(req, res, next) {
        try {
            const responsible = req.params.id;
            const tasks = await projectService.GetMyTasks(responsible);
            res.send(tasks)
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new ProjectController()