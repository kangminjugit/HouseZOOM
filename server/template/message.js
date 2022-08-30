class MessageFactory{
    static createMessage(status, code, data, message){
        if(code === 200){
            return {
                "status": status,
                "code": code,
                "data": data,
                "message": message
            };
        }
        return null;
    }
};

module.exports = MessageFactory;