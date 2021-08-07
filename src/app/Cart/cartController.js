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
     * Body: userId, restId, cartId, menuId, menuCount, additionalMenuId, addtionalMenuCount
     */
    const {userId, restId, cartId, menuId, menuCount, additionalMenuId, addtionalMenuCount} = req.body;

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
    if (!addtionalMenuCount)
        return res.send(response(baseResponse.ADDCART_ADDITIONALMENUCOUNT_EMPTY));
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
    if (isNaN(addtionalMenuCount) === true)
        return res.send(response(baseResponse.ADDCART_ADDITIONALMENUCOUNT_NOTNUM));


    const addCartResponse = await cartService.addCart(
        userId, restId, cartId, menuId, menuCount, additionalMenuId, addtionalMenuCount
    );
    return res.send(addCartResponse);

};

