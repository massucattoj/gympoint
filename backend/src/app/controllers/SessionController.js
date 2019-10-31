import jwt from 'jsonwebtoken';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    /* Para logar na app necessario email e password */
    const { email, password } = req.body;

    /* Verificar se email existe */
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email
      },
      token: jwt.sign({ id }, '48100ea2cb81ccaee93a096a315b47a1', {
        expiresIn: '7d'
      })
    });
  }
}

export default new SessionController();
/* Chave do MD5 online gympointmassucatto */
