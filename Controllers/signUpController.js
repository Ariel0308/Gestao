import User from '../Models/User.js';

const createUser = async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado!' });
    }
    const newUser = new User({ nome, email, senha });
    await newUser.save();
    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  }
    catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

export default { createUser };
