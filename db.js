const { Pool, Client } = require("pg");
const pool = new Pool({
  user: "ebsviwiiwjqatb",
  host: "ec2-52-23-86-208.compute-1.amazonaws.com",
  database: "datehj637a2bh2",
  password: "5dd573e0b549db2a5d97f47793a28d624ddb4cd4cd19f9e31a860d85948a7926",
  port: 5432,
});
module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
