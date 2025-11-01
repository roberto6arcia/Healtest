
const express = require('express');
var multer = require('multer')
const resourseService = require('./resourse.service');
const authController = require('../auth/auth.controller');

const route = express.Router();
const resourse = new resourseService();
const auth = new authController();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const resourseRoute = (app) => {

    app.use('/resourse', route);

    route.get('/list/:limit/:page', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await resourse.getResourses(req.userId, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(500).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/count-resourse', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await resourse.getCountResourse(req.userId);
            if(result.count){
                return res.status(200).json(result)
            }
            return res.status(500).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/list-bypatient/:limit/:page', [auth.verifyToken, auth.isPatient], async (req, res) => {
        try {
            const result = await resourse.getResoursesByPatient(req.userId, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(500).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/count-resourse-bypatient', [auth.verifyToken, auth.isPatient], async (req, res) => {
        try {
            const result = await resourse.getCountResourseByPatient(req.userId);
            if(result.count){
                return res.status(200).json(result)
            }
            return res.status(500).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/get/:id', [auth.verifyToken], async (req, res) => {
        try {
            const file = await resourse.getResourseData(req.params.id);
            res.setHeader('Content-Type', file.realtype);
            res.send(file.data);
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/get-data/:id', [auth.verifyToken], async (req, res) => {
        try {
            const result = await resourse.getResourse(req.params.id);
            if(result.id){
                return res.status(200).json(result)
            }
            return res.status(500).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/get-groups/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await resourse.getGroupsByResourse(req.params.id);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(500).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/resourse-byall/:data/:limit/:page', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await resourse.getResoursesByAll(req.userId, req.params.data, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(500).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    });

    route.get('/resourse-by-patient-all/:data/:limit/:page', [auth.verifyToken, auth.isPatient], async (req, res) => {
        try {
            const result = await resourse.getResoursesByPatientAndAll(req.userId, req.params.data, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(500).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    });

    route.delete('/delete/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await resourse.deleteResourse(req.params.id);
            if(result.id){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false});
        } catch (error) {
            return res.status(500).json({response: false});
        }
    })

    route.get('/groups-in-res/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await resourse.getGroupsInRes(req.params.id);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(500).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.post('/save-in-group', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await resourse.saveResInGroup(req.body.id, req.body.groups);
            if(result.id){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false});
        } catch (error) {
            return res.status(500).json({response: false})
        }
    });

    route.post('/save', [auth.verifyToken, auth.isAdminOrDoctor], upload.single('data'), async (req, res) => {
        try {
            const data = {
                name: req.body.name,
                type: req.body.type,
                realtype: req.body.realtype,
                description: req.body.description,
                data: req.file.buffer,
            };
            const result = await resourse.saveResourse(req.userId, data);
            if(result.id){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false});
        } catch (error) {
            return res.status(500).json({response: false})
        }
    });

    route.patch('/update/:id', [auth.verifyToken, auth.isAdminOrDoctor], upload.single('data'), async (req, res) => {
        try {
            let data;
            let response;
            if(req.file?.buffer){
                data = {
                    name: req.body.name,
                    type: req.body.type,
                    realtype: req.body.realtype,
                    description: req.body.description,
                    data: req.file.buffer,
                };
                const result = await resourse.updateDataResourse(req.userId, req.params.id, data);
                response = result;
            }else{
                data = {
                    name: req.body.name,
                    type: req.body.type,
                    realtype: req.body.realtype,
                    description: req.body.description
                };
                const result = await resourse.updateResourse(req.userId, req.params.id, data);
                response = result;
            }
            if(response.id){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false});
        } catch (error) {
            return res.status(500).json({response: false});
        }
    })
    
}

module.exports = { resourseRoute };
