const express = require('express');
const app = express();

// You MUST pass a port number (e.g. 3000)
app.get("/" , (req , res)=>{
    res.send("Hello setuping the backend of the Shyam metalics")
})

app.listen(3000, () => {
    console.log("Hello keshu");
});
