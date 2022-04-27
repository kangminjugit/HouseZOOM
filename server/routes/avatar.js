var express = require('express');
const pool = require('../db/config');
var router = express.Router();
const {studentAuthMiddleware} = require('../middlewares/authmiddleware');

/**
 * @swagger
 * tags:
 *  name: Avatar
 *  description: 캐릭터 꾸미기 관련 API
 */

/**
 * @swagger
 *  /api/avatar/default:
 *    get:
 *      tags: [Avatar]
 *      summary: 기본 캐릭터 몸통 
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "image/png":
 *                      schema:
 *                          type: object
 *                          properties:
 *                              image:
 *                                  type: image
 *                                  description: 기본 캐릭터
 */
 router.get(`/default`, async (req, res, next) => {
    res.set({ 'content-type': 'image/png' });
    res.sendFile('/Users/kangminju/Documents/GitHub/HouseZOOM/server/image/avatar_body.PNG');
});

/**
 * @swagger
 *  /api/avatar/cur-item?studentId=#:
 *    get:
 *      tags: [Avatar]
 *      summary: 학생의 아바타가 현재 입고있는 옷 반환 
 *      produces:
 *      - "application/json; charset=utf-8"
 *      parameters:
 *          - in: query
 *            name: studentId
 *            schema:
 *              type: string
 *            required: true
 *            description: 학생 아이디
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.get(`/cur-item`, async (req, res, next) => {
    const {studentId} = req.query;

    if(studentId === ''){
        const error = new Error('student id is required!');
        error.status = 400;
        next(error);
        return;
    }   

    const connection = await pool.getConnection(async conn => conn);
    try{
        [rows, fields] = await connection.query('select item.id, item.name, item.type, item.image from my_item,item where my_item.item_id=item.id and my_item.is_cur=1 and my_item.student_id=?', [studentId]);
        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {
                "items": rows
            },
            "message": null
        });
    }catch(error){
        next(error);
    }finally{
        connection.release();
    }
});


/**
 * @swagger
 *  /api/avatar/all-item?type=#:
 *    get:
 *      tags: [Avatar]
 *      summary: 해당 type의 전체아이템 조회 api
 *      produces:
 *      - "application/json; charset=utf-8"
 *      parameters:
 *          - in: query
 *            name: type
 *            schema:
 *              type: string
 *            required: true
 *            description: 아이템 타입(top, bottom, hair, *) -- *는 전체 아이템 의미
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.get(`/all-item`, async (req, res, next) => {
    const {type} = req.query;

    if(type === '' || type === undefined){
        const error = new Error('type is required!');
        error.status = 400;
        next(error);
        return;
    }   

    const connection = await pool.getConnection(async conn => conn);
    try{
        if(type === '*'){
            [rows, fields] = await connection.query('select * from item');
        }else{
            [rows, fields] = await connection.query('select * from item where type = ?', [type]);
        }
        
        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {
                "items": rows
            },
            "message": null
        });
    }catch(error){
        next(error);
    }finally{
        connection.release();
    }
});

module.exports = router;