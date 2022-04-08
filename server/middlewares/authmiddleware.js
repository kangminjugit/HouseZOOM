const {verify} = require('../utils/jwt-util');
const pool = require('../db/config');

const teacherAuthMiddleware = async (req, res, next) => {
    try{
        const {authorization} = req.headers;
        
        if(authorization === null || authorization === undefined){
            const error = new Error('선생님 회원 로그인이 필요합니다!');
            error.status = 401;
            throw error;  
        }
    
        const token = authorization.split('Bearer ')[1];
        const result = verify(token);

        if(result.ok){
            req.id = result.id;

            const connection = await pool.getConnection(async conn => conn);
            const [rows, fields] = await connection.query(
                'SELECT * FROM teacher WHERE id = ?', 
                [result.id]);
            if(rows.length === 0){
                const error = new Error('선생님 회원 로그인이 필요합니다!');
                error.status = 403;
                throw error;
            }

            req.name = result.name;
            next();
        }
    }catch(err){
        next(err);
    }    
}

const studentAuthMiddleware = async (req, res, next) => {
    try{
        const {authorization} = req.headers;
        
        if(authorization === null || authorization === undefined){
            const error = new Error('학생 회원 로그인이 필요합니다!');
            error.status = 401;
            throw error;  
        }
    
        const token = authorization.split('Bearer ')[1];
        const result = verify(token);
        if(result.ok){
            req.id = result.id;
            const connection = await pool.getConnection(async conn => conn);
            const [rows, fields] = await connection.query(
                'SELECT * FROM student WHERE id = ?', 
                [result.id]);
            if(rows.length === 0){
                const error = new Error('학생 회원 로그인이 필요합니다!');
                error.status = 403;
                throw error;
            }

            req.name = result.name;
            next();
        }
    }catch(err){
        next(err);
    }

}

const authmiddleware = async (req, res, next) => {
    try{
        const {authorization} = req.headers;
        
        if(authorization === null || authorization === undefined){
            const error = new Error('로그인이 필요합니다!');
            error.status = 401;
            throw error;  
        }
    
        const token = authorization.split('Bearer ')[1];
        const result = verify(token);
        if(result.ok){
            req.id = result.id;
            req.name = result.name;
            next();
        }
    }catch(err){
        next(err);
    }    
}

module.exports = {teacherAuthMiddleware, studentAuthMiddleware, authmiddleware};