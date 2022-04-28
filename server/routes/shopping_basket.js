var express = require('express');
const pool = require('../db/config');
var router = express.Router();
const {studentAuthMiddleware} = require('../middlewares/authmiddleware');


/**
 * @swagger
 * tags:
 *  name: Shopping Basket
 *  description: 장바구니 API
 */

/**
 * @swagger
 *  /api/shopping-basket:
 *    get:
 *      tags: [Shopping Basket]
 *      summary: 학생의 장바구니 조회 API (학생 토큰 필요)
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.get(`/`,studentAuthMiddleware, async (req, res, next) => {

    const connection = await pool.getConnection(async conn => conn);
    try{
        [rows, fields] = await connection.query('select item.id, item.name, item.type, item.price, item.image from shopping_basket, item where shopping_basket.item_id = item.id and shopping_basket.student_id = ?', [req.id]);
        
        console.log(rows);
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


/**
 * @swagger
 *  /api/shopping-basket:
 *    post:
 *      tags: [Shopping Basket]
 *      summary: 학생의 장바구니에 아이템 추가 API (학생 토큰 필요)
 *      produces:
 *      - "application/json; charset=utf-8"
 *      parameters:
 *          - in: body
 *            name: items
 *            schema:
 *              type: array
 *              items:
 *                  type: integer
 *            required: true
 *            description: 장바구니에 추가할 아이템 array
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '400':
 *              description: 전체 아이템 리스트에 없는 아이템을 장바구니에 추가할 때
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '422':
 *              description: 이미 존재하는 아이템을 장바구니에 추가할 때
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.post(`/`,studentAuthMiddleware, async (req, res, next) => {
    const items = req.body;

    const connection = await pool.getConnection(async conn => conn);
    try{
        var item_id_pairs = [];
        items.forEach(item => {
            item_id_pairs.push([item, req.id]);
        });
        await connection.query('insert into shopping_basket(item_id, student_id) values ?', [item_id_pairs]);

        connection.commit();

        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {},
            "message": '아이템이 성공적으로 장바구니에 추가되었습니다.'
        });
    }catch(error){
        if(error.code === 'ER_DUP_ENTRY'){
            let error = new Error('이미 장바구니에 존재하는 아이템이 있습니다.');
            error.status = 422;
            next(error);
        }else if(error.code === 'ER_NO_REFERENCED_ROW_2'){
            let error = new Error('전체 아이템 리스트에 존재하지 않는 아이템이 있습니다.');
            error.status = 400;
            next(error);
        }else{
            next(error);
        }
    }finally{
        connection.release();
    }
});


module.exports = router;
