const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const paymentProvider = require("./paymentProvider");
const paymentDao = require("./paymentDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");


// 결제하기
exports.addOrder = async function (cartId, reqManager, reqDelivery, disposableCheck, userCouponId) {
    try {
        // cartId 중복 확인
        const cartIdRows = await paymentProvider.cartIdCheck(cartId);
        if (cartIdRows.length > 0)
            return errResponse(baseResponse.ADDORDER_REDUNDANT_CARTID);

        // cart가 존재하는지 확인인

       if (!userCouponId) {
            const connection = await pool.getConnection(async (conn) => conn);
            const addOrderNoCouponParams =[cartId, reqManager, reqDelivery, disposableCheck];
            const addTotalPayPriceParams =[cartId, cartId];

            const addOrderNoCouponResult = await paymentDao.addOrderNoCoupon(connection, addOrderNoCouponParams);
            const addTotalPayPrice = await  paymentDao.addTotalPayPrice(connection, addTotalPayPriceParams);
            connection.release();
            return response(baseResponse.SUCCESS);
        } else {
            const connection = await pool.getConnection(async (conn) => conn);
            const addOrderParams =[cartId, reqManager, reqDelivery, disposableCheck, userCouponId];
            const addTotalPayPriceParams =[cartId, cartId];

            const addOrderResult = await paymentDao.addOrder(connection, addOrderParams);
            const addTotalPayPrice = await  paymentDao.addTotalPayPrice(connection, addTotalPayPriceParams);
            connection.release();
            return response(baseResponse.SUCCESS);
        }
    } catch (err) {
        logger.error(`App - addOrder Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};