var express = require('express');
var router = express.Router();
const pool = require('../db/config');
const bcrypt = require('bcrypt');

const saltRounds = 10;
// /**
//  * @swagger
//  * tags:
//  *  name: Register
//  *  definition: 회원가입
//  */


// /**
//  * @swagger
//  *  /api/register/teacher:
//  *    post:
//  *      tags: [Register]
//  *      summary: 선생님 회원가입 API
//  *      consumes:
//  *          - application/json; charset=utf-8
//  *      parameters:
//  *         - in: body
//  *           name: teacher
//  *           description: 선생님 정보
//  *           schema:
//  *              type: object
//  *              required:
//  *                  - id, name, password, class_id
//  *              properties:
//  *                  id:
//  *                      type: string
//  *                  name:
//  *                      type: string
//  *                  password:
//  *                      type: string
//  *                  class_id:
//  *                      type: integer

//  *      responses:
//  *          '200':
//  *              description: OK
//  *              content:
//  *                  "application/json; charset=utf-8":
//  *                      schema:
//  *                          type: object
//  *                          properties:
//  *                              class_id:
//  *                                  type: integer
//  *                                  description: 반 아이디
//  *          '400':
//  *              description: school_code, name, auth_code, year 중 하나라도 없으면 에러
//  *              content:
//  *                  "application/json; charset=utf-8":
//  *                      schema:
//  *                          type: object
//  *          '422':
//  *              description: (school_code, year, name) 세트가 두 개 이상이면 에러 (같은 학교 같은 학년에 같은 이름의 반이 두 개 이상 있으면 안됨)
//  *              content:
//  *                  "application/json; charset=utf-8":
//  *                      schema:
//  *                          type: object
//  */

//  router.post(`/teacher`, async (req, res, next) => {
//     try{
//         const {id, name, password, class_id} = req.body;
//         // id, name, password, class_id 중 하나라도 없으면 에러
//         if(!id || !name || !password || !class_id){
//             const error = new Error('id, name, password, class_id are required!');
//             error.status = 400;
//             throw error;
//         }

//         // password 암호화
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         // 이미 담임선생님이 등록되어있는 반인지 확인
//         [rows, fields] = await pool.query('SELECT * FROM teacher WHERE class_id = ?', [class_id]);

//         if(rows.length>0){
//             const error = new Error('이미 등록된 담임선생님이 있는 반입니다!');
//             error.status = 405;
//             throw error;           
//         }

//         // 선생님 회원가입
//         [rows, fields] = await pool.query(
//             'INSERT INTO teacher(id, name, password, class_id) VALUES(?, ?, ?, ?)', 
//             [id, name, hashedPassword, class_id]);

//         res.set({ 'content-type': 'application/json; charset=utf-8' });
//         res.send({
//             "status": 'success',
//             "code": 200,
//             "data": null,
//             "message": 'Successfully add new teacher'
//         });
//     }catch(error){
//         next(error);
//     }
// });


module.exports = router;
