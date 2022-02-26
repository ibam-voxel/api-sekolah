const db = require('../../app/models');
/**
 * Cleaning up data in database
 * @return {Promise<void>} Promise resolved or rejected without any return data
 */
const cleanUpDatabase = async () => {
  await db.Murid.destroy({
    where: {},
    force: true,
    truncate: {
      cascade: true
    }
  });
  await db.Bayar.destroy({
    where: {},
    force: true,
    truncate: {
      cascade: true
    }
  });
};

module.exports = {
  cleanUpDatabase
};