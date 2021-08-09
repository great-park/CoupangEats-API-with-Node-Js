const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const paymentDao = require("./paymentDao");



//cartId 체크
exports.cartIdCheck = async function (cartId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const cartIdCheckResult = await paymentDao.selectCartId(connection, cartId);
    connection.release();

    return cartIdCheckResult;
};