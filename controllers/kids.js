"use strict";

const validator = require("validator");
const fs = require("fs");
const path = require("path");
const Kids = require("../models/Kids");
const paypal = require("paypal-rest-sdk");
const currentUrl = process.env.url;

paypal.configure({
    mode: "live",
    client_id: process.env.paypalCliendId,
    client_secret: process.env.paypalCliendSecret,
});


var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.sendinbluekey;

var apiInstance = new SibApiV3Sdk.ContactsApi();
var apiInstanceMail = new SibApiV3Sdk.SMTPApi();

var createContact = new SibApiV3Sdk.CreateContact(); // CreateContact | Values to create a contact

var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email




var controller = {

    getLandingPage: (req, res) => {
        res.render("index");
    },

    getsponsor: (req, res) => {
        res.render("sponsor");
    },

    emailsubscription: (req, res) => {
        const { email, fName, lName } = req.body;
        if (email && fName && lName) {
            createContact = {
                email: email,
                attributes: {
                    NOMBRE: fName,
                    SURNAME: lName,
                },
                listIds: [7],
                updateEnabled: true,
            };

            apiInstance.createContact(createContact).then(function(data) {
                console.log('API called successfully. Returned data: ' + data);
                console.log(data);
                res.redirect("/");
            }, function(error) {
                console.error(error);
                res.redirect("/");
            });
        } else {
            res.redirect("/");
        }
    },

    getKids: (req, res) => {
        var query = Kids.find({ godparent: null, "image.data": { $ne: null } },
            "image name", { $sample: { size: 12 } }
        );
        //Find
        query
            .sort("-_id").limit(12)
            .lean()
            .exec((err, kids) => {
                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Something go wrong",
                    });
                } else {
                    res.render("godParent1", { kids });
                }
            });
    },

    getKid: (req, res) => {
        //Recoger el id de la url
        var kidId = req.params.id;
        //Comprobar que existe
        if (!kidId || kidId == null) {
            return res.status(404).render("error", { code: "404", message: "No pudimos encontrar la página que estas buscando" });
        }

        Kids.findOne({ _id: kidId, godparent: null }).exec((err, kid) => {
            if (!kid || err) {
                return res.status(404).render("error", { code: "404", message: "No pudimos encontrar la página que estas buscando" });
            }
            kid = kid.toJSON();
            return res.render("forum", { kid });

        });

    },





    getKidsEn: (req, res) => {
        var query = Kids.find({ godparent: null, "image.data": { $ne: null } },
            "image name", { $sample: { size: 12 } }
        );
        //Find
        query
            .sort("-_id").limit(12)
            .lean()
            .exec((err, kids) => {
                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Something go wrong",
                    });
                } else {
                    res.render("sponsor", { kids });
                }
            });
    },



















    deleteGodParent: (req, res) => {
        //Recoger el id por la url
        var kidId = req.params.id;
        //Recoger los datos que llegan por put
        Kids.findOneAndUpdate({ _id: kidId }, {
                godparent: undefined,
            }, { new: true },
            (err, kidUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Update error",
                    });
                } else {
                    return res.status(200).send({
                        status: "success",
                        message: "Update succesfull",
                    });
                }
            }
        );
    },

    updateNewGodParent: (req, res) => {
        //Recoger el id por la url
        var kidId = req.params.id;

        //Recoger los datos que llegan por put
        var params = req.body;
        console.log(req.body);
        //Validar datos
        try {
            var validate_name = !validator.isEmpty(params.fName);
            var validate_lastName = !validator.isEmpty(params.lastName);
            var validate_email = !validator.isEmpty(params.email);
            var validate_birthday = !validator.isEmpty(params.birthday);
            var validate_cellphone = !validator.isEmpty(params.cellphone);
            //var validate_RFC = !validator.isEmpty(params.RFC);
            var validate_subscriptionId = !validator.isEmpty(params.subscriptionId);

        } catch (err) {
            return res.status(404).render("error", { code: "400", message: "Faltan datos por llenar" });
        }

        if (
            validate_name &&
            validate_lastName &&
            validate_email &&
            validate_birthday &&
            validate_cellphone &&
            validate_subscriptionId
        ) {
            //Find and update
            console.log(params.subscriptionId);
            Kids.findOneAndUpdate({ _id: kidId, godparent: null }, {
                    godparent: {
                        name: params.fName,
                        lastName: params.lastName,
                        email: params.email,
                        cellphone: params.cellphone,
                        birthday: params.birthday,
                        RFC: params.RFC,
                        subscriptionId: params.subscriptionId,
                        socialCause: params.socialCause,
                        postalCode: params.postalCode
                    },
                }, { new: true },
                (err, kidUpdated) => {
                    if (err) {
                        return res.status(500).send({
                            status: "error",
                            message: err,
                        });
                    } else if (!kidUpdated) {
                        return res.status(404).send({
                            status: "error",
                            message: "Kid not found",
                        });
                    }

                    return res.send("success");
                }
            );
        } else {
            return res.status(200).send({
                status: "error",
                message: "The data is not correct",
            });
        }
    },

    sendEmail: (req, res) => {

        let months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];



        Kids.findById(req.params.kidId)
            .then((kid) => {
                kid = kid.toJSON();
                paypal.billingAgreement.get(kid.godparent.subscriptionId, function(
                    error,
                    billingAgreement
                ) {
                    if (error) {
                        console.log("error");
                    } else {
                        let date = new Date();
                        var todayString = `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()} `;
                        date = new Date(billingAgreement.agreement_details.next_billing_date);
                        var nextPaymentString = `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()} `;
                        try {
                            createContact = {
                                email: kid.godparent.email,
                                attributes: {
                                    NOMBRE: kid.godparent.name,
                                    SURNAME: kid.godparent.lastName,
                                    SMS: `52${kid.godparent.cellphone}`,
                                    CUMPLEANOS: kid.godparent.birthday,
                                    APADRINADO: kid.name,
                                    USERID: kid.godparent.email,
                                    DONACION: billingAgreement.plan.payment_definitions[0].amount.value,
                                    RFC: kid.godparent.RFC,
                                    CODIGOPOSTAL: kid.godparent.postalCode,
                                    CAUSASOCIAL: kid.godparent.socialCause
                                },
                                listIds: [3],
                                updateEnabled: true,
                            };

                            sendSmtpEmail = {
                                to: [{
                                    email: kid.godparent.email,
                                    name: kid.godparent.name
                                }],
                                templateId: 2,
                                params: {
                                    NOMBRE: kid.godparent.name,
                                    SURNAME: kid.godparent.lastName,
                                    SMS: `52${kid.godparent.cellphone}`,
                                    CUMPLEANOS: kid.godparent.birthday,
                                    APADRINADO: kid.name + " " + kid.lastname,
                                    GRADO: kid.schoolGrade,
                                    USERID: kid.godparent.email,
                                    DONACION: billingAgreement.plan.payment_definitions[0].amount.value,
                                    RFC: kid.godparent.RFC
                                },
                                headers: {
                                    'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
                                }
                            };


                            apiInstance.createContact(createContact)
                                .then((data) => {
                                    console.log('API called successfully Contact created. Returned data: ' + data);
                                    apiInstanceMail.sendTransacEmail(sendSmtpEmail)
                                }).then(function(data) {
                                    console.log('API called successfully. Email sent Returned data: ' + data);
                                    res.redirect("/thanks");
                                })
                                .catch(err => console.log(err));




                        } catch (error) {
                            console.log(error);
                        }

                    }
                });
            })
            .catch((err) => {
                res.send(err);
            });
    },

    getSubscription: (req, res) => {
        const today = new Date();
        var query = Kids.find({ godparent: { $ne: null } }, "godparent");
        //Find
        query.exec((err, kids) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Something go wrong",
                });
            } else if (!kids) {
                return res.status(404).send({
                    status: "error",
                    message: "Kids not found",
                });
            } else {
                kids.forEach((kid) => {
                    paypal.billingAgreement.get(kid.godparent.subscriptionId, function(
                        error,
                        billingAgreement
                    ) {
                        if (error) {
                            return res.send(error);
                        } else {
                            var nextMonth = new Date(billingAgreement.last_payment_date);
                            nextMonth = new Date(nextMonth.setDate(nextMonth.getDate() + 30));
                            if (billingAgreement.state !== "Active" && today > nextMonth) {
                                Kids.findOneAndUpdate({ _id: kid._id }, { godparent: undefined },
                                    (err, kidUpdated) => {
                                        console.log(kidUpdated);
                                    }
                                );
                                // kid.update({ godparent: undefined }, (err, kidUpdated) => {
                                //   console.log(kidUpdated);
                                // });
                            }
                        }
                    });
                });
                res.send("success");
            }
        });
    },

    confirmPayment: (req, res) => {
        const data = req.body;
        Kids.findOne({ _id: data.kidId, godparent: null }).lean().exec((err, kid) => {
            if (kid) {
                res.render("confirm", { data, kid, imageUrl: currentUrl });
            } else {
                res.status(404).render("error", { code: "404", message: "El niño ya fue apadrinado lo sentimos" });
            }

        });
    },

    recurrentFunction: () => {
        const today = new Date();
        var query = Kids.find({ godparent: { $ne: null } }, "godparent");
        //Find
        query.exec((err, kids) => {
            if (err) {
                console.log(err);
            } else if (!kids) {
                console.log("No se encontro niños");
            } else {
                kids.forEach((kid) => {
                    paypal.billingAgreement.get(kid.godparent.subscriptionId, function(
                        error,
                        billingAgreement
                    ) {
                        if (error) {
                            console.log("error");
                        } else {
                            var nextMonth = new Date(billingAgreement.last_payment_date);
                            nextMonth = new Date(nextMonth.setDate(nextMonth.getDate() + 30));
                            if (billingAgreement.state !== "Active" && today > nextMonth) {
                                Kids.findOneAndUpdate({ _id: kid._id }, { godparent: undefined },
                                    (err, kidUpdated) => {
                                        console.log(kidUpdated);
                                    }
                                );
                            }
                        }
                    });
                });
                console.log("Success");
            }
        });
    },
    showThanksMessage: (req, res) => {
        res.render("thanks");
    }
}; //end controller

module.exports = controller;