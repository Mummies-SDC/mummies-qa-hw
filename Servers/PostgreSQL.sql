CREATE SCHEMA questionSchema;

DROP questions IF EXISTS;
DROP answers IF EXISTS;
DROP photos IF EXISTS;

-- id,product_id,body,date_written,asker_name,asker_email,reported,helpful
CREATE TABLE IF NOT EXISTS questions (
  question_id integer PRIMARY KEY NOT NULL,
  product_id integer NOT NULL,
  question_body VARCHAR(1000) NOT NULL,
  question_date BIGINT NOT NULL,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(60) NOT NULL,
  reported boolean DEFAULT false,
  question_helpfulness integer NOT NULL DEFAULT 0
);

COPY questions
FROM '/Users/hectorwong/Hack Reactor/SDC/questions.csv'
DELIMITER ',' CSV HEADER;

-- //id,question_id,body,date_written,answerer_name,answerer_email,reported,helpful
CREATE TABLE IF NOT EXISTS answers (
  id integer PRIMARY KEY NOT NULL,
  question_id integer NOT NULL,
  body VARCHAR(1000),
  date BIGINT,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(60) NOT NULL,
  reported boolean DEFAULT false,
  helpful integer DEFAULT 0,
  CONSTRAINT fk_question
    FOREIGN KEY(question_id)
      REFERENCES questions(question_id)
);

COPY questions
FROM '/Users/hectorwong/Hack Reactor/SDC/answers.csv'
DELIMITER ',' CSV HEADER;

-- id,answer_id,url
CREATE TABLE IF NOT EXISTS photos (
  id integer PRIMARY KEY NOT NULL,
  answer_id integer NOT NULL,
  url VARCHAR(1000) NOT NULL,
  CONSTRAINT fk_answer
    FOREIGN KEY(answer_id)
      REFERENCES answers(id)
);

COPY photos
FROM '/Users/hectorwong/Hack Reactor/SDC/photos.csv'
DELIMITER ',' CSV HEADER;