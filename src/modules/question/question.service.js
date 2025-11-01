const database = require('../../database/database');

const connection = database.connection;


class QuestionService {

    async saveQuestion(id, file) {
        try {
            const data = [file.keyword, file.question, file.realtype, file.data, id];
            const query = 'INSERT INTO questions (keyword, question, realtype, image, created_at, user_id) VALUES ($1, $2, $3, $4, current_timestamp, $5) RETURNING id';
            const { rows } = await connection.query(query, data);
            return rows[0];
        } catch (error) {
            console.log(error)
            return  false;
        } 
    }

    async saveOptions(id, options){
        try {
            const values = [];
            const queryValues = options.map((option, index) => {
              const position = index * 2; 
              values.push(option, id);
              return `($${position + 1}, $${position + 2})`;
            }).join(', ');
            const query = `
              INSERT INTO options (option, question_id)
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

    async updateQuestion(user_id, question_id, file) {
        try {
            let updateQuery;
            let values;
            updateQuery = `
                  UPDATE questions
                  SET keyword = $1, question = $2, realtype = $3
                  WHERE user_id = $4 and id = $5
                  RETURNING id;
                `;
                values = [file.keyword, file.question, file.realtype, user_id, question_id];
            const { rows } = await connection.query(updateQuery, values);
            return rows[0];
        } catch (error) {
            console.log(error)
            return  false;
        } 
    }

    async updateDataQuestion(user_id, question_id, file) {
        try {
            let updateQuery;
            let values;
            updateQuery = `
                  UPDATE questions
                  SET keyword = $1, question = $2, realtype = $3, image = $4
                  WHERE user_id = $5 and id = $6
                  RETURNING id;
                `;
            values = [file.keyword, file.question, file.realtype, file.data, user_id, question_id];
            const { rows } = await connection.query(updateQuery, values);
            return rows[0];
        } catch (error) {
            console.log(error)
            return  false;
        } 
    }

    async updateOptions(question_id, options) {
        try {
            const query = `delete from options where question_id = ${question_id} returning id`;
            const { rows } = await connection.query(query);
            if(rows[0].id){
                const result = await this.saveOptions(question_id, options);
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

    async deleteQuestion(id) {
        try {
            const query = `delete from questions where id = ${id} returning id`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return  false;
        } 
    }

    async getQuestions(id, limit, page) {
        try {
            const query = `select id, keyword, question, realtype, created_at, user_id from questions where user_id = ${id} limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return  false;
        }
    }

    async getQuestionData(question_id) {
        try {
            const query = `select image, realtype from questions where id = ${question_id}`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return  false;
        }
    }

    async getQuestion(user_id, question_id) {
        try {
            const query = `select id, keyword, question, realtype, created_at from questions where user_id = ${user_id} and id = ${question_id}`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return  false;
        }
    }

    async getCountQuestion(id) {
        try {
            const query = `select count(*) from questions where user_id = ${id}`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return  false;
        }
    }

    async getOptionsByQuestion(id) {
        try {
            const query = `select * from options where question_id = ${id}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return  false;
        }
    }

    async getCountOptionsByQuestion(id) {
        try {
            const query = `select count(*) from options where question_id = ${id}`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return  false;
        }
    }

    async getQuestionsByAll(id, data, limit, page) {
        try {
            const query = `select  id, keyword, question, realtype, created_at, user_id from questions 
                            where ( keyword like '%${data}%' OR question like '%${data}%' ) 
                            AND ( user_id = ${id} )
                            order by keyword
                            limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return  false;
        }
    }

}

module.exports = QuestionService; 