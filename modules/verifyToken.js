import jwt from 'jsonwebtoken';
import config from '../core/config/config.dev';

const verifyToken = (req, res, next) => {
  const token = req.header('Auth-Token');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, config.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invaild Token');
  }
};

export default verifyToken;
