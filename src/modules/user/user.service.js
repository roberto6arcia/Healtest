
const database = require('../../database/database');
const groupPatientService = require('../group_patient/group-patient.service');


const connection = database.connection;
const groupPatient = new groupPatientService();

class UserService {

    async setSesion(data) {
        try {
            const query = `select * from users where 
                        (username = '${data.username}' OR email = '${data.username}')`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        }
    }
 
    async getPatients(limit, page) {
        try {
            const query = `select id, name, lastname, email, username, telephone, role, created_at 
                            from users 
                            where role = 'patient' order by lastname, name limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getCountPatients() {
        try {
            const query = `select count(*) from users where role = 'patient'`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getDoctors(limit, page) {
        try {
            const query = `select id, name, lastname, email, username, telephone, role, created_at from users where role = 'doctor' order by lastname, name limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getAllDoctors() {
        try {
            const query = `select id, name, lastname, email, username, telephone, role, created_at from users where role = 'doctor' order by lastname, name`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getCountDoctors(limit, page) {
        try {
            const query = `select count(*) from users where role = 'doctor'`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getUsersByAll(data){
        try {
            const query = `select id, name, lastname, email, username, telephone, role, created_at from users where
            (
                username like '%${data}%' OR 
                name like '%${data}%' OR 
                lastname like '%${data}%' OR 
                email like '%${data}%' OR
                telephone like '%${data}%'
            )`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getDoctorsByAll(data, limit, page){
        try {
            const query = `select id, name, lastname, email, username, telephone, role, created_at from users where
            (
                username like '%${data}%' OR 
                name like '%${data}%' OR 
                lastname like '%${data}%' OR 
                email like '%${data}%' OR
                telephone like '%${data}%' 
            ) AND role = 'doctor' limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getPatientsByAll(data, limit, page){
        try {
            const query = `select id, name, lastname, email, username, telephone, role, created_at from users where
            (
                username like '%${data}%' OR 
                name like '%${data}%' OR 
                lastname like '%${data}%' OR 
                email like '%${data}%' OR
                telephone like '%${data}%' 
            ) AND role = 'patient' limit ${limit} offset ${page}`;
            const { rows } = await connection.query(query);
            return rows;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getUser(id) {
        try {
            if(!isNaN(id)){
                const query = `select id, name, lastname, email, username, telephone, role, created_at from users where id = ${id}`;
                const { rows } = await connection.query(query);
                return rows[0];
            }
            return false;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getUserById(id) {
        try {
            const query = `select id, name, lastname, email, telephone from users where id = ${id}`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getUserIn(id) {
        try {
            const query = `select * from users where id = ${id}`;
            const { rows } = await connection.query(query);
            return rows[0];
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

    async deleteUser(id) {
        try {
            const ifExist = groupPatient.deleteGroupPatient(id);
            if(ifExist){
                const query = `delete from users where id = ${id} returning id`;
                const { rows } = await connection.query(query);
                return rows[0];
            }
            return false;
        } catch (error) {
            console.log(error)
            return false;
        } 
    }

    async updateUser(id, data) {
        try {
            const query = `update users set 
                            name = '${data.name}',
                            lastname = '${data.lastname}',
                            email = '${data.email}',
                            username = '${data.username}',
                            telephone = '${data.telephone}' where id = ${id} returning id`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        } 
    }

    async updatePassword(id, pass_new){
        try {
            const query = `update users set password = '${pass_new}' where id = ${id} returning id`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        } 
    }

    async getProfile(id_user) {
        try {
            const query = `select id, name, lastname, email, username, telephone, role, created_at from users where id = ${id_user}`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        } 
    }

}

module.exports = UserService; 