const {sign, verify, refreshVerify} = require('./jwt-util');
const jwt = require('jsonwebtoken');

const refresh = async (req, res, next) => {
    try{
        const {authorization, refreshToken} = req.headers;
        const accessToken = authorization.split('Bearer ')[1];
    
        // verify access token
        const authResult = verify(accessToken);
        const decoded = jwt.decode(accessToken);
    
        // id 추출 불가
        if(decoded === null || decoded.id === null || decoded.id === undefined){
            
        }

        // verify refresh token
        const refreshResult = refreshVerify(refreshToken, decoded.id);

        // access token 만료
        if(!authResult.ok){
            // refresh token 만료
            if(!refreshResult.ok){
                // 새로 로그인
            }
            // refresh token 만료x -> 새로운 access token 발급
            else{
                const newAccessToken = sign({
                    id: req.id,
                    name: req.name
                });
            }
        }
        // access token 만료x 
        else{
            
        }
    }catch(error){
        next(error);
    }
}

module.exports = refresh;