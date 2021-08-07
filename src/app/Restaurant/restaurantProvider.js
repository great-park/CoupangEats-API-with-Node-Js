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

    const RestMenuResult = [
        await restaurantDao.selectRestMenuInfo(connection, menuId),
        await restaurantDao.selectRestAdditionalMenu(connection, menuId)
    ];
    connection.release();
    return RestMenuResult;
};
