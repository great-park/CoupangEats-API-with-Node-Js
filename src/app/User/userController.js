const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const regexEmail = require("regex-email");
const {emit} = require("nodemon");


/**
 * API No. 0
 * API Name : 테스트 API, RDS 연결 확인
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {

    const rdsTest = await userProvider.rdsTest();
    return res.send(response(baseResponse.SUCCESS, rdsTest));
};


/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API // 이메일, 비밀번호, 전화번호, 이름(실명)
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {
    /**
     * Body: userEmail, password, phoneNumber, userName
     */
    const {userEmail, password, phoneNumber, userName} = req.body;

    // 빈 값 체크
    if (!userEmail)
        return res.send(response(baseResponse.SIGNUP_USEREMAIL_EMPTY));
    if (!password)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
    if (!phoneNumber)
        return res.send(response(baseResponse.SIGNUP_PHONENUMBER_EMPTY));
    if (!userName)
        return res.send(response(baseResponse.SIGNUP_USERNAME_EMPTY));

    // 길이 체크
    if (phoneNumber.length != 11)
        return res.send(response(baseResponse.SIGNUP_PHONENUMBER_LENGTH));
    if (userName.length > 6)
        return res.send(response(baseResponse.SIGNUP_USERNAME_LENGTH));
    if (password.length > 20 || password.length < 8)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
    // 숫자 확인
    if (isNaN(phoneNumber) === true)
        return res.send(response(baseResponse.SIGNUP_PHONENUMBER_NOTNUM))
    // 비밀번호 기타 조건 확인 - 영문/숫자/특수문자 2가지 이상 조합, 3개이상 연속되거나 동일한 문자/숫자 제외, 아이디 제외

    // 이메일 형식 체크 (by 정규표현식)
    if (!regexEmail.test(userEmail))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    const signUpResponse = await userService.createUser(
        userEmail, password, phoneNumber, userName
    );
    return res.send(signUpResponse);
};

// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 2
 * API Name : 로그인 API
 * [POST] /app/login
 * body : userEmail, passsword
 */
exports.login = async function (req, res) {

    const {userEmail, password} = req.body;

     
    // 빈 값 체크
    if (!userEmail)
        return res.send(response(baseResponse.SIGNIN_USEREMAIL_EMPTY));
    if (!password)
        return res.send(response(baseResponse.SIGNIN_PASSWORD_EMPTY));
    // 길이 체크
    if (password.length > 20 || password.length < 8)
        return res.send(response(baseResponse.SIGNIN_PASSWORD_LENGTH));
    // 이메일 형식 체크 (by 정규표현식)
    if (!regexEmail.test(userEmail))
        return res.send(response(baseResponse.SIGNIN_EMAIL_ERROR_TYPE));

    const signInResponse = await userService.postSignIn(userEmail, password);
    console.log(signInResponse)

    return res.send(signInResponse);
};


/**
 * API No. 3
 * API Name : 홈화면 조회 API
 * [GET] /app/users/:userId/restarurants
 * header : jwt
 */
exports.home = async function (req, res) {
    /**
     * Path variable: userId
     */
    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId;
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    const restarurantList = await userProvider.retrieveRestarurants(userId);
    return res.send(response(baseResponse.SUCCESS, restarurantList));

};


/**
 * API No. 4
 * API Name : 홈화면 비 회원용 조회 API
 * [GET] /app/users/restarurants
 */
exports.noUserHome = async function (req, res) {

    const restarurantNoUserList = await userProvider.retrieveRestarurantsNoUser();
    return res.send(response(baseResponse.SUCCESS, restarurantNoUserList));

};


/**
 * API No. 5
 * API Name : 골라먹는 맛집 API
 * [GET] /app/users/:userId/restaurants/famous
 */
exports.famous = async function (req, res) {
    /**
     * Path variable: userId
     */
    const userId = req.params.userId;

    /**
     * Query String: Cheetah, deliveryFee, minimumAmount
     */
    const Cheetah = req.query.Cheetah;
    const deliveryFee = req.query.deliveryFee;
    const minimumAmount = req.query.minimumAmount;

    if (Cheetah !== 'Y' ) {
        // 치타배달 상관 X
        const famousResult = await userProvider.retrievefamous(userId, deliveryFee, minimumAmount);
        return res.send(response(baseResponse.SUCCESS, famousResult));

    } else {
        const CheetahfamousResult = await userProvider.retrieveCheetahfamous(userId, deliveryFee, minimumAmount);
        return res.send(response(baseResponse.SUCCESS, CheetahfamousResult));
    }
};

/**
 * API No. 6
 * API Name : 인기프랜차이즈 조회 API
 * [GET] /app/users/:userId/restaurants/franchises
 */
exports.franchise = async function (req, res) {
    /**
     * Path variable: userId
     */
    const userId = req.params.userId;

    /**
     * Query String: Cheetah, deliveryFee, minimumAmount
     */
    const Cheetah = req.query.Cheetah;
    const deliveryFee = req.query.deliveryFee;
    const minimumAmount = req.query.minimumAmount;

    if (Cheetah !== 'Y' ) {
        // 치타배달 상관 X
        const franchiseResult = await userProvider.retrieveFranchise(userId, deliveryFee, minimumAmount);
        return res.send(response(baseResponse.SUCCESS, franchiseResult));

    } else {
        const CheetahFranchiseResult = await userProvider.retrieveCheetahFranchise(userId, deliveryFee, minimumAmount);
        return res.send(response(baseResponse.SUCCESS, CheetahFranchiseResult));
        }
};

/**
 * API No. 7
 * API Name : 새로들어왔어요 조회 API
 * [GET] /app/users/:userId/restaurants/recently-openings
 */
exports.recentlyOpen = async function (req, res) {
    /**
     * Path variable: userId
     */
    const userId = req.params.userId;

    /**
     * Query String: Cheetah, deliveryFee, minimumAmount
     */
    const Cheetah = req.query.Cheetah;
    const deliveryFee = req.query.deliveryFee;
    const minimumAmount = req.query.minimumAmount;

    if (Cheetah !== 'Y' ) {
        // 치타배달 상관 X
        const recentlyOpenResult = await userProvider.retrieveRecentlyOpen(userId, deliveryFee, minimumAmount);
        return res.send(response(baseResponse.SUCCESS, recentlyOpenResult));

    } else {
        const CheetahRecentlyOpenResult = await userProvider.retrieveCheetahRecentlyOpen(userId, deliveryFee, minimumAmount);
        return res.send(response(baseResponse.SUCCESS, CheetahRecentlyOpenResult));
    }
};
/**
 * API No. 8
 * API Name : 식당메뉴 조회 API
 * [GET] /app/users/:userId/restaurants/:restId
 * header : jwt
 */
exports.menu = async function (req, res) {
    /**
     * Path variable: userId, restId
     */
    const userId = req.params.userId;
    const restId = req.params.restId;
    const userIdFromJWT = req.verifiedToken.userId;
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    const menuList = await userProvider.retrievemenu(userId, restId);
    return res.send(response(baseResponse.SUCCESS, menuList));

};

/**
 * API No. 9
 * API Name : 식당메뉴 조회 비회원API
 * [GET] /app/users/restaurants/:restId
 */
exports.noUserMenu = async function (req, res) {
    /**
     * Path variable: restId
     */
    const restId = req.params.restId;

    const menuNoUserList = await userProvider.retrievemenuNoUser(restId);
    return res.send(response(baseResponse.SUCCESS, menuNoUserList));

};


/**
 * API No. 15
 * API Name : 기본 배달지 주소 수정 + JWT + Validation
 * [PATCH] /app/users/:userId/default-addresses
 * body : userAddressId
 * Header : jwt
 */

exports.patchDefaultAddress = async function (req, res) {

    // jwt - userId, path variable :userId
    /**
     * Path variable: userId
     */

    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    const userAddressId = req.body.userAddressId;

    // userAddressId가 userId에 속한 지 확인 validation 필요
    // 빈 값 체크
    if (!userId)
        return res.send(response(baseResponse.REPPAY_USERID_EMPTY));
    // 숫자 확인
    if (isNaN(userId) === true)
        return res.send(response(baseResponse.REPPAY_USERID_NOTNUM))

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const patchDefaultAddressInfo = await userService.editDefaultAddress(userId, userAddressId)
        return res.send(patchDefaultAddressInfo);
    }
};


/**
 * API No. 16
 * API Name : 대표 결제 수단 변경 + JWT + Validation
 * [PATCH] /app/users/:userId/payments
 * body : cardId, accountId
 * Header : jwt
 */

exports.patchReqPayment = async function (req, res) {

    // jwt - userId, path variable :userId
    /**
     * Path variable: userId
     */

    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    const {cardId, accountId} = req.body;

    // 빈 값 체크
    if (!userId)
        return res.send(response(baseResponse.REPPAY_USERID_EMPTY));
    // 숫자 확인
    if (isNaN(userId) === true)
        return res.send(response(baseResponse.REPPAY_USERID_NOTNUM))



    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!cardId){
            const patchPaymentAccount = await userService.editPaymentAccount(userId, accountId)
            return res.send(patchPaymentAccount);

        } else{
            const patchPaymentCard = await userService.editPaymentCard(userId, cardId)
            return res.send(patchPaymentCard);
        }
    }
};

/**
 * API No. 21
 * API Name : 배달지 주소 목록 조회 API
 * [GET] /app/users/:userId/addresses
 */
exports.getUserAddress = async function (req, res) {
    /**
     * Path variable: userId
     */

    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const getUserAddress = await userProvider.getUserAddress(userId);
        return res.send(response(baseResponse.SUCCESS, getUserAddress));

    }


};


/**
 * API No. 22
 * API Name : 배달지 주소 추가 API
 * [POST] /app/users/:userId/addresses
 * body : eupMyeonDongName, detailAddress,addressCategory, introduction
 */
exports.addUserAddress = async function (req, res) {
    /**
     * Path variable: userId
     */

    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    const {eupMyeonDongName, detailAddress, addressCategory, introduction} = req.body;

     
    // 빈 값 체크
    if (!eupMyeonDongName)
        return res.send(response(baseResponse.ADDADDRESS_EMD_NAME_EMPTY));
    if (!detailAddress)
        return res.send(response(baseResponse.ADDADDRESS_DETAIL_ADDRESS_EMPTY));
    if (!addressCategory)
        return res.send(response(baseResponse.ADDADDRESS_ADDRESS_CATEGORY_EMPTY));

    // 길이 체크
    if (detailAddress.length > 50)
        return res.send(response(baseResponse.ADDADDRESS_DETAIL_ADDRESS_LENGTH));
    if (typeof(introduction) !== 'undefined') {
        if (introduction.length > 100)
            return res.send(response(baseResponse.ADDADDRESS_INTRODUCTION_LENGTH));
    }

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!introduction){
            const addUserAddress = await userService.addUserAddress(userId,eupMyeonDongName, detailAddress, addressCategory);
            console.log(addUserAddress)
            return res.send(addUserAddress);

        } else{
            const addUserAddress = await userService.addUserAddress(userId,eupMyeonDongName, detailAddress, addressCategory, introduction);
            console.log(addUserAddress)
            return res.send(addUserAddress);
        }
    }
};

/**
 * API No. 23
 * API Name : 배달지 주소 수정 API
 * [PATCH] /app/users/:userId/addresses/:userAddressId
 * body : eupMyeonDongName, detailAddress,addressCategory, introduction
 */
exports.patchUserAddress = async function (req, res) {
    /**
     * Path variable: userId, userAddressId
     */

    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    const userAddressId = req.params.userAddressId;
    const {eupMyeonDongName, detailAddress, addressCategory, introduction} = req.body;


    // 빈 값 체크
    if (!eupMyeonDongName)
        return res.send(response(baseResponse.ADDADDRESS_EMD_NAME_EMPTY));
    if (!detailAddress)
        return res.send(response(baseResponse.ADDADDRESS_DETAIL_ADDRESS_EMPTY));
    if (!addressCategory)
        return res.send(response(baseResponse.ADDADDRESS_ADDRESS_CATEGORY_EMPTY));
    if (!userAddressId)
        return res.send(response(baseResponse.ADDADDRESS_ADDRESS_ID_EMPTY));

    // 길이 체크
    if (detailAddress.length > 50)
        return res.send(response(baseResponse.ADDADDRESS_DETAIL_ADDRESS_LENGTH));
    if (typeof(introduction) !== 'undefined') {
        if (introduction.length > 100)
            return res.send(response(baseResponse.ADDADDRESS_INTRODUCTION_LENGTH));
    }

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const patchUserAddress = await userService.patchUserAddress(eupMyeonDongName, detailAddress, addressCategory, introduction, userAddressId, userId);
        console.log(patchUserAddress)
        return res.send(patchUserAddress);
    }
};

/**
 * API No. 24
 * API Name : 배달지 삭제 API
 * [PATCH] /app/users/:userId/delete-addresses/:userAddressId
 */
exports.deleteUserAddress = async function (req, res) {
    /**
     * Path variable: userId, userAddressId
     */

    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    const userAddressId = req.params.userAddressId;

    parseInt(userId)

    // 빈 값 체크
    if (!userId)
        return res.send(response(baseResponse.REPPAY_USERID_EMPTY));
    if (!userAddressId)
        return res.send(response(baseResponse.ADDADDRESS_ADDRESS_ID_EMPTY));
    // console.log(userId);
    //     // console.log(typeof userId);
    //     // // 인덱스 양의 정수 체크
    //     // if (Number.isInteger(userId) === false){
    //     //     return res.send(response(baseResponse.USERID_NOT_INT));
    //     // }
    //     // if (isPositive(userId) === false){
    //     //     return res.send(response(baseResponse.USERID_NOT_POSITIVE));
    //     // }
    //     // if (Number.isInteger(userAddressId) === false){
    //     //     return res.send(response(baseResponse.USERADDRESSID_NOT_INT));
    //     // }
    //     // if (isPositive(userAddressId) === false){
    //     //     return res.send(response(baseResponse.USERADDRESSID_NOT_POSITIVE));
    //     // }

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const deleteUserAddress = await userService.deleteUserAddress(userId, userAddressId);
        console.log(deleteUserAddress)
        return res.send(deleteUserAddress);
    }
};


/**
 * API No. 25
 * API Name : 즐겨찾기 추가 API
 * [POST] /app/users/:userId/bookmarks
 * body : restId
 */
exports.addBookmarks = async function (req, res) {
    /**
     * Path variable: userId
     */

    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    const {restId} = req.body;
    console.log("진입")


    // 빈 값 체크
    if (!userId)
        return res.send(response(baseResponse.REPPAY_USERID_EMPTY));
    if (!restId)
        return res.send(response(baseResponse.REVIEW_RESTID_EMPTY));


    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const addBookmarks = await userService.addBookmarks(userId,restId);
        console.log(addBookmarks)
        return res.send(addBookmarks);

    }
};


/**
 * API No. 26
 * API Name : 즐겨찾기 목록 조회 API
 * [GET] /app/users/:userId/addresses
 */
exports.getBookmarks = async function (req, res) {
    /**
     * Path variable: userId
     */

    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;

    // 빈값확인
    if (!userId)
        return res.send(response(baseResponse.REPPAY_USERID_EMPTY)); // 30
    // 숫자 확인
    if (isNaN(userId) === true)
        return res.send(response(baseResponse.REPPAY_USERID_NOTNUM)); // 31

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const getBookmarks = await userProvider.getBookmarks(userId);
        return res.send(response(baseResponse.SUCCESS, getBookmarks));
    }
};




/**
 * API No. 27
 * API Name : 검색 API
 * [GET] /app/users/:userId/addresses
 */
exports.search = async function (req, res) {
    /**
     * Path variable: userId
     */
    /**
     * Body: searchContent
     */

    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    const {searchContent} = req.body;

    // 빈 값 체크
    if (!userId)
        return res.send(response(baseResponse.REPPAY_USERID_EMPTY)); // 30
    if (!searchContent)
        return res.send(response(baseResponse.SEARCH_CONTENT_EMPTY)); // 51

    // 길이 체크
    if (searchContent.length > 45)
        return res.send(response(baseResponse.SEARCH_CONTENT_LENGTH)); // 52

    // 숫자 확인
    if (isNaN(userId) === true)
        return res.send(response(baseResponse.REPPAY_USERID_NOTNUM)); // 31

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const searchResult = await userProvider.search(userId, searchContent);
        return res.send(response(baseResponse.SUCCESS, searchResult));
    }
};

/**
 * API No. 28
 * API Name : 인기 검색어 조회 API
 * [GET] /app/users/searches/popular
 */
exports.popularSearch = async function (req, res) {

    const popularSearchResult = await userProvider.popularSearch();
    return res.send(response(baseResponse.SUCCESS, popularSearchResult));

};

/**
 * API No. 29
 * API Name : 최근 검색어 조회 API
 * [GET] /app/users/:userId/searches/recent
 */
exports.recentSearch = async function (req, res) {
    /**
     * Path variable: userId
     */

    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    // 빈 값 체크
    if (!userId)
        return res.send(response(baseResponse.REPPAY_USERID_EMPTY)); // 30
    // 숫자 확인
    if (isNaN(userId) === true)
        return res.send(response(baseResponse.REPPAY_USERID_NOTNUM)); // 31

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const recentSearchResult = await userProvider.recentSearch(userId);
        return res.send(response(baseResponse.SUCCESS, recentSearchResult));
    }
};


/**
 * API No. 30
 * API Name : 주문내역 조회 API
 * [GET] /app/users/:userId/searches/recent
 */
exports.orderList = async function (req, res) {
    /**
     * Path variable: userId
     */

    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    // 빈 값 체크
    if (!userId)
        return res.send(response(baseResponse.REPPAY_USERID_EMPTY)); // 30
    // 숫자 확인
    if (isNaN(userId) === true)
        return res.send(response(baseResponse.REPPAY_USERID_NOTNUM)); // 31

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const orderListResult = await userProvider.orderList(userId);
        return res.send(response(baseResponse.SUCCESS, orderListResult));
    }
};

/**
 * API No. 31
 * API Name : 카카오 소셜 로그인 API
 */
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

passport.use('kakao-login', new KakaoStrategy({
    clientID: '3a6baddf50b045d0c3593cbd288c61b1',
    callbackURL: 'http://localhost:3000/kakao/oauth',
}, async (accessToken, refreshToken, profile, done) => {
    console.log(accessToken); console.log(profile);
}));





// /** JWT 토큰 검증 API
//  * [GET] /app/auto-login
//  */
// exports.check = async function (req, res) {
//     const userIdResult = req.verifiedToken.userId;
//     console.log(userIdResult);
//     return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
// };