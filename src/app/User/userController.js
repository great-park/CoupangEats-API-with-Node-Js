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


// /**
//  * API No
//  * API Name : 유저 생성 (회원가입) API // 전화번호, 위치정보, 닉네임, 프로필 사진
//  * [POST] /app/users
//  */
// exports.postUsers = async function (req, res) {
//     /**
//      * Body: phoneNumber, townName, userName, userImageUrl, password
//      */
//     const {phoneNumber, townName, userName, userImageUrl, password} = req.body;
//
//     // 빈 값 체크
//     if (!phoneNumber)
//         return res.send(response(baseResponse.SIGNUP_PHONENUMBER_EMPTY));
//     if (!townName)
//         return res.send(response(baseResponse.SIGNUP_TOWNNAME_EMPTY));
//     if (!userName)
//         return res.send(response(baseResponse.SIGNUP_USERNAME_EMPTY));
//     if (!password)
//         return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
//
//     // 길이 체크
//     if (phoneNumber.length != 11)
//         return res.send(response(baseResponse.SIGNUP_PHONENUMBER_LENGTH));
//     if (userName.length > 20)
//         return res.send(response(baseResponse.SIGNUP_USERNAME_LENGTH));
//     if (password.length > 20 || password.length < 6)
//         return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
//     // 숫자 확인
//     if (isNaN(phoneNumber) === true)
//         return res.send(response(baseResponse.SIGNUP_PHONENUMBER_NOTNUM))
//
//     const signUpResponse = await userService.createUser(
//         phoneNumber,
//         townName,
//         userName,
//         userImageUrl,
//         password
//     );
//     return res.send(signUpResponse);
// };
//
// // TODO: After 로그인 인증 방법 (JWT)
// /**
//  * API No. 10
//  * API Name : 로그인 API
//  * [POST] /app/login
//  * body : phoneNumber, passsword
//  */
// exports.login = async function (req, res) {
//
//     const {phoneNumber, password} = req.body;
//
//     // phoneNumber, password 형식적 Validation
//     // 빈 값 체크
//     if (!phoneNumber)
//         return res.send(response(baseResponse.SIGNUP_PHONENUMBER_EMPTY));
//     if (!password)
//         return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
//     // 길이 체크
//     if (phoneNumber.length != 11)
//         return res.send(response(baseResponse.SIGNUP_PHONENUMBER_LENGTH));
//     if (password.length > 20 || password.length < 6)
//         return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
//     // 숫자 확인
//     if (isNaN(phoneNumber) === true)
//         return res.send(response(baseResponse.SIGNUP_PHONENUMBER_NOTNUM))
//
//     const signInResponse = await userService.postSignIn(phoneNumber, password);
//     console.log(signInResponse)
//
//     return res.send(signInResponse);
// };


// /** JWT 토큰 검증 API
//  * [GET] /app/auto-login
//  */
// exports.check = async function (req, res) {
//     const userIdResult = req.verifiedToken.userId;
//     console.log(userIdResult);
//     return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
// };