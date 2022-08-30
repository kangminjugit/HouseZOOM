var express = require('express');
const pool = require('../db/config');
var router = express.Router();
const {teacherAuthMiddleware} = require('../middlewares/authmiddleware');
const MessageFactory = require('../template/message');

/**
 * @swagger
 * tags:
 *  name: Badge
 *  description: 뱃지 API
 */

/**
 * @swagger
 *  /api/badge:
 *    post:
 *      tags: [Badge]
 *      summary: 학생에게 뱃지 제공 (선생님 토큰 필요)
 *      produces:
 *      - "application/json; charset=utf-8"
 *      parameters:
 *         - in: body
 *           name: badgeInfo
 *           description: 뱃지 정보
 *           schema:
 *              type: object
 *              required:
 *                  - studentId, point, subject
 *              properties:
 *                  studentId:
 *                      type: string
 *                  point:
 *                      type: integer
 *                  subject:
 *                      type: string
 *                  description:
 *                      type: string
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '400':
 *              description: studentId, point, subject 중 하나라도 없으면 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '404':
 *              description: 존재하지 않는 아이디입니다.
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */


 router.post(`/`,teacherAuthMiddleware, async (req, res, next) => {
    const {studentId, point, subject, description} = req.body;
    // id, name, password 중 하나라도 없으면 에러
    if(studentId === '' || studentId === 'undefined' || point === 'undefined' || subject==='' || subject === 'undefined'){
        const error = new Error('studentId, point, subject are required!');
        error.status = 400;
        next(error);
        return;
    }

    const connection = await pool.getConnection(async conn => conn);
    try{
        try{
            await connection.beginTransaction();

            var newSticker = null;

            // 뱃지 추가
            if(description){
                [newSticker] = await connection.query(
                    'INSERT INTO sticker(time, point, subject, description, studentId) VALUES(DATE_ADD(NOW(), INTERVAL 9 HOUR), ?, ?, ?, ?);', 
                    [point, subject, description, studentId]  
                );
            }else{
                [newSticker] = await connection.query(
                    'INSERT INTO sticker(time, point, subject, studentId) VALUES(DATE_ADD(NOW(), INTERVAL 9 HOUR), ?, ?, ?);', 
                    [point, subject, studentId]  
                );          
            }

            // 포인트 증가
            await connection.query('update student set point = point + ? where id = ?', [point, studentId]);

            await connection.commit();

            res.set({ 'content-type': 'application/json; charset=utf-8' });
            res.send(MessageFactory.createMessage('success', 200, {}, null));
            // res.send({
            //     "status": 'success',
            //     "code": 200,
            //     "data": {},
            //     "message": null
            // });
            await connection.release();
        }catch(error){
            await connection.rollback();
            throw error;
        }
    }catch(error){
        await connection.release();
        // 존재하지 않는 학생 아이디 에러
        if(error.code === 'ER_NO_REFERENCED_ROW_2'){
            let error = new Error('존재하지 않는 학생 아이디입니다!');
            error.status = 404;
            next(error);
        }else{
            next(error);
        }
    }
});

module.exports = router;