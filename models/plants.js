'use strict';

const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  crop_name: { type: String, required: true },
  ph_low: { type: Number, required: true },
  ph_high: { type: Number, required: true },
  cf_low: { type: Number, required: true },
  cf_high: { type: Number, required: true },
  ppm700_low: { type: Number, required: true },
  ppm700_high: { type: Number, required: true },
  day_low_temp: { type: Number, required: true },
  day_high_temp:{ type: Number, required: true },
  night_low_temp:{ type: Number, required: true },
  night_high_temp:{ type: Number, required: true },
  min_low_temp: { type: Number, required: true },
  max_high_temp:{ type: Number, required: true }
});

plantSchema.methods.serialize = function() {
  return {
    crop_name: this.crop_name || '',
    ph_low: this.ph_low || '',
    ph_high: this.ph_high || '',
    cf_low: this.cf_low || '',
    cf_high: this.cf_high || '',
    ppm700_low: this.ppm700_low || '',
    ppm700_high:  this.ppm700_high || '',
    day_low_temp:  this.day_low_temp || '',
    day_high_temp: this.day_high_temp || '',
    night_low_temp: this.night_low_temp || '',
    night_high_temp: this.night_high_temp || '',
    min_low_temp:  this.min_low_temp || '',
    max_high_temp: this.max_high_temp || ''
  };
};

// Add `createdAt` and `updatedAt` fields
PlantSchema.set('timestamps', true);


plantSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.location.$init;
  }
});

plantSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  }
});


module.exports = mongoose.model('Plant', plantSchema);