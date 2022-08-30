var express = require('express');
const pool = require('../db/config');
var router = express.Router();
const {studentAuthMiddleware} = require('../middlewares/authmiddleware');
const MessageFactory = require('../template/message');


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
    try{
        [rows, fields] = await pool.query('select item.id, item.name, item.type, item.price, item.image from shopping_basket, item where shopping_basket.item_id = item.id and shopping_basket.student_id = ?', [req.id]);
        
        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send(MessageFactory.createMessage(
            'success',
            200,{
                "items": rows
            },
            null
        ));
        // res.send({
        //     "status": 'success',
        //     "code": 200,
        //     "data": {
        //         "items": rows
        //     },
        //     "message": null
        // });
    }catch(error){
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
        Array.from(items).forEach(item => {
            item_id_pairs.push([item, req.id]);
        });

        if(item_id_pairs.length === 0){
            res.set({ 'content-type': 'application/json; charset=utf-8' });
            res.send(MessageFactory.createMessage(
                'success',
                200,
                {},
                '아이템이 성공적으로 장바구니에 추가되었습니다.'
            ));
            // res.send({
            //     "status": 'success',
            //     "code": 200,
            //     "data": {},
            //     "message": '아이템이 성공적으로 장바구니에 추가되었습니다.'
            // });       
            return;
        }

        await connection.query('insert into shopping_basket(item_id, student_id) values ?;', [item_id_pairs]);

        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send(MessageFactory.createMessage(
            'success',
            200,
            {},
            '아이템이 성공적으로 장바구니에 추가되었습니다.'
        ));
        // res.send({
        //     "status": 'success',
        //     "code": 200,
        //     "data": {},
        //     "message": '아이템이 성공적으로 장바구니에 추가되었습니다.'
        // });

        connection.release();
    }catch(error){
        connection.release();
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

    try{
        var item_id_pairs = [];
        items.forEach(item => {
            item_id_pairs.push([item, req.id]);
        });
        await pool.query('delete from shopping_basket where (item_id, student_id) in (?)', [item_id_pairs]);

        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.send(MessageFactory.createMessage(
            'success',
            200,
            {},
            '아이템이 성공적으로 장바구니에서 삭제되었습니다.'
        ));
        // res.send({
        //     "status": 'success',
        //     "code": 200,
        //     "data": {},
        //     "message": '아이템이 성공적으로 장바구니에서 삭제되었습니다.'
        // });
    }catch(error){
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
    const connection = await pool.getConnection(async conn => conn);
    try{

        var [itemArr, fields] = await connection.query('select item.id, item.price from shopping_basket, item where shopping_basket.item_id = item.id and shopping_basket.student_id = ?',[req.id]);
        var total_price = 0;
        var itemId_studentId_pairs = [];
        itemArr.forEach(row => {
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

        connection.release();

        try{
            const connectionArr = [];
            for(var i=0; i<3; i++){
                connectionArr.push(await pool.getConnection(async conn => conn));
            }

            const pointDecreaseFunction = async function(){
                // 학생의 포인트 감소
                return connectionArr[0].query('update student set point = ? where id = ?', [point-total_price, req.id]).then(result => result);
            };

            const itemDeleteFunction = async function(){
                // 학생의 장바구니에서 아이템들 삭제
                return connectionArr[1].query('delete from shopping_basket where (item_id, student_id) in (?)', [itemId_studentId_pairs]).then(result => result);
            };

            const itemAddFunction = async function(){
                // 학생의 아이템 목록에 추가
                return connectionArr[2].query('insert into my_item(item_id, student_id) values ?',[itemId_studentId_pairs]).then(result => result);
            };

            await Promise.all([pointDecreaseFunction(), itemDeleteFunction(), itemAddFunction()]);

            for(var i=0; i<3; i++){
                await connectionArr[i].commit();
                connectionArr[i].release();
            }

            res.set({ 'content-type': 'application/json; charset=utf-8' });
            res.send(MessageFactory.createMessage(
                'success',
                200,
                {},
                '장바구니에 있는 아이템을 성공적으로 구매하였습니다.'
            ));
            // res.send({
            //     "status": 'success',
            //     "code": 200,
            //     "data": {},
            //     "message": '장바구니에 있는 아이템을 성공적으로 구매하였습니다.'
            // });

        }catch(err){
            for(var i=0; i<3; i++){
                await connectionArr[i].rollback();
            }

            throw err;
        }
    }catch(error){
        for(var i=0; i<3; i++){
            connectionArr[i].release();
        }
        next(error);
    }
});

module.exports = router;
