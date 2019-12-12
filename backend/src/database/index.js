/*
  Realiza conexao com o banco de dados e carrega os models
*/
import Sequelize from 'sequelize';
import mongoose from 'mongoose';

/* importar models */
import User from '../app/models/User';
import Student from '../app/models/Student';
import Plan from '../app/models/Plan';
import Enrollment from '../app/models/Enrollment';

/* Importar configs do banco de dados */
import databaseConfig from '../config/database';

const models = [User, Student, Plan, Enrollment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  /* Metodo responsavel pela conexao */
  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/gympoint',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true
      }
    );
  }
}

export default new Database();
