var express = require('express');
const pool = require('../db/config');
const MessageFactory = require('../template/message');
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
    
    try{
        [rows, fields] = await pool.query('SELECT * FROM teacher WHERE id = ?', [id]);
        
        const isDuplicated = rows.length>0;
        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send(MessageFactory.createMessage('success', 200, {'isDuplicated': isDuplicated}, null));
    }catch(error){
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

    
    try{
        [rows, fields] = await pool.query('SELECT * FROM student WHERE id = ?', [id]);
        
        const isDuplicated = rows.length>0;
        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send(MessageFactory.createMessage('success', 200, {"isDuplicated": isDuplicated}, null));
    }catch(error){
        next(error);
    }
});

module.exports = router;