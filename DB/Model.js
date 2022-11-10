const dbconnection = require('../db/index.js');

module.exports = {
  getQuestions: async function getQuestions(ID, count, offset) {
    console.log('inside model: ', ID, count, offset);
    const questions = await dbconnection.query(`
    SELECT question_id, question_body, question_date, asker_name, question_helpfulness
    FROM questions
    WHERE product_id='${ID}' AND reported=false
    ORDER BY question_helpfulness
    LIMIT '${count}'
    OFFSET '${offset}'
    `)
    return questions;
  },

  /*
  ANSWER OBJECT SAMPLE:
  body: null,
  name: null,
  email: null,
  photos: [],
  */

  answer: async function(answer, ID) {
    const unixDate = (new Date()).getTime();
    await dbconnection
      .query(`INSERT INTO answers(question_id, body, date, name, email)
      VALUES('${ID}', '${answer.body}', '${unixDate}', '${answer.name}', '${answer.email}')
      RETURNING id
      `)
      .then(async (answerID) => {
        if (answer.photos.length !== 0) {
          answer.photos.map(async(photoURL) => {
            await dbconnection.query(`
            INSERT INTO photos(answer_id, url)
            VALUES (${answerID.rows[0].id}, '${photoURL}')
            `)
          })
        }
      })
    .catch((err) => {
      console.log(err);
    })
  },

  getAnswers: async function getAnswers(ID) {
    const answers = await dbconnection.query(`
    SELECT a.id, a.body, a.date, a.name, a.helpful,
    json_agg(photos.url) AS photos
    FROM answers AS a
    JOIN photos
    ON a.id = photos.answer_id
    WHERE question_id='${ID}'
    GROUP BY a.id, a.body, a.date, a.name, a.helpful
    ORDER BY helpful desc
    `)
    return answers;
  },

  getPhotos: async function getPhotos(ID) {
    const photos = await dbconnection.query(`
    SELECT *
    FROM photos
    WHERE answer_id='${ID}'
    `)
    return photos;
  },

  helpfulQuestion: async function(ID) {
    await dbconnection.query(`
    UPDATE questions
    SET question_helpfulness = question_helpfulness + 1
    WHERE question_id = '${ID}'
    `)
  },

  reportQuestion: async function(ID) {
    await dbconnection.query(`
    UPDATE questions
    SET reported = true
    WHERE question_id = '${ID}'
    `)
  },

  helpfulAnswer: async function(ID) {
    await dbconnection.query(`
    UPDATE answers
    SET helpful = helpful + 1
    WHERE id = '${ID}'
    `)
  },

  reportAnswer: async function(ID) {
    await dbconnection.query(`
    UPDATE answers
    SET reported = true
    WHERE id = '${ID}'
    `)
  },

  ask: async function(question) {
    // console.log('within the model:', question);
    const unixDate = (new Date()).getTime();
    await dbconnection.query(`
    INSERT INTO questions(product_id, question_body, question_date, asker_name, email)
    VALUES ('${question.product_id}', '${question.body}', '${unixDate}', '${question.name}', '${question.email}')
    `)
    .then(() => {
      console.log('success');
    })
    .catch((err) => {
      console.log(err);
    })
  },

}
