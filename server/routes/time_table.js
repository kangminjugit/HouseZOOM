var express = require('express');
var router = express.Router();
const pool = require('../db/config');

/**
 * @swagger
 * tags:
 *  name: Time table
 *  definition: 시간표
 */

/**
 * @swagger
 *  /api/time-table?classId=#:
 *    get:
 *      tags: [Time table]
 *      summary: 해당 반의 시간표 정보
 *      consumes:
 *          - application/json; charset=utf-8
 *      parameters:
 *         - in: query
 *           name: classId
 *           type: int
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
 */
 router.get(`/`, async (req, res, next) => {
    const {classId} = req.query;

    if(classId === ''){
        const error = new Error('class id is required!');
        error.status = 400;
        next(error);
        return;
    }   

    const connection = await pool.getConnection(async conn => conn);
    try{
        [rows, fields] = await connection.query('select * from time_table where class_id = ?', [classId]);
        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {
                "time_table": rows
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

