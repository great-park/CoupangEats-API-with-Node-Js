module.exports = function(app){
    const payment = require('./paymentController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 17. 결제하기 API- 결제한 카트
    app.post('/app/payments', payment.addOrder);

};