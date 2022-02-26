const _ = require('lodash');
const flaverr = require('flaverr');

const {
  Murid,
  sequelize,
  Sequelize
} = require('../models');

/**
 * Create a Murid
 * @param {Object} data Data
 * @param {String} data.nama_lengkap Nama Lengkap
 * @param {Number} data.kelas Kelas
 * @param {Object} transaction Object transaction
 * @returns Data containing status and data or error
 */

const Create = async (
  data = {
    nama_lengkap,
    kelas
  },
  transaction,
) => {
  try {
    // create
    let result;
    if (transaction) {
      result = await Murid.create(data, { transaction });
    } else {
      result = await sequelize.transaction(async (t) => {
        const murid = await Murid.create(data, { transaction: t });
        return murid;
      });
    }

    return {
      status: true,
      data: result,
    };
  } catch (err) {
    return {
      status: false,
      err,
    };
  }
};

/**
 * Find Murids
 * @param {Object} params Params untuk filter
 * @param {String} params.nama_lengkap Nama Lengkap
 * @param {Number} params.kelas Kelas
 * @param {Object} pagination Pagination
 * @param {Number} pagination.page Halaman yang ditampilkan
 * @param {Number} pagination.per_page Data per halaman yang ditampilkan
 * @returns Data containing status and data or error
 */

const FindAll = async (
  params = {
    nama_lengkap,
    kelas
  },
  pagination = { page: 1, per_page: 20 },
) => {
  try {
    const {
      nama_lengkap,
      kelas
    } = params;

    const page = parseInt(pagination.page) || 1;
    const per_page = parseInt(pagination.per_page) || 20;

    // params
    const where = {};
    nama_lengkap ? (where.nama_lengkap = { [Sequelize.Op.eq]: nama_lengkap }) : '';
    kelas ? (where.kelas = { [Sequelize.Op.eq]: kelas }) : '';

    // ambil data untuk pagination
    const { count, rows } = await Murid.findAndCountAll({
      offset: (page - 1) * per_page,
      limit: per_page,
      where,
      order: [
        ['nama_lengkap', 'ASC'],
      ]
    });

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('murid not found'));
    }

    const result = paginate({
      data: rows,
      count,
      page,
      per_page,
    });

    return {
      status: true,
      data: result,
    };
  } catch (err) {
    return {
      status: false,
      err,
    };
  }
};

/**
 * Find a Murid
 * @param {String} id UUID dari Murid
 * @returns Data containing status and data or error
 */

const FindOne = async (id, transaction) => {
  try {
    const murid = await Murid.findOne({
      where: { id },
      transaction
    });

    if (!murid) {
      throw flaverr(
        'E_NOT_FOUND',
        Error(`murid with id ${id} is not found`),
      );
    }

    return {
      status: true,
      data: murid,
    };
  } catch (err) {
    return {
      status: false,
      err,
    };
  }
};

/**
 * Update a Murid
 * @param {String} id UUID dari Murid
 * @param {Object} data Data
 * @param {String} data.nama_lengkap Nama Lengkap
 * @param {Number} data.kelas Kelas
 * @returns Data containing status and data or error
 */

const Update = async (
  id,
  data = {
    nama_lengkap,
    kelas
  },
) => {
  try {
    // update
    const result = await sequelize.transaction(async (t) => {
      const murid = await Murid.findByPk(id, { transaction: t });
      if (!murid) throw flaverr(`E_NOT_FOUND`, Error(`murid with id ${id} not found`));

      if (_.has(data, 'nama_lengkap') && !_.isUndefined(data.nama_lengkap)) {
        murid.nama_lengkap = data.nama_lengkap;
      }
      if (_.has(data, 'kelas') && !_.isUndefined(data.kelas)) {
        murid.kelas = data.kelas;
      }

      const update = await murid.save({ transaction: t });
      if (!update) throw flaverr(`E_ERROR`, Error(`failed to update murid with id ${id}`));

      return murid;
    });

    return {
      status: true,
      data: result,
    };
  } catch (err) {
    return {
      status: false,
      err,
    };
  }
};

const Delete = async function (id = '', token) {
  try {
    const res = await sequelize.transaction(async (t) => {
      const murid = await FindOne(id, t);
      if (!murid.status) throw murid.err;

      await murid.data.destroy({ transaction: t });

      return murid.data;
    });
    
    return {
      status: true,
      data: res,
    };
  } catch (err) {
    return {
      status: false,
      err,
    };
  }
};

module.exports = {
  Create,
  FindAll,
  FindOne,
  Update,
  Delete,
};