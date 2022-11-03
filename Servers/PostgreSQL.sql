CREATE SCHEMA questionSchema;

DROP questions IF EXISTS
DROP answers IF EXISTS
DROP photos IF EXISTS

-- id,product_id,body,date_written,asker_name,asker_email,reported,helpful
CREATE TABLE IF NOT EXISTS questions (
  question_id integer PRIMARY KEY NOT NULL,
  product_id integer NOT NULL,
  question_body VARCHAR(1000) NOT NULL,
  question_date DATE,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(60) NOT NULL,
  question_helpfulness integer NOT NULL DEFAULT(0),
  reported boolean DEFAULT 0,
)
-- //id,question_id,body,date_written,answerer_name,answerer_email,reported,helpful
CREATE TABLE IF NOT EXISTS answers (
  id integer PRIMARY KEY NOT NULL,
  question_id integer NOT NULL,
  date DATE,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(60) NOT NULL,
  reported boolean DEFAULT 0,
  helpful integer DEFAULT 0,
  FOREIGN KEY('question_id') REFERENCES questions
)

-- id,answer_id,url
CREATE TABLE IF NOT EXISTS photos (
  id integer PRIMARY KEY NOT NULL,
  answer_id integer NOT NULL,
  url VARCHAR(1000) NOT NULL,
  FOREIGN KEY('answer_id') REFERENCES answers
)