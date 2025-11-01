
const express = require('express');
const userService = require('./user.service');
const authController = require('../auth/auth.controller');

const route = express.Router();
const user = new userService();
const auth = new authController();

const userRoute = (app) => {

    app.use('/user', route);

    route.post('/login', async (req, res) => {
        try {
            const result = await user.setSesion(req.body);
            const pass_ = await auth.provePassword(req.body.password, result.password);
            if(pass_){
                const token = await auth.generateToken(result.id, result.role);
                return res.status(200).json({ token: token })
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    });
 
    route.get('/list-patient/:limit/:page', [auth.verifyToken, auth.isAdmin], async (req, res) => {
        try {
            const result = await user.getPatients(req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/count-patient', [auth.verifyToken, auth.isAdmin], async (req, res) => {
        try {
            const result = await user.getCountPatients();
            if(result.count){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/list-doctor/:limit/:page', [auth.verifyToken, auth.isAdmin], async (req, res) => {
        try {
            const result = await user.getDoctors(req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/count-doctor', [auth.verifyToken, auth.isAdmin], async (req, res) => {
        try {
            const result = await user.getCountDoctors();
            if(result.count){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })
 
    route.get('/list-doctor', [auth.verifyToken, auth.isAdmin], async (req, res) => {
        try {
            const result = await user.getAllDoctors();
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/unique/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await user.getUser(req.params.id);
            if(result.id){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/get-user/:id', [auth.verifyToken], async (req, res) => {
        try {
            const result = await user.getUserById(req.params.id);
            if(result.id){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/profile-user', [auth.verifyToken], async (req, res) => {
        try {
            const result = await user.getProfile(req.userId);
            if(result.id){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.post('/save-doctor', [auth.verifyToken, auth.isAdmin], async (req, res) => {
        try {
            const pass_encrypt = await auth.encryptPassword(req.body.password);
            req.body.password = pass_encrypt;
            req.body.role = 'doctor';
            const result = await user.saveUser(req.body);
            if(result.id){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false}); 
        } catch (error) {
            return res.status(500).json({response: false});
        }
    })

    route.post('/save-patient', [auth.verifyToken, auth.isAdmin], async (req, res) => {
        try {
            const pass_encrypt = await auth.encryptPassword(req.body.password);
            req.body.password = pass_encrypt;
            req.body.role = 'patient';
            const result = await user.saveUser(req.body);
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
            const result = await user.deleteUser(req.params.id);
            if(result.id){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false});
        } catch (error) {
            return res.status(500).json({response: false});
        }
    })

    route.patch('/update/:id', [auth.verifyToken], async (req, res) => {
        try {
            const result = await user.updateUser(req.params.id, req.body);
            if(result.id){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false});
        } catch (error) {
            return res.status(500).json({response: false});
        }
    })

    route.patch('/update-password', [auth.verifyToken], async (req, res) => {
        try {
            const user_ = await user.getUserIn(req.userId);
            const pass_ = await auth.provePassword(req.body.password_old, user_.password);
            if(pass_){
                const pass_encrypt = await auth.encryptPassword(req.body.password_new);
                const result = await user.updatePassword(req.userId, pass_encrypt);
            }else{
                return res.status(200).json({response: false});
            }
            return res.status(200).json({response: true});
        } catch (error) {
            return res.status(500).json({response: false});
        }
    });

    route.patch('/update-password-admin/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const pass_encrypt = await auth.encryptPassword(req.body.password_new);
            const result = await user.updatePassword(req.params.id, pass_encrypt);
            if(result.id){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false});
        } catch (error) {
            return res.status(500).json({response: false});
        }
    });

    route.get('/is-admin', [auth.verifyToken, auth.isAdmin], async (req, res) => {
        try {
            return res.status(200).json({response: true});
        } catch (error) {
            return res.status(500).json({response: false})
        }
    });

    route.get('/is-patient', [auth.verifyToken, auth.isPatient], async (req, res) => {
        try {
            return res.status(200).json({response: true});
        } catch (error) {
            return res.status(500).json({response: false})
        }
    });

    route.get('/get-users-byall/:data', [auth.verifyToken, auth.isAdmin], async (req, res) => {
        try {
            const result = await user.getUsersByAll(req.params.data);
            if(result){
                return res.status(200).json(result); 
            }
            return res.status(200).json([]);
        } catch (error) {
            return res.status(500).json([])
        }
    });

    route.get('/get-doctors-byall/:data/:limit/:page', [auth.verifyToken, auth.isAdmin], async (req, res) => {
        try {
            const result = await user.getDoctorsByAll(req.params.data, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result); 
            }
            return res.status(200).json([]);
        } catch (error) {
            return res.status(500).json([])
        }
    });

    route.get('/get-patients-byall/:data/:limit/:page', [auth.verifyToken, auth.isAdmin], async (req, res) => {
        try {
            const result = await user.getPatientsByAll(req.params.data, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result); 
            }
            return res.status(200).json([]);
        } catch (error) {
            return res.status(500).json([])
        }
    });

}

module.exports = { userRoute };