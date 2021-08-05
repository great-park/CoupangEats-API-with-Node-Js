module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    app.get('/app/test', user.getTest)

    // 1. 유저 생성 (회원가입) API
    app.post('/app/users', user.postUsers);

    // 2. 로그인 하기 API (JWT 생성)
    app.post('/app/logins', user.login);

    // 3. 홈화면 API
    app.get('/app/users/:userId/restarurants', user.home)

    // // 4. 골라먹는 맛집 API
    // app.get('/app/restaurants/famous', user.famous)

    // 5. 인기 프랜차이즈 API
    app.get('/app/users/:userId/restaurants/franchises', user.franchise)

    // // 6. 새로 들어왔어요 API
    // app.get('/app/users/:userId/restaurants/recently-openings', user.franchise)

    // 7. 식당 메뉴창 API
    app.get('/app/users/:userId/restaurants/:restId', user.menu)

    // 8. 식당 자세한 정보 조회 API
    app.get('/app/restaurants/:restId/informations', user.restInfo)
};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API
