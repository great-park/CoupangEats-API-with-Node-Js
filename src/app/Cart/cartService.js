const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const cartProvider = require("./cartProvider");
const cartDao = require("./cartDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 카트에 담기
exports.addCart = async function (userId, restaurantId, cartId, menuId, menuCount, additionalMenuId) {
    try {
        // 카트 인덱스 중복 확인
        const cartIdRows = await cartProvider.cartIdCheck(cartId);
        if (cartIdRows.length > 0)
            return errResponse(baseResponse.ADDCART_REDUNDANT_CARTID);
        // 같은 카트 안 메뉴 인덱스 중복 확인
        const menuPerCartRows = await cartProvider.menuPerCartCheck(cartId,menuId);
        if (menuPerCartRows.length > 0)
            return errResponse(baseResponse.ADDCART_REDUNDANT_MENU);

        const CartParams = [userId,restaurantId, userId];
        const MenuPerCartParams = [cartId, menuId, menuCount];
        const AdditionalMenuPerCartParams = [cartId, menuId, additionalMenuId];



        const connection = await pool.getConnection(async (conn) => conn);

        const CartResult = await cartDao.insertCart(connection, CartParams);
        const MenuPerCartResult = await cartDao.insertMenuPerCart(connection, MenuPerCartParams);
        const AdditionalMenuPerCartResult = await cartDao.insertAdditionalMenuPerCart(connection, AdditionalMenuPerCartParams);



        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - addCart Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};