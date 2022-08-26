import express from "express";
//import dotenv from "dotenv";
import connection from "./src/db/connect";
import routes from "./src/routes";
import sessionMiddleware from "./src/middleware/sessionMiddleware";
import passport from "./src/middleware/passportMiddleware";
import bodyParser from "body-parser";
//dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
let port = 3000;
let host = 'localhost';

app.listen(port, host, () => {
   console.log(`Server listening at http://${host}:${port}`);
   connection();
   routes(app);
});
