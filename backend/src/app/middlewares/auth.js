// Middleware de autenticacao
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth'; // necessario para usar o segredo do token

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // se o token nao estiver presente
  if (!authHeader) {
    return res.json(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
