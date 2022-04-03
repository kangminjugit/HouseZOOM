var express = require('express');
const db = require('../db/config');
var router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Class
 *  description: 반
 */



// /**
//  * @swagger
//  *  /api/class:
//  *    post:
//  *      tags: [Class]
//  *      summary: 반 생성 API
//  *      produces:
//  *      - "application/json; charset=utf-8"
//  *      parameters:
//  *          - in: query
//  *            name: school_code
//  *            schema:
//  *              type: string
//  *            example: 7021079
//  *            required: true
//  *            description: 표준 학교 코드
//  *          - in: query
//  *            name: name
//  *            schema:
//  *              type: string
//  *            example: 1반 모여라!
//  *            required: true
//  *            description: 반 이름
//  *          - in: query
//  *            name: auth_code
//  *            schema:
//  *              type: string
//  *            example: 1c1234
//  *            required: true
//  *            description: 인증코드
//  *          - in: query
//  *            name: year
//  *            schema:
//  *              type: int
//  *            example: 5
//  *            required: true
//  *            description: 학년
//  * 
//  *      responses:
//  *          '200':
//  *              description: class id object
//  *              content:
//  *                  application/json:
//  *                      schema:
//  *                          type: object
//  *                          properties:
//  *                              class_id:
//  *                                  type: integer
//  *                                  description: 반 아이디
//  * 
//  */

// router.post(`/`, (req, res, next) => {
//     db.query('INSERT INTO class(school_code, name, auth_code, year) VALUES(?, ?, ?, ?)', [req.query.school_code, req.query.name, req.query.auth_code, req.query.year], (err, rows, fields) => {
//         if(err){
//             console.log(err);
//             res.status(400).send('이미 존재하는 반 이름입니다');
            
//         }else{
//             // console.log(JSON.stringify({class_id: rows.insertId}));
//             res.send(JSON.stringify({class_id: rows.insertId}));
//         }

//     })
// });
  

module.exports = router;