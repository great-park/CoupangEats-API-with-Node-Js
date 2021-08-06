const jwtMiddleware = require("../../../config/jwtMiddleware");
const restaurantProvider = require("../../app/Restaurant/restaurantProvider");
const restaurantService = require("../../app/Restaurant/restaurantService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");


/**
 * API No. 8
 * API Name : 식당 자세한 정보 조회 API
 * [GET] /app/restaurants/:restId/informations
 */
exports.restDetailInfo = async function (req, res) {
    /**
     * Path variable:restId
     */
    const restId = req.params.restId;

    const restDetailInfoList = await restaurantProvider.retrieveRestDetailInfo(restId);
    return res.send(response(baseResponse.SUCCESS, restDetailInfoList));

};


/**
 * API No. 9
 * API Name : 특정 메뉴 정보 조회 API
 * [GET] /app/restaurants/:restId/menu/:menuId
 */
exports.restMenu = async function (req, res) {
    /**
     * Path variable:restId, menuId
     */
    const menuId = req.params.menuId;

    const restMenuList = await restaurantProvider.retrieveRestMenu(menuId);
    return res.send(response(baseResponse.SUCCESS, restMenuList));

};

