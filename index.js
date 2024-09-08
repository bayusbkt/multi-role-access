import express from "express";
import cors from "cors";
import session from "express-session";
import sequelizeStore from "connect-session-sequelize";
import dotenv from "dotenv";
import { connection, sequelize } from "./Config/Database.js";
import router from "./Routes/Api.js";

dotenv.config();
const app = express();
const sessionStore = sequelizeStore(session.Store)
const store = new sessionStore({
  db: sequelize
})

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
      maxAge: 1000 * 60 * 15
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(router);

// store.sync();
connection();
app.listen(process.env.PORT, () => {
  console.log(`App Running on http://localhost:${process.env.PORT}`);
});
