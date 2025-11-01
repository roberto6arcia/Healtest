
const database = require('../../database/database');

const connection = database.connection;

class StatService {

    async getTestStateByDoctor(user_id){
        try {
            const query = `select count(*), ts.state from test_state as ts
                            inner join tests as t
                            on ts.test_id = t.id and t.user_id = ${user_id} group by ts.state`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }
 
    async getCountPatientsByGroup(user_id){
        try {
            const query = `select count(*), g.name as state from group_patient as gp
                            inner join groups as g
                            on gp.group_id = g.id and g.user_id = ${user_id} group by g.name`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getCountTestsByGroup(user_id){
        try {
            const query = `select count(*), g.name as state from group_test as gt
                            inner join groups as g
                            on gt.group_id = g.id and g.user_id = ${user_id} group by g.name`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getCountResoursesByGroup(user_id){
        try {
            const query = `select count(*), g.name as state from resourses_group as rg
                            inner join groups as g
                            on rg.group_id = g.id and g.user_id = ${user_id} group by g.name`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getPatientsByMonth(user_id){
        try {
            const query = `SELECT DATE_TRUNC('month', u.created_at) AS state, COUNT(*) AS count 
                            FROM users AS u
                            INNER JOIN group_patient AS gp ON gp.paciente_id = u.id 
                            INNER JOIN groups AS g ON g.id = gp.group_id AND g.user_id = ${user_id}
                            GROUP BY state 
                            ORDER BY state`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getResoursesByType(user_id){
        try {
            const query = `SELECT COUNT(*), type AS state FROM resourses 
                            where user_id = ${user_id} GROUP BY type`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getCountTestByPatient(patient_id){
        try {
            const query = `select count(*), ts.state as state from group_test as gt
                            inner join group_patient as gp
                            on gt.group_id = gp.group_id and gp.paciente_id = ${patient_id}
                            inner join test_state as ts
                            on ts.test_id = gt.test_id and ts.paciente_id = ${patient_id} group by ts.state`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getCountActByPatient(patient_id){
        try {
            const query = `select count(*), acs.state as state from activity_group as ag
                            inner join group_patient as gp
                            on ag.group_id = gp.group_id and gp.paciente_id = ${patient_id}
                            inner join activity_state as acs
                            on acs.activity_id = ag.activity_id and acs.paciente_id = ${patient_id} group by acs.state`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getCountTypeActByPatient(patient_id){
        try {
            const query = `select count(*), a.type as state from activity_group as ag
                            inner join group_patient as gp
                            on ag.group_id = gp.group_id and gp.paciente_id = ${patient_id}
                            inner join activities as a
                            on a.id = ag.activity_id group by a.type`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

}

module.exports = StatService;

