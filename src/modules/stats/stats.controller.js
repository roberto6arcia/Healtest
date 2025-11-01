
const express = require('express');
const statService = require('./stats.service');
const authController = require('../auth/auth.controller');

const route = express.Router();
const stat = new statService();
const auth = new authController();

const statRoute = (app) => {

    app.use('/stat', route);

    route.get('/state-bydoctor-graph', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await stat.getTestStateByDoctor(req.userId);
            if(result){
                return res.status(200).json(result);
            }
            return res.status(200).json([]);
        } catch (error) {
            return res.status(500).json([])
        }
    });
 
    route.get('/patient-bydoctor-graph', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await stat.getCountPatientsByGroup(req.userId);
            if(result){
                return res.status(200).json(result);
            }
            return res.status(200).json([]);
        } catch (error) {
            return res.status(500).json([])
        }
    });

    route.get('/test-bydoctor-graph', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await stat.getCountTestsByGroup(req.userId);
            if(result){
                return res.status(200).json(result);
            }
            return res.status(200).json([]);
        } catch (error) {
            return res.status(500).json([])
        }
    });

    route.get('/resourse-bydoctor-graph', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await stat.getCountResoursesByGroup(req.userId);
            if(result){
                return res.status(200).json(result);
            }
            return res.status(200).json([]);
        } catch (error) {
            return res.status(500).json([])
        }
    });

    route.get('/patient-bymonth-graph', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await stat.getPatientsByMonth(req.userId);
            if(result){
                return res.status(200).json(result);
            }
            return res.status(200).json([]);
        } catch (error) {
            return res.status(500).json([])
        }
    });
 
    route.get('/resourse-bytype-graph', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await stat.getResoursesByType(req.userId);
            if(result){
                return res.status(200).json(result);
            }
            return res.status(200).json([]);
        } catch (error) {
            return res.status(500).json([])
        }
    });

    route.get('/test-bypatient/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await stat.getCountTestByPatient(req.params.id);
            if(result){
                return res.status(200).json(result);
            }
            return res.status(200).json([]);
        } catch (error) {
            return res.status(500).json([])
        }
    });

    route.get('/act-bypatient/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await stat.getCountActByPatient(req.params.id);
            if(result){
                return res.status(200).json(result);
            }
            return res.status(200).json([]);
        } catch (error) {
            return res.status(500).json([])
        }
    });

    route.get('/act-type-bypatient/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await stat.getCountTypeActByPatient(req.params.id);
            if(result){
                return res.status(200).json(result);
            }
            return res.status(200).json([]);
        } catch (error) {
            return res.status(500).json([])
        }
    });

}

module.exports = { statRoute };
