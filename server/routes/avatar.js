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
    try{
        [rows, fields] = await pool.query('select item.id, item.name, item.type, item.image from my_item,item where my_item.item_id=item.id and my_item.is_cur=1 and my_item.student_id=?', [req.id]);
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

    try{
        if(type === '*'){
            [rows, fields] = await pool.query('select item.id, item.name, item.type, item.image, my_item.is_cur as isUsed from my_item, item where my_item.item_id = item.id and my_item.student_id = ?', [req.id]);
        }else{
            [rows, fields] = await pool.query('select item.id, item.name, item.type, item.image, my_item.is_cur as isUsed from my_item, item where my_item.item_id = item.id and my_item.student_id = ? and item.type = ?', [req.id, type]);
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
    }
});


/**
 * @swagger
 *  /api/avatar/put-on?itemId=#:
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
    try{
        [rows, fields] = await pool.query('UPDATE my_item SET is_cur = ? where item_id = ? and student_id = ?', [1,itemId,req.id]);

        if(rows.affectedRows === 0){
            const error = new Error('사용자가 가지고 있지 않은 아이템입니다!');
            error.status = 403;
            next(error);
            return;          
        }

        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {},
            "message": '아이템을 성공적으로 착용하였습니다.'
        });
    }catch(error){
        next(error);
    }
});


/**
 * @swagger
 *  /api/avatar/take-off?itemId=#:
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

    try{
        [rows, fields] = await pool.query('UPDATE my_item SET is_cur = ? where item_id = ? and student_id = ?', [0,itemId,req.id]);
        if(rows.affectedRows === 0){
            const error = new Error('사용자가 가지고 있지 않은 아이템입니다!');
            error.status = 403;
            next(error);
            return;          
        }

        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {},
            "message": '아이템을 성공적으로 해제하였습니다.'
        });
    }catch(error){
        next(error);
    }
});


/**
 * @swagger
 *  /api/avatar/class?classId=#:
 *    get:
 *      tags: [Avatar]
 *      summary: 반 학생들 캐릭터들이 현재 입고있는 아이템들 조회 api
 *      produces:
 *      - "application/json; charset=utf-8"
 *      parameters:
 *          - in: query
 *            name: classId
 *            schema:
 *              type: integer
 *            required: true
 *            description: 조회하고싶은 반의 아이디
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.get(`/class`, async (req, res, next) => {
    const {classId} = req.query;

    if(classId === '' || classId === undefined){
        const error = new Error('classId is required!');
        error.status = 400;
        next(error);
        return;
    }   

    try{
        var [rows, fields] = await pool.query("select student.id as student_id, student.name as student_name,item_type, item_image\
        from student left outer join (\
            select item.id as id, my_item.student_id as student_id, item.image as item_image, item.type as item_type\
            from item, my_item\
            where item.id = my_item.item_id and my_item.is_cur = 1\
        ) as item\
        on student.id = item.student_id\
        where student.class_id = ?", [classId]);
        
        var studentDict = {};
        rows.forEach(row => {
            if(!studentDict[row['student_id']]){
                studentDict[row['student_id']] = {};
                studentDict[row['student_id']]['student_name'] = row['student_name'];
            }

            if(!studentDict[row['student_id']]['itemList']){
                studentDict[row['student_id']]['itemList'] = [];
            }

            if(!(row['item_type'] == null || row['item_image'] == null)){
                studentDict[row['student_id']]['itemList'].push({
                    'item_type': row['item_type'],
                    'item_image': row['item_image']
                });                
            }

        });

        var result = [];
        for (var key in studentDict) {
            if (studentDict.hasOwnProperty(key)) {
                result.push( {
                    'student_id': key,
                    'student_name' : studentDict[key]['student_name'],
                    'itemList': studentDict[key]['itemList']
                });
            }
        }

        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {
                "result": result
            },
            "message": null
        });
    }catch(error){
        next(error);
    }
});
module.exports = router;