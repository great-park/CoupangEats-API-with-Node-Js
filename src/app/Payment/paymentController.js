const jwtMiddleware = require("../../../config/jwtMiddleware");
const paymentProvider = require("../../app/Payment/paymentProvider");
const paymentService = require("../../app/Payment/paymentService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");


/**
 * API No. 15
 * API Name : 결제하기 API - 결제된 카트
 * [POST] /app/payments
 */
exports.addOrder = async function (req, res) {
    /**
     * Body: cartId
     */
    const {cartId, reqManager, reqDelivery, disposableCheck, userCouponId} = req.body;
    //totalPirce는 쿼리로 계산해서 서버 데이터에 입력

    // 빈 값 체크
    if (!cartId)
        return res.send(response(baseResponse.ADDORDER_CARTID_EMPTY));
    // 숫자 확인
    if (isNaN(cartId) === true)
        return res.send(response(baseResponse.ADDORDER_CARTID_NOTNUM))
    // 비밀번호 기타 조건 확인 - 영문/숫자/특수문자 2가지 이상 조합, 3개이상 연속되거나 동일한 문자/숫자 제외, 아이디 제외

    const addOrderResponse = await paymentService.addOrder(cartId);
    return res.send(addOrderResponse);
};