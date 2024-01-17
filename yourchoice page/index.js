const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/fist_project");

const express = require('express');
const app = express();
const path = require('path')




// app.use(express.static(path.join(__dirname,'1adminpropertice')));
app.use(express.static(path.join(__dirname, "2homeproperties")));

app.use(express.static(path.join(__dirname, "1adminproperties")));

//----------user page----------------
const router = require('./router/userRouter')

app.use("/", router);
//-----------admin page----------------

const adminrouter = require('./router/adminRouter')

app.use('/', adminrouter);


//-----asets------------------



//app.use(express.static(path.join(__dirname,"1adminpropertice")));


const port = 9999;
app.listen(port, () => {
    console.log(`surver port http://localhost:${port}`);
})


