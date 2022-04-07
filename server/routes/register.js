var express = require('express');
var router = express.Router();
const pool = require('../db/config');
const bcrypt = require('bcrypt');

const saltRounds = 10;
/**
 * @swagger
 * tags:
 *  name: Register
 *  definition: 회원가입
 */


/**
 * @swagger
 *  /api/register/teacher:
 *    post:
 *      tags: [Register]
 *      summary: 선생님 회원가입 API
 *      consumes:
 *          - application/json; charset=utf-8
 *      parameters:
 *         - in: body
 *           name: teacher
 *           description: 선생님 정보
 *           schema:
 *              type: object
 *              required:
 *                  - id, name, password
 *              properties:
 *                  id:
 *                      type: string
 *                  name:
 *                      type: string
 *                  password:
 *                      type: string

 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '400':
 *              description: id, name, password, class_id 중 하나라도 없으면 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '405':
 *              description: class_id에 해당되는 반에 등록되어있는 담임선생님이 이미 존재
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object       
 *          '422':
 *              description: 이미 존재하는 선생님 아이디이면 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.post(`/teacher`, async (req, res, next) => {
    const {id, name, password} = req.body;
    // id, name, password 중 하나라도 없으면 에러
    if(id === '' || name === '' || password === '' ){
        const error = new Error('id, name, password are required!');
        error.status = 400;
        next(error);
        return;
    }

    const connection = await pool.getConnection(async conn => conn);

    try{
        // password 암호화
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 선생님 회원가입
        [rows, fields] = await pool.query(
            'INSERT INTO teacher(id, name, password) VALUES(?, ?, ?)', 
            [id, name, hashedPassword]);

        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": null,
            "message": 'Successfully add new teacher'
        });
    }catch(error){
        if(error.code === 'ER_DUP_ENTRY'){
            const error = new Error('이미 존재하는 아이디입니다!');
            error.status = 422;
            next(error);
        }else{
            next(error);
        }
    }finally{
        connection.release();
    }
});



/**
 * @swagger
 *  /api/register/student:
 *    post:
 *      tags: [Register]
 *      summary: 학생 회원가입 API
 *      consumes:
 *          - application/json; charset=utf-8
 *      parameters:
 *         - in: body
 *           name: student
 *           description: 학생 정보
 *           schema:
 *              type: object
 *              required:
 *                  - id, name, password, class_id, auth_code
 *              properties:
 *                  id:
 *                      type: string
 *                  name:
 *                      type: string
 *                  password:
 *                      type: string
 *                  class_id:
 *                      type: integer
 *                  auth_code:
 *                      type: string

 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '400':
 *              description: id, name, password, class_id, auth_code 중 하나라도 없으면 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '404':
 *              description: 존재하지 않는 반이면 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '405':
 *              description: 반에 해당하는 인증코드 틀리면 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object       
 *          '422':
 *              description: 이미 존재하는 학생 아이디이면 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.post(`/student`, async (req, res, next) => {
    const {id, name, password, class_id, auth_code} = req.body;
    // id, name, password, class_id 중 하나라도 없으면 에러
    if(id === '' || name === '' || password === '' || class_id == null || auth_code === ''){
        const error = new Error('id, name, password, class_id, auth_code are required!');
        error.status = 400;
        next(error);
        return;
    }

    const connection = await pool.getConnection(async conn => conn);

    try{
        [rows, fields] = await connection.query('SELECT auth_code FROM class WHERE id = ?', [class_id]);
        if(rows.length==0){
            const error = new Error('존재하지 않는 반입니다!');
            error.status = 404;
            throw error;               
        }
        
        // 반 인증코드 확인
        const isAuthorized = await bcrypt.compare(auth_code, rows[0]['auth_code']);
        if(!isAuthorized){
            const error = new Error('잘못된 인증코드입니다!');
            error.status = 405;
            throw error;               
        }

        // password 암호화
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 학생 회원가입
        [rows, fields] = await connection.query(
            'INSERT INTO student(id, name, password, class_id) VALUES(?, ?, ?, ?)', 
            [id, name, hashedPassword, class_id]);

        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": null,
            "message": 'Successfully add new student'
        });
    }catch(error){
        if(error.code === 'ER_DUP_ENTRY'){
            const error = new Error('이미 존재하는 아이디입니다!');
            error.status = 422;
            next(error);
        }else{
            next(error);
        }
    }finally{
        connection.release();
    }
});

module.exports = router;
