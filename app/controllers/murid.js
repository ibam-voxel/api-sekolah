const { success } = require('../services/httpRes');

const muridRepository = require('../repositories/murid');
const transactionRepo = require('../repositories/transaction');

const library = {};

library.Create = async (req, res, next) => {
  try {
    const {
      nama_lengkap,
      kelas
    } = req.body;

    // start transaction
    const transaction = await transactionRepo.Create();

    const muridData = {
      nama_lengkap,
      kelas
    };

    // create murid
    const murid = await muridRepository.Create(
      muridData,
      transaction.data,
    );

    if (!murid.status) {
      await transactionRepo.Rollback(transaction.data);
      throw murid.err;
    }

    // end transaction
    await transactionRepo.Commit(transaction.data);

    return success(res, 201, murid.data);
  } catch (err) {
    return next(err);
  }
};

library.FindAll = async (req, res, next) => {
  try {
    const {
      nama_lengkap,
      kelas,
      page,
      per_page,
    } = req.query;

    const pagination = { page, per_page };
    const params = {
      nama_lengkap,
      kelas
    };

    const murids = await muridRepository.FindAll(params, pagination);

    if (!murids.status) {
      throw murids.err;
    }

    return success(res, 200, murids.data);
  } catch (err) {
    return next(err);
  }
};

library.FindOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    const murid = await muridRepository.FindOne(id);

    if (!murid.status) {
      throw murid.err;
    }

    return success(res, 200, murid.data);
  } catch (err) {
    return next(err);
  }
};

library.Update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nama_lengkap,
      kelas
    } = req.body;

    const muridData = {
      nama_lengkap,
      kelas
    };

    const murid = await muridRepository.Update(id, muridData);

    if (!murid.status) {
      throw murid.err;
    }

    return success(res, 201, murid.data);
  } catch (err) {
    return next(err);
  }
};

library.Delete = async function (req, res, next) {
  try {
    const { id } = req.params;
    const murid = await muridRepository.Delete(id);

    if (!murid.status) throw murid.err;

    return success(res, 201, murid.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = library;