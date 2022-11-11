require('dotenv').config();
const client = require('../db/index.js');
const dbconnection = require('../db/index.js');
const models = require('../db/model.js');

module.exports = {
  getQuestions: function getQuestions(req, res) {
    const { productID } = req.params;
    let {count, page} = req.query;
    count = count || 5;
    page = page || 1;
    let offset = page * count - count
    models.getQuestions(productID, count, offset)
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Could not get questions from DB');
    })
  },

  helpfulQuestion: async function(req, res) {
    const {questionID} = req.params;
    if (!questionID) {
      console.log('Question ID required');
      res.status(400).send('No Question ID');
    }
    await models.helpfulQuestion(questionID)
    .then((result) => {
      console.log(result);
      res.send('Successfully incremented helpfulness of question');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Could not update helpfulness of question :(');
    });
  },

  reportQuestion: async function(req, res) {
    const {questionID} = req.params;
    await models.reportQuestion(questionID)
      .then((result) => {
        console.log(result);
        res.send('Successfully reported question');
    })
    .catch((err) => {
      res.status(500);
      res.send('Could not report question to DB');
    });
  },

  helpfulAnswer: function(req, res) {
    const {answerID} = req.params;
    models.helpfulAnswer(answerID)
      .then(() => {
        res.send('Succesfully incremented helpfulness');
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('could not update helpfulness of answer');
      });
  },

  reportAnswer: async function(req, res) {
    const {answerID} = req.params;
    if (!answerID) {
      res.status(400).send('No answer ID attached');
    }
    console.log('answerID', answerID);
    await models.reportAnswer(answerID)
      .then(() => {
        res.send('successfully reported answer');
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Could not report answer to DB');
      });
  },

  ask: async function(req, res) {
    if (Object.keys(req.body).length === 0) {
      res.status(400).send('No body attached');
    }
    // console.log('req body upon receipt: ', req.body);
    await models.ask(req.body)
      .then((results) => {
        res.send('Succesfully posted question into DB');
      })
      .catch((err) => {
        console.log(err, 'request body: ', req.body);
        res.status(500).send('Failed to post answer');
      });
  },

  answer: async function(req, res) {
    // if (Object.keys(req.body).length === 0) {
    //   res.status(400).send('No answer attached to request');
    // }
    const answerBody = req.body;
    const { questionID } = req.params;

    models.answer(answerBody, questionID)
      .then((results) => {
        console.log('results upon exiting model: ', results);
        res.send('Successfully uploaded answer');
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Something went wrong :(');
      });
  },
};
