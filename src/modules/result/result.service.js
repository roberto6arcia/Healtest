
const database = require('../../database/database');

const connection = database.connection;

class ResultService {
     
    async saveTestResponse(id, responses){
        try {
            const date_at = new Date(Date.now());
            const values = [];
            const queryValues = responses.map((response, index) => {
                const position = index * 5; 
                values.push(response.question_id, response.test_id, response.option_id, id, date_at);
                return `($${position + 1}, $${position + 2}, $${position + 3}, $${position + 4}, $${position + 5})`;
            }).join(', ');
            const query = `
              INSERT INTO test_response (question_id, test_id, option_id, paciente_id, created_at)
              VALUES ${queryValues}
              RETURNING id;
            `;
            const { rows } = await connection.query(query, values);
            return rows[0];
        } catch (error) {
            console.log(error)
            return  false;
        } 
    }

    async getResults(paciente_id, test_id){
        try {
            const query = `select * from test_response 
                            where 
                            test_id = ${test_id}  
                            and
                            paciente_id = ${paciente_id}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getDateResults(paciente_id, test_id){
        try {
            const query = `select created_at as date from test_response
                            where 
                            test_id = ${test_id}  
                            and
                            paciente_id = ${paciente_id}
                            group by created_at`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getResultsByPatientAndAll(id, data, limit, page) {
        try {
            const query = `select t.id, t.name, t.dateinit, t.dateend, t.user_id from tests as t
                            inner join test_state as ts
                            on ts.test_id = t.id and ts.paciente_id = ${id} and ts.state = 'Terminada' and (t.name like '%${data}%')
                            order by t.name
                            limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getResultsByPatient(id, limit, page) {
        try {
            const query = `select t.id, t.name, t.dateinit, t.dateend, t.user_id from tests as t
                            inner join test_state as ts
                            on ts.test_id = t.id and ts.paciente_id = ${id} and ts.state = 'Terminada'
                            order by t.name
                            limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getCountResultsByPatient(id) {
        try {
            const query = `select count(*) from tests as t
                            inner join test_state as ts
                            on ts.test_id = t.id and ts.paciente_id = ${id} and ts.state = 'Terminada'`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        }
    }

}

module.exports = ResultService;
