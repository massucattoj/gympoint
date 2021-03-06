import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  /* Metodo chamado automaticamente pelo sequelize */
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING
      },
      {
        sequelize /* Como recebeu ele como parametro, deve retornar como objeto */
      }
    );

    // antes de qualquer usuario ser salvo no banco de dados esse trecho de codigo e executado
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  /* Verificar se senhas  que o user esta usando para logar e a mesma armazenada no banco */
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
