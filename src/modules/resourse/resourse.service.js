const database = require('../../database/database');

const connection = database.connection;


class ResourseService {

    async saveResourse(id, file) {
        try {
            const data = [file.name, file.type, file.realtype, file.description, file.data, id];
            const query = 'INSERT INTO resourses (name, type, realtype, description, data, created_at, user_id) VALUES ($1, $2, $3, $4, $5, current_timestamp, $6) returning id';
            const { rows } = await connection.query(query, data);
            return rows[0];
        } catch (error) {
            console.log(error)
            return  false;
        } 
    }

    async updateResourse(user_id, resourse_id, file) {
        try {
            let updateQuery;
            let values;
            updateQuery = `
                  UPDATE resourses
                  SET name = $1, type = $2, realtype = $3, description = $4
                  WHERE user_id = $5 and id = $6 returning id;
                `;
            values = [file.name, file.type, file.realtype, file.description, user_id, resourse_id];
            const { rows } = await connection.query(updateQuery, values);
            return rows[0];
        } catch (error) {
            console.log(error)
            return  false;
        } 
    }

    async updateDataResourse(user_id, resourse_id, file) {
        try {
            let updateQuery;
            let values;
            updateQuery = `
                  UPDATE resourses
                  SET name = $1, type = $2, realtype = $3, description = $4, data = $5
                  WHERE user_id = $6 and id = $7 returning id;
                `;
            values = [file.name, file.type, file.realtype, file.description, file.data, user_id, resourse_id];
            const { rows } = await connection.query(updateQuery, values);
            return rows[0];
        } catch (error) {
            console.log(error)
            return  false;
        } 
    }

    async deleteResourse(id) {
        try {
            const query = `delete from resourses where id = ${id} returning id`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return  false;
        } 
    }

    async getResourses(id, limit, page) {
        try {
            const query = `select id, name, type, realtype, description, created_at, user_id from resourses where user_id = ${id} limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getResoursesByPatientAndAll(id, data, limit, page) {
        try {
            const query = `select r.id, r.name, r.type, r.realtype, r.description, r.created_at, r.user_id from resourses as r
                            inner join resourses_group as rg
                            on rg.resourse_id = r.id 
                            inner join group_patient as gp
                            on gp.group_id = rg.group_id and gp.paciente_id = ${id} 
                            and (r.name like '%${data}%' or r.type like '%${data}%' or r.realtype like '%${data}%' or r.description like '%${data}%') 
                            order by r.name
                            limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getResoursesByPatient(id, limit, page) {
        try {
            const query = `select r.id, r.name, r.type, r.realtype, r.description, r.created_at, r.user_id from resourses as r
                            inner join resourses_group as rg
                            on rg.resourse_id = r.id 
                            inner join group_patient as gp
                            on gp.group_id = rg.group_id and gp.paciente_id = ${id}
                            order by r.name
                            limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getCountResourseByPatient(id, limit, page) {
        try {
            const query = `select count(*) from resourses as r
                            inner join resourses_group as rg
                            on rg.resourse_id = r.id 
                            inner join group_patient as gp
                            on gp.group_id = rg.group_id and gp.paciente_id = ${id}`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getGroupsByResourse(id) {
        try {
            const query = `select g.id, g.name, g.description, g.created_at, g.user_id from groups as g
                            inner join resourses_group as gp
                            on g.id = gp.group_id and gp.resourse_id = ${id}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getResourseData(resourse_id) {
        try {
            const query = `select id, data, realtype from resourses where id = ${resourse_id}`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getResourse(resourse_id) {
        try {
            const query = `select id, name, type, realtype, description, created_at from resourses where id = ${resourse_id}`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getCountResourse(id) {
        try {
            const query = `select count(*) from resourses where user_id = ${id}`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getResoursesByAll(id, data, limit, page) {
        try {
            const query = `select id, name, type, realtype, description, created_at, user_id from resourses 
                            where ( name like '%${data}%' OR type like '%${data}%' OR description like '%${data}%') 
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

    async getGroupsInRes(resourse_id) {
        try {
            const query = `select group_id as id from resourses_group where resourse_id = ${resourse_id}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async saveResInGroup(id, groups){
        try {
            const result = await this.deleteResInGroup(id);
            const values = [];
            const queryValues = groups.map((group, index) => {
              const position = index * 2; 
              values.push(id, group.id);
              return `($${position + 1}, $${position + 2})`;
            }).join(', ');
            const query = `
              INSERT INTO resourses_group (resourse_id, group_id)
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

    async deleteResInGroup(id){
        try {
            const query = `delete from resourses_group where resourse_id = ${id} returning id`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return  false;
        }
    }

}

module.exports = ResourseService; 