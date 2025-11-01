const express = require('express');
const groupPatientService = require('./group-patient.service');
const authController = require('../auth/auth.controller');

const route = express.Router();
const groupPatient = new groupPatientService();
const auth = new authController();

const groupPatientRoute = (app) => {

    app.use('/group-patient', route);

    route.get('/group-by-patient/:id', [auth.verifyToken], async (req, res) => {
        try {
            const result = await groupPatient.getGroupByPatient(req.params.id);
            if(result.id){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/count-patient/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await groupPatient.getNumPatientByGroup(req.params.id);
            if(result.count){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json(error)
        }
    })

    route.post('/save', [auth.verifyToken, auth.isAdmin], async (req, res) => {
        try {
            const result = await groupPatient.saveGroupPatient(req.body);
            if(result.id){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false}); 
        } catch (error) {
            return res.status(500).json({response: false});
        }
    })

    route.patch('/update/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await groupPatient.updateGroupPatient(req.params.id, req.body);
            if(result.id){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false});
        } catch (error) {
            return res.status(500).json({response: false});
        }
    })

};

module.exports = { groupPatientRoute };