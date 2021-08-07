module.exports = function(app){
    const cart = require('./cartController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 10. 카트 담기 API
    app.post('/app/carts', cart.addCart);


};