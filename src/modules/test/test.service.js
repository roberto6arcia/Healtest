
const database = require('../../database/database');

const connection = database.connection;

class TestService {
 
    async saveTest(id, data) {
        try {
            const query = `insert into tests 
                                    (name, dateinit, dateend, user_id) 
                                values
                                    (
                                        '${data.name}', 
                                        current_timestamp,
                                        '${data.dateEnd}',
                                        '${id}'
                                    ) returning id`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return  error;
        } 
    }

    async saveQuestionsInTest(id, questions){
        try {
            const values = [];
            const queryValues = questions.map((question, index) => {
              const position = index * 2; 
              values.push(question.id, id);
              return `($${position + 1}, $${position + 2})`;
            }).join(', ');
            const query = `
              INSERT INTO question_test (question_id, test_id)
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

    async saveTestInGroup(id, groups){
        try {
            const result = await this.deleteTestInGroup(id);
            if(groups.length){
                const values = [];
                const queryValues = groups.map((group, index) => {
                  const position = index * 2; 
                  values.push(group.id, id);
                  return `($${position + 1}, $${position + 2})`;
                }).join(', ');
                const query = `
                  INSERT INTO group_test (group_id, test_id)
                  VALUES ${queryValues};
                `;
                const { rows } = await connection.query(query, values);
                return rows;
            }
            return true;
        } catch (error) {
            console.log(error)
            return  false;
        } 
    }

    async deleteTestInGroup(id){
        try {
            const query = `delete from group_test where test_id = ${id} returning id`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return  false;
        }
    }

    async updateTest(id, data) {
        try {
            const query = `update tests set 
                            name = '${data.name}',
                            dateend = '${data.dateEnd}' where id = ${id} returning id`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return  false;
        } 
    }

    async updateQuestionsInTest(test_id, questions) {
        try {
            const query = `delete from question_test where test_id = ${test_id}`;
            const { rows } = await connection.query(query);
            if(rows){
                const result = await this.saveQuestionsInTest(test_id, questions);
                if(result.id){
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.log(error)
            return  false;
        } 
    }

    async deleteTest(id) {
        try {
            const query = `delete from tests where id = ${id} returning id`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return  false;
        } 
    }

    async getTests(id, limit, page) {
        try {
            const query = `select * from tests where user_id = ${id} order by name limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getCountTests(id) {
        try {
            const query = `select count(*) from tests where user_id = ${id}`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getTest(user_id, test_id) {
        try {
            const query = `select * from tests where user_id = ${user_id} and id = ${test_id}`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getTestState(user_id, test_id){
        try {
            const query = `select state from test_state where paciente_id = ${user_id} and test_id = ${test_id}`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getGroupsInTest(test_id) {
        try {
            const query = `select group_id as id from group_test where test_id = ${test_id}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getQuestByTest(id){
        try {
            const query = `select q.id, q.keyword, q.question, q.realtype, q.created_at, q.user_id 
                            from questions as q
                            inner join question_test as qt
                            on qt.question_id = q.id and qt.test_id = ${id}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getTestsByAll(id, data, limit, page) {
        try {
            const query = `select * from tests 
                            where ( name like '%${data}%') 
                            AND ( user_id = ${id} )
                            order by name
                            limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getTestsByPatientAndAll(id, data, limit, page) {
        try {
            const query = `select t.id, t.name, t.dateinit, t.dateend, t.user_id from tests as t
                            inner join group_test as gt
                            on gt.test_id = t.id 
                            inner join group_patient as gp
                            on gp.group_id = gt.group_id and gp.paciente_id = ${id} and (t.name like '%${data}%') 
                            order by t.name
                            limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getTestsByPatient(id, limit, page) {
        try {
            const query = `select t.id, t.name, t.dateinit, t.dateend, t.user_id from tests as t
                            inner join group_test as gt
                            on gt.test_id = t.id 
                            inner join group_patient as gp
                            on gp.group_id = gt.group_id and gp.paciente_id = ${id}
                            order by t.name
                            limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getCountTestsByPatient(id){
        try {
            const query = `select count(*) from tests as t
                            inner join group_test as gt
                            on gt.test_id = t.id 
                            inner join group_patient as gp
                            on gp.group_id = gt.group_id and gp.paciente_id = ${id}`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        }
    }

}

module.exports = TestService;