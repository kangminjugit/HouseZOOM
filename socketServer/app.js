// var createError = require('http-errors');
const app = require('express')();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
// const io = require('socket.io').listen(4040);
const axios = require('axios');
const { ObjectId } = require('mongodb');
// const { access } = require('fs');
// const jwt = require('jsonwebtoken');
// const { type } = require('os');
// const internal = require('stream');
// const http = require('./api');
// const {addUser} = require('./user');

// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const mongoClient = require('mongodb').MongoClient;
const PORT = 4040;
const DB = 'housezoom';
const COLLECTION = 'room';

app.get('/', (req, res) => {
  res.send('socket server is running');
})

server.listen(PORT, () => {
  console.log('listening on http://localhost:4040/');
})


const quizTimeoutFunction = ( classId) => {
  // MongoDB에서 접속한 학생들 찾고 퀴즈 결과 알리기
  mongoClient.connect('mongodb://ec2-3-38-116-33.ap-northeast-2.compute.amazonaws.com', function(err, db){
    if(err) throw err;

    var collection = db.db(DB).collection(COLLECTION);
    var query = {classId: classId};

    collection.findOne(query,function(err, res){
      if(err) throw err;
      var quiz = res.quizArr[res.quizArr.length-1];
      var studentAnswerDict = {};
      var studentAnswerArr = [];
      var teacherSocket = io.sockets.sockets.get(res.teacher.socketId);

      if(res.studentAnswerArr !== undefined){
        res.studentAnswerArr.forEach(elem => {
          if(elem.quizId === quiz.id){
            studentAnswerDict[elem.socketId] = elem;
            studentAnswerArr.push(elem);
          }
        });
      }

      console.log(studentAnswerArr);

      if(res.studentArr !== undefined){
        res.studentArr.forEach(elem => {
          var studentSocket = io.sockets.sockets.get(elem.socketId);
          
          if(studentSocket){
            if(elem.socketId in studentAnswerDict){
              var studentAnswer = studentAnswerDict[elem.socketId];
  
                studentSocket.emit('quiz_timeout', {
                  'data':{
                    'message': '퀴즈가 종료되었습니다!',
                    'is_ox': quiz.isOX,
                    'answer': quiz.answer,
                    'studentAnswer': studentAnswer.answer,
                    'is_correct': quiz.answer === studentAnswer.answer? true: false,
                  }
                });
          
                if(quiz.answer === studentAnswer.answer){
                  // api로 db 업데이트
                  axios.post('http://3.35.141.211:3000/api/point',{
                    'is_ox': quiz.isOX,
                    'studentId' : studentAnswer.id,
                    'point':quiz.point       
                  },{
                    headers: { Authorization: `Bearer ${res.teacher.accessToken}` },
                  } );
          
                  // api로 db 업데이트
                  axios.post('http://3.35.141.211:3000/api/badge',{
                    'studentId' : elem.id,
                    'point':quiz.point  ,
                    'subject': quiz.badge.subject,
                    'description': quiz.badge.description
                  },{
                    headers: { Authorization: `Bearer ${res.teacher.accessToken}` },
                  } ).then(res => {
                    
                  });
                }
              }else{
                studentSocket.emit('quiz_timeout', {
                  'data':{
                    'message': '퀴즈가 종료되었습니다!',
                    'is_ox': quiz.isOX,
                    'answer': quiz.answer,
                    'is_correct': false
                  }
                });
              }
            }
            
        });
      }
      

      if(teacherSocket){
        teacherSocket.emit('quiz_timeout', {
          'data': {
            'message': '퀴즈가 종료되었습니다!',
            'is_ox':quiz.isOX,
            'problem':quiz.problem,
            'choices': quiz.choices,
            'studentAnswerArr': studentAnswerArr
          }
        });
      }


        db.close();
    });

  });


  
};

io.on('connection', (socket) => {
  
  socket.on('choose_class', async(data, callback) => {
    const {data: {accessToken, classId}} = data;
    socket.join(classId);
  });

  socket.on('student_join_class',async(data, callback) => {
    const {data: {studentId, classId, name}} = data;

    // 속한 반에 해당하는 room에 join
    socket.join(classId);
    
    // MongoDB에 학생 정보 저장
    mongoClient.connect('mongodb://ec2-3-38-116-33.ap-northeast-2.compute.amazonaws.com', function(err, db){
      if(err) throw err;
      const collection = db.db(DB).collection(COLLECTION);
      var filter = {classId: classId};
      var updateDoc = {
        $push:{
          studentArr:{
            id: studentId,
            name: name,
            socketId: socket.id
          }
        }
      };
      var options = {upsert: true};
      
      collection.updateOne(
        { classId: classId },
        { $pull: { 'studentArr': { id: studentId } } }
      );

      collection.updateOne(filter, updateDoc,options, function(err, res){
        if(err) throw err;
        db.close();
      });
    });
  });

  socket.on('teacher_join_class',async(data, callback) => {
    const {data: {teacherId,accessToken, classId, name}} = data;

    // 속한 반에 해당하는 room에 join
    socket.join(classId);

    // MongoDB에 선생님 정보 저장
    mongoClient.connect('mongodb://ec2-3-38-116-33.ap-northeast-2.compute.amazonaws.com',function(err, db){
      if(err) throw err;
      var collection = db.db(DB).collection(COLLECTION);
      var filter = {classId: classId};
      var updateDoc = {
        '$set':{
          'teacher.id': teacherId,
          'teacher.name': name,
          'teacher.socketId':socket.id,
          'teacher.accessToken':accessToken
        }
      };
      var options = {upsert: true};
      collection.updateOne(filter, updateDoc,options, function(err, res){
        if(err) throw err;
        db.close();
      });
    });
  });

  socket.on('give_point', async(data, callback) => {
    const {data: {accessToken, studentId, point, classId}} = data;

    // api로 db 업데이트
    axios.post('http://3.35.141.211:3000/api/point',{
      'studentId' : studentId,
      'point':point        
    },{
      headers: { Authorization: `Bearer ${accessToken}` },
    } ).then(res => {
      
    });

    // 학생 소켓 찾고 그 소켓으로 point 정보 보내기
    mongoClient.connect('mongodb://ec2-3-38-116-33.ap-northeast-2.compute.amazonaws.com', function(err, db){
      if(err) throw err;

      var collection = db.db(DB).collection(COLLECTION);
      var filter = {classId: classId};

      collection.findOne(filter, function(err, res){
        if(err) throw err;
        console.log(res);

        if(res['studentArr'] !== undefined){
          var student = res['studentArr'].find(elem => elem.id === studentId);
          var studentSocket = io.sockets.sockets.get(student.socketId);
  
          // 학생 소켓에 알리기
          if(studentSocket){
            studentSocket.emit('get_point', {
              'data':{
                'studentId': studentId,
                'point': point
              }
            });
          }
        }

        db.close();      
      })
      
    });


  })

  socket.on('give_badge', async(data, callback) => {
    const {data: {accessToken, studentId, point, subject, description, classId}} = data;

    // api로 db 업데이트
    axios.post('http://3.35.141.211:3000/api/badge',{
      'studentId' : studentId,
      'point':point,
      'subject': subject,
      'description': description
    },{
      headers: { Authorization: `Bearer ${accessToken}` },
    } ).then(res => {
      
    });

    // 학생 소켓 찾고 소켓에 뱃지 정보 보내기
    mongoClient.connect('mongodb://ec2-3-38-116-33.ap-northeast-2.compute.amazonaws.com', function(err, db){
      if(err) throw err;

      var collection = db.db(DB).collection(COLLECTION);
      var filter = {classId: classId};

      collection.findOne(filter, function(err, res){
        if(err) throw err;
        var student = res['studentArr'].find(elem => elem.id === studentId);
        var studentSocket = io.sockets.sockets.get(student.socketId);
        
        if(studentSocket){
          studentSocket.emit('get_badge', {
            'data':{
              'studentId' : studentId,
              'point':point,
              'subject': subject,
              'description': description
            }
          });
        }
        db.close();    
      })
      
    });
  })

  socket.on('give_ox_quiz', (data, callback) => {
    const {data: {classId,teacherId,accessToken, problem, answer, timeLimitMin, timeLimitSec, point, badgeSubject, badgeDescription}} = data;

    // MongoDB에 퀴즈 정보 저장
    mongoClient.connect('mongodb://ec2-3-38-116-33.ap-northeast-2.compute.amazonaws.com', function(err, db){
      if(err) throw err;
      const collection = db.db(DB).collection(COLLECTION);
      const filter = {classId: classId};
      const updateDoc = {
        $push:{
          quizArr:{
            id: new Date().getTime(),
            problem: problem,
            isOX: true,
            choices: ['O','X'],
            answer: answer,
            timeLimit: {min: timeLimitMin, sec:timeLimitSec},
            point: point,
            badge: {subject:badgeSubject, description: badgeDescription},
          }
        }
      };
      const options = {upsert: true};
      collection.updateOne(filter, updateDoc, options, function(err, res){
        if(err) throw err;

        socket.to(classId).emit('get_ox_quiz', {
          'data':{
            'problem': problem,
            'point':point,
            'timeLimitMin': timeLimitMin,
            'timeLimitSec': timeLimitSec
          }
        });
    
        setTimeout(quizTimeoutFunction, 1000*timeLimitSec+1000*60*timeLimitMin, classId);
        db.close();
      });
    });
  })


  socket.on('give_choice_quiz', (data, callback) => {
    const {data: {classId,teacherId,accessToken, problem, multiChoices, answer, timeLimitMin, timeLimitSec, point, badgeSubject, badgeDescription}} = data;

    // MongoDB에 퀴즈 정보 저장
    mongoClient.connect('mongodb://ec2-3-38-116-33.ap-northeast-2.compute.amazonaws.com', function(err, db){
      if(err) throw err;
      const collection = db.db(DB).collection(COLLECTION);
      const filter = {classId: classId};
      const updateDoc = {
        $push:{
          quizArr:{
            id: new Date().getTime(),
            problem: problem,
            isOX: false,
            choices: multiChoices,
            answer: answer,
            timeLimit: {min: timeLimitMin, sec:timeLimitSec},
            point: point,
            badge: {subject:badgeSubject, description: badgeDescription},
          }
        }
      };
      const options = {upsert: true};
      collection.updateOne(filter, updateDoc, options, function(err, res){
        if(err) throw err;
  
        socket.to(classId).emit('get_choice_quiz', {
          'data':{
            'problem': problem,
            'multiChoices':multiChoices,
            'point':point,
            'timeLimitMin': timeLimitMin,
            'timeLimitSec': timeLimitSec
          }
        });
    
        setTimeout(quizTimeoutFunction, 1000*parseInt(timeLimitSec)+1000*60*parseInt(timeLimitMin), classId);
        db.close();
      });
    });


  });

  socket.on('submit_quiz', (data, callback) => {
    const {data: {classId, studentId, answer}} = data;

    // MongoDB에 학생 답 저장
    mongoClient.connect('mongodb://ec2-3-38-116-33.ap-northeast-2.compute.amazonaws.com', function(err, db){
      if(err) throw err;
      const collection = db.db(DB).collection(COLLECTION);

      var filter = {
        classId: classId,
      };
      var projection = {
        _id: 1,
        quizArr: 1
      }
      collection.findOne(filter, projection, function(err, res){
        if(err) throw err;
        // console.log(res);
        var elemId = res._id;
        var quizId = res.quizArr[res.quizArr.length-1].id;
        var isOX = res.quizArr[res.quizArr.length-1].isOX;

        filter = {_id:ObjectId(elemId)};
        var updateDoc = {
          $push:{
            studentAnswerArr:{
              quizId: quizId,
              id: studentId,
              answer: isOX? answer : answer+"",
              socketId: socket.id
            }
          }
        };

        var options = {upsert: true};

        collection.updateOne(filter, updateDoc, options, function(err, res){
          if(err) throw err;
          // console.log(res);
          db.close();
        });

      })
    });

  });
  
});


// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
