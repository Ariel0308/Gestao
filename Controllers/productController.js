import Produto from "../Models/Produto";

const getAllProducts = async (req, res) => {
    const {categoryId} = req.params;      
    
    try {
        const products = await Produto.find({ id_categoria: categoryId }).populate('id_categoria');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
}

const getProduct = async (req, res) => {
    const {id} = req.params;      
    
    try {
        const product = await Produto.findById( id ).populate('id_categoria');
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
}

module.exports = { getAllProducts, getProduct };