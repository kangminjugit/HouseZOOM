var express = require('express');
var router = express.Router();
const pool = require('../db/config');
const {teacherAuthMiddleware} = require('../middlewares/authmiddleware');

/**
 * @swagger
 * tags:
 *  name: Time table
 *  definition: 시간표
 */

/**
 * @swagger
 *  /api/time-table?classId=#:
 *    get:
 *      tags: [Time table]
 *      summary: 해당 반의 시간표 정보
 *      consumes:
 *          - application/json; charset=utf-8
 *      parameters:
 *         - in: query
 *           name: classId
 *           type: int
 *           description: 반 아이디
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '400':
 *              description: classId 없으면 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */
 router.get(`/`, async (req, res, next) => {
    const {classId} = req.query;

    if(classId === ''){
        const error = new Error('class id is required!');
        error.status = 400;
        next(error);
        return;
    }   

    const connection = await pool.getConnection(async conn => conn);
    try{
        [rows, fields] = await connection.query('select * from time_table where class_id = ?', [classId]);
        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {
                "time_table": rows
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
 *  /api/time-table:
 *    post:
 *      tags: [Time table]
 *      summary: 해당 반에 시간표 정보 추가/업데이트(선생님 계정 토큰 필요)
 *      consumes:
 *          - application/json; charset=utf-8
 *      parameters:
 *         - name: timeTable
 *           in: body
 *           description: 새로 추가/업데이트할 시간표 정보
 *           schema:
 *              type: object
 *              properties:
 *                  classId:
 *                      type: integer
 *                  timeTable:
 *                      type: array
 *                      items:
 *                          $ref: "#/definitions/timeTable"             
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '400':
 *              description: classId 없으면 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 * definitions:           
 *      timeTable:
 *          type: object
 *          properties:
 *              day:
 *                  type: string
 *              period:
 *                  type: integer
 *              subject:
 *                  type: string          
 */
 router.post(`/`,teacherAuthMiddleware, async (req, res, next) => {
    const {classId, timeTable} = req.body;
    if(classId === ''){
        const error = new Error('class id is required!');
        error.status = 400;
        next(error);
        return;
    }   

    const connection = await pool.getConnection(async conn => conn);
    try{
        
        [rows, fields] = await connection.query('select * from class where id = ?', [classId]);
        if(rows.length == 0){
            let error = new Error('존재하지 않는 반입니다!');
            error.status = 404;
            throw error;
        }

        try{
            await timeTable.forEach(async (elem) => {
                if(elem.day === undefined || elem.period === undefined || elem.subject === undefined){
                    let error = new Error('잘못된 json형식입니다!');
                    error.status = 404;
                    throw error;
                }
                var [isExist] = await connection.query('select * from time_table where day = ? and period = ?', [
                    elem.day, elem.period
                ]);
                

                if(isExist.length > 0){
                    await connection.query('UPDATE time_table SET subject = ? WHERE id = ?', [
                        elem.subject, isExist[0].id
                    ]);
                }
                else
                    await connection.query('insert into time_table(day, period, subject, class_id) values(?, ?, ?, ?)', [
                        elem.day, elem.period, elem.subject, classId
                    ]);

                res.set({ 'content-type': 'application/json; charset=utf-8' });
                res.send({
                    "status": 'success',
                    "code": 200,
                    "data": {},
                    "message": '시간표가 성공적으로 저장되었습니다!'
                });
            })
        }catch(err){
            await connection.rollback();
            throw error;
        }
    }catch(error){
        next(error);
    }finally{
        connection.release();
    }
});

module.exports = router;

