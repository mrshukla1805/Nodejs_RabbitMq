const express = require("express");
const app = express();
const PORT = 5001;
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
    } catch (ex) {
        console.error(ex);
    }
}

app.get("/send",async (req,res)=> {
    const sampleData = {
        name: "Nagesh Shukla",
        company: "Searching !!!"
    }
    await channel.sendToQueue("rabbit", Buffer.from(JSON.stringify(sampleData)))

    return res.send("done");
});


app.listen(PORT, () => {
    console.log(`Server at ${PORT}`);
});
