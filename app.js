const express = require("express");

// custom imports
const auth = require("./routes/auth");
const users = require("./routes/users");
const confirmation = require("./routes/confirmation");

const app = express();

app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/confirmation", confirmation);

app.listen(5000, () => {
  console.log("Listening on port 5000...");
});
