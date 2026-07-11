const mongoose = require('mongoose');

function createModel(modelName, mongooseSchema, collectionName) {
  let mongooseModel;
  try {
    mongooseModel = mongoose.model(modelName, mongooseSchema, collectionName);
  } catch (e) {
    mongooseModel = mongoose.model(modelName);
  }

  return new Proxy({}, {
    get(target, prop) {
      return mongooseModel[prop] ? mongooseModel[prop].bind(mongooseModel) : undefined;
    }
  });
}

module.exports = { createModel };
