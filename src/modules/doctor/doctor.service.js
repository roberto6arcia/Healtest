const database = require('../../database/database');
const groupPatientService = require('../group_patient/group-patient.service');


const connection = database.connection;
const groupPatient = new groupPatientService();

class DoctorService {

    async getPatientsByMonitor(id, limit, page) {
        try {
            const query = `select u.id, u.name, u.lastname, u.email, u.username, u.telephone, u.role, u.created_at 
                            from users as u inner join
                            group_patient as gp
                            on gp.paciente_id = u.id
                            inner join
                            groups as g
                            on gp.group_id = g.id and g.user_id = ${id}
                            order by u.lastname, u.name 
                            limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getCountPatientsByMonitor(id) {
        try {
            const query = `select count(*) 
                            from users as u inner join
                            group_patient as gp
                            on gp.paciente_id = u.id
                            inner join
                            groups as g
                            on gp.group_id = g.id and g.user_id = ${id}`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getPatientsByMonitorAndGroup(monitor_id, group_id, limit, page) {
        try {
            const query = `select u.id, u.name, u.lastname, u.email, u.username, u.telephone, u.role, u.created_at 
                            from users as u inner join
                            group_patient as gp
                            on gp.paciente_id = u.id
                            inner join
                            groups as g
                            on gp.group_id = g.id and g.user_id = ${monitor_id} and g.id = ${group_id}
                            order by u.lastname, u.name 
                            limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getCountPatientsByMonitorAndGroup(monitor_id, group_id) {
        try {
            const query = `select count(*) 
                            from users as u inner join
                            group_patient as gp
                            on gp.paciente_id = u.id
                            inner join
                            groups as g
                            on gp.group_id = g.id and g.user_id = ${monitor_id} and g.id = ${group_id}`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getPatientsByMonitorByAll(id, data, limit, page) {
        try {
            const query = `select u.id, u.name, u.lastname, u.email, u.username, u.telephone, u.role, u.created_at 
                            from users as u inner join
                            group_patient as gp
                            on gp.paciente_id = u.id
                            inner join
                            groups as g
                            on gp.group_id = g.id and g.user_id = ${id} and
                            (
                                u.username like '%${data}%' OR 
                                u.name like '%${data}%' OR 
                                u.lastname like '%${data}%' OR 
                                u.email like '%${data}%' OR
                                u.telephone like '%${data}%' 
                            ) AND role = 'patient'
                            order by u.lastname, u.name 
                            limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getPatientsByMonitorAndGroupByAll(monitor_id, group_id, data, limit, page) {
        try {
            const query = `select u.id, u.name, u.lastname, u.email, u.username, u.telephone, u.role, u.created_at 
                            from users as u inner join
                            group_patient as gp
                            on gp.paciente_id = u.id
                            inner join
                            groups as g
                            on gp.group_id = g.id and g.user_id = ${monitor_id} and g.id = ${group_id} and
                            (
                                u.username like '%${data}%' OR 
                                u.name like '%${data}%' OR 
                                u.lastname like '%${data}%' OR 
                                u.email like '%${data}%' OR
                                u.telephone like '%${data}%' 
                            ) AND role = 'patient'
                            order by u.lastname, u.name 
                            limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async findUser(data) {
        try {
            const query = `select id, name, lastname, email, username, telephone, role, created_at from users where (email = '${data.email}' OR username = '${data.username}')`;
            const { rows } = await connection.query(query);
            return !rows[0];
        } catch (error) {
            console.log(error)
            return false;
        } 
    }

    async saveUser(data) {
        try {
            const isUser = await this.findUser(data);
            if (isUser) {
                const query = `insert into users 
                                    (name, lastname, email, username, telephone, password, role, created_at) 
                                values
                                    (
                                        '${data.name}', 
                                        '${data.lastname}', 
                                        '${data.email}', 
                                        '${data.username}', 
                                        '${data.telephone}', 
                                        '${data.password}', 
                                        '${data.role}',
                                        current_timestamp
                                    ) returning id`;
                const { rows } = await connection.query(query);
                return rows[0];
            } else {
                return false;
            }
        } catch (error) {
            console.log(error)
            return false;
        } 
    }

}

module.exports = DoctorService; 