var express = require('express');
const pool = require('../db/config');
const bcrypt = require('bcrypt');
const {teacherAuthMiddleware, authmiddleware} = require('../middlewares/authmiddleware');
var router = express.Router();

const saltRounds = 10;

/**
 * @swagger
 * tags:
 *  name: Class
 *  description: 반
 */


/**
 * @swagger
 *  /api/class:
 *    post:
 *      tags: [Class]
 *      summary: 반 생성 API(선생님 계정으로 로그인 필요!)
 *      consumes:
 *          - application/json; charset=utf-8
 *      parameters:
 *         - in: body
 *           name: class
 *           description:  반 생성 정보
 *           schema:
 *              type: object
 *              required:
 *                  - school_code, name, auth_code, year
 *              properties:
 *                  school_code:
 *                      type: string
 *                  name:
 *                      type: string
 *                  auth_code:
 *                      type: string
 *                  year:
 *                      type: integer

 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *                          properties:
 *                              class_id:
 *                                  type: integer
 *                                  description: 반 아이디
 *          '400':
 *              description: school_code, name, auth_code, year 중 하나라도 없으면 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '403':
 *              description: 토큰 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '422':
 *              description: (school_code, year, name) 세트가 두 개 이상이면 에러 (같은 학교 같은 학년에 같은 이름의 반이 두 개 이상 있으면 안됨)
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.post(`/`, teacherAuthMiddleware, async (req, res, next) => {
    const {school_code, name, auth_code, year} = req.body;

    // school_code, name, auth_code, year 중 하나라도 없으면 에러
    if(school_code==='' || name==='' || auth_code==='' || year === null){
        let error = new Error('school_code, name, auth_code, year are required!');
        error.status = 400;
        next(error);
        return;       
    }

    const connection = await pool.getConnection(async conn => conn);
    try{
        // 생성한 인증코드 암호화
        const hashedAuthCode = await bcrypt.hash(auth_code, saltRounds);

        const [school] = await connection.query(
            'SELECT * FROM school WHERE school_code = ?', 
            [school_code, name, year]);

        if(school.length === 0){
            let error = new Error('해당하는 학교가 존재하지 않습니다!');
            error.status = 404;
            throw error;
        }

        // 반 생성 & 선생님-반 연결 관계 생성
        try{
            await connection.beginTransaction();
            const [newClass] = await connection.query(
                'INSERT INTO class(school_code, name, auth_code, year) VALUES(?, ?, ?, ?)', 
                [school_code, name, hashedAuthCode, year]  
            );

            await connection.query(
                'INSERT INTO class_teacher(class_id, teacher_id) VALUES(?, ?)',
                [newClass.insertId, req.id]
            );

            await connection.commit();

            res.set({ 'content-type': 'application/json; charset=utf-8' });
            res.send({
                "status": 'success',
                "code": 200,
                "data": {
                    'class_id': newClass.insertId
                },
                "message": 'Successfully add new class'
            }); 
        
        }catch(error){
            await connection.rollback();
            throw error;
        }
       
    }catch(error){
        // (school_code, year, name) 쌍이 unique하지 않으면 에러
        if(error.code === 'ER_DUP_ENTRY'){
            let error = new Error('같은 학교, 같은 학년에 이미 같은 이름의 반이 존재합니다!');
            error.status = 422;
            next(error);
        }else{
            next(error);
        }
    }finally{
        connection.release();
    }
});


/**
 * @swagger
 *  /api/class?school_code=#&year=#:
 *    get:
 *      tags: [Class]
 *      summary: 특정 학교, 학년에 대한 반 리스트 API
 *      produces:
 *      - "application/json; charset=utf-8"
 *      parameters:
 *          - in: query
 *            name: school_code
 *            schema:
 *              type: string
 *            example: 7021079
 *            required: true
 *            description: 표준 학교 코드
 *          - in: query
 *            name: year
 *            schema:
 *              type: integer
 *            example: 1
 *            required: true
 *            description: 학년
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *                          properties:
 *                              class_id:
 *                                  type: integer
 *                                  description: 반 아이디
 *          '400':
 *              description: school_code, name, auth_code, year 중 하나라도 없으면 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '422':
 *              description: (school_code, year, name) 세트가 두 개 이상이면 에러 (같은 학교 같은 학년에 같은 이름의 반이 두 개 이상 있으면 안됨)
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.get(`/`,async (req, res, next) => {
    const {school_code, year} = req.query;

    // school_code, year 중 하나라도 없으면 에러
    if(school_code==='' || year==null){
        const error = new Error('school_code, year are required!');
        error.status = 400;
        next(error);
        return;       
    }

    const connection = await pool.getConnection(async conn => conn);
    try{   
        // 특정 학교의 특정 학년 안에 반 정보 리스트 불러오기
        const [rows] = await connection.query(
            `SELECT id, name FROM class WHERE school_code = ? AND year = ?`,
            [req.query.school_code, req.query.year]
        );

        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {
                'class_list': rows
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
 *  /api/class:
 *    delete:
 *      tags: [Class]
 *      summary: 반 삭제 API (선생님 계정으로 로그인 필요!)
 *      consumes:
 *          - application/json; charset=utf-8
 *      parameters:
 *         - in: body
 *           name: class
 *           description: 반 정보
 *           schema:
 *              type: object
 *              required:
 *                  - class_id, auth_code
 *              properties:
 *                  class_id:
 *                      type: integer
 *                  auth_code:
 *                      type: string

 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '400':
 *              description: class_id, auth_code 없으면 에러
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '403':
 *              description: 토큰 에러 / 반 삭제 권한 없음 에러(인증코드 틀렸을 때)
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '404':
 *              description: 존재하지 않는 반 아이디 에러
 */

 router.delete(`/`, teacherAuthMiddleware, async (req, res, next) => {
    const {class_id, auth_code} = req.body;

    // school_code, name, auth_code, year 중 하나라도 없으면 에러
    if(class_id === null || auth_code === null || class_id === undefined || auth_code === undefined){
        const error = new Error('class_id, auth_code are required!');
        error.status = 400;
        next(error);
        return;       
    }

    const connection = await pool.getConnection(async conn => conn);
    try{
        const [existingClass] = await connection.query(
            'SELECT auth_code FROM class WHERE id = ?',
            [class_id]
        );

        if(existingClass.length === 0){
            let error = new Error('존재하지 않는 반입니다!');
            error.status = 404;
            throw error;
        }

        const isAuthorized = await bcrypt.compare(auth_code, existingClass[0].auth_code);
        if(!isAuthorized){
            let error = new Error('인증코드가 틀렸습니다!');
            error.status = 403;
            throw error;  
        }

        
        try{
            await connection.beginTransaction();

            await connection.query(
                'DELETE FROM class_teacher WHERE class_id = ? AND teacher_id = ?',
                [class_id, req.id]);
            await connection.query(
                'DELETE FROM class WHERE id = ?',
                [class_id]);
    
            await connection.commit();

            // 정상적으로 행 추가 후엔 새로 추가된 반의 id를 response로 보냄
            res.set({ 'content-type': 'application/json; charset=utf-8' });
            res.send({
                "status": 'success',
                "code": 200,
                "data": null,
                "message": 'Successfully delete class'
            });  
        }catch(error){
            await connection.rollback();
            throw error;
        }

    }catch(error){
        next(error);
    }finally{
        connection.release();
    }
});




/**
 * @swagger
 *  /api/class/authorize:
 *    post:
 *      tags: [Class]
 *      summary: 반 인증코드 확인 API
 *      consumes:
 *          - application/json; charset=utf-8
 *      parameters:
 *         - in: body
 *           name: class
 *           description:  특정 반 아이디와 인증코드
 *           schema:
 *              type: object
 *              required:
 *                  - id, auth_code, 
 *              properties:
 *                  id:
 *                      type: integer
 *                  auth_code:
 *                      type: string
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: Object
 *                          properties:
 *                              class_id:
 *                                  type: integer
 *                                  description: 반 아이디
 *          '404':
 *              description: 해당 아이디의 반이 존재하지 않음
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.post(`/authorize`, async (req, res, next) => {
    const {id, auth_code} = req.body;
    if(id==null || auth_code ===''){
        const error = new Error('school_code, year are required!');
        error.status = 400;
        next(error);
        return;            
    }

    const connection = await pool.getConnection(async conn => conn);
    try{
        const [rows] = await connection.query(
            'SELECT auth_code FROM class WHERE id = ?',
            [id]
        );

        if(!rows.length){
            const error = new Error("존재하지 않는 반입니다!");
            error.status = 404;
            throw error;           
        }

        const isAuthorized = await bcrypt.compare(auth_code, rows[0]['auth_code']);
        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {
                'result': isAuthorized
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