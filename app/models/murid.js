module.exports = (sequelize, DataTypes) => {
  const Murid = sequelize.define(
    'Murid',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      nama_lengkap: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      kelas: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      paranoid: true,
      timestamps: true,
      underscored: true,
      tableName: 'Murids',
    },
  );
  return Murid;
};