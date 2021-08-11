module.exports = function(app){
    const restaurant = require('./restaurantController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 10. 식당 자세한 정보 조회 API
    app.get('/app/restaurants/:restId/informations', restaurant.restDetailInfo);

    // 11. 특정 메뉴 조회 API
    app.get('/app/restaurants/menu/:menuId', restaurant.restMenu);

    // 18. 리뷰 조회 API
    app.get('/app/restaurants/:restId/reviews', restaurant.getReview);

    // 19. 리뷰 평가 API
    app.patch('/app/restaurants/:restId/reviews/:reviewId/good-bad', restaurant.goodbadReview);

    // 20. 리뷰 작성 API
    app.post('/app/restaurants/:restId/reviews',jwtMiddleware, restaurant.postReview);


};