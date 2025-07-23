const express = require("express");
const passport = require("passport");
const router = express.Router();

// Initiate Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Handle Google OAuth Callback
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    console.log("✅ Google login success:", req.user);
    // console.log(process.env.REACT_APP_FRONTEND_BASE_URL);
    
    res.redirect(`${process.env.REACT_APP_FRONTEND_BASE_URL}/dashboard?loggedIn=true`);
  }
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(`${process.env.REACT_APP_FRONTEND_BASE_URL}`);
  });
});

// Check login session
router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Not logged in" });
  }
});

module.exports = router;
