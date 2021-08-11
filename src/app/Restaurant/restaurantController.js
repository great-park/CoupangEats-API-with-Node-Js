const jwtMiddleware = require("../../../config/jwtMiddleware");
const restaurantProvider = require("../../app/Restaurant/restaurantProvider");
const restaurantService = require("../../app/Restaurant/restaurantService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");


/**
 * API No. 10
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
 * API No. 11
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


/**
 * API No. 18
 * API Name : 리뷰 조회 API
 * [GET] /app/restaurants/:restId/reviews
 */
exports.getReview = async function (req, res) {
    /**
     * Path variable:restId
     */
    const restId = req.params.restId;

    const getReviewList = await restaurantProvider.getReview(restId);
    return res.send(response(baseResponse.SUCCESS, getReviewList));

};

/**
 * API No. 19
 * API Name : 리뷰 평가 API
 * [PATCH] /app/restaurants/:restId/reviews/:reviewId/good-bad
 * body : good, bad
 */

exports.goodbadReview = async function (req, res) {

    /**
     * Path variable: restId, reviewId
     */

    const restId = req.params.restId;
    const reviewId = req.params.reviewId;
    const {good, bad} = req.body;
    // 빈 값 체크
    if (!restId)
        return res.send(response(baseResponse.REVIEW_RESTID_EMPTY));
    if (!reviewId)
        return res.send(response(baseResponse.REVIEW_REVEWID_EMPTY));



    if (!bad) {
        const increaseGood = await restaurantService.increaseGood(restId, reviewId) //
        console.log('good')
        return res.send(increaseGood);
    } else {
        const increaseBad = await restaurantService.increaseBad(restId, reviewId) //
        console.log('bad')
        return res.send(increaseBad);
    }
};

/**
 * API No. 20
 * API Name : 리뷰 작성 API
 * [POST] /app/restaurants/:restId/reviews
 */
exports.postReview = async function (req, res) {
    /**
     * Body: userId, menuId, reviewContent, reviewImageUrl, star
     */
    /**
     * Path variable: restId
     */
    const restId = req.params.restId;
    const {userId, menuId, reviewContent, reviewImageUrl, star} = req.body;

    // 빈값 체크
    if (!userId)
        return res.send(response(baseResponse.REVIEW_USERID_EMPTY));
    if (!restId)
        return res.send(response(baseResponse.REVIEW_RESTID_EMPTY));
    if (!reviewContent)
        return res.send(response(baseResponse.REVIEW_REVIEWCONTEN_EMPTY));
    if (!star)
        return res.send(response(baseResponse.REVIEW_STAR_EMPTY));

    // 숫자 확인
    if (isNaN(userId) === true)
        return res.send(response(baseResponse.REVIEW_USERID_NOTNUM));
    if (isNaN(restId) === true)
        return res.send(response(baseResponse.REVIEW_RESTID_NOTNUM));

    // 별점 범위 확인
    if (star > 5 || star <0)
        return res.send(response(baseResponse.REVIEW_STAR_RANGE)); //
    // 리뷰 내용 길이 확인
    if (reviewContent.length > 200)
        return res.send(response(baseResponse.REVIEW_CONTENT_RANGE));

    const userIdFromJWT = req.verifiedToken.userId;
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }


    const postReviewResponse = await restaurantService.postReview(restId,userId, menuId, reviewContent, reviewImageUrl, star);
    return res.send(postReviewResponse);

};
