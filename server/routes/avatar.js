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
 *      summary: 아바타 기본 몸통
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */
 router.get(`/default`, async (req, res, next) => {
    res.set({ 'content-type': 'application/json; charset=utf-8' });
    res.send({
        "status": 'success',
        "code": 200,
        "data": {
            "avatarBody":  'https://housezoombucket.s3.ap-northeast-2.amazonaws.com/1652194871637_avatar_body.png'
        },
        "message": null
    });
});

/**
 * @swagger
 *  /api/avatar/cur-item?studentId=#:
 *    get:
 *      tags: [Avatar]
 *      summary: 학생의 아바타가 현재 입고있는 옷 반환 (학생 토큰 필요)
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.get(`/cur-item`,studentAuthMiddleware, async (req, res, next) => {
    const connection = await pool.getConnection(async conn => conn);
    try{
        [rows, fields] = await connection.query('select item.id, item.name, item.type, item.image from my_item,item where my_item.item_id=item.id and my_item.is_cur=1 and my_item.student_id=?', [req.id]);
        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {
                "items": rows
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
 *  /api/avatar/my-item?type=#:
 *    get:
 *      tags: [Avatar]
 *      summary: 학생이 가지고있는 아이템 조회 api (학생 토큰 필요)
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

 router.get(`/my-item`,studentAuthMiddleware, async (req, res, next) => {
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
            [rows, fields] = await connection.query('select item.id, item.name, item.type, item.image from my_item, item where my_item.item_id = item.id and my_item.student_id = ?', [req.id]);
        }else{
            [rows, fields] = await connection.query('select item.id, item.name, item.type, item.image from my_item, item where my_item.item_id = item.id and my_item.student_id = ? and item.type = ?', [req.id, type]);
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
        await connection.release();
    }catch(error){
        await connection.release();
        next(error);
    }
});


/**
 * @swagger
 *  /api/avatar/put-on?id=#:
 *    post:
 *      tags: [Avatar]
 *      summary: 아이템 입기 api (학생 토큰 필요)
 *      produces:
 *      - "application/json; charset=utf-8"
 *      parameters:
 *          - in: query
 *            name: itemId
 *            schema:
 *              type: string
 *            required: true
 *            description: 입을 아이템 아이디
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '403':
 *              description: 사용자가 갖고있지 않은 아이템 
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.post(`/put-on`,studentAuthMiddleware, async (req, res, next) => {
    const {itemId} = req.query;

    if(itemId === '' || itemId === undefined){
        const error = new Error('item id is required!');
        error.status = 400;
        next(error);
        return;
    }   

    const connection = await pool.getConnection(async conn => conn);
    try{
        [rows, fields] = await connection.query('select * from my_item where item_id = ? and student_id = ?', [itemId,req.id]);
        
        if(rows.length === 0){
            const error = new Error('사용자가 가지고있지 않은 아이템입니다!');
            error.status = 403;
            next(error);
            return;    
        }
        [rows, fields] = await connection.query('UPDATE my_item SET is_cur = ? where item_id = ? and student_id = ?', [1,itemId,req.id]);

        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {},
            "message": '아이템을 성공적으로 착용하였습니다.'
        });
        await connection.release();
    }catch(error){
        await connection.release();
        next(error);
    }
});


/**
 * @swagger
 *  /api/avatar/take-off?id=#:
 *    post:
 *      tags: [Avatar]
 *      summary: 아이템 벗기 api (학생 토큰 필요)
 *      produces:
 *      - "application/json; charset=utf-8"
 *      parameters:
 *          - in: query
 *            name: itemId
 *            schema:
 *              type: string
 *            required: true
 *            description: 벗을 아이템 아이디
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '403':
 *              description: 사용자가 갖고있지 않은 아이템 
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.post(`/take-off`,studentAuthMiddleware, async (req, res, next) => {
    const {itemId} = req.query;

    if(itemId === '' || itemId === undefined){
        const error = new Error('item id is required!');
        error.status = 400;
        next(error);
        return;
    }   

    const connection = await pool.getConnection(async conn => conn);
    try{
        [rows, fields] = await connection.query('select * from my_item where item_id = ? and student_id = ?', [itemId,req.id]);
        
        if(rows.length === 0){
            const error = new Error('사용자가 가지고있지 않은 아이템입니다!');
            error.status = 403;
            next(error);
            return;    
        }
        [rows, fields] = await connection.query('UPDATE my_item SET is_cur = ? where item_id = ? and student_id = ?', [0,itemId,req.id]);

        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {},
            "message": '아이템을 성공적으로 해제하였습니다.'
        });
        await connection.release();
    }catch(error){
        await connection.release();
        next(error);
    }
});
module.exports = router;