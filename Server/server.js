require("dotenv").config();

const connectDb = require("./utils/db");
const express = require("express");
const cookieParser = require("cookie-parser")

const dataRouter = require("./routers/data-router"); 
const authRouter = require("./routers/auth-router"); 


const cors = require("cors");


const app = express();
app.use(cookieParser())

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

// primary router
app.use('/api/', dataRouter);
app.use('/api/auth/', authRouter);


connectDb().then(()=>{
  const PORT= process.env.PORT || 3000;
  app.listen(PORT,()=>{
      console.log("Server is ready at port:",PORT);
  });
});





  


  


  