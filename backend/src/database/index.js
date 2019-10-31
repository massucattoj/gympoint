/*
  Realiza conexao com o banco de dados e carrega os models
*/
import Sequelize from 'sequelize';

/* importar models */
import User from '../app/models/User';
import Student from '../app/models/Student';

/* Importar configs do banco de dados */
import databaseConfig from '../config/database';

const models = [User, Student];

class Database {
  constructor() {
    this.init();
  }

  /* Metodo responsavel pela conexao */
  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
