const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const cartDao = require("./cartDao");




// 같은 카트내 메뉴 인덱스 중복 체크
exports.menuPerCartCheck = async function (cartId, menuId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const menuPerCartCheckResult = await cartDao.selectmenuPerCartCheck(connection, cartId, menuId);
    connection.release();

    return menuPerCartCheckResult;
};


// 카트 존재 확인
exports.CartCheck = async function (cartId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const CartCheckResult = await cartDao.selectCartCheck(connection, cartId);
    connection.release();

    return CartCheckResult;
};

// 카트 조회

exports.retrieveCart = async function (cartId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const cartAddressResult = await cartDao.selectCartAddress(connection, cartId);
    const cartRestInfoResult = await cartDao.selectCartRestInfo(connection, cartId);
    const cartMenuINfoResult = await cartDao.selectCartMenuInfo(connection, cartId);
    const cartDeliveryFeeResult = await cartDao.selectDeliveryFee(connection, cartId);
    const card = await cartDao.selectCartCard(connection, cartId);
    const account = await cartDao.selectCartAccount(connection, cartId);

    const cartPayMethodResult = {card, account};

    const cartFinalResult = {cartAddressResult, cartRestInfoResult, cartMenuINfoResult, cartDeliveryFeeResult, cartPayMethodResult}
    connection.release();
    return cartFinalResult;
};