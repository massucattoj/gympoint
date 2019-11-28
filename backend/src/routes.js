/*
  Rotas da aplicacao GymPoint
*/
import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

// rotas que precisam de autenticacao do usuario
routes.use(authMiddleware);
routes.post('/students', StudentController.store); //  create user
routes.put('/students/:id', StudentController.update); // edit user

// plans
routes.post('/plan', PlanController.store); // create plan

export default routes;
