const dbconnection = require('../db/index.js');

module.exports = {
  getQuestions: async function getQuestions(ID, count, offset) {
  return dbconnection.query(`
    SELECT q.question_id, q.question_body, q.question_date, q.asker_name, q.question_helpfulness,
      (JSON_BUILD_OBJECT(a.id, JSON_BUILD_OBJECT(
        'id', a.id, 'body', a.body, 'date', to_timestamp(a.date), 'name', a.name, 'helpfulness', a.helpful, 'photos',
        (JSON_AGG(p.url))
        ))
      ) AS answers
    FROM questions q
    LEFT JOIN answers a
    ON q.question_id = a.question_id
    LEFT JOIN photos p
    ON a.id = p.answer_id
    WHERE product_id='${ID}' AND q.reported=false
    GROUP BY q.question_id, a.id
    ORDER BY question_helpfulness DESC
    LIMIT '${count}'
    OFFSET '${offset}'
    `)
    .then((results) => {
      return results.rows;
    })
  },

  getAnswers: async function getAnswers(ID) {
    return dbconnection.query(`
    SELECT a.id, a.body, a.date, a.name, a.helpful,
    json_agg(photos.url) AS photos
    FROM answers AS a
    JOIN photos
    ON a.id = photos.answer_id
    WHERE question_id=3333333
    GROUP BY a.id, a.body, a.date, a.name, a.helpful
    ORDER BY helpful desc
    `)
    .then((results) => {
      return results.rows;
    })
    .catch((err) => {
      return err;
    })
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
