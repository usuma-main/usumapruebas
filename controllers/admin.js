const Kids = require("../models/Kids");
const Admin = require("../models/Admin");
const imgModel = require('../models/Image');
const passport = require("passport");
const path = require('path');

const fs = require('fs');


passport.use(Admin.createStrategy());

passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());




var controller = {

  singInPanel: (req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect("/admin/panel");
    } else {
      return res.render("adminLogin");
    }
  },

  login: (req, res) => {
    const admin = new Admin({
      username: req.body.username,
      password: req.body.password
    });
    req.login(admin, function (err) {
      if (err) {
        console.log("Error login ", err);
        return res.redirect("/admin");
      } else {
        passport.authenticate("local")(req, res, function () {
          return res.redirect("/admin/panel");
        });
      }
    });

  },

  logout: (req, res) => {
    req.logout();
    res.redirect("/admin");
  },

  register: (req, res) => {
    Admin.register({ username: req.body.username }, req.body.password, function (err, user) {
      if (err) {
        console.log("Error ", err);
        return res.redirect("/admin");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/admin/panel");
        });
      }
    })
  },


  addKidPanel: (req, res) => {
    if (req.isAuthenticated()) {
      return res.render("adminAddKid");
    } else {
      return res.redirect("/admin");
    }
  },

  adminPanel: (req, res) => {
    if (!req.isAuthenticated()) {
      return res.redirect("/admin");
    }

    let query;
    let schoolGrade = req.query.schoolGrade;
    const hasGodParent = req.query.hasGodParent;

    if (schoolGrade) {
      if (schoolGrade === "all") {
        schoolGrade = { $ne: null };
      } else {
        query = Kids.find({ schoolGrade: schoolGrade });
      }
    } else {
      query = Kids.find({});
    }

    if (hasGodParent === "no") {
      query = Kids.find({ schoolGrade: schoolGrade, godparent: null });
    } else if (hasGodParent == "yes") {
      query = Kids.find({ schoolGrade: schoolGrade, godparent: { $ne: null } });
    } else if (hasGodParent === "all") {
      query = Kids.find({ schoolGrade: schoolGrade });
    }
    //Find
    query
      .sort("-_id")
      .lean()
      .exec((err, kids) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Something go wrong",
          });
        } else {
          res.render("adminManagement", { kids, godParent: hasGodParent, schoolGrade: schoolGrade });
        }
      });
  },

  uploadNewKid: (req, res) => {

    if (!req.isAuthenticated()) {
      return res.redirect("/admin");
    }

    if (!req.file) {
      res.status(400).render("error", { code: "400", message: "No se encontro imágen del nuevo estudiante" });
    }

    let file_ext = req.file.mimetype;
      if (
        file_ext != "image/png" &&
        file_ext != "image/jpg" &&
        file_ext != "image/jpeg" &&
        file_ext != "image/gif"
      ) {
        return res.status(404).render("error", { code: "400", message: "El archivo que se intentó subir no es el formato correcto" });
      }

      try {
        var image = {
          name: req.body.name,
          data: fs.readFileSync(path.join('./upload/' + req.file.filename)),
          contentType: 'image/jpg'
        };
    
        const kid = new Kids({
          name: req.body.name,
          lastname: req.body.lastname,
          schoolGrade: req.body.schoolGrade,
          birthday: req.body.birthday,
          gender: req.body.gender,
          Hobbies: req.body.Hobbies,
          Vision: req.body.Vision,
          signUpDate: Date.now(),
          image: image,
          noticeOfPrivacy: req.body.noticeOfPrivacy === "on" ? true : false,
          parents: {
            familiarName: req.body.familiarName,
            cellphone: req.body.cellphone,
            father: req.body.father,
            fatherCellphone: req.body.fatherCellphone,
            fatherSchoolGrade: req.body.fatherSchoolGrade,
            mother: req.body.mother,
            motherCellphone: req.body.motherCellphone,
            motherSchoolGrade: req.body.motherSchoolGrade,
            sons: req.body.sons,
          }
        });
        kid.save(function (err) {
          if (err) {
            console.log(err)
            return res.status(503).render("error", { code: "503", message: "Hubo un error al subir la información favor de intentarlo de nuevo" });
          } else {
            return res.redirect("/admin");
          }
        })
      } catch (error) {
        return res.status(503).render("error", { code: "503", message: "Hubo un error al subir la información favor de intentarlo de nuevo" });
      }

    
  },


  editKid: (req, res) => {
    if (!req.isAuthenticated()) {
      return res.redirect("/admin");
    }

    const kidId = req.query.Id
    console.log("el id es " + kidId)

    Kids.findOne({ _id: kidId }).lean().exec((err, kid) => {
      if (!kid || err) {
        return res.status(404).render("error", { code: "404", message: "No pudimos encontrar la página que estas buscando" });
      }

      let month = parseInt(kid.birthday.getMonth()) + 1
      let formatDate = kid.birthday.getFullYear() + "-" + ("0" + month).slice(-2) + "-" + ("0" + kid.birthday.getDate()).slice(-2)
      return res.render("editKid", { kid, birthday: formatDate });

    });

  },
  updateKid: (req, res) => {
    if (!req.isAuthenticated()) {
      return res.redirect("/admin");
    }

    if (req.file) {
      var image = {
        name: req.body.name,
        data: fs.readFileSync(path.join('./upload/' + req.file.filename)),
        contentType: 'image/jpg'
      }
      console.log(req.file);
      let file_ext = req.file.mimetype;
      if (
        file_ext != "image/png" &&
        file_ext != "image/jpg" &&
        file_ext != "image/jpeg" &&
        file_ext != "image/gif"
      ) {
        res.status(404).render("error", { code: "400", message: "El archivo que se intentó subir no es el formato correcto" });
      }

      Kids.findOneAndUpdate(
        { _id: req.body.id },
        {
          name: req.body.firstname,
          lastname: req.body.lastname,
          schoolGrade: req.body.schoolGrade,
          birthday: req.body.birthday,
          gender: req.body.gender,
          Hobbies: req.body.Hobbies,
          Vision: req.body.Vision,
          image: image,
          noticeOfPrivacy: req.body.noticeOfPrivacy === "on" ? true : false,
          parents: {
            familiarName: req.body.familiarName,
            cellphone: req.body.cellphone,
            father: req.body.father,
            fatherCellphone: req.body.fatherCellphone,
            fatherSchoolGrade: req.body.fatherSchoolGrade,
            mother: req.body.mother,
            motherCellphone: req.body.motherCellphone,
            motherSchoolGrade: req.body.motherSchoolGrade
          }
        },
        { new: true },
        (err, kidUpdated) => {
          if (err) {
            console.log(err)
            res.status(404).render("error", { code: "404", message: "Algo salio mal o no tienes los permisos necesarios porfavor trata nuevamente" });
          } else {
            console.log(kidUpdated)
            return res.redirect("/admin");
          }
        }
      );
    }
    else {
      Kids.findOneAndUpdate(
        { _id: req.body.id },
        {
          name: req.body.firstname,
          lastname: req.body.lastname,
          schoolGrade: req.body.schoolGrade,
          birthday: req.body.birthday,
          gender: req.body.gender,
          Hobbies: req.body.Hobbies,
          Vision: req.body.Vision,
          noticeOfPrivacy: req.body.noticeOfPrivacy === "on" ? true : false,
          parents: {
            familiarName: req.body.familiarName,
            cellphone: req.body.cellphone,
            father: req.body.father,
            fatherCellphone: req.body.fatherCellphone,
            fatherSchoolGrade: req.body.fatherSchoolGrade,
            mother: req.body.mother,
            motherCellphone: req.body.motherCellphone,
            motherSchoolGrade: req.body.motherSchoolGrade
          }
        },
        { new: true },
        (err, kidUpdated) => {
          if (err) {
            console.log(err);
            return res.status(404).render("error", { code: "404", message: "Algo salio mal o no tienes los permisos necesarios porfavor trata nuevamente" });
          } else {
            console.log(kidUpdated)
            return res.redirect("/admin");
          }
        }
      );
    }
  },

  deleteKid: (req, res) => {
    if (!req.isAuthenticated()) {
      return res.redirect("/admin");
    }
    if (req.params.id != undefined) {
      Kids.findByIdAndDelete(req.params.id).
        exec()
        .then((kid) => {
          console.log("Kid deleted ", kid);
          return res.redirect("/admin");
        })
        .catch(err => console.log("Error ", err));
    } else {
      res.status(404).render("error", { code: "404", message: "Algo salio mal o no tienes los permisos necesarios porfavor trata nuevamente" });
    }
  }




};


module.exports = controller;