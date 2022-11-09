const dbconnection = require('../DB/index.js');

module.exports = {
  getQuestions: async function getQuestions(ID, count, offset) {
    console.log('inside model: ', ID, count, offset);
    const questions = await dbconnection`
    SELECT question_id, question_body, question_date, asker_name, question_helpfulness
    FROM questions
    WHERE product_id=${ID} AND reported=false
    ORDER BY question_helpfulness
    LIMIT ${count}
    OFFSET ${offset}
    `
    return questions;
  },

  getAnswers: async function getAnswers(ID) {
    const answers = await dbconnection`
    SELECT a.id, a.body, a.date, a.name, a.helpful,
    json_agg(photos.url) AS photos
    FROM answers AS a
    JOIN photos
    ON a.id = photos.answer_id
    WHERE question_id=${ID}
    GROUP BY a.id, a.body, a.date, a.name, a.helpful
    ORDER BY helpful desc
    `
    return answers;
  },
  /**
   *
  VARIATION 0:
  SELECT *
  FROM answers
  WHERE question_id = ${ID}
  ORDER BY helpful DESC

   VARIATION 1:
   SELECT a.id, a.body, a.date, a.name, a.helpful,
   json_agg(photos.url) AS photos
   FROM answers AS a
   JOIN photos
   ON a.id = photos.answer_id
   WHERE question_id=${ID}
   GROUP BY a.id, a.body, a.date, a.name, a.helpful
   ORDER BY helpful desc

   VARIATION 2:
   SELECT a.id, a.body, a.date, a.name, a.helpful,
   (SELECT json_agg(item)
   FROM (SELECT photos.url FROM photos WHERE answer_id=a.id) item) AS photos
   FROM answers AS a
   WHERE question_id=403468
   */

  getPhotos: async function getPhotos(ID) {
    const photos = await dbconnection`
    SELECT *
    FROM photos
    WHERE answer_id=${ID}
    `
    return photos;
  },

  helpfulQuestion: async function(ID) {
    await dbconnection`
    UPDATE questions
    SET question_helpfulness = question_helpfulness + 1
    WHERE question_id = ${ID}
    `
  },

  reportQuestion: async function(ID) {
    await dbconnection`
    UPDATE questions
    SET reported = true
    WHERE question_id = ${ID}
    `
  },

  helpfulAnswer: async function(ID) {
    await dbconnection`
    UPDATE answers
    SET helpful = helpful + 1
    WHERE id = ${ID}
    `
  },

  reportAnswer: async function(ID) {
    await dbconnection`
    UPDATE answers
    SET reported = true
    WHERE id = ${ID}`
  },

  ask: async function(question) {
    // console.log('within the model:', question);
    const unixDate = (new Date()).getTime();
    await dbconnection`
    INSERT INTO questions(product_id, question_body, question_date, asker_name, email)
    VALUES (${question.product_id}, ${question.body}, ${unixDate}, ${question.name}, ${question.email})
    `
    // .then(() => {
    //   console.log('SUCCESS IN DB');
    // })
  },

  /*
  body: null,
  name: null,
  email: null,
  photos: [],
  */

  answer: async function(answer, ID) {
    // console.log('within the model:', answer)
    const unixDate = (new Date()).getTime();
    await dbconnection`
    INSERT INTO answers(question_id, body, date, name, email)
    VALUES(${ID}, ${answer.body}, ${unixDate}, ${answer.name}, ${answer.email})
    RETURNING id
    `
    .then(async (answerID) => {
      if (answer.photos.length !== 0) {
        answer.photos.map(async(photoURL) => {
          await dbconnection`
          INSERT INTO photos(answer_id, url)
          VALUES (${answerID[0].id}, ${photoURL})
          RETURNING id
          `
          .then(() => {
            // console.log('SUCCESS!');
          })
          .catch((err) => {
            console.log(err);
          })
        })
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Could not post answer to DB');
    })
  },
}
