const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const cartDao = require("./cartDao");



// 카트 인덱스 체크
exports.cartIdCheck = async function (cartId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const cartIdCheckResult = await cartDao.selectCartId(connection, cartId);
    connection.release();

    return cartIdCheckResult;
};

// 같은 카트내 메뉴 인덱스 중복 체크
exports.menuPerCartCheck = async function (cartId, menuId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const menuPerCartCheckResult = await cartDao.selectmenuPerCartCheck(connection, cartId, menuId);
    connection.release();

    return menuPerCartCheckResult;
};

// 카트 조회

exports.retrieveCart = async function (cartId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const retrieveCartResult = [
        await cartDao.selectCartAddress(connection, cartId),
        await cartDao.selectCartRestInfo(connection, cartId),
        await cartDao.selectCartMenuInfo(connection, cartId),
        await cartDao.selectCartOrderPrice(connection, cartId),
        await cartDao.selectCartTotalPrice(connection, cartId),
        await cartDao.selectCartReq(connection, cartId),
        await cartDao.selectCartCard(connection, cartId),
        await cartDao.selectCartAccount(connection, cartId)
    ];
    connection.release();
    return retrieveCartResult;
};