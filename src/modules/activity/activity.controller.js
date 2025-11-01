
const express = require('express');
var multer = require('multer');
const activityService = require('./activity.service');
const authController = require('../auth/auth.controller');

const route = express.Router();
const activity = new activityService();
const auth = new authController();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const activityRoute = (app) => {

    app.use('/activity', route);

    route.get('/list/:limit/:page', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await activity.getActivities(req.userId, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/count-activity', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await activity.getCountActivity(req.userId);
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
            const result = await activity.getActivitiesByPatient(req.userId, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/count-activity-bypatient', [auth.verifyToken, auth.isPatient], async (req, res) => {
        try {
            const result = await activity.getCountActivitiesByPatient(req.userId);
            if(result.count){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/list-bydoctor/:user_id/:limit/:page', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await activity.getActivitiesByPatient(req.params.user_id, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/count-activity-bydoctor/:user_id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await activity.getCountActivitiesByPatient(req.params.user_id);
            if(result.count){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/cricigrams/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await activity.getCrucisByActivity(req.params.id);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/tasks/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await activity.getTaskByActivity(req.params.id);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/cricigrams-response/:id', [auth.verifyToken, auth.isPatient], async (req, res) => {
        try {
            const result = await activity.getResponseByPatientAndAct(req.userId, req.params.id);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/cricigrams-bydoctor/:user_id/:activity_id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await activity.getResponseByPatientAndAct(req.params.user_id, req.params.activity_id);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        } 
    })

    route.get('/tasks-bydoctor/:user_id/:activity_id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const file = await activity.getResponseTaskByPatientAndAct(req.params.user_id, req.params.activity_id);
            res.setHeader('Content-Type', file.realtype);
            res.send(file.data);
        } catch (error) {
            return res.status(500).json([])
        } 
    })

    route.get('/tasks-data-bydoctor/:user_id/:activity_id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await activity.getResourseTaskDataByPatientAndAct(req.params.user_id, req.params.activity_id);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/tasks-bypatient/:activity_id', [auth.verifyToken, auth.isPatient], async (req, res) => {
        try {
            const file = await activity.getResponseTaskByPatientAndAct(req.userId, req.params.activity_id);
            res.setHeader('Content-Type', file.realtype);
            res.send(file.data);
        } catch (error) {
            console.log(error)
            return res.status(500).json([])
        } 
    })

    route.get('/tasks-data-bypatient/:activity_id', [auth.verifyToken, auth.isPatient], async (req, res) => {
        try {
            const result = await activity.getResourseTaskDataByPatientAndAct(req.userId, req.params.activity_id);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            console.log(error)
            return res.status(500).json([])
        } 
    })

    route.get('/cricigrams-by-patient/:id', [auth.verifyToken, auth.isPatient], async (req, res) => {
        try {
            const result = await activity.getCrucisByPatient(req.params.id);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/tasks-by-patient/:id', [auth.verifyToken, auth.isPatient], async (req, res) => {
        try {
            const result = await activity.getTaskByPatient(req.params.id);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/get/:id', [auth.verifyToken], async (req, res) => {
        try {
            const result = await activity.getActivity(req.userId, req.params.id);
            if(result.id){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/groups-in-act/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await activity.getGroupsInAct(req.params.id);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/activity-byall/:data/:limit/:page', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await activity.getActivitiesByAll(req.userId, req.params.data, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    });

    route.get('/activity-by-patient-all/:data/:limit/:page', [auth.verifyToken, auth.isPatient], async (req, res) => {
        try {
            const result = await activity.getActivitiesByPatientAndAll(req.userId, req.params.data, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    });

    route.get('/activity-by-doctor-all/:user_id/:data/:limit/:page', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await activity.getActivitiesByPatientAndAll(req.params.user_id, req.params.data, req.params.limit, req.params.page);
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
            const result = await activity.getActState(req.userId, req.params.id);
            if(result.state){
                return res.status(200).json({response: result.state})
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    });

    route.get('/state-bydoctor/:user_id/:activity_id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await activity.getActState(req.params.user_id, req.params.activity_id);
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
            const result = await activity.deleteActivity(req.params.id);
            if(result.id){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false});
        } catch (error) {
            return res.status(500).json({response: false});
        }
    })

    route.post('/save', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await activity.saveActivity(req.userId, req.body);
            if(result.id){
                const result_ = await activity.saveCrucigrams(result.id, [...req.body.horizontals, ...req.body.verticals]);
                if(result_.id){
                    return res.status(200).json({response: true}); 
                }
            }
            return res.status(200).json({response: false});
        } catch (error) {
            return res.status(500).json({response: false})
        }
    });

    route.post('/save-task', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await activity.saveActivity(req.userId, req.body);
            if(result.id){
                const result_ = await activity.saveTask(result.id, req.body.task);
                if(result_.id){
                    return res.status(200).json({response: true}); 
                }
            }
            return res.status(200).json({response: false});
        } catch (error) {
            return res.status(500).json({response: false})
        }
    });

    route.post('/save-response', [auth.verifyToken], async (req, res) => {
        try {
            const result_ = await activity.saveActivityResponse(req.userId, req.body.id, [...req.body.horizontals, ...req.body.verticals]);
            if(result_.id){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false});
        } catch (error) {
            return res.status(500).json({response: false})
        }
    });

    route.patch('/save-task-response/:id', [auth.verifyToken], upload.single('data'), async (req, res) => {
        try {
            const data = {
                name: req.body.name,
                type: req.body.type,
                realtype: req.body.realtype,
                description: req.body.description,
                data: req.file.buffer,
            };
            const result_ = await activity.saveTaskResponse(req.userId, req.params.id, data);
            if(result_.id){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false});
        } catch (error) {
            return res.status(500).json({response: false})
        }
    });

    route.post('/save-in-group', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await activity.saveActInGroup(req.body.id, req.body.groups);
            if(result){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false});
        } catch (error) {
            console.log(error)
            return res.status(500).json({response: false})
        }
    });

    route.patch('/update/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await activity.updateActivity(req.userId, req.params.id, req.body);
            if(result.id){
                const result_ = await activity.updateCrucigrams(result.id, [...req.body.horizontals, ...req.body.verticals]);
                if(result_){
                    return res.status(200).json({response: true}); 
                }
            }
            return res.status(200).json({response: false});
        } catch (error) {
            console.log(error)
            return res.status(500).json({response: false});
        }
    })

    route.patch('/update-task/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await activity.updateTask(req.params.id, req.body);
            if(result.id){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false});
        } catch (error) {
            return res.status(500).json({response: false});
        }
    })

    route.patch('/update-response-task/:id', [auth.verifyToken], upload.single('data'), async (req, res) => {
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
                const result = await activity.updateResponseDataTask(req.userId, req.params.id, data);
                response = result;
            }else{
                data = {
                    name: req.body.name,
                    type: req.body.type,
                    realtype: req.body.realtype,
                    description: req.body.description
                };
                const result = await activity.updateResponseTask(req.userId, req.params.id, data);
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

module.exports = {activityRoute};