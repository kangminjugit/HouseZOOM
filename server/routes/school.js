var express = require('express');
const pool = require('../db/config');
const MessageFactory = require('../template/message');
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
 *      - "application/json; charset=utf-8"
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: list
 *                          properities:
 *                              school_location:
 *                                  type: string
 *                                  description: location 
 *          '404':
 *              description: Not Found!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      
 */
router.get('/cities',  async (req, res, next) => {
    try{
        const [rows] = await pool.query(`SELECT DISTINCT school_location FROM school ORDER BY school_location`);

        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send(MessageFactory.createMessage(
            'success',
            200,{
                'city_list': rows.map(row => row['school_location'])
            },
            null
        ));
        // res.send({
        //     'status': 'success',
        //     'code': 200,
        //     'data': {
        //         'city_list': rows.map(row => row['school_location'])
        //     },
        //     'message': null
        // });
    }catch(error){
        next(error);
    }
});


/**
 * @swagger
 *  /api/school/location:
 *    get:
 *      tags: [School]
 *      summary: 해당 시/도에 위치한 학교 리스트 API
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
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: list
 *                          properities:
 *                              school_code:
 *                                  type: string
 *                                  description: 표준 학교 코드
 *                              school_name:
 *                                  type: string
 *                                  descipriont: 학교 이름 
  *          '404':
 *              description: Not Found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 */

router.get(`/location`, async (req, res, next) => {
    const {school_location} = req.query;
    if(school_location === ''){
        const error = new Error('school_code, year are required!');
        error.status = 400;
        next(error);
        return;   
    }

    try{
        // 시/도에 있는 학교 리스트 불러오기
        const [rows] = await pool.query(
            'SELECT school_code, school_name FROM school WHERE school_location = ?', 
            [school_location]);

        // 쿼리로 준 이름의 시/도가 없는 경우 에러 처리
        if(!rows.length){
            const err = new Error(`No school in the city or there is no city named ${school_location}`);
            err.status = 404;
            throw err;
        }

        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send(MessageFactory.createMessage(
            'success',
            200,{
                'school_list': rows
            },
            null
        ));
        // res.send({
        //     'status': 'success',
        //     'code': 200,
        //     'data': {
        //         'school_list': rows
        //     },
        //     'message': null
        // });
    }catch(error){
        next(error);
    }
});
  

module.exports = router;