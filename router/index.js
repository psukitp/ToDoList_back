const Router = require('express').Router
const router = new Router()
const userController = require('../controllers/user-controller')
const projectController = require('../controllers/project-controller')


//user
router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/logout', userController.logout)
router.post('/refresh', userController.refresh)
router.get('/users-no-manager', userController.getUsersWithoutManager)
router.post('/create-manager-employee-connection', userController.createManagerUserConnection)
router.post('/get-my-employeers', userController.getMyEmployeers)

//project
router.get('/my-projects/:id', projectController.GetMyProjects)
router.get('/project/:id', projectController.GetOneProject)
router.post('/create-project', projectController.createNewProject)
router.post('/create-task', projectController.CreateTaskToProject)
router.post('/update-task', projectController.UpdateTaskStatus)
router.get('/my-tasks/:id', projectController.GetMyTasks)


module.exports = router
