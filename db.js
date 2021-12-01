const Client = require("pg").Client;


const client = new Client({ database: "perntodo" });
client.connect();
module.exports = client;


