var express = require('express');
const pool = require('../db/config');
var router = express.Router();
const {teacherAuthMiddleware, studentAuthMiddleware} = require('../middlewares/authmiddleware');

/**
 * @swagger
 * tags:
 *  name: Point
 *  description: 칭찬포인트 API
 */


/**
 * @swagger
 *  /api/point:
 *    get:
 *      tags: [Point]
 *      summary: 각 학생의 포인트 정보 조회 (학생 토큰 필요)
 *      produces:
 *      - "application/json; charset=utf-8"
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.get(`/`,studentAuthMiddleware, async (req, res, next) => {
    const connection = await pool.getConnection(async conn => conn);
    try{
        const [rows, fields] = await connection.query('select id,name, point from student where id = ?', [req.id]);
        
        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {
                'id': rows[0].id,
                'name':rows[0].name,
                'point':rows[0].point
            },
            "message": null
        });
        connection.release();
    }catch(error){
        connection.release();
        next(error);
    }
});



/**
 * @swagger
 *  /api/point/class?classId=#:
 *    get:
 *      tags: [Point]
 *      summary: 반에 속하는 학생들의 포인트 정보 조회(선생님 토큰 필요)
 *      produces:
 *      - "application/json; charset=utf-8"
 *      parameters:
 *         - in: query
 *           name: classId
 *           type: integer
 *           description: 반 아이디
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.get(`/class`,teacherAuthMiddleware, async (req, res, next) => {
    const {classId} = req.query;
    if(classId === null || classId === undefined){
        const error = new Error('classId is required!');
        error.status = 400;
        next(error);
        return;  
    }

    try{
        const [rows, fields] = await pool.query('select id, name, point from student where class_id = ?', [classId]);
        
        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {
                'studentPointArr': rows
            },
            "message": null
        });
    }catch(error){
        next(error);
    }
});


/**
 * @swagger
 *  /api/point:
 *    post:
 *      tags: [Point]
 *      summary: 학생에게 칭찬 포인트 제공 (선생님 토큰 필요)
 *      produces:
 *      - "application/json; charset=utf-8"
 *      parameters:
 *         - in: body
 *           name: pointInfo
 *           description: 칭찬 포인트 정보
 *           schema:
 *              type: object
 *              required:
 *                  - studentId, point
 *              properties:
 *                  studentId:
 *                      type: string
 *                  point:
 *                      type: integer
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '400':
 *              description: studentId, point 중 하나라도 없으면 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '422':
 *              description: 이미 존재하는 아이템을 장바구니에 추가할 때
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */


 router.post(`/`,teacherAuthMiddleware, async (req, res, next) => {
    const {studentId, point} = req.body;
    // id, name, password 중 하나라도 없으면 에러
    if(studentId === '' || studentId === 'undefined' || point === 'undefined' ){
        const error = new Error('studentId, point are required!');
        error.status = 400;
        next(error);
        return;
    }

    const connection = await pool.getConnection(async conn => conn);
    try{
        await connection.query('update student set point = point + ? where id = ?', [point, studentId]);
        [rows, fields] = await connection.query('select id, point from student where id = ?', [studentId]);

        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {
                "updatedPointInfo": rows
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