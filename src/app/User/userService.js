// const {logger} = require("../../../config/winston");
// const {pool} = require("../../../config/database");
// const secret_config = require("../../../config/secret");
// const userProvider = require("./userProvider");
// const userDao = require("./userDao");
// const baseResponse = require("../../../config/baseResponseStatus");
// const {response} = require("../../../config/response");
// const {errResponse} = require("../../../config/response");
//
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
// const {connect} = require("http2");
//
// // Service: Create, Update, Delete 비즈니스 로직 처리
//
// exports.createUser = async function (phoneNumber, townName, userName, userImageUrl, password) {
//     try {
//         // 전화번호 중복 확인
//         const phoneNumberRows = await userProvider.phoneNumberCheck(phoneNumber);
//         if (phoneNumberRows.length > 0)
//             return errResponse(baseResponse.SIGNUP_REDUNDANT_PHONENUMBER);
//         // 비밀번호 암호화
//         const hashedPassword = await crypto
//             .createHash("sha512")
//             .update(password)
//             .digest("hex");
//
//         const insertUserInfoParams = [phoneNumber, townName, userName, userImageUrl, hashedPassword];
//
//         const connection = await pool.getConnection(async (conn) => conn);
//
//         const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
//         console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
//         connection.release();
//         return response(baseResponse.SUCCESS);
//
//
//     } catch (err) {
//         logger.error(`App - createUser Service error\n: ${err.message}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// };
//
//
// // TODO: After 로그인 인증 방법 (JWT)
// exports.postSignIn = async function (phoneNumber, password) {
//     try {
//         // 전화번호 여부 확인
//         const phoneNumberRows = await userProvider.phoneNumberCheck(phoneNumber);
//         if (phoneNumberRows.length < 1) return errResponse(baseResponse.SIGNIN_PHONENUMBER_WRONG);
//         const selectphoneNumber = phoneNumberRows[0].phoneNumber
//         // 비밀번호 확인
//         const hashedPassword = await crypto
//             .createHash("sha512")
//             .update(password)
//             .digest("hex");
//         const selectUserPasswordParams = [selectphoneNumber, hashedPassword];
//         const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);
//
//
//         if (passwordRows[0].password !== hashedPassword) {
//             return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
//         }
//         // 계정 상태 확인
//         const userInfoRows = await userProvider.accountCheck(phoneNumber);
//         console.log("userInfoRows : ", userInfoRows)
//         if (userInfoRows[0].status === "N") {
//             return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
//         } else if (userInfoRows[0].status === "D") {
//             return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
//         }
//         console.log("userInfoRows[0].userId")
//         console.log(userInfoRows[0])
//         console.log(userInfoRows[0].userId) // DB의 userId
//
//         //토큰 생성 Service  sign method - jsonwebtoken 외부 라이브러리 사용
//         let token = await jwt.sign(
//             {
//                 userId: userInfoRows[0].userId,
//             }, // 토큰의 내용(payload)
//             secret_config.jwtsecret, // 비밀키
//             {
//                 expiresIn: "365d",
//                 subject: "User",
//             } // 유효 기간 365일
//         );
//
//         return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].userId, 'jwt': token});
//
//     } catch (err) {
//         logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
//
//         return errResponse(baseResponse.DB_ERROR);
//     }
// };
