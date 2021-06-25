const express = require("express");

// custom imports
const auth = require("./routes/auth");
const users = require("./routes/users");

const app = express();

app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/users", users);

app.listen(5000, () => {
  console.log("Listening on port 5000...");
});
