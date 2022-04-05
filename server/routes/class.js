var express = require('express');
const db = require('../db/config');
const bcrypt = require('bcrypt');
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
 *      summary: 반 생성 API
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
 *          '422':
 *              description: (school_code, year, name) 세트가 두 개 이상이면 에러 (같은 학교 같은 학년에 같은 이름의 반이 두 개 이상 있으면 안됨)
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

router.post(`/`, (req, res, next) => {
    // school_code, name, auth_code, year 중 하나라도 없으면 에러
    if(!req.body.school_code || !req.body.name || !req.body.auth_code || !req.body.year){
        const error = new Error('school_code, name, auth_code, year are required!');
        error.status = 400;
        next(error);
        return;       
    }

    // auth_code는 암호화하여 저장
    bcrypt.hash(req.body.auth_code, saltRounds).then(function(hash) {

    // class 테이블에 새로운 반에 대한 행 추가
        db.query('INSERT INTO class(school_code, name, auth_code, year) VALUES(?, ?, ?, ?)', [req.body.school_code, req.body.name, hash, req.body.year], (err, rows, fields) => {
            if(err){
                // (school_code, year, name) 쌍이 unique하지 않으면 에러
                if(err.code === 'ER_DUP_ENTRY'){
                    const error = new Error('같은 학교, 같은 학년에 이미 같은 이름의 반이 존재합니다!');
                    error.status = 422;
                    next(error);
                    return;
                }
                next(err);
                return;
            }
            
            // 정상적으로 행 추가 후엔 새로 추가된 행의 id를 response로 보냄
            res.set({ 'content-type': 'application/json; charset=utf-8' });
            res.send({
                "status": 'success',
                "code": 200,
                "data": {
                    'class_id': rows.insertId
                },
                "message": 'Successfully add new class'
            });
        })
    });
});

  



/**
 * @swagger
 *  /api/class:
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

 router.get(`/`, (req, res, next) => {
    // school_code, name, auth_code, year 중 하나라도 없으면 에러
    if(!req.query.school_code.length || !req.query.year.length){
        const error = new Error('school_code, year are required!');
        error.status = 400;
        next(error);
        return;       
    }


    db.query(`SELECT id, name  FROM class WHERE school_code = ? AND year = ?`, [req.query.school_code, req.query.year], (err, rows, fields) => {
        if(err){
            next(err);
            return;
        }    
        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {
                'class_list': rows
            },
            "message": null
        });   
    })
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

 router.post(`/authorize`, (req, res, next) => {
    db.query('SELECT auth_code FROM class WHERE id = ?', [req.body.id], (err, rows, fields) => {
        if(err) next(err);
        if(!rows.length){
            const error = new Error("해당 반이 존재하지 않습니다!");
            error.status = 404;
            next(error);
        }
        bcrypt.compare(req.body.auth_code, rows[0]['auth_code']).then(function(result) {
            res.set({ 'content-type': 'application/json; charset=utf-8' });
            res.send({
                "status": 'success',
                "code": 200,
                "data": {
                    'result': result
                },
                "message": null
            });  
        }).catch(error => {
            next(error);
        });
    })

});
module.exports = router;