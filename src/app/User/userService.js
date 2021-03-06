const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 유저 생성
exports.createUser = async function (userEmail, password, phoneNumber, userName) {
    try {
        // 전화번호 중복 확인
        const phoneNumberRows = await userProvider.phoneNumberCheck(phoneNumber); // phoneNumberCheck
        if (phoneNumberRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_PHONENUMBER);
        //이메일 중복 확인
        const emailRows = await userProvider.emailCheck(userEmail); // emailCheck
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);
        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const insertUserInfoParams = [userEmail, hashedPassword, phoneNumber, userName];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// 로그인
exports.postSignIn = async function (userEmail, password) {
    try {
        // 이메일 여부 확인
        const userEmailRows = await userProvider.emailCheck(userEmail);
        if (userEmailRows.length < 1) return errResponse(baseResponse.SIGNIN_USEREMAIL_WRONG);
        const selectuserEmail = userEmailRows[0].userEmail
        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");
        const selectUserPasswordParams = [selectuserEmail, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);


        if (passwordRows[0].password !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }
        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(userEmail);
        console.log("userInfoRows : ", userInfoRows)
        if (userInfoRows[0].status === "N") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].status === "D") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }
        console.log("userInfoRows[0].userId")
        console.log(userInfoRows[0])
        console.log(userInfoRows[0].userId) // DB의 userId

        //토큰 생성 Service  sign method - jsonwebtoken 외부 라이브러리 사용
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].userId,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "User",
            } // 유효 기간 365일
        );
        const connection = await pool.getConnection(async (conn) => conn);
        const getUserInfoResult = await userDao.getUserInfo(connection, userEmail)
        connection.release();

        return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].userId, 'jwt': token, getUserInfoResult});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);

        return errResponse(baseResponse.DB_ERROR);
    }
};

// 기본 주소 변경
exports.editDefaultAddress = async function (userId, userAddressId) {
    try {
        console.log(userId)
        const connection = await pool.getConnection(async (conn) => conn);
        const editDefaultAddressResult = await userDao.updateDefaultAddress(connection, userId, userAddressId)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editDefaultAddress Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 대표 결제수단 변경 - 계좌
exports.editPaymentAccount = async function (userId, accountId) {
    try {
        console.log(userId)
        const connection = await pool.getConnection(async (conn) => conn);

        const initializationPaymentResult = await userDao.initializationPayment(connection, userId)
        const editPaymentAccountResult = await userDao.updatePaymentAccount(connection, userId, accountId)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editPaymentAccount Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 대표 결제수단 변경 - 카드
exports.editPaymentCard = async function (userId, cardId) {
    try {
        console.log(userId)
        const connection = await pool.getConnection(async (conn) => conn);

        const editPaymentCardResult = await userDao.updatePaymentCard(connection, userId, cardId)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editPaymentCard Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 배달지 추가
exports.addUserAddress = async function (userId,eupMyeonDongName, detailAddress, addressCategory, introduction) {
    try {
        //읍면동 이름 유효 확인
        const EMDRows = await userProvider.EMDCheck(eupMyeonDongName);
        if (EMDRows.length === 0)
            return errResponse(baseResponse.EMD_INVAILD_NAME);
        console.log(userId)

        if (!introduction){
            const connection = await pool.getConnection(async (conn) => conn);
            const addUserAddressResult = await userDao.addUserAddressNoI(connection,userId,eupMyeonDongName, detailAddress, addressCategory);
            connection.release();
            return response(baseResponse.SUCCESS);
        }else {
            const connection = await pool.getConnection(async (conn) => conn);
            const addUserAddressResult = await userDao.addUserAddress(connection,userId,eupMyeonDongName, detailAddress,addressCategory, introduction);
            connection.release();
            return response(baseResponse.SUCCESS);
        }
    } catch (err) {
        logger.error(`App - addUserAddress Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 배달지 수정
exports.patchUserAddress = async function (eupMyeonDongName, detailAddress, addressCategory, introduction, userAddressId, userId) {
    try {
        //읍면동 이름 유효 확인
        const EMDRows = await userProvider.EMDCheck(eupMyeonDongName);
        if (EMDRows.length === 0)
            return errResponse(baseResponse.EMD_INVAILD_NAME);
        console.log(userId)

        if (!introduction){
            const connection = await pool.getConnection(async (conn) => conn);
            const patchUserAddressResult = await userDao.patchUserAddressNoI(connection,eupMyeonDongName, detailAddress, addressCategory, userAddressId, userId);
            connection.release();
            return response(baseResponse.SUCCESS);
        }else {
            const connection = await pool.getConnection(async (conn) => conn);
            const patchUserAddressResult = await userDao.patchUserAddress(connection,eupMyeonDongName, detailAddress,addressCategory, introduction, userAddressId, userId);
            connection.release();
            return response(baseResponse.SUCCESS);
        }
    } catch (err) {
        logger.error(`App - patchUserAddress Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 즐겨찾기 추가
exports.addBookmarks = async function (userId,restId) {
    try {
        //즐겨찾기 중복 확인
        const BookmarksRows = await userProvider.BookmarksCheck(userId, restId);
        console.log(BookmarksRows)
        if (BookmarksRows.length > 0)
            return errResponse(baseResponse.BOOKMARKS_REDUNDANT);

        console.log(userId)
        const connection = await pool.getConnection(async (conn) => conn);
        const addBookmarksResult = await userDao.addBookmarks(connection,userId,restId);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - addBookmarks Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 배달지 삭제

exports.deleteUserAddress = async function (userId, userAddressId) {
    try {
        //존재하는 userAddresId인지 확인
        const userAddresIdRows = await userProvider.userAddresIdCheck(userAddressId);
        if (userAddresIdRows.length === 0)
            return errResponse(baseResponse.USERADDRESSID_INVALID);

        const connection = await pool.getConnection(async (conn) => conn);

        const deleteUserAddressResult = await userDao.deleteUserAddress(connection,userId,userAddressId);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - deleteUserAddress Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}