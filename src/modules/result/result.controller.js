
const express = require('express');
const resultService = require('./result.service');
const authController = require('../auth/auth.controller');

const route = express.Router();
const results = new resultService();
const auth = new authController();

const resultRoute = (app) => {
 
    app.use('/result', route);

    route.get('/result-bypatient/:limit/:page', [auth.verifyToken, auth.isPatient], async (req, res) => {
        try {
            const result = await results.getResultsByPatient(req.userId, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/count-result-bypatient', [auth.verifyToken, auth.isPatient], async (req, res) => {
        try {
            const result = await results.getCountResultsByPatient(req.userId);
            if(result.count){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/list-result/:test_id', [auth.verifyToken, auth.isPatient], async (req, res) => {
        try {
            const result = await results.getResults(req.userId, req.params.test_id);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/list-result-bydoctor/:user_id/:test_id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await results.getResults(req.params.user_id, req.params.test_id);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/result-by-patient-all/:data/:limit/:page', [auth.verifyToken, auth.isPatient], async (req, res) => {
        try {
            const result = await results.getResultsByPatientAndAll(req.userId, req.params.data, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    });

    route.get('/date-bydoctor/:idUser/:idTest', [auth.verifyToken], async (req, res) => {
        try {
            const result = await results.getDateResults(req.params.idUser, req.params.idTest);
            if(result){
                return res.status(200).json(result.date)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    });

    route.post('/save-response', [auth.verifyToken, auth.isPatient], async (req, res) => {
        try {
            const result = await results.saveTestResponse(req.userId, req.body.responses);
            if(result.id){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false});
        } catch (error) {
            console.log(error)
            return res.status(500).json({response: false})
        }
    });

}

module.exports = { resultRoute };
