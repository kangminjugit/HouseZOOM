class HeaderFactory{
    createHeader(contentType){
        return { 
            'content-type': contentType
        };
    }
};

module.exports = HeaderFactory;