var express = require('express');
const db = require('../db/config');
var router = express.Router();

/**
 * @swagger
 * tags:
 *  name: School
 *  description: 학교
 */

/**
 * @swagger
 *  /api/school/cities:
 *    get:
 *      tags: [School]
 *      summary: 전국 시도 리스트 API
 *      produces:
 *      - application/json
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: list
 *                          properities:
 *                              school_location:
 *                                  type: string
 *                                  description: location 
 *                      
 */
router.get('/cities', (req, res, next) => {
    db.query(`SELECT DISTINCT school_location FROM school ORDER BY school_location`, (err, rows, fields) => {
        if(err) {
            console.log(err);
        }
        res.send(rows.map(row => row['school_location']));
    });    
});


/**
 * @swagger
 *  /api/school/location:
 *    get:
 *      tags: [School]
 *      summary: 해당 시/도에 위치한 학교 리스트
 *      produces:
 *      - "application/json; charset=utf-8"
 *      parameters:
 *          - in: query
 *            name: school_location
 *            schema:
 *              type: string
 *            required: true
 *            description: 시/도 이름
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: list
 *                          properities:
 *                              school_code:
 *                                  type: string
 *                                  description: 표준 학교 코드
 *                              school_name:
 *                                  type: string
 *                                  descipriont: 학교 이름 
 */

router.get(`/location`, (req, res, next) => {
    db.query('SELECT school_code, school_name FROM school WHERE school_location = ?', [req.query.school_location], (err, rows, fields) => {
        if(err){
            console.log(err);
        }
        res.send(rows);
    })
});
  

module.exports = router;