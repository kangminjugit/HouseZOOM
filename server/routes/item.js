var express = require('express');
const pool = require('../db/config');
var router = express.Router();


/**
 * @swagger
 * tags:
 *  name: Item
 *  description: 아이템 API
 */

/**
 * @swagger
 *  /api/item?type=#:
 *    get:
 *      tags: [Item]
 *      summary: 해당 type의 전체아이템 조회 api
 *      produces:
 *      - "application/json; charset=utf-8"
 *      parameters:
 *          - in: query
 *            name: type
 *            schema:
 *              type: string
 *            required: true
 *            description: 아이템 타입(top, bottom, hair, *) -- *는 전체 아이템 의미
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.get(`/`, async (req, res, next) => {
    const {type} = req.query;

    if(type === '' || type === undefined){
        const error = new Error('type is required!');
        error.status = 400;
        next(error);
        return;
    }   

    const connection = await pool.getConnection(async conn => conn);
    try{
        if(type === '*'){
            [rows, fields] = await connection.query('select * from item');
        }else{
            [rows, fields] = await connection.query('select * from item where type = ?', [type]);
        }
        
        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {
                "items": rows
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
