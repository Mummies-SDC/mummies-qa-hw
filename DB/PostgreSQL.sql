DROP DATABASE IF EXISTS "sdcDB";
CREATE DATABASE "sdcDB";
\c "sdcDB";

-- id,product_id,body,date_written,asker_name,asker_email,reported,helpful
CREATE TABLE IF NOT EXISTS questions (
  question_id SERIAL PRIMARY KEY NOT NULL,
  product_id integer NOT NULL,
  question_body VARCHAR(1000) NOT NULL,
  question_date BIGINT NOT NULL,
  asker_name VARCHAR(60) NOT NULL,
  email VARCHAR(60) NOT NULL,
  reported boolean DEFAULT false,
  question_helpfulness integer NOT NULL DEFAULT 0
);

-- //id,question_id,body,date_written,answerer_name,answerer_email,reported,helpful
CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY NOT NULL,
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

-- id,answer_id,url
CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY NOT NULL,
  answer_id integer NOT NULL,
  url VARCHAR(1000) NOT NULL,
  CONSTRAINT fk_answer
    FOREIGN KEY(answer_id)
      REFERENCES answers(id)
);

COPY questions
FROM '/Users/hectorwong/Hack Reactor/SDC/questions.csv'
DELIMITER ',' CSV HEADER;

COPY answers
FROM '/Users/hectorwong/Hack Reactor/SDC/answers.csv'
DELIMITER ',' CSV HEADER;

COPY photos
FROM '/Users/hectorwong/Hack Reactor/SDC/answers_photos.csv'
DELIMITER ',' CSV HEADER;

CREATE INDEX product_id_index
ON questions(product_id);

CREATE INDEX question_id_index
ON answers(question_id);

CREATE INDEX answer_id_index
ON photos(answer_id);

ALTER SEQUENCE questions_question_id_seq RESTART WITH 3518964;
ALTER SEQUENCE answers_id_seq RESTART WITH 6879307;
ALTER SEQUENCE photos_id_seq RESTART WITH 2063760;