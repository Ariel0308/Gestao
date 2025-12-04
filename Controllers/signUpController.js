import bcrypt from 'bcryptjs';
import User from '../Models/User.js';

const createUser = async (req, res) => {
  const { nome, email, senha, isAdmin } = req.body;
  try {
    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado!' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    const newUser = new User({ nome, email, senha: hashedPassword, isAdmin: Boolean(isAdmin) });
    await newUser.save();
    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

export default { createUser };
