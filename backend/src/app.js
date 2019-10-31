// Iniciando aplicacao
import express from 'express';
import routes from './routes';

import './database';

class App {
  // metodos
  constructor() {
    this.server = express();

    this.middleware();
    this.routes();
  }

  middleware() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
// server eh o unico metodo que faz sentido exportar desta classe
