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

    // userEmail, password 형식적 Validation
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


// /** JWT 토큰 검증 API
//  * [GET] /app/auto-login
//  */
// exports.check = async function (req, res) {
//     const userIdResult = req.verifiedToken.userId;
//     console.log(userIdResult);
//     return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
// };