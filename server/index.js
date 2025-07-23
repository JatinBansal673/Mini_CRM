const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

require("./utils/passportConfig")(passport);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
const MongoStore = require("connect-mongo");
app.set("trust proxy", 1); // trust first proxy


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: process.env.NODE_ENV === "production", // true only if using HTTPS
    httpOnly: true,
    sameSite:"None", // "None" only if using HTTPS
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Mini CRM backend is running ✅");
});

app.use("/api/customers", require("./routes/customers"));
app.use("/api/campaigns", require("./routes/campaigns"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/vendor", require("./routes/vendor"));


mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("DB Connected Successfully");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("DB Connection Failed:", err);
    process.exit(1);
  });


