module.exports = function(app){
    const cart = require('./cartController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');



    // 10. 카트 생성 API
    app.post('/app/newCarts',jwtMiddleware, cart.createCart);

    // 11. 카트 담기 API
    app.post('/app/carts', cart.addCart);

    // 12. 카트 보기 API
    app.get('/app/carts/:cartId', cart.getCart);



};