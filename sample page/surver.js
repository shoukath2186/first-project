const mongoose=require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/user_management")

const express=require('express');
const app=express()



const port=5550;

const rout=require('./router/router')

app.use('/',rout)


app.listen(port,()=>{
  console.log(`surver runnimg http://localhost:${port}`);
});





