var express = require('express');
const pool = require('../db/config');
var router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Accept appliance
 *  description: 학생 승인/거절 관련 api
 */

/**
 * @swagger
 *  /api/apply?classId=#&teacherId=#:
 *    get:
 *      tags: [Accept appliance]
 *      summary: 승인 대기 중인 학생 리스트 조회 api (선생님 아이디 토큰 필요)
 *      produces:
 *      - "application/json; charset=utf-8"
 *      parameters:
 *          - in: query
 *            name: classId
 *            schema:
 *              type: string
 *            required: true
 *            description: 반 아이디
 *          - in: query
 *            name: teacherId
 *            schema:
 *              type: string
 *            required: true
 *            description: 선생님 아이디
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '400':
 *              description: classId, teacherId 중 하나라도 없으면 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.get(`/`,async (req, res, next) => {
    const {classId, teacherId} = req.query;

    // classId, teacherId 중 하나라도 없으면 에러
    if(classId==='' || teacherId==''){
        const error = new Error('classId, teacherId are required!');
        error.status = 400;
        next(error);
        return;       
    }

    const connection = await pool.getConnection(async conn => conn);
    try{   
        // 해당 반에 대해 승인 대기 중인 학생 아이디, 이름 
        const [rows] = await connection.query(
            `SELECT id, name FROM student WHERE class_id = ? AND isAccepted = ?`,
            [classId, 'WAIT']
        );

        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {
                'student_list': rows
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