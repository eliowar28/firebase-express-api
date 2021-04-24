const router = require("express").Router();
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const permissions = require("../permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(permissions),
});

const db = admin.firestore();

//Get all
router.route("/").get(async (req, res) => {
  try {
    let notes = await db.collection("notes");
    let notesSnapshot = await notes.get();
    const response = notesSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      content: doc.data().content,
      user : doc.data().user,
      date: new Date(
        parseInt(doc.data().date.seconds) * 1000
      ).toUTCString(),
    }));
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get One
router.route("/:id").get(async (req, res) => {
  try {
    let notes = await db.collection("notes").doc(req.params["id"]);
    let notesSnapshot = await notes.get();
    const response = {
      title: notesSnapshot.data().title,
      content: notesSnapshot.data().content,
      user: notesSnapshot.data().user,
      date: new Date(
        parseInt(notesSnapshot.data().date.seconds) * 1000
      ).toUTCString(),
    };
    res.status(200).send(response);
  } catch (err) {
    res.status(404).json({ message: "Document not found" });
  }
});

//Delete
router.route("/:id").delete(async (req, res) => {
  try {
    let notes = await db.collection("notes").doc(req.params["id"]).delete();
    res.status(200).send({ message: "Document successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//create
router.route("/").post(async (req, res) => {
  try {
    await db.collection("notes").doc(uuidv4()).create({
      user: res.locals.email,
      title: req.body.title,
      content: req.body.content,
      date: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({ message: "Note created successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update
router.route("/:id").put(async (req, res) => {
  try {
    let note = await db.collection("notes").doc(req.params["id"]);
    let noteUpdated = await note.update(
      {...req.body}
    )
    res.status(200).send(noteUpdated);
  } catch (err) {
    res.status(404).json({ message: "Document not found" });
  }
});


module.exports = router;
