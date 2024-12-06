const { PrismaClient } = require("@prisma/client");
const ClientError = require("../errors/ClientError");
const passport = require('passport');
const prisma = new PrismaClient();
const {sendOrderNotification} = require('../MessageBroker');

const getOrder = async (req, res, next) => {
  try {
    const id = req.user.id;

    const barang = await prisma.barang.findMany({
      where: {
        userId : id,
      },
    });

    const barangIds = barang.map(barang => barang.id);
    
    const orders = await prisma.order.findMany({
      where: {
        barangId: {
          in: barangIds, 
        },
      },
    });

    return res.status(200).json({
      message: "Success",
      data: orders,
    });
  } catch (error) {
    return next(error);
  }
};

const decideOrder = async (req, res, next) => {
  try {
    const { id, decide } = req.body;

    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        barang: true, 
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if(order.status != "Pending"){
      return res.status(400).json({ message: "GAGAL! Barang Sudah Pernah Ditolak atau Diterima" });
    }

    if (decide) {
      const updatedOrder = await prisma.order.update({
        where: {
          id,
        },
        data: {
          status: "Diterima",
        },
      });

      const updatedSaldo = await prisma.user.update({
        where: {
          id: order.barang.userId, 
        },
        data: {
          saldo: {
            increment: order.harga, 
          },
        },
      });
      
      await sendOrderNotification(updatedOrder);

      res.status(200).json({
        message: "Order diterima dan saldo diperbarui",
        order: updatedOrder,
        penjual: updatedSaldo,
      });
    } else {

      const canceledOrder = await prisma.order.update({
        where: {
          id,
        },
        data: {
          status: "Ditolak",
        },
      });

      const updatedSaldoPembeli = await prisma.customer.update({
        where: {
          id: order.userId, 
        },
        data: {
          saldo: {
            increment: order.harga, 
          },
        },
      });

      const updateStockBarang = await prisma.barang.update({
        where: {
          id: order.barangId,
        },
        data: {
          jumlah: {increment: order.jumlah}
        }
      })

      res.status(200).json({
        message: "Order ditolak",
        order: canceledOrder,
        pembeli: updatedSaldoPembeli,
        barang: updateStockBarang,
      });
    }
  } catch (error) {
    next(error); // Tangani error dengan middleware error handler
  }
};


module.exports = {
  getOrder,
  decideOrder,
};
