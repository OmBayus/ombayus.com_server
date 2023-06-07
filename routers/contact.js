const router = require("express").Router();
const Contact = require("../models/contact");
const SendMail = require("../utils/sendEmail");
const { authExactor } = require("../utils/middleware");

router.post("/sendMsg", async (req, res) => {
  try {
    if (req.body.msg) {
      return res.json({ error: "You can send one message per hour." });
    }

    const newMsg = new Contact({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    });

    newMsg.save((err) => {
      if (err) {
        return res.json({ error: "error" });
      }
      SendMail(
        "omerbayramcavus@gmail.com",
        "ombayus.com Contact Message",
        newMsg
      );
      res.json(newMsg);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.use(authExactor);

router.get("/getAll", (req, res) => {
  Contact.find({}, (err, items) => {
    if (!err) {
      res.json(items);
    }
  });
});

router.get("/getLength", async (req, res) => {
  var len = await Contact.count();
  res.json({ len });
});

router.get("/getWithPagination", async (req, res) => {
  var len = await Contact.count();

  const resultsPerPage = 5;
  let page = req.query.page >= 1 ? req.query.page : 1;

  page = page - 1;

  Contact.find({})
    .sort({ $natural: -1 })
    .limit(resultsPerPage)
    .skip(resultsPerPage * page)
    .then((results) => {
      return res.status(200).json({
        len,
        page: page + 1,
        results,
      });
    })
    .catch((err) => {
      return res.json([]);
    });
});

router.post("/del", async (req, res) => {
  Contact.findOneAndDelete({ _id: req.body._id })
    .then((item) => {
      if (!item) {
        res.json({ error: "The project has already been deleted." });
        return;
      }
      res.json(item);
    })
    .catch((err) => res.json({ error: err.message }));
});

module.exports = router;
