var express = require('express');
const pool = require('../db/config');
var router = express.Router();
const {teacherAuthMiddleware} = require('../middlewares/authmiddleware');

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

 router.get(`/`,teacherAuthMiddleware, async (req, res, next) => {
    const {classId, teacherId} = req.query;

    // classId, teacherId 중 하나라도 없으면 에러
    if(classId==='' || teacherId==''){
        const error = new Error('classId, teacherId are required!');
        error.status = 400;
        next(error);
        return;       
    }

    try{   
        // 해당 반에 대해 승인 대기 중인 학생 아이디, 이름 
        const [rows] = await pool.query(
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
    }
});

/**
 * @swagger
 *  /api/apply/accept:
 *    post:
 *      tags: [Accept appliance]
 *      summary: 학생 승인 (선생님 아이디 토큰 필요)
 *      produces:
 *      - "application/json; charset=utf-8"
 *      parameters:
 *         - in: body
 *           name: studentId
 *           description:  승인할 학생 아이디
 *           schema:
 *              type: object
 *              required:
 *                  - studentId
 *              properties:
 *                  studentId:
 *                      type: string
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '400':
 *              description: classId, teacherId, studentId 중 하나라도 없으면 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.post(`/accept`, teacherAuthMiddleware, async (req, res, next) => {
    const {studentId} = req.body;

    // studentId 없으면 에러
    if(studentId===''){
        let error = new Error('classId, teacherId, studentId are required!');
        error.status = 400;
        next(error);
        return;       
    }
    try{
        await pool.query(
            'update student set isAccepted = ? where id = ?', [
                'ACCEPT', studentId
            ]
        );

        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {},
            "message": `${studentId}를 정상적으로 승인했습니다.`
        }); 
    }catch(err){
        next(err);
    }
});



/**
 * @swagger
 *  /api/apply/deny:
 *    post:
 *      tags: [Accept appliance]
 *      summary: 학생 거절 (선생님 아이디 토큰 필요)
 *      produces:
 *      - "application/json; charset=utf-8"
 *      parameters:
 *         - in: body
 *           name: studentId
 *           description:  거절할 학생 아이디
 *           schema:
 *              type: object
 *              required:
 *                  - studentId
 *              properties:
 *                  studentId:
 *                      type: string
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '400':
 *              description: classId, teacherId, studentId 중 하나라도 없으면 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.post(`/deny`, teacherAuthMiddleware, async (req, res, next) => {
    const {studentId} = req.body;

    // studentId 없으면 에러
    if(studentId===''){
        let error = new Error('classId, teacherId, studentId are required!');
        error.status = 400;
        next(error);
        return;       
    }

    try{
        await pool.query(
            'update student set isAccepted = ? where id = ?', [
                'DENY', studentId
            ]
        );

        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {},
            "message": `${studentId}를 정상적으로 거절했습니다.`
        }); 
    }catch(err){
        next(err);
    }
});

module.exports = router;