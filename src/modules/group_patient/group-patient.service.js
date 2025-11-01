
const database = require('../../database/database');
const groupService = require('../group/group.service');

const group = new groupService();
const connection = database.connection;

class GroupPatientService {

    async getGroupByPatient(id) {
        try {
            const query = `select group_id from group_patient where paciente_id = ${id}`;
            const { rows } = await connection.query(query);
            if(rows[0]){
                const group_ = await group.getGroup(rows[0].group_id);
                return group_;
            }
            return false;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getNumPatientByGroup(id) {
        try {
            const query = `select count(*) from group_patient where group_id = ${id}`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async saveGroupPatient(data) {
        try {
            const query = `insert into group_patient 
                                    (group_id, paciente_id) 
                                values
                                    (
                                        ${data.group_id}, 
                                        ${data.paciente_id}
                                    ) returning id`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        } 
    }

    async deleteGroupPatient(id) {
        try {
            const ifExist = this.getGroupByPatient(id);
            if(ifExist){
                const query = `delete from group_patient where paciente_id = ${id}`;
                const { rows } = await connection.query(query);
                if(rows){
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.log(error)
            return false;
        } 
    }

    async updateGroupPatient(id, data) {
        try {
            const query = `update group_patient set 
                            group_id = ${data.group_id} where paciente_id = ${id} returning id`;
            const { rows } = await connection.query(query);
            return rows[0];
        } catch (error) {
            console.log(error)
            return false;
        } 
    }

}

module.exports = GroupPatientService;