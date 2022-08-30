var express = require('express');
const pool = require('../db/config');
var router = express.Router();
const {teacherAuthMiddleware} = require('../middlewares/authmiddleware');
const MessageFactory = require('../template/message');
const mongoClient = require('mongodb').MongoClient;

/**
 * @swagger
 *  /api/quiz:
*    get:
*      tags: [Quiz]
*      summary: classId에 해당되는 퀴즈 배열
*      produces:
*      - "application/json; charset=utf-8"
*      query:
*          - in: query
*            name: classId
*            schema:
*              type: integer
*            required: true
*            description: 반 아이디
*      responses:
*          '200':
*              description: OK
 *          '404':
*              description: Not Found
*              content:
*                  application/json:
*                      schema:
*                          type: object
*/
router.get(`/`,teacherAuthMiddleware, async (req, res, next) => {
    const {classId} = req.query;

    // classId 없으면 에러
    if(classId === '' || classId === undefined ){
        const error = new Error('classId is required!');
        error.status = 400;
        next(error);
        return;
    }

    // MongoDB에 퀴즈 정보 저장
    mongoClient.connect('mongodb://ec2-13-209-14-200.ap-northeast-2.compute.amazonaws.com:27017', async function(err, db){
      if(err) {
        db.close();
        next(err);
        return;
      }
      const collection = db.db('housezoom').collection('quiz');
      const query = {
        classId: Number(classId)
      };
      const options = {
        sort: {id : -1}
      };

      const cursor = await collection.find(query, options);
      const allValues = await cursor.toArray();

      res.set({ 'content-type': 'application/json; charset=utf-8' });
      res.send(MessageFactory.createMessage(
          'success',
          200,{
              "quizArr": allValues
          },
          null
      ));
      db.close();
    }); 
});


/**
 * @swagger
 *  /api/quiz:
*    post:
*      tags: [Quiz]
*      summary: classId에 해당되는 퀴즈 배열
*      produces:
*      - "application/json; charset=utf-8"
*      parameters:
*          - in: query
*            name: classId
*            schema:
*              type: string
*            required: true
*            description: 반 아이디
*          - in: query
*            name: teacherID
*            schema:
*              type: string
*            required: true
*            description: 선생님 아이디
*          - in: query
*            name: isOX
*            schema:
*              type: boolean
*            required: true
*            description: ox퀴즈인지
*          - in: query
*            name: classId
*            schema:
*              type: string
*            required: true
*            description: 반 아이디
*      responses:
*          '200':
*              description: OK
 *          '404':
*              description: Not Found
*              content:
*                  application/json:
*                      schema:
*                          type: object
*/
router.post(`/`,teacherAuthMiddleware, async (req, res, next) => {
    const {classId, teacherID,isOX, problem,choice, answer, timeLimitMin, timeLimitSec, point, badgeSubject, badgeDescription} = req.body;

    console.log(req.body);

    // classId 없으면 에러
    if(classId === '' ){
        const error = new Error('classId is required!');
        error.status = 400;
        next(error);
        return;
    }

    // MongoDB에 퀴즈 정보 저장
    mongoClient.connect('mongodb://ec2-13-209-14-200.ap-northeast-2.compute.amazonaws.com:27017', async function(err, db){
      if(err) {
        db.close();
        next(err);
        return;
      }
      const collection = db.db('housezoom').collection('quiz');
      await collection.insertOne({
        classId: Number(classId),
        teacherID: teacherID,
        problem: problem,
        isOX: isOX === "True" ? true : false,
        choice: choice,
        answer: isOX === "True" ? (answer === "True" ? true : false ) : answer,
        timeLimitMin: timeLimitMin,
        timeLimitSec: timeLimitSec,
        point: Number(point),
        badgeSubject: badgeSubject,
        badgeDescription: badgeDescription
      });

      res.set({ 'content-type': 'application/json; charset=utf-8' });
      res.send(MessageFactory.createMessage(
          'success',
          200,{
          },
          null
      ));
      db.close();
    }); 
});

module.exports = router;