
const express = require('express');
const doctorService = require('./doctor.service');
const groupPatientService = require('../group_patient/group-patient.service');
const authController = require('../auth/auth.controller');

const route = express.Router();
const doctor = new doctorService();
const groupPatient = new groupPatientService();
const auth = new authController();

const doctorRoute = (app) => {

    app.use('/doctor', route);

    route.get('/list-patient-bymonitor/:limit/:page', [auth.verifyToken, auth.isDoctor], async (req, res) => {
        try {
            const result = await doctor.getPatientsByMonitor(req.userId, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/count-patient-bymonitor', [auth.verifyToken, auth.isDoctor], async (req, res) => {
        try {
            const result = await doctor.getCountPatientsByMonitor(req.userId);
            if(result.count){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/list-patient-bym-g/:id/:limit/:page', [auth.verifyToken, auth.isDoctor], async (req, res) => {
        try {
            const result = await doctor.getPatientsByMonitorAndGroup(req.userId, req.params.id, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/count-patient-bym-g/:id', [auth.verifyToken, auth.isDoctor], async (req, res) => {
        try {
            const result = await doctor.getCountPatientsByMonitorAndGroup(req.userId, req.params.id);
            if(result.count){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/get-patients-bymonitor-byall/:data/:limit/:page', [auth.verifyToken, auth.isDoctor], async (req, res) => {
        try {
            const result = await doctor.getPatientsByMonitorByAll(req.userId, req.params.data, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    });

    route.get('/get-patients-bymg-byall/:id/:data/:limit/:page', [auth.verifyToken, auth.isDoctor], async (req, res) => {
        try {
            const result = await doctor.getPatientsByMonitorAndGroupByAll(req.userId, req.params.id, req.params.data, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    });

    route.post('/save-patient-bydoctor', [auth.verifyToken, auth.isDoctor], async (req, res) => {
        try {
            const pass_encrypt = await auth.encryptPassword(req.body.password);
            req.body.password = pass_encrypt;
            req.body.role = 'patient';
            const result = await doctor.saveUser(req.body);
            if(result.id){
                const data = {
                    group_id: req.body.group_id,
                    paciente_id: result.id,
                };
                const result_ = await groupPatient.saveGroupPatient(data);
                if(result_.id){
                    return res.status(200).json({response: true});
                } 
            }
            return res.status(200).json({response: false}); 
        } catch (error) {
            return res.status(500).json({response: false});
        }
    })

    route.get('/is-doctor', [auth.verifyToken, auth.isDoctor], async (req, res) => {
        try {
            return res.status(200).json({response: true});
        } catch (error) {
            return res.status(500).json({response: false})
        }
    });

}

module.exports = { doctorRoute };