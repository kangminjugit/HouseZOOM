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
        await connection.release();
    }catch(error){
        await connection.release();
        next(error);
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
 *            description: 장바구니에 추가할 아이템 id array
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

        // console.log(Array.isArray(items), Array.isArray(Array.from(items)))
        Array.from(items).forEach(item => {
            item_id_pairs.push([item, req.id]);
        });

        await connection.query('insert into shopping_basket(item_id, student_id) values ?', [item_id_pairs]);

        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {},
            "message": '아이템이 성공적으로 장바구니에 추가되었습니다.'
        });

        await connection.release();
    }catch(error){
        await connection.release();
        console.log(error);
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
    }
});


/**
 * @swagger
 *  /api/shopping-basket:
 *    delete:
 *      tags: [Shopping Basket]
 *      summary: 학생의 장바구니의 아이템 삭제 API (학생 토큰 필요)
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
 *            description: 장바구니에서 삭제할 아이템 id array
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '400':
 *              description: 전체 아이템 리스트에 없는 아이템을 장바구니에 삭제할 때
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.delete(`/`,studentAuthMiddleware, async (req, res, next) => {
    const items = req.body;

    const connection = await pool.getConnection(async conn => conn);
    try{
        var item_id_pairs = [];
        items.forEach(item => {
            item_id_pairs.push([item, req.id]);
        });
        await connection.query('delete from shopping_basket where (item_id, student_id) in (?)', [item_id_pairs]);

        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send({
            "status": 'success',
            "code": 200,
            "data": {},
            "message": '아이템이 성공적으로 장바구니에서 삭제되었습니다.'
        });

        await connection.release();
    }catch(error){
        await connection.release();
        if(error.code === 'ER_NO_REFERENCED_ROW_2'){
            let error = new Error('전체 아이템 리스트에 존재하지 않는 아이템이 있습니다.');
            error.status = 400;
            next(error);
        }else{
            next(error);
        }
    }
});


/**
 * @swagger
 *  /api/shopping-basket/buy:
 *    post:
 *      tags: [Shopping Basket]
 *      summary: 학생의 장바구니에 있는 아이템들 구입 API (학생 토큰 필요)
 *      responses:
 *          '200':
 *              description: OK
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 *          '404':
 *              description: 포인트 부족
 *              content:
 *                  "application/json; charset=utf-8":
 *                      schema:
 *                          type: object
 */

 router.post(`/buy`,studentAuthMiddleware, async (req, res, next) => {
    const items = req.body;

    const connection = await pool.getConnection(async conn => conn);
    try{

        var [rows, fields] = await connection.query('select item.id, item.price from shopping_basket, item where shopping_basket.item_id = item.id and shopping_basket.student_id = ?',[req.id]);
        var total_price = 0;
        var itemId_studentId_pairs = [];
        rows.forEach(row => {
            total_price += row.price;
            itemId_studentId_pairs.push([row.id, req.id]);
        });
        

        var [rows, fields] = await connection.query('select point from student where id = ?', [req.id]);
        var point = rows[0].point;

        if(total_price > point){
            let error = new Error('포인트가 부족합니다!');
            error.status = 404;
            throw error;
        }

        try{
            await connection.beginTransaction();

            // 학생의 포인트 감소
            await connection.query('update student set point = ? where id = ?', [point-total_price, req.id]);
            
            // 학생의 장바구니에서 아이템들 삭제
            await connection.query('delete from shopping_basket where (item_id, student_id) in (?)', [itemId_studentId_pairs]);

            // 학생의 아이템 목록에 추가
            await connection.query('insert into my_item(item_id, student_id) values ?',[itemId_studentId_pairs]);

            await connection.commit();

            res.set({ 'content-type': 'application/json; charset=utf-8' });
            res.send({
                "status": 'success',
                "code": 200,
                "data": {},
                "message": '장바구니에 있는 아이템을 성공적으로 구매하였습니다.'
            });

            await connection.release();

        }catch(err){
            await connection.rollback();
            throw err;
        }
    }catch(error){
        await connection.release();
        next(error);
    }
});

module.exports = router;
