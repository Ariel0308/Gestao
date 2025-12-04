import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Models/User.js';

const jwtSecret = process.env.JWT_SECRET ?? 'dev-secret';

const login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou senha inválidos!' });
    }

    const isValid = await bcrypt.compare(senha, user.senha);
    if (!isValid) {
      return res.status(400).json({ message: 'Email ou senha inválidos!' });
    }

    const token = jwt.sign(
      {
        sub: user._id.toString(),
        email: user.email,
        nome: user.nome,
        isAdmin: user.isAdmin,
      },
      jwtSecret,
      { expiresIn: '8h' },
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

export default { login };