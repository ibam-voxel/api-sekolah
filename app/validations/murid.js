const {
  body, param, query,
} = require('express-validator');

const Create = () => [
  body('nama_lengkap').exists().notEmpty().isString(),
  body('kelas').exists().notEmpty().isString(),
];

const FindAll = () => [
  query('nama_lengkap').optional().notEmpty().isString(),
  query('kelas').optional().notEmpty().isString(),
  query('page').optional().notEmpty().isInt({ min: 1 }),
  query('per_page').optional().notEmpty().isInt({ min: 1 }),
];

const FindOne = () => [
  param('id')
    .exists()
    .notEmpty()
    .isUUID()
    .withMessage('tolong input dengan benar murid_id'),
];

const Delete = () => [
  param('id')
    .optional()
    .notEmpty()
    .isUUID()
    .withMessage('tolong input dengan benar murid_id'),
];

const Update = () => [
  param('id')
    .exists()
    .notEmpty()
    .isUUID()
    .withMessage('tolong input dengan benar murid_id'),
  body('nama_lengkap').exists().notEmpty().isString(),
  body('kelas').exists().notEmpty().isString(),
];

module.exports = {
  Create,
  FindAll,
  FindOne,
  Update,
  Delete
};