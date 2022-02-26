module.exports = (sequelize, DataTypes) => {
  const Bayar = sequelize.define(
    'Bayar',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      nomor_invoice: DataTypes.STRING,
      tanggal: DataTypes.DATE,
      murid_id: DataTypes.UUID,
      cara_bayar: DataTypes.ENUM('transfer', 'tunai', 'potong-tabungan'),
      diskon: DataTypes.STRING,
      nominal: DataTypes.STRING,
      keterangan: {
        type: DataTypes.STRING,
        defaultValue: null,
      }
    },
    {
      paranoid: true,
      timestamps: true,
      underscored: true,
      tableName: 'Bayars',
    },
  );
  Bayar.associate = function (models) {
    // associations can be defined here
    Bayar.belongsTo(models.Murid, { foreignKey: 'murid_id' });
  };
  return Bayar;
};