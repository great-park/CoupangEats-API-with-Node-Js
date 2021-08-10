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
exports.addOrder = async function (cartId) {
    try {
        // cartId 중복 확인
        const cartIdRows = await paymentProvider.cartIdCheck(cartId);
        if (cartIdRows.length > 0)
            return errResponse(baseResponse.ADDORDER_REDUNDANT_CARTID);


        const connection = await pool.getConnection(async (conn) => conn);

        const addOrderResult = await paymentDao.addOrder(connection, cartId);

        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - addOrder Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};