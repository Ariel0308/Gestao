import mongoose from 'mongoose';
import Movimento from '../Models/Movimento.js';

const parseDateRange = (fromParam, toParam) => {
  const from = fromParam ? new Date(fromParam) : undefined;
  const to = toParam ? new Date(toParam) : undefined;
  const match = {};

  if (from && !Number.isNaN(from.getTime())) {
    match.$gte = from;
  }

  if (to && !Number.isNaN(to.getTime())) {
    match.$lte = to;
  }

  return match.$gte || match.$lte ? match : undefined;
};

const salesReport = async (req, res) => {
  try {
    const dateFilter = parseDateRange(req.query.from, req.query.to);
    const matchStage = { tipo: 'Saida' };
    if (dateFilter) {
      matchStage.data_mov = dateFilter;
    }

    const [totals] = await Movimento.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalUnits: { $sum: '$quantidade' },
          totalRevenue: { $sum: { $multiply: ['$quantidade', '$valor_unitario'] } },
        },
      },
    ]);

    res.status(200).json({
      totalUnits: totals?.totalUnits ?? 0,
      totalRevenue: totals?.totalRevenue ?? 0,
      period: {
        from: req.query.from ?? null,
        to: req.query.to ?? null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar relatório de vendas', error: error.message });
  }
};

const stockMovementsReport = async (req, res) => {
  try {
    const dateFilter = parseDateRange(req.query.from, req.query.to);
    const matchStage = {};
    if (dateFilter) {
      matchStage.data_mov = dateFilter;
    }

    const grouped = await Movimento.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$tipo',
          totalUnits: { $sum: '$quantidade' },
          totalValue: { $sum: { $multiply: ['$quantidade', '$valor_unitario'] } },
        },
      },
    ]);

    const summary = {
      Entrada: { totalUnits: 0, totalValue: 0 },
      Saida: { totalUnits: 0, totalValue: 0 },
    };

    grouped.forEach((item) => {
      summary[item._id] = {
        totalUnits: item.totalUnits,
        totalValue: item.totalValue,
      };
    });

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar relatório de estoque', error: error.message });
  }
};

const topProductsReport = async (req, res) => {
  try {
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit, 10) || 5));
    const dateFilter = parseDateRange(req.query.from, req.query.to);

    const matchStage = { tipo: 'Saida' };
    if (dateFilter) {
      matchStage.data_mov = dateFilter;
    }

    const report = await Movimento.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$id_produto',
          totalUnits: { $sum: '$quantidade' },
          totalRevenue: { $sum: { $multiply: ['$quantidade', '$valor_unitario'] } },
        },
      },
      { $sort: { totalUnits: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'produtos',
          localField: '_id',
          foreignField: '_id',
          as: 'produto',
        },
      },
      { $unwind: '$produto' },
    ]);

    res.status(200).json(
      report.map((item) => ({
        produto: {
          id: item.produto._id,
          nome: item.produto.nome,
        },
        totalUnits: item.totalUnits,
        totalRevenue: item.totalRevenue,
      })),
    );
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar ranking de produtos', error: error.message });
  }
};

export default {
  salesReport,
  stockMovementsReport,
  topProductsReport,
};

