const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();
const authenticated = require("./middlewares/authenticated");
const notesRouter = require("./routes/notes");
const usersRouter = require("./routes/users");


app.use(cors({origin: true}));

app.use("/api/notes", authenticated, notesRouter);

app.use("/users", usersRouter);

exports.app = functions.https.onRequest(app);
