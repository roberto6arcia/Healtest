
const express = require('express');
const groupService = require('./group.service');
const authController = require('../auth/auth.controller');

const route = express.Router();
const group = new groupService();
const auth = new authController();

const groupRoute = (app) => {

    app.use('/group', route);

    route.get('/list/:limit/:page', [auth.verifyToken, auth.isAdmin], async (req, res) => {
        try {
            const result = await group.getGroups(req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/count', [auth.verifyToken, auth.isAdmin], async (req, res) => {
        try {
            const result = await group.getCountGroups();
            if(result.count){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/get-groups-bymonitor/:id', [auth.verifyToken, auth.isAdmin], async (req, res) => {
        try {
            const result = await group.getGroupsByDoctor(req.params.id);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/list-groups-bymonitor', [auth.verifyToken, auth.isDoctor], async (req, res) => {
        try {
            const result = await group.getGroupsByDoctor(req.userId);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })
 
    route.get('/groups-bymonitor/:limit/:page', [auth.verifyToken, auth.isDoctor], async (req, res) => {
        try {
            const result = await group.getGroupsByMonitor(req.userId, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/count-groups-bymonitor', [auth.verifyToken, auth.isDoctor], async (req, res) => {
        try {
            const result = await group.getCountGroupsByMonitor(req.userId);
            if(result.count){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/unique/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await group.getGroup(req.params.id);
            if(result.id){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.post('/save', [auth.verifyToken, auth.isAdmin], async (req, res) => {
        try {
            const result = await group.saveGroup(req.body);
            if(result.id){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false}); 
        } catch (error) {
            return res.status(500).json({response: false});
        }
    })

    route.post('/save-bymonitor', [auth.verifyToken, auth.isDoctor], async (req, res) => {
        try {
            req.body.user_id = req.userId;
            const result = await group.saveGroup(req.body);
            if(result.id){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false}); 
        } catch (error) {
            return res.status(500).json({response: false});
        }
    })

    route.delete('/delete/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await group.deleteGroup(req.params.id);
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
            const result = await group.updateGroup(req.params.id, req.body);
            if(result.id){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false});
        } catch (error) {
            return res.status(500).json({response: false});
        }
    })

    route.get('/get-groups-byall/:data/:limit/:page', [auth.verifyToken, auth.isAdmin], async (req, res) => {
        try {
            const result = await group.getGroupsByAll(req.params.data, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result); 
            }
            return res.status(200).json([]);
        } catch (error) {
            return res.status(500).json([])
        }
    });

    route.get('/groups-bymonitor-byall/:data/:limit/:page', [auth.verifyToken, auth.isDoctor], async (req, res) => {
        try {
            const result = await group.getGroupsByMonitorByAll(req.userId, req.params.data, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result); 
            }
            return res.status(200).json([]);
        } catch (error) {
            return res.status(500).json([])
        }
    });

};

module.exports = { groupRoute };