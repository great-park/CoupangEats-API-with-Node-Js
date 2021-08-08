const jwtMiddleware = require("../../../config/jwtMiddleware");
const cartProvider = require("../../app/Cart/cartProvider");
const cartService = require("../../app/Cart/cartService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");


/**
 * API No. 10
 * API Name : 카트에 담기 API
 * [POST] /app/carts
 */
exports.addCart = async function (req, res) {
    /**
     * Body: userId, restId, cartId, menuId, menuCount, additionalMenuId
     */
    const {userId, restId, cartId, menuId, menuCount, additionalMenuId} = req.body;

    // 빈값 체크
    if (!userId)
        return res.send(response(baseResponse.ADDCART_USERID_EMPTY));
    if (!restId)
        return res.send(response(baseResponse.ADDCART_RESTID_EMPTY));
    if (!cartId)
        return res.send(response(baseResponse.ADDCART_CARTID_EMPTY));
    if (!menuId)
        return res.send(response(baseResponse.ADDCART_MENUID_EMPTY));
    if (!menuCount)
        return res.send(response(baseResponse.ADDCART_MENUCOUNT_EMPTY));
    if (!additionalMenuId)
        return res.send(response(baseResponse.ADDCART_ADDITIONALMENUID_EMPTY));

    // 숫자 확인
    if (isNaN(userId) === true)
        return res.send(response(baseResponse.ADDCART_USERID_NOTNUM));
    if (isNaN(restId) === true)
        return res.send(response(baseResponse.ADDCART_RESTID_NOTNUM));
    if (isNaN(cartId) === true)
        return res.send(response(baseResponse.ADDCART_CARTID_NOTNUM));
    if (isNaN(menuId) === true)
        return res.send(response(baseResponse.ADDCART_MENUID_NOTNUM));
    if (isNaN(menuCount) === true)
        return res.send(response(baseResponse.ADDCART_MENUCOUNT_NOTNUM));
    if (isNaN(additionalMenuId) === true)
        return res.send(response(baseResponse.ADDCART_ADDITIONALMENUID_NOTNUM));



    const addCartResponse = await cartService.addCart(
        userId, restId, cartId, menuId, menuCount, additionalMenuId
    );
    return res.send(addCartResponse);

};


/**
 * API No. 11
 * API Name : 카트 조회 API
 * [GET] /app/carts/:cartId
 */
exports.getCart = async function (req, res) {
    /**
     * Path variable: cartId
     */
    const cartId = req.params.cartId;

    const CartList = await cartProvider.retrieveCart(cartId);
    return res.send(response(baseResponse.SUCCESS, CartList));

};


/**
 * API No. 13
 * API Name : 카트 요청사항 입력 API
 * [PATCH] /app/carts/:cartId/requests
 */
exports.addReq = async function (req, res) {
    /**
     * Body: reqManager, reqDelivery
     */
    /**
     * Path variale: cartId
     */

    const {reqManager, reqDelivery} = req.body;
    const cartId = req.params.cartId;

    const addReqResponse = await cartService.addReq(
        reqManager, reqDelivery, cartId
    );
    return res.send(addReqResponse);

};