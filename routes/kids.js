'use strict'

var express = require('express');
var KidController = require('../controllers/kids');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/kids' });
const schedule = require("node-schedule");






router.get("/", KidController.getLandingPage);
router.get("/sponsor", KidController.getKidsEn);
router.post("/", KidController.emailsubscription);
router.get('/apadrina', KidController.getKids);
router.get('/kid/:id', KidController.getKid);
router.post('/kidGodParent/:id', KidController.updateNewGodParent);
router.post("/confirmPayment/", KidController.confirmPayment);
router.post("/api/deleteGodParent/:id", KidController.deleteGodParent);
router.get('/api/send-email/:kidId', KidController.sendEmail);
router.post("/api/getSubscription", KidController.getSubscription);
router.get("/thanks", KidController.showThanksMessage);
router.get("/avisoDePrivacidad", (req, res) => {
    res.sendFile(__dirname + "/avisoDePrivacidad.pdf");
});

var j = schedule.scheduleJob("0 0 * * 0 ", function() {
    console.log("A minute has passed");
    KidController.recurrentFunction();
});


module.exports = router;