var express = require('express');
var router = express.Router();
const pool = require('../db/config');
const { teacherAuthMiddleware } = require('../middlewares/authmiddleware');

/**
 * @swagger
 * tags:
 *  name: Student
 *  definition: 학생 관련 API
 */

/**
 * @swagger
 *  /api/student?classId=#:
 *    get:
 *      tags: [Student]
 *      summary: 반 학생 리스트 조회 API (선생님 토큰 필요)
 *      consumes:
 *          - application/json; charset=utf-8
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
 *          '400':
 *              description: classId 없으면 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '403':
 *              description: 해당 반이 선생님 계정에 등록되어있지 않은 반인 경우
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.get('/', teacherAuthMiddleware, async (req, res, next) => {
    const {classId} = req.query;
    if(classId === null || classId === undefined){
        const error = new Error('classId is required!');
        error.status = 400;
        next(error);
        return;  
    }

    const connection = await pool.getConnection(async conn => conn);
    try{
        const [rows] = await connection.query(`select student.id, student.name, student.point from student, class_teacher where student.class_id = class_teacher.class_id and student.class_id = ? and class_teacher.teacher_id = ? order by student.name;`, [classId, req.id]);

        if(rows.length === 0){
            const error = new Error('선생님 계정에 등록되어있지 않은 반입니다!');
            error.status = 403;
            next(error);
            return;  
        }

        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            'status': 'success',
            'code': 200,
            'data': {
                'studentList': rows
            },
            'message': null
        })
    }catch(error){
        next(error);
    }finally{
        connection.release();
    }
});

module.exports = router;