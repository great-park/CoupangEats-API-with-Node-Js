const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const restaurantProvider = require("./restaurantProvider");
const restaurantDao = require("./restaurantDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");


// 리뷰 평가 Good
exports.increaseGood = async function (restId, reviewId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const increaseGoodResult = await restaurantDao.increaseGood(connection, restId, reviewId)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - increaseGood Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 리뷰 평가 Bad
exports.increaseBad = async function (restId, reviewId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const increaseBadResult = await restaurantDao.increaseBad(connection, restId, reviewId)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - increaseBad Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 리뷰 작성
exports.postReview = async function (restId,userId, menuId, reviewContent, reviewImageUrl, star) {
    try {
        // 해당 유저가 이 메뉴를 시킨 적이 있는지 확인
        const userOrderCheckRows = await restaurantProvider.userOrderCheck(userId, menuId); //
        console.log(userOrderCheckRows)
        if (userOrderCheckRows.length === 0)
            return errResponse(baseResponse.REVIEW_NOT_ORDER); //

        const connection = await pool.getConnection(async (conn) => conn);

        const postReviewResult = await restaurantDao.postReview(connection, restId, menuId, userId, reviewContent, reviewImageUrl, star)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - postReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}