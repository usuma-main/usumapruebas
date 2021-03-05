'use strict'

var express = require('express');
var adminController = require('../controllers/admin');

var fs = require('fs'); 

var multer = require('multer'); 
const { deleteKid } = require('../controllers/admin');
  
var storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'upload') 
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now()) 
    } 
}); 
  
var upload = multer({ storage: storage });



var router = express.Router();


router.get("/admin", adminController.singInPanel);
router.post("/admin/login", adminController.login);
router.post("/admin/register", adminController.register);
router.post("/admin/logout", adminController.logout);
router.get("/admin/panel", adminController.adminPanel);

router.get("/admin/editKid", adminController.editKid);
router.post("/admin/editKid",upload.single('image'), adminController.updateKid);

router.delete("/admin/delete/:id", deleteKid);
router.get("/admin/addKid", adminController.addKidPanel);
router.post('/admin/addKid', upload.single('image'), adminController.uploadNewKid);






module.exports = router;