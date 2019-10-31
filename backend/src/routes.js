/*
  Rotas da aplicacao GymPoint
*/
import { Router } from 'express';
import User from './app/models/User';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.get('/', (req, res) => res.json({ message: 'hello world' }));

export default routes;
