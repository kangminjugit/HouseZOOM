const jwt = require('jsonwebtoken');
const config = require('../config/secretkey');


module.exports = {
    sign: (user) => {
        const payload = {
            id: user.id,
            name: user.name
        };

        return jwt.sign(payload, config.secret, {
            expiresIn: '2h'
        });
    },
    verify: (accessToken) => {
        try{
            const decoded = jwt.verify(accessToken, config.secret);
            return {
                ok: true,
                id: decoded.id,
                name: decoded.name
            };
        }catch(err){
            if(err instanceof jwt.TokenExpiredError){
                const error = new Error('토큰이 만료되었습니다!');
                error.status = 403;
                throw error;
            }else if(err instanceof jwt.JsonWebTokenError){
                const error = new Error('잘못된 형식의 토큰입니다!');
                error.status = 403;
                throw error;
            }else if(err instanceof jwt.NotBeforeError){
                const error = new Error('토큰이 아직 활성화되지 않았습니다!');
                error.status = 403;
                throw error;
            }else{
                throw err;
            }
        }
    },
    refresh: () => {
        return jwt.sign({}, config.secret, {
            expiresIn: '14d'
        });
    },
    refreshVerify: async (refreshToken, dbRefreshToken) => {
        try{
            if(refreshToken !== dbRefreshToken){
                return false;
            }
            jwt.verify(refreshToken, config.secret);
            return true;
        }catch(err){
            return false;
        }
    }
}