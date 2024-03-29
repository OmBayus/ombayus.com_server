const router = require("express").Router();
const Traffic = require("../models/traffic");
const geoip = require("geoip-lite");
const { authExactor } = require("../utils/middleware");

router.post("/send", async (req, res) => {
  try {
    const origins =
      process.env.NODE_ENV !== "production"
        ? [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
          ]
        : ["https://www.ombayus.com", "https://admin.ombayus.com"];
    if (origins.includes(req.headers.origin)) {
      var ip =
        process.env.NODE_ENV !== "production"
          ? "1.1.1.1"
          : req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      if (ip) {
        const trafficmod = await Traffic.findOne({ name: "Traffic" });
        const traffic = {
          name: "Traffic",
          country: trafficmod.country,
          logins: trafficmod.logins,
          lastLogins: trafficmod.lastLogins,
        };
        var geo = geoip.lookup(ip);
        if (!geo) {
          return res.json(false);
        }
        if (traffic.country[geo.country]) {
          traffic.country[geo.country] += 1;
        } else {
          traffic.country[geo.country] = 1;
        }

        if (traffic.lastLogins.length > 10) {
          traffic.lastLogins.shift();
        }

        traffic.lastLogins.push({
          ip: ip + " ( " + geo.country + "/" + geo.city + " )",
          date: new Date().toString(),
        });

        if (traffic.logins[new Date().toLocaleDateString()]) {
          traffic.logins[new Date().toLocaleDateString()] += 1;
        } else {
          traffic.logins[new Date().toLocaleDateString()] = 1;
        }

        Traffic.findOneAndUpdate({ name: "Traffic" }, traffic, {
          new: true,
        }).then((t) => {});
        return res.json(true);
      }
    }
    res.json(false);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.use(authExactor);

router.get("/get", async (req, res) => {
  const trafficmod = await Traffic.findOne({ name: "Traffic" });
  res.json(trafficmod);
});

// router.post("/create",(req,res)=>{
//     const traffic = new Traffic({
//         name:'Traffic',
//         country: { TR: 1 },
//         logins: { '19.10.2021': 1 },
//         lastLogins: []
//       })
//     traffic.save().then((data)=>res.json(data))
// })

module.exports = router;
