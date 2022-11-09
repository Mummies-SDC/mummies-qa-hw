const router = require('express').Router();
const controllers = require('./controllers.js');

router.get('/qa/questions/:productID', controllers.getQuestions);
router.put('/qa/questions/:questionID/helpful', controllers.helpfulQuestion);
router.put('/qa/questions/:questionID/report', controllers.reportQuestion);
router.put('/qa/answers/:answerID/helpful', controllers.helpfulAnswer);
router.put('/qa/answers/:answerID/report', controllers.reportAnswer);
router.post('/qa/questions', controllers.ask);
router.post('/qa/answer/:questionID', controllers.answer);
// router.get('/answers/:questionID', controllers.getAnswers);
// router.post('/ask', controllers.ask); // PRODUCT ID GOES IN BODY
// router.post('/answer/:questionID', controllers.answer);
// router.put('/question/helpful/:questionID', controllers.helpfulQuestion);
// router.put('/question/report/:questionID', controllers.reportQuestion);
// router.put('/answer/helpful/:answerID', controllers.helpfulAnswer);
// router.put('/answer/report/:answerID', controllers.reportAnswer);

module.exports = router;