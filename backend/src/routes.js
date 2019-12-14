/*
  Rotas da aplicacao GymPoint
*/
import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckInController from './app/controllers/CheckInController';
import HelpOrderController from './app/controllers/HelpOrderController';
import AdminHelpOrderController from './app/controllers/AdminHelpOrderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

// checkins students
routes.post('/students/:id/checkins', CheckInController.store);
routes.get('/students/:id/checkins', CheckInController.index);

// help orders students
routes.post('/students/:id/help-orders', HelpOrderController.store);
routes.get('/students/:id/help-orders', HelpOrderController.index);

// rotas que precisam de autenticacao do usuario
routes.use(authMiddleware);
routes.post('/students', StudentController.store); //  create user
routes.put('/students/:id', StudentController.update); // edit user

// plans
routes.post('/plan', PlanController.store); // create plan
routes.get('/plans', PlanController.index); // show plans
routes.put('/plan/:id', PlanController.update); // update plan
routes.delete('/plan/:id', PlanController.delete); // delete plan

// enrollments
routes.post('/enrollment', EnrollmentController.store); // create enrollment
routes.get('/enrollments', EnrollmentController.index);
routes.put('/enrollment/:id', EnrollmentController.update);
routes.delete('/enrollment/:id', EnrollmentController.delete);

// helo orders admins
routes.get('/help-orders', AdminHelpOrderController.index);
routes.post('/help-orders/:id/answer', AdminHelpOrderController.store);

export default routes;
