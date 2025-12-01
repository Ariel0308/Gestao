import User from '../Models/User.js';

const login = async (req, res) => {
  const { email, senha } = req.body;
    try {
    const user = await User.findOne({ email });
    if (!user || user.senha !== senha) {
        return res.status(400).json({ message: 'Email ou senha inválidos!' });
    }
    res.status(200).json({ message: 'Login bem-sucedido!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }

};

module.exports = { login };