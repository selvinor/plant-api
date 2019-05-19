'use strict';
const express = require('express');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const bodyParser = require('body-parser');
const Plant = require('../models/plants');
const router = express.Router();
const jsonParser = bodyParser.json();
/* ========== GET/READ ALL ITEMS ========== */
// router.get('/', (req, res) => {
//   return Plant.find()
//     .then(plants => res.json(plants.map(plant => plant.serialize())))
//     .catch(err => {
//       next(err);
//     });
// });

router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;
  let filter = {};

  if (searchTerm) {
    console.log('searchTerm: ', searchTerm);
    filter.crop_name = { $regex: searchTerm, $options: 'i' };
  }

  Plant.find(filter)
    .sort({ updatedAt: 'desc' })
    .then(results => {
      res.json(results); 
    })
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

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:plantId', jsonParser, (req, res, next) => {
  const { plantId } = req.params;
  console.log('plantId', plantId);
  // const updateFields = [ crop_name, 
  //   ph_low, 
  //   ph_high, 
  //   cf_low, 
  //   cf_high, 
  //   ppm700_low, 
  //   ppm700_high, 
  //   day_low_temp, 
  //   day_high_temp, 
  //   night_low_temp, 
  //   night_high_temp, 
  //   min_low_temp, 
  //   max_high_temp
  // ];
  // console.log('updateFields', updateFields);
  const updatePlant = {};
//  const updateFields = ['plant', 'userId'];
  
const updateFields = ['crop_name', 'ph_low', 'ph_high'];
  updateFields.forEach(field => {
    
    if (field in req.body) {

      updatePlant[field] = req.body[field];
    }
  });
  console.log('updatePlant', updatePlant);
  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(plantId)) {
    const err = new Error('The `plantId` is not valid');
    err.status = 400;
    return next(err);
  }
  if (plantId && !mongoose.Types.ObjectId.isValid(plantId)) {
    const err = new Error('The `plantId` is not valid');
    err.status = 400;
    return next(err);
  }

  Plant.findByIdAndUpdate(plantId, updatePlant, { new: true })
    .then(result => {
      if (result) {
        // console.log('put request response is: ', res);
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
  });

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:plantId', (req, res, next) => {
  const { plantId } = req.params;
  //const userId = req.user.id;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(plantId)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

//  Plant.findOneAndDelete({ plantId, userId })
  Plant.deleteOne({ _id: plantId })
    .then(result => {
      if (result) {
        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
