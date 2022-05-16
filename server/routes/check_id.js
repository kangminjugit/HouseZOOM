var express = require('express');
const pool = require('../db/config');
var router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Check
 *  description: 아이디 중복 체크
 */

/**
 * @swagger
 *  /api/check/teacher?id=#:
 *    get:
 *      tags: [Check]
 *      summary: 선생님 아이디 중복 확인 API
 *      consumes:
 *          - application/json; charset=utf-8
 *      parameters:
 *         - in: query
 *           name: id
 *           type: string
 *           description: 선생님 아이디

 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '400':
 *              description: id 없으면 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */
 router.get(`/teacher`, async (req, res, next) => {
    const {id} = req.query;

    if(id === ''){
        const error = new Error('id is required!');
        error.status = 400;
        next(error);
        return;
    }    

    const connection = await pool.getConnection(async conn => conn);
    
    try{
        [rows, fields] = await connection.query('SELECT * FROM teacher WHERE id = ?', [id]);
        
        const isDuplicated = rows.length>0;
        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {
                "isDuplicated": isDuplicated
            },
            "message": null
        });
        await connection.release();
    }catch(error){
        await connection.release();
        next(error);
    }
});



/**
 * @swagger
 *  /api/check/student?id=#:
 *    get:
 *      tags: [Check]
 *      summary: 학생 아이디 중복 확인 API
 *      consumes:
 *          - application/json; charset=utf-8
 *      parameters:
 *         - in: query
 *           name: id
 *           type: string
 *           description: 학생 아이디

 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '400':
 *              description: id 없으면 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */
 router.get(`/student`, async (req, res, next) => {
    const {id} = req.query;

    if(id === ''){
        const error = new Error('id is required!');
        error.status = 400;
        next(error);
        return;
    }    

    const connection = await pool.getConnection(async conn => conn);
    
    try{
        [rows, fields] = await connection.query('SELECT * FROM student WHERE id = ?', [id]);
        
        const isDuplicated = rows.length>0;
        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {
                "isDuplicated": isDuplicated
            },
            "message": null
        });
        await connection.release();
    }catch(error){
        await connection.release();
        next(error);
    }
});

module.exports = router;