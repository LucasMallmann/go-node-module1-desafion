const express = require("express");
const nunjucks = require("nunjucks");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

nunjucks.configure("views", {
  watch: true,
  express: app,
  autoescape: true
});

app.set("view engine", "njk");

const checkAgeMiddleware = (req, res, next) => {
  const { age } = req.query;
  if (!age) return res.redirect("/");
  return next();
};

app.get("/", (req, res) => {
  return res.render("home");
});

app.get("/minor", checkAgeMiddleware, (req, res) => {
  const { age } = req.query;
  return res.render("minor", { age });
});

app.get("/major", checkAgeMiddleware, (req, res) => {
  const { age } = req.query;
  return res.render("major", { age });
});

app.post("/check", (req, res) => {
  const age = req.body.age;
  if (age >= 18) {
    return res.redirect(`/major?age=${age}`);
  } else {
    return res.redirect(`/minor?age=${age}`);
  }
});

app.listen(3001);
