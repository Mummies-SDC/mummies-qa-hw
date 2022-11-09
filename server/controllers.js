require('dotenv').config();
const client = require('../DB/index.js');
const dbconnection = require('../DB/index.js');
const models = require('../db/Model.js');

module.exports = {
  getQuestions: async function getQuestions(req, res) {
    const { productID } = req.params;
    const {count, page} = req.query;
    const offset = page * count - count;
    // console.log('count: ', count, 'page: ', offset, 'productID: ', productID);

    let responseObj = [];

    await models.getQuestions(productID, count, offset.toString())
      .then((results) => {
        responseObj = results;
      })
      .catch((err) => {
        res.status(501);
        console.log(err);
        res.send(':(');
      })
      .then(() => {
        // console.log('total object: ', responseObj);
        responseObj.map((each) => {
        each.question_date = new Date(each.question_date * 1);
        })
      })
      .then(() => {
        return Promise.all(responseObj.map(async (question) => {
          let results = await models.getAnswers(question.question_id)
          if (results.length === 0) {
            question.answers = {};
          } else {
            let answers = {};
            results.forEach((element) => {
              // console.log('element should have photos: ', element);
              let shapeup = {
                id: element.id,
                body: element.body,
                name: element.name,
                date: new Date(element.date * 1),
                helpfulness: element.helpful,
                photos: element.photos
              };
              answers[element.id] = shapeup;
            })
            question.answers = answers;
          }
        }))
      })
      .then(() => {
        // console.log('final output: ', responseObj);
        res.send({
          'product_id': productID,
          'results': responseObj
        });
      })
      .catch((err) => {
        console.log('HERE IS THE ERROR: ',err);
        res.status(500).send('could not get something from DB');
      })
    },

  helpfulQuestion: async function(req, res) {
    const {questionID} = req.params;
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

  helpfulAnswer: async function(req, res) {
    const {answerID} = req.params;
    await models.helpfulAnswer(answerID)
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
    // console.log('req body upon receipt: ', req.body);
    await models.ask(req.body)
      .then((results) => {
        res.send('Succesfully posted question into DB');
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Failed to post answer');
      });
  },

  answer: async function(req, res) {
    const answerBody = req.body;
    const { questionID } = req.params;
    await models.answer(answerBody, questionID)
      .then((results) => {
        // console.log(results);
        res.send('Successfully uploaded answer');
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Something went wrong :(');
      });
  }
  // },

  // getAnswers(req, res) {
  //   const { questionID } = req.params;

  //   const answerURL = `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/qa/questions/${questionID}/answers`;

  //   axios.get(answerURL, config)
  //     .then((results) => {
  //       console.log('init answer query successful', results.data);
  //       res.send(results.data);
  //     })
  //     .catch((err) => {
  //       console.log('error getting answers from server', err);
  //       res.status(500).send('Could not get results from server');
  //     });
  // },

  // ask(req, res) {
  //   const questionDetails = req.body;
  //   console.log(req.body);

  //   const askURL = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/qa/questions';

  //   axios.post(askURL, questionDetails, config)
  //     .then(() => {
  //       res.send('GREAT SUCCESS');
  //     })
  //     .catch((err) => {
  //       console.log('Something went wrong with pOsTiNg', err);
  //       res.status(400);
  //       res.send('Could not upload your question to the database');
  //     });
  // },

  // answer(req, res) {
  //   const answerDetails = req.body;
  //   const { questionID } = req.params;
  //   console.log('answer details: ', answerDetails);
  //   console.log('questionID: ', questionID);

  //   const answerURL = `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/qa/questions/${questionID}/answers`;

  //   axios.post(answerURL, answerDetails, config)
  //     .then(() => {
  //       res.send('GREAT SUCCESS ANSWERING');
  //     })
  //     .catch((err) => {
  //       console.log(err.data, 'Could not create answer in DB 😔');
  //       res.body(err.data);
  //       res.status(400).send('Could not submit answer: ');
  //     });
  // },

  // helpfulQuestion(req, res) {
  //   const { questionID } = req.params;
  //   const helpfulURL = `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/qa/questions/${questionID}/helpful`;

  //   axios.put(helpfulURL, null, config)
  //     .then(() => {
  //       console.log('GREAT SUCCESS');
  //       res.send(`Successfully incremented helpful rating of ${questionID}`);
  //     })
  //     .catch((err) => {
  //       console.log(err, 'Something went wrong with updating helpfulness');
  //       res.send('There is an issue with incrementing helpfulness');
  //     });
  // },

  // reportQuestion(req, res) {
  //   const { questionID } = req.params;
  //   const reportQuestionURL = `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/qa/questions/${questionID}/report`;

  //   axios.put(reportQuestionURL, null, config)
  //     .then(() => {
  //       console.log('GREAT SUCCESS REPORTING');
  //       res.send(`Successfully Reported Question ${questionID}!`);
  //     })
  //     .catch((err) => {
  //       console.log(err, 'Could not successfully report question');
  //       res.send('There was an issue with reporting this question');
  //     });
  // },

  // helpfulAnswer(req, res) {
  //   const { answerID } = req.params;
  //   const helpfulAnswerURL = `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/qa/answers/${answerID}/helpful`;

  //   axios.put(helpfulAnswerURL, null, config)
  //     .then(() => {
  //       console.log('VERY HELPFUL ANSWER!');
  //       res.send('Successfully declared helpfulness');
  //     })
  //     .catch((err) => {
  //       console.log(err, `Something went wrong with updating helpfulness of answer ${answerID}`);
  //       res.send(`Could not increment helpfulness rating of ${answerID}`);
  //     });
  // },

  // reportAnswer(req, res) {
  //   const { answerID } = req.params;
  //   const reportAnswerURL = `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/qa/answers/${answerID}/report`;

  //   axios.put(reportAnswerURL, null, config)
  //     .then(() => {
  //       console.log('GREAT SUCCESS - ANSWER REPORTED');
  //       res.send(`Successfully Reported Answer ${answerID}`);
  //     })
  //     .catch((err) => {
  //       console.log(err, 'Something went wrong with reporting');
  //       res.send(`Could not successfully report ${answerID}`);
  //     });
  // },
};
