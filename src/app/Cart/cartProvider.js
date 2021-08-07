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