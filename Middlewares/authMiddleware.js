import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET ?? 'dev-secret';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido', error: error.message });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Acesso restrito a administradores' });
  }
  next();
};

