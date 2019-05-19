'use strict';
const express = require('express');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const Plant = require('../models/plants');
const router = express.Router();

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res) => {
  return Plant.find()
    .then(plants => res.json(plants.map(plant => plant.serialize())))
    .catch(err => {
      next(err);
    });
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Plant.findOne({ _id: id })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
  if (!req.body) {
    const err = new Error('Missing `plant` in request body');
    err.status = 400;
    return next(err);
  }

  Plant.create(req.body).then(result => {
    res
      .location(`${req.originalUrl}/${result.id}`)
      .status(201)
      .json(result);
  })
    .catch(err => {
      next(err);
    });
});


module.exports = router;
