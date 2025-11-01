
const express = require('express');
const route = express.Router();
const user = require('./user/user.controller');
const doctor = require('./doctor/doctor.controller');
const group = require('./group/group.controller');
const groupPatient = require('./group_patient/group-patient.controller');
const resourse = require('./resourse/resourse.controller');
const question = require('./question/question.controller');
const test = require('./test/test.controller');
const result = require('./result/result.controller');
const activity = require('./activity/activity.controller');
const stat = require('./stats/stats.controller');

user.userRoute(route);
doctor.doctorRoute(route);
group.groupRoute(route);
groupPatient.groupPatientRoute(route);
resourse.resourseRoute(route);
question.questionRoute(route);
test.testRoute(route);
activity.activityRoute(route);
result.resultRoute(route);
stat.statRoute(route);

module.exports =  route; 