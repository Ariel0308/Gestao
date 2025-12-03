import Categoria from "../Models/Categoria";

const getCategories = async (req, res) => {    
    try {
        const categorias = await Categoria.find();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
}


module.exports = { getCategories };