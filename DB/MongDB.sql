const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mummiesSDC');

const questionModel = mongoose.model('questionModel', new Schema({
  product_id: Number,
  results: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'resultsModel'
  }
}))

const resultsModel = mongoose.model('resultsModel', new Schema({
  question_id: {type: Number, index: true, unique: true},
  question_body: {type: String, maxLength: 1000},
  question_date: Date,
  question_helpfulness: {type: Number, default: 0}
  reported: {type: Boolean, default: false}
  // answers needs to be a key somehow????????
  answers: {
    type: monogoose.Schema.Types.ObjectId,
    ref: 'answersModel'
  }
}))

const answersModel = mongoose.model('answersModel', new Schema({
  id: {type: Number, index: true, unique: true},
  body: {type: String, maxLength: 1000},
  date: Date,
  answerer_name: {type: String, maxLength: 60},
  helpfulness: {type: Number, default: 0},
  photos: [String]
}))