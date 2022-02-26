const addForeignKeys = (queryInterface, Sequelize, tables = [], t) => tables.map((table) => {
  const [result] = table.column.map((column, index) => {
    const type = table.type ? Sequelize[table.type[index]] : Sequelize.UUID;

    return queryInterface.changeColumn(
      table.table,
      column,
      {
        type,
        references: {
          model: table.refTable[index],
        },
      },
      { transaction: t },
    );
  });
  return result;
});

const removeForeignKeys = (queryInterface, tables = [], t) => tables.map(async (table) => {
  await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
  const foreignKeys = await queryInterface.getForeignKeysForTables([
    table.table,
  ]);

  const [output] = await Promise.all(foreignKeys[table.table].map(async (name) => {
    return await queryInterface.removeConstraint(table.table, name, {
      transaction: t,
    });
  }));

  await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
  return output;
});

module.exports = { addForeignKeys, removeForeignKeys };
