module.exports = function(app){
    const cart = require('./cartController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 10. 카트 담기 API
    app.post('/app/carts', cart.addCart);

    // 11. 카트 보기 API
    app.get('/app/carts/:cartId', cart.getCart);

    // 13. 카트 요청사항 입력 API
    app.patch('/app/carts/:cartId/requests', cart.addReq);



};