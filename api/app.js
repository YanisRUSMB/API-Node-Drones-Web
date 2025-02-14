const express = require('express');

const app = express ();
app.use(express.json());

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});


app.get('/api/hello', (request, response) => {
    const message = {
        message: "Hello World!"
    };
    
    response.send(message);
 });