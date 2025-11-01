
const express = require('express');
const testService = require('./test.service');
const authController = require('../auth/auth.controller');

const route = express.Router();
const test = new testService();
const auth = new authController();

const testRoute = (app) => {

    app.use('/test', route);

    route.get('/list/:limit/:page', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await test.getTests(req.userId, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/count-test', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await test.getCountTests(req.userId);
            if(result.count){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/list-bypatient/:limit/:page', [auth.verifyToken, auth.isPatient], async (req, res) => {
        try {
            const result = await test.getTestsByPatient(req.userId, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/count-test-bypatient', [auth.verifyToken, auth.isPatient], async (req, res) => {
        try {
            const result = await test.getCountTestsByPatient(req.userId);
            if(result.count){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/list-bypd/:id/:limit/:page', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await test.getTestsByPatient(req.params.id, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/count-test-bypd/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await test.getCountTestsByPatient(req.params.id);
            if(result.count){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/questions/:id', [auth.verifyToken], async (req, res) => {
        try {
            const result = await test.getQuestByTest(req.params.id);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/groups-in-test/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await test.getGroupsInTest(req.params.id);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/get-data/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await test.getTest(req.userId, req.params.id);
            if(result.id){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/test-byall/:data/:limit/:page', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await test.getTestsByAll(req.userId, req.params.data, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    });

    route.get('/test-by-patient-all/:data/:limit/:page', [auth.verifyToken, auth.isPatient], async (req, res) => {
        try {
            const result = await test.getTestsByPatientAndAll(req.userId, req.params.data, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    });

    route.get('/test-bypd-all/:id/:data/:limit/:page', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await test.getTestsByPatientAndAll(req.params.id, req.params.data, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    });

    route.get('/state/:id', [auth.verifyToken, auth.isPatient], async (req, res) => {
        try {
            const result = await test.getTestState(req.userId, req.params.id);
            if(result.state){
                return res.status(200).json({response: result.state})
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    });

    route.get('/state-bydoctor/:idUser/:idTest', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await test.getTestState(req.params.idUser, req.params.idTest);
            if(result.state){
                return res.status(200).json({response: result.state})
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    });

    route.delete('/delete/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await test.deleteTest(req.params.id);
            if(result.id){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false});
        } catch (error) {
            return res.status(500).json({response: false});
        }
    })

    route.post('/save-in-group', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await test.saveTestInGroup(req.body.id, req.body.groups);
            if(result){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false});
        } catch (error) {
            console.log(error)
            return res.status(500).json({response: false})
        }
    });

    route.post('/save', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await test.saveTest(req.userId, req.body);
            if(result.id){
                const result_ = await test.saveQuestionsInTest(result.id, req.body.questions);
                if(result_.id){
                    return res.status(200).json({response: true}); 
                }
            }
            return res.status(200).json({response: false});
        } catch (error) {
            return res.status(500).json({response: false})
        }
    });

    route.patch('/update/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await test.updateTest(req.params.id, req.body);
            if(result.id){
                const result_ = await test.updateQuestionsInTest(result.id, req.body.questions);
                if(result_){
                    return res.status(200).json({response: true}); 
                }
            }
            return res.status(200).json({response: false});
        } catch (error) {
            return res.status(500).json({response: false})
        }
    });

}

module.exports = { testRoute };
