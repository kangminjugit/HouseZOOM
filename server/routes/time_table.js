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
    try{
        [rows, fields] = await pool.query('select * from time_table where class_id = ?', [classId]);
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
 *                  required: true
 *                  type: string
 *              period:
 *                  required: true
 *                  type: integer
 *              subject:
 *                  type: string  
 *              zoom_url:
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

        connection.release();

        try{
            const updateTimeTableFunction = async function(elem){
                if(elem.day === undefined || elem.period === undefined || elem.subject === undefined){
                    let error = new Error('잘못된 json형식입니다!');
                    error.status = 404;
                    throw error;
                }

                var [isExist] = await connection.query('select * from time_table where day = ? and period = ? and class_id = ?', [
                    elem.day, elem.period, classId
                ]);
                

                if(isExist.length > 0){
                    if(elem.zoom_url === undefined){
                        connection.query('UPDATE time_table SET subject = ? WHERE id = ?', [
                            elem.subject, isExist[0].id
                        ]);                        
                    }else{
                        connection.query('UPDATE time_table SET subject = ? , zoom_url = ? WHERE id = ?', [
                            elem.subject,elem.zoom_url, isExist[0].id
                        ]);
                    }

                }
                else{
                    if(elem.zoom_url === undefined){
                        connection.query('insert into time_table(day, period, subject, class_id, zoom_url) values(?, ?, ?, ?, ?)', [
                            elem.day, elem.period, elem.subject, classId, elem.zoom_url
                        ]);
                    }else{
                        connection.query('insert into time_table(day, period, subject, class_id) values(?, ?, ?, ?)', [
                            elem.day, elem.period, elem.subject, classId
                        ]);
                    }

                }
            }

            await Promise.all(timeTable.map(elem => updateTimeTableFunction(elem)));

            res.set({ 'content-type': 'application/json; charset=utf-8' });
            res.send({
                "status": 'success',
                "code": 200,
                "data": {},
                "message": '시간표가 성공적으로 저장되었습니다!'
            });

            connection.release();
        }catch(err){
            await connection.rollback();
            throw err;
        }
    }catch(error){
        connection.release();
        next(error);
    }
});


/**
 * @swagger
 *  /api/time-table:
 *    delete:
 *      tags: [Time table]
 *      summary: 해당 반의 전체 시간표 삭제(선생님 토큰 필요!) 
 *      consumes:
 *          - application/json; charset=utf-8
 *      parameters:
 *         - in: body
 *           name: class
 *           description: 반 아이디
 *           schema:
 *              type: object
 *              required:
 *                  - class_id
 *              properties:
 *                  class_id:
 *                      type: integer    
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

 router.delete(`/`, teacherAuthMiddleware, async (req, res, next) => {
    const {class_id, auth_code} = req.body;

    // school_code, name, auth_code, year 중 하나라도 없으면 에러
    if(class_id === null || class_id === undefined){
        const error = new Error('class_id is required!');
        error.status = 400;
        next(error);
        return;       
    }

    try{
        await pool.query(
            'DELETE FROM time_table WHERE class_id = ? ',
            [class_id]);

        
        // 정상적으로 행 추가 후엔 새로 추가된 반의 id를 response로 보냄
        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": null,
            "message": '성공적으로 시간표를 삭제하였습니다.'
        });  

    }catch(error){
        next(error);
    }
});


module.exports = router;

