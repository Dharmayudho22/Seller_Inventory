const { PrismaClient } = require("@prisma/client");
const ClientError = require("../errors/ClientError");
const passport = require('passport');
const prisma = new PrismaClient();

const getBarang = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const barang = await prisma.barang.findMany({
      where: {
        userId: userId,
      },
    });

    if (!barang) {
      return res.status(404).json({
        message: "Barang not found",
      });
    }

    return res.status(200).json({
      message: "Success",
      data: barang, 
    });
  } catch (error) {
    return next(error);
  }
};

const addBarang = async (req, res, next) => {
  try {
    const { nama, harga ,deskripsi } = req.body;
    const id = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('');
    const jumlah = 0;
    const userId = req.user.id;

    const isBarang = await prisma.barang.findUnique({
      where: {
        id,
      },
    });

    if (isBarang) {
      throw new ClientError("Barang already exists"); 
    }

    const newBarang = await prisma.barang.create({
      data: {
        id,
        nama,
        harga,
        jumlah,
        userId,
        deskripsi,
      },
    });

    return res.status(201).json({
      message: "Barang added successfully",
      data: newBarang,
    });
  } catch (error) {
    return next(error);
  }
};

const tambahBarang = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tambah } = req.body;  

    const isBarang = await prisma.barang.findUnique({
      where: {
        id,
      },
    });

    if (!isBarang) {
      throw new ClientError("Barang not found");
    }

    if (isBarang.userId != req.user.id){
      throw new ClientError("Barang bukan milik toko anda");
    }

    const updatedBarang = await prisma.barang.update({
      where: {
        id,
      },
      data: {
        jumlah: isBarang.jumlah + tambah,  
      },
    });

    return res.status(200).json({
      message: "Barang updated successfully",
      data: updatedBarang,
    });

  } catch (error) {
    console.error(error); 
    return next(error); 
  }
};

const deleteBarang = async (req, res, next) => {
  try {
    const { id } = req.params;

    const isBarang = await prisma.barang.findUnique({
      where: {
        id,
      },
    });

    if (!isBarang) {
      throw new ClientError("Barang not found");
    }
    if (isBarang.userId != req.user.id){
      throw new ClientError("Barang bukan milik toko anda");
    }

    await prisma.barang.delete({
      where: {
        id,
      },
    });
    

    return res.status(200).json({
      message: "Barang deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const editBarang = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nama, deksripsi, jumlah, harga } = req.body;  

    const isBarang = await prisma.barang.findUnique({
      where: {
        id,
      },
    });

    if (!isBarang) {
      throw new ClientError("Barang not found");
    }

    if (isBarang.userId != req.user.id){
      throw new ClientError("Barang bukan milik toko anda");
    }

    const updatedBarang = await prisma.barang.update({
      where: {
        id,
      },
      data: {
        nama,
        deksripsi,
        jumlah, 
        harga,
      },
    });

    return res.status(200).json({
      message: "Barang updated successfully",
      data: updatedBarang,
    });

  } catch (error) {
    console.error(error); 
    return next(error); 
  }
};


module.exports = {
  getBarang,
  addBarang,
  tambahBarang,
  deleteBarang,
  editBarang,
};
