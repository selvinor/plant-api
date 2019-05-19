'use strict';

const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');

const Plant = require('../models/plants');
const User = require('../models/users');

const seedPlants = require('../db/seed/plants');
const seedUsers = require('../db/seed/users');

console.log(`Connecting to mongodb at ${DATABASE_URL}`);
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.info('Dropping Database');
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    console.info('Seeding Database');
    return Promise.all([

      Plant.insertMany(seedPlants),
      Plant.createIndexes(),

      User.insertMany(seedUsers),
      User.createIndexes()

    ]);
  })
  .then(() => {
    console.info('Disconnecting');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });
