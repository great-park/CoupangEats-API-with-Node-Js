const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const restaurantDao = require("./restaurantDao");


// 식당 정보 조회 API
exports.retrieveRestDetailInfo = async function (restId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const RestDetailInfoResult = await restaurantDao.selectRestDetailInfo(connection, restId);
    connection.release();
    return RestDetailInfoResult;
};

// 특정 메뉴 조회 API
exports.retrieveRestMenu = async function (menuId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const RestMenuResult = await restaurantDao.selectRestMenuInfo(connection, menuId);
    const RestAdditionalMenuResult = await restaurantDao.selectRestAdditionalMenu(connection, menuId);
    connection.release();
    const finalRestMenuResult = {RestMenuResult, RestAdditionalMenuResult};
    return finalRestMenuResult;
};

// 리뷰 조회 API
exports.getReview = async function (restId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const getReviewResult = await restaurantDao.selectReview(connection, restId);
    connection.release();
    return getReviewResult;
};

exports.userOrderCheck = async function (userId, menuId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const userOrderCheckResult = await restaurantDao.userOrderCheck(connection, userId, menuId);
    connection.release();
    return userOrderCheckResult;
};
