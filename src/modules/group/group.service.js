
const database = require('../../database/database');

const connection = database.connection;

class GroupService {

    async getGroups(limit, page) {
        try {
            const query = `select * from groups order by name limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getCountGroups() {
        try {
            const query = `select count(*) from groups`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getGroupsByAll(data, limit, page){
        try {
            const query = `select * from groups 
                            where ( name like '%${data}%' OR description like '%${data}%') 
                            limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getGroupsByDoctor(id){
        try {
            const query = `select * from groups where ( user_id = ${id} ) order by name`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getGroupsByMonitor(id, limit, page){
        try {
            const query = `select * from groups where ( user_id = ${id} ) order by name limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getCountGroupsByMonitor(id){
        try {
            const query = `select count(*) from groups where ( user_id = ${id} )`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getGroupsByMonitorByAll(id, data, limit, page){
        try {
            const query = `select * from groups 
                            where ( name like '%${data}%' OR description like '%${data}%') 
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

    async getGroup(id) {
        try {
            if(!isNaN(id)){
                const query = `select * from groups where id = ${id}`;
                const { rows } = await connection.query(query);
                return rows[0];
            }
            return false;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async findGroup(name) {
        try {
            const query = `select * from groups where name = '${name}'`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async saveGroup(data) {
        try {
            const query = `insert into groups 
                                    (name, description, created_at, user_id) 
                                values
                                    (
                                        '${data.name}', 
                                        '${data.description}',
                                        current_timestamp,
                                        '${data.user_id}'
                                    ) returning id`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        } 
    }

    async deleteGroup(id) {
        try {
            const query = `delete from groups where id = ${id} returning id`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        } 
    }

    async updateGroup(id, data) {
        try {
            const query = `update groups set 
                            name = '${data.name}',
                            description = '${data.description}' where id = ${id} returning id`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        } 
    }

}

module.exports = GroupService;