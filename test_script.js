const pg = require("pg");
const settings = require("./settings"); // settings.json

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

const name = process.argv.slice(2)[0];

client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }
  client.query("SELECT * FROM famous_people WHERE first_name = $1 OR last_name = $2", [name, name], (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    findPeople(name, result)
    client.end();
  });
});

function findPeople (name, result) {
    console.log(`Found ${result.rows.length} people by the name '${name}':`);
    result.rows.forEach((name, index) => {
        console.log(`-${index + 1}: ${name.first_name} ${name.last_name}, born '${name.birthdate.toLocaleDateString()}'`);
    })
}
