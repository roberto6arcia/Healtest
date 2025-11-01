
const express = require('express');
var multer = require('multer')
const questionService = require('./question.service');
const authController = require('../auth/auth.controller');

const route = express.Router();
const question = new questionService();
const auth = new authController();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const questionRoute = (app) => {

    app.use('/question', route);

    route.get('/list/:limit/:page', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await question.getQuestions(req.userId, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/count-question', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await question.getCountQuestion(req.userId);
            if(result.count){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/options/:id', [auth.verifyToken], async (req, res) => {
        try {
            const result = await question.getOptionsByQuestion(req.params.id);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    })

    route.get('/count-options/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await question.getCountOptionsByQuestion(req.params.id);
            if(result.count){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/get/:id', [auth.verifyToken], async (req, res) => {
        try {
            const file = await question.getQuestionData(req.params.id);
            res.setHeader('Content-Type', file.realtype);
            res.send(file.image);
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/get-data/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await question.getQuestion(req.userId, req.params.id);
            if(result.id){
                return res.status(200).json(result)
            }
            return res.status(200).json({})
        } catch (error) {
            return res.status(500).json({})
        }
    })

    route.get('/question-byall/:data/:limit/:page', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await question.getQuestionsByAll(req.userId, req.params.data, req.params.limit, req.params.page);
            if(result){
                return res.status(200).json(result)
            }
            return res.status(200).json([])
        } catch (error) {
            return res.status(500).json([])
        }
    });

    route.delete('/delete/:id', [auth.verifyToken, auth.isAdminOrDoctor], async (req, res) => {
        try {
            const result = await question.deleteQuestion(req.params.id);
            if(result.id){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false});
        } catch (error) {
            return res.status(500).json({response: false});
        }
    })

    route.post('/save', [auth.verifyToken, auth.isAdminOrDoctor], upload.single('data'), async (req, res) => {
        try {
            const data = {
                keyword: req.body.keyword,
                question: req.body.question,
                realtype: req.body.realtype,
                options: JSON.parse(req.body.options),
                data: req.file.buffer,
            };
            const result = await question.saveQuestion(req.userId, data);
            if(result.id){
                const result_ = await question.saveOptions(result.id, data.options);
                if(result_.id){
                    return res.status(200).json({response: true}); 
                }
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
                    keyword: req.body.keyword,
                    question: req.body.question,
                    realtype: req.body.realtype,
                    options: JSON.parse(req.body.options),
                    data: req.file.buffer,
                };
                const result = await question.updateDataQuestion(req.userId, req.params.id, data);
                if(result.id){
                    const result_ = await question.updateOptions(result.id, data.options);
                    if(result_){
                        response = result_;
                    }
                }
            }else{
                data = {
                    keyword: req.body.keyword,
                    question: req.body.question,
                    realtype: req.body.realtype,
                    options: JSON.parse(req.body.options),
                };
                const result = await question.updateQuestion(req.userId, req.params.id, data);
                if(result.id){
                    const result_ = await question.updateOptions(result.id, data.options);
                    if(result_){
                        response = result_;
                    }
                }
            }
            if(response){
                return res.status(200).json({response: true}); 
            }
            return res.status(200).json({response: false});
        } catch (error) {
            console.log(error)
            return res.status(500).json({response: false});
        }
    })

}

module.exports = { questionRoute };
