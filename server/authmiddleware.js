const jwt = require('jsonwebtoken');
const config = require('./config/secretkey');

const authMiddleware = async (req, res, next) => {
    const bearerHeader = req.header('Access-Token');
    if(bearerHeader == null){
        const error = new Error('인증이 필요합니다!');
        error.status = 403;
        next(error);
        return;    
    }

    try{
        const bearerToken = bearerHeader.split(' ')[1];
        const tokenInfo = await jwt.verify(bearerToken, config.secret);
        req.tokenInfo = tokenInfo;
        next();
    }catch(error){
        next(error);
    }
}

module.exports = authMiddleware;