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

// 카트 생성 / 카트에 담기 2
exports.createCart = async function (userId, restaurantId) {
    try {

        const CartParams = [userId,restaurantId, userId, userId];

        const connection = await pool.getConnection(async (conn) => conn);

        const CartResult = await cartDao.insertCart(connection, CartParams);
        const cartIdResult = CartResult[0].insertId;


        connection.release();
        return response(baseResponse.SUCCESS, {cartIdResult});


    } catch (err) {
        logger.error(`App - createCart Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 카트에 담기 1
exports.addCart = async function (cartId, menuId, menuCount, additionalMenuId) {
    try {
        // 같은 카트 안 메뉴 인덱스 중복 확인
        const menuPerCartRows = await cartProvider.menuPerCartCheck(cartId,menuId);
        if (menuPerCartRows.length > 0)
            return errResponse(baseResponse.ADDCART_REDUNDANT_MENU);

        const MenuPerCartParams = [cartId, menuId, menuCount];
        const AdditionalMenuPerCartParams = [cartId, menuId, additionalMenuId];

        const connection = await pool.getConnection(async (conn) => conn);

        const MenuPerCartResult = await cartDao.insertMenuPerCart(connection, MenuPerCartParams);
        const AdditionalMenuPerCartResult = await cartDao.insertAdditionalMenuPerCart(connection, AdditionalMenuPerCartParams);

        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - addCart Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


exports.addReq = async function (reqManager, reqDelivery, cartId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        const editDefaultAddressResult = await cartDao.addReq(connection,reqManager, reqDelivery, cartId)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - addReq Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};