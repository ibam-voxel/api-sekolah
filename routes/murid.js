const express = require('express');

const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/murid');
const murid = require('../app/controllers/murid');

router.post(
  '/',
  validationRules.Create(),
  validate,
  murid.Create,
);

router.get(
  '/',
  validationRules.FindAll(),
  validate,
  murid.FindAll,
);

router.get(
  '/:id',
  validationRules.FindOne(),
  validate,
  murid.FindOne,
);

router.patch(
  '/:id',
  validationRules.Update(),
  validate,
  murid.Update,
);

router.delete(
  '/:id',
  validationRules.Delete(),
  validate,
  murid.Delete,
);

const routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;