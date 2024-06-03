const express = require("express");
const router = express.Router();

router.get("/chat", (req, res) => {
  const name = req.query.name;
  const room = req.query.room;

  if (name && room) {
    res
      .status(200)
      .send({ response: `Hello ${name}, welcome to the ${room} room.` });
  } else {
    res.status(400).send({ error: "Name and room parameters are required." });
  }
});

module.exports = router;
