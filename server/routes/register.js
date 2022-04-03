var express = require('express');
var router = express.Router();
const db = require('../db/config');
const bcrypt = require('bcrypt');

const saltRounds = 10;
/**
 * @swagger
 * tags:
 *  name: Register
 *  definition: 회원가입
 */


// /**
//  * @swagger
//  *  /api/student_register:
//  *    post:
//  *      tags: [Register]
//  *      summary: 학생 회원가입 API
//  *      produces:
//  *      - "application/json; charset=utf-8"
//  *      parameters:
//  *        - in: query
//  *          name: body
//  *          description: 학생 회원가입 정보
//  *          required: true
//  *          schema:
//  *              type: object
//  *              properties:
//  *                  id:
//  *                      type: string
//  *                  password:
//  *                      type: string
//  *                  name:
//  *                      type: string
//  *                  group_id:
//  *                      type: integer
//  */
// router.post('/register', (req,res, next) => {
//   console.log(req.body);
//   const param = [req.body.id, req.body.password, req.body.name, 0, req.body.group_id];
// //   bcrypt.hash(param[1], saltRounds, (error, hash) => {
// //     param[1] = hash;
// //     db.query(`INSERT INTO student ('id', 'password', 'name', 'avatar_id', 'group_id') VALUES (?, ?, ?, ?, ?)`, param, (err, row) => {
// //       if(err) console.log(err);
// //     });
// //   });
//     db.query(`INSERT INTO student (id, password, name, avatar_id, group_id) VALUES (?, ?, ?, ?, ?)`, param, (err, row) => {
//         if(err) console.log(err);
//     });
//   res.end();
// });



module.exports = router;
