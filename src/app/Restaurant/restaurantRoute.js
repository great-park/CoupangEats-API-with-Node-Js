module.exports = function(app){
    const restaurant = require('./restaurantController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 8. 식당 자세한 정보 조회 API
    app.get('/app/restaurants/:restId/informations', restaurant.restDetailInfo);

    // 9. 특정 메뉴 조회 API
    app.get('/app/restaurants/menu/:menuId', restaurant.restMenu);

    // 16. 리뷰 조회 API
    app.get('/app/restaurants/:restId/reviews', restaurant.getReview);


};