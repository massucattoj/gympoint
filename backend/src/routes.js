/*
  Rotas da aplicacao GymPoint
*/
import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

// rotas que precisam de autenticacao do usuario
routes.use(authMiddleware);
routes.post('/students', StudentController.store); //  cria usuario
routes.put('/students/:id', StudentController.update); // edita usuario

export default routes;
