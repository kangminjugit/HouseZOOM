var express = require('express');
var router = express.Router();
const pool = require('../db/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/secretkey');

const saltRounds = 10;

/**
 * @swagger
 * tags:
 *  name: Login
 *  definition: 로그인
 */


/**
 * @swagger
 *  /api/login/teacher:
 *    post:
 *      tags: [Login]
 *      summary: 선생님 로그인 API
 *      consumes:
 *          - application/json; charset=utf-8
 *      parameters:
 *         - in: body
 *           name: teacher
 *           description: 선생님 정보
 *           schema:
 *              type: object
 *              required:
 *                  - id, password
 *              properties:
 *                  id:
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
 *              description: id, password 중 하나라도 없으면 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '401':
 *              description: 로그인 에러(없는 아이디 or 틀린 비밀번호)
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object       
 */

router.post('/teacher', async (req, res, next) => {
    const {id, password} = req.body;
    // id, password 중 하나라도 없으면 에러
    if(id === ''  || password === '' ){
        const error = new Error('id, password are required!');
        error.status = 400;
        next(error);
        return;
    }

    const connection = await pool.getConnection(async conn => conn);
    try{
        [rows, fields] = await connection.query('SELECT * FROM teacher WHERE id = ?', [id]);
        if(rows.length === 0){
            const error = new Error('등록되지 않은 아이디입니다!');
            error.status = 401;
            throw error;  
        }

        const isAuthorized = await bcrypt.compare(password, rows[0]['password']);
        if(!isAuthorized){
            const error = new Error('잘못된 비밀번호입니다!');
            error.status = 401;
            throw error;              
        }

        jwt.sign({
            id: id,
            name: rows[0].name
        },
        config.secret, {
            expiresIn: '1d'
        },
        (err, token) => {
            if(err){
                const error = new Error('token sign fail');
                error.status = 401;
                throw error;
            }else{
                res.set({ 'content-type': 'application/json; charset=utf-8' });
                res.send({
                    "status": 'success',
                    "code": 200,
                    "data": {
                        "token": token
                    },
                    "message": 'login success'
                });
            }
        })

    }catch(error){
        next(error);
    }finally{
        connection.release();
    }
})

/**
 * @swagger
 *  /api/login/student:
 *    post:
 *      tags: [Login]
 *      summary: 학생 로그인 API
 *      consumes:
 *          - application/json; charset=utf-8
 *      parameters:
 *         - in: body
 *           name: student
 *           description: 학생 정보
 *           schema:
 *              type: object
 *              required:
 *                  - id, password
 *              properties:
 *                  id:
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
 *              description: id, password 중 하나라도 없으면 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '401':
 *              description: 로그인 에러(없는 아이디 or 틀린 비밀번호)
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object       
 */

 router.post('/student', async (req, res, next) => {
    const {id, password} = req.body;
    // id, password 중 하나라도 없으면 에러
    if(id === ''  || password === '' ){
        const error = new Error('id, password are required!');
        error.status = 400;
        next(error);
        return;
    }

    const connection = await pool.getConnection(async conn => conn);
    try{
        [rows, fields] = await connection.query('SELECT * FROM student WHERE id = ?', [id]);
        if(rows.length === 0){
            const error = new Error('등록되지 않은 아이디입니다!');
            error.status = 401;
            throw error;  
        }

        const isAuthorized = await bcrypt.compare(password, rows[0]['password']);
        if(!isAuthorized){
            const error = new Error('잘못된 비밀번호입니다!');
            error.status = 401;
            throw error;              
        }

        jwt.sign({
            id: id,
            name: rows[0].name
        },
        config.secret, {
            expiresIn: '1d'
        },
        (err, token) => {
            if(err){
                const error = new Error('token sign fail');
                error.status = 401;
                throw error;
            }else{
                res.set({ 'content-type': 'application/json; charset=utf-8' });
                res.send({
                    "status": 'success',
                    "code": 200,
                    "data": {
                        "token": token
                    },
                    "message": 'login success'
                });
            }
        })

    }catch(error){
        next(error);
    }finally{
        connection.release();
    }
})


module.exports = router;