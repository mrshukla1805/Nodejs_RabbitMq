const express = require("express");
const app = express();
const PORT = 5002;
const amqp = require("amqplib");
const bp = require("body-parser");
var channel, connection;

connect();
async function connect() {
    try {
        const Server = "amqp://localhost:5672";
        connection = await amqp.connect(Server);
        channel = await connection.createChannel();
        await channel.assertQueue("rabbit");
        channel.consume("rabbit", data => {
            console.log(`Received data at 5002: ${Buffer.from(data.content)}`);
            channel.ack(data);
        });
    } catch (ex) {
        console.error(ex);
    }
}

app.listen(PORT, () => {
    console.log(`Server at ${PORT}`);
});
