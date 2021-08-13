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
    app.get('/app/users/:userId/restarurants', jwtMiddleware, user.home);

    // 4. 홈화면 비 회원용
    app.get('/app/users/restarurants', user.noUserHome);

    // 5. 골라먹는 맛집 API
    app.get('/app/users/:userId/restaurants/famous', user.famous);

    // 6. 인기 프랜차이즈 API
    app.get('/app/users/:userId/restaurants/franchises', user.franchise);

    // 7. 새로 들어왔어요 API
    app.get('/app/users/:userId/restaurants/recently-openings', user.recentlyOpen);

    // 8. 식당 메뉴창 API
    app.get('/app/users/:userId/restaurants/:restId',jwtMiddleware, user.menu);

    // 9. 식당 메뉴창 비회원용 API
    app.get('/app/users/restaurants/:restId', user.noUserMenu);

    // 15. 기본 주소 변경 API = 배달지 주소 설정(저장한 주소 중 선택, 기본 지역을 수정)
    app.patch('/app/users/:userId/default-addresses', jwtMiddleware, user.patchDefaultAddress);

    // 16. 대표 결제 수단 변경 API
    app.patch('/app/users/:userId/payments', jwtMiddleware, user.patchReqPayment);

    // 21. 배달지 목록 조회 API
    app.get('/app/users/:userId/addresses', jwtMiddleware, user.getUserAddress);

    // 22. 배달지 추가 API
    app.post('/app/users/:userId/addresses', jwtMiddleware, user.addUserAddress);

    // 23. 배달지 수정 API
    app.patch('/app/users/:userId/addresses/:userAddressId', jwtMiddleware, user.patchUserAddress);

    // 24. 배달지 삭제 API
    app.patch('/app/users/:userId/delete-addresses/:userAddressId', jwtMiddleware, user.deleteUserAddress);

    // 25. 즐겨찾기 등록 API
    app.post('/app/users/:userId/bookmarks', jwtMiddleware, user.addBookmarks);

    // 26. 즐겨찾기 목록 조회 API
    app.get('/app/users/:userId/bookmarks', jwtMiddleware, user.getBookmarks);

    // 27. 검색, 검색기록 저장 API
    app.get('/app/users/:userId/searches', jwtMiddleware, user.search);

    // 28. 인기 검색어 API
    app.get('/app/users/searches/popular', user.popularSearch);

    // 29. 최근 검색어 API
    app.get('/app/users/:userId/searches/recent',jwtMiddleware, user.recentSearch);

    // 30. 주문내역 API
    app.get('/app/users/:userId/order-lists',jwtMiddleware, user.orderList);



};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API
