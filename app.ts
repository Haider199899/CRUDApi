import express from "express";
import dotenv from "dotenv";
import connection from "./src/db/connect";
import routes from "./src/routes";
import sessionMiddleware from "./src/middleware/sessionMiddleware";
import passport from "./src/middleware/passportMiddleware";
import bodyParser from "body-parser";
// Path for dotnev config
dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
let port =process.env.PORT;
let host = process.env.HOST;
let redis_port=6379;
connection();
routes(app);

app.listen(port, () => {
   console.log(`Server listening at http://${host}:${port}`);
});

