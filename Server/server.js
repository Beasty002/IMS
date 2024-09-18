require("dotenv").config();

const connectDb = require("./utils/db");
const express = require("express");
const dataRouter = require("./routers/data-router"); 


const cors = require("cors");


const app = express();


const corsOptions={
    origin: ["http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  } 
  app.use(cors(corsOptions));
  app.options('*',cors(corsOptions));

  app.use(express.json());
  app.use('/', dataRouter);

  connectDb().then(()=>{
    const PORT= process.env.PORT || 3000;
    app.listen(PORT,()=>{
        console.log("Server is ready");
    });
  });

  


  


  