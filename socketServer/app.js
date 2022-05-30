// var createError = require('http-errors');
const app = require('express')();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const axios = require('axios');
// const { access } = require('fs');
// const jwt = require('jsonwebtoken');
// const { type } = require('os');
// const internal = require('stream');
// const http = require('./api');
const {addUser} = require('./user');

// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const {MongoClient} = require('mongodb');

const mongoClient = new MongoClient('mongodb://ec2-3-38-116-33.ap-northeast-2.compute.amazonaws.com');
const PORT = 4040;
const DB = 'housezoom';
const COLLECTION = 'room';

var studentSockets = {};
var teacherSockets = {};

var quiz = {};
var studentAnswers = {};

var classes = {};

function quizTimeoutFunction(socket, classId, answer){
  var studentAnswerArr = [];
  classes[classId].forEach(studentId => {
    if(studentSockets[studentId]){
      studentSockets[studentId].emit('quiz_timeout', {
        'data':{
          'message': '퀴즈가 종료되었습니다!',
          'is_ox': quiz[classId]['is_ox'],
          'answer': answer,
          'studentAnswer': studentAnswers[studentId],
          'is_correct': answer === studentAnswers[studentId] ? true: false,
        }
      });

      if(answer === studentAnswers[studentId]){
        // api로 db 업데이트
        axios.post('http://3.35.141.211:3000/api/point',{
          'is_ox': quiz[classId]['is_ox'],
          'studentId' : studentId,
          'point':quiz[classId]['point']        
        },{
          headers: { Authorization: `Bearer ${quiz[classId]['accessToken']}` },
        } );

        // api로 db 업데이트
        axios.post('http://3.35.141.211:3000/api/badge',{
          'studentId' : studentId,
          'point':quiz[classId]['point']  ,
          'subject': quiz[classId]['badgeSubject'],
          'description': quiz[classId]['badgeDescription']
        },{
          headers: { Authorization: `Bearer ${quiz[classId]['accessToken']}` },
        } ).then(res => {
          
        });
      }

      studentAnswerArr.push({
        'studentId': studentId,
        'studentAnswer': studentAnswers[studentId] 
      });
    }
  });

  teacherSockets[quiz[classId]['teacherId']].emit('quiz_timeout', {
    'data': {
      'message': '퀴즈가 종료되었습니다!',
      'is_ox':quiz[classId]['is_ox'],
      'problem':quiz[classId]['problem'],
      'choices': quiz[classId]['is_ox']? ['O','X'] : quiz[classId]['multiChoices'] ,
      'studentAnswerArr': studentAnswerArr
    }
  });
}

io.on('connection', (socket) => {
  var newQuizId = 0;

  socket.on('choose_class', async(data, callback) => {
    const {data: {accessToken, classId}} = data;
    socket.join(classId);
  });

  socket.on('student_join_class',async(data, callback) => {
    const {data: {studentId, classId, name}} = data;

    // 속한 반에 해당하는 room에 join
    socket.join(classId);
    console.log(studentId+' joined');

    // 접속한 학생 저장
    studentSockets[studentId] = socket;
    if(!classes[classId]){
      classes[classId] = [];
    }
    classes[classId].push(studentId);
    
    // MongoDB에 학생 정보 저장
    try{
      await mongoClient.connect();
      const collection = mongoClient.db(DB).collection(COLLECTION);

      const filter = {classId: classId};
      const options = {upsert: true};
      const updateDoc = {
        $push:{
          studentArr:{
            id: studentId,
            name: name,
            socket: socket
          }
        }
      };
      const result = await collection.updateOne(filter, updateDoc, options);
      console.log(result);
    }finally{
      await mongoClient.close();
    }
  });

  socket.on('teacher_join_class',async(data, callback) => {
    const {data: {teacherId, classId, name}} = data;

    // 속한 반에 해당하는 room에 join
    socket.join(classId);
    console.log(teacherId+' joined');

    // 접속한 선생님 정보 저장
    teacherSockets[teacherId] = socket;
    if(!classes[classId]){
      classes[classId] = [];
    }
    classes[classId].push(teacherId);

    // MongoDB에 선생님 정보 저장
    try{
      await mongoClient.connect();
      const collection = mongoClient.db(DB).collection(COLLECTION);

      const filter = {classId: classId};
      const options = {upsert: true};
      const updateDoc = {
        $set:{
          'teacher.id':teacherID,
          'teacher.name':name,
          'teacher.accessToken':accessToken,
          'teacher.socket':socket
        }
      };
      const result = await collection.updateOne(filter, updateDoc, options);
      console.log(result);
    }finally{
      await mongoClient.close();
    }
  });

  socket.on('give_point', async(data, callback) => {
    const {data: {accessToken, classId, studentId, point}} = data;

    // api로 db 업데이트
    axios.post('http://3.35.141.211:3000/api/point',{
      'studentId' : studentId,
      'point':point        
    },{
      headers: { Authorization: `Bearer ${accessToken}` },
    } ).then(res => {
      
    });

    // 학생 소켓 찾기
    var studentSocket = studentSockets[studentId];

    // 학생 소켓에 알리기
    if(studentSocket){
      studentSocket.emit('get_point', {
        'data':{
          'studentId': studentId,
          'point': point
        }
      });
    }
  })

  socket.on('give_badge', async(data, callback) => {
    const {data: {accessToken, studentId, point, subject, description}} = data;

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

    // 학생 소켓 찾기
    var studentSocket = studentSockets[studentId];

    // 학생 소켓에 알리기
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
  })

  socket.on('give_ox_quiz', (data, callback) => {
    const {data: {classId,teacherId,accessToken, problem, answer, timeLimitMin, timeLimitSec, point, badgeSubject, badgeDescription}} = data;

    quiz[classId] = {
      'is_ox': true,
      'problem': problem, 
      'answer': answer,
      'point': point ,
      'teacherId':teacherId,
      'accessToken':accessToken,
      'badgeSubject':badgeSubject,
      'badgeDescription':badgeDescription
    };

    socket.to(classId).emit('get_ox_quiz', {
      'data':{
        'problem': problem,
        'point':point,
        'timeLimitMin': timeLimitMin,
        'timeLimitSec': timeLimitSec
      }
    });

    setTimeout(quizTimeoutFunction, 1000*timeLimitSec+1000*60*timeLimitMin,socket, classId, answer);
  })


  socket.on('give_choice_quiz', (data, callback) => {
    const {data: {classId,teacherId,accessToken, problem, multiChoices, answer, timeLimitMin, timeLimitSec, point, badgeSubject, badgeDescription}} = data;
    quiz[classId] = {
      'is_ox': false,
      'problem': problem, 
      'multiChoices':multiChoices,
      'answer': parseInt(answer),
      'point': point ,
      'teacherId':teacherId,
      'accessToken':accessToken,
      'badgeSubject': badgeSubject,
      'badgeDescription': badgeDescription
    };

    socket.to(classId).emit('get_choice_quiz', {
      'data':{
        'problem': problem,
        'multiChoices':multiChoices,
        'point':point,
        'timeLimitMin': timeLimitMin,
        'timeLimitSec': timeLimitSec
      }
    });

    setTimeout(quizTimeoutFunction, 1000*timeLimitSec+1000*60*timeLimitMin,socket, classId, parseInt(answer));
  });

  socket.on('submit_quiz', (data, callback) => {
    const {data: {classId, studentId, answer}} = data;
    studentAnswers[studentId] = answer;
  });
  
  socket.on('disconnect', () => {
  
  })
});

app.get('/', (req, res) => {
  res.send('socket server is running');
})

server.listen(PORT, () => {
  console.log('listening on http://localhost:4040/');
})

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
