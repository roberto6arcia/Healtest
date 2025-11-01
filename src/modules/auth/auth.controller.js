
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../../config');
const userService = require('../user/user.service');


const user = new userService();

class AuthController {

  async encryptPassword(password) {
    try {
      const salt = await bcrypt.genSalt(10);
      const pass_encrypt = await bcrypt.hash(password, salt); 
      return pass_encrypt;
    } catch (error) {
      return error;
    }
  }

  async provePassword(password_, password) {
    try {
      // const pass_encrypt = await this.encryptPassword("admin");
      // const rest = await user.updatePassword(2, pass_encrypt);
      // if(rest) console.log("password changed")
      const result = await bcrypt.compare(password_, password);
      return result;
    } catch (error) {
      return false;
    }
  }

  async generateToken(id_user, role) {
    try{
      const token_jwt = jwt.sign({ id: id_user, role: role }, config.SECRET, {
        expiresIn: 7200
      });
      return token_jwt;
    }catch(error){
      return error;
    }
  }

  async verifyToken(req, res, next) {
    try {
      const token = req.headers['x-access-token']; 
      if (!token) {
        return res.status(403).json({response: false});
      } else {
        const token_decode = jwt.verify(token, config.SECRET);
        req.userId = token_decode.id;
        req.role = token_decode.role;
        next();
      }
    } catch (error) {
      return res.status(403).json({response: false});
    }
  }

  async isAdmin(req, res, next){
    try {
      if(!(req.role == 'admin')){
        return res.status(403).json({response: false})
      }
      next()
    } catch (error) {
      return res.status(403).json({response: false})
    }
  }

  async isDoctor(req, res, next){
    try {
      const user_id = await user.getUser(req.userId);
      if(!(user_id.role == 'doctor')){
        return res.status(403).json({message: 'Acceso denegado'})
      }
      next()
    } catch (error) {
      return res.status(403).json({message: 'Acceso denegado'})
    }
  }

  async isPatient(req, res, next){
    try {
      const user_id = await user.getUser(req.userId);
      if(!(user_id.role == 'patient')){
        return res.status(403).json({message: 'Acceso denegado'})
      }
      next()
    } catch (error) {
      return res.status(403).json({message: 'Acceso denegado'})
    }
  }

  async isAdminOrDoctor(req, res, next){
    try {
      const user_id = await user.getUser(req.userId);
      if(!(user_id.role == 'doctor' || user_id.role == 'admin')){
        return res.status(403).json({message: 'Acceso denegado'})
      }
      next()
    } catch (error) {
      return res.status(403).json({message: 'Acceso denegado'})
    }
  }

}

module.exports = AuthController;