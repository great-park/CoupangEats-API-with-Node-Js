const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// RDS 연결 체크
exports.rdsTest = async function () {

  const connection = await pool.getConnection(async (conn) => conn);
  const rdsTestResult = await userDao.selectTestData(connection);
  connection.release();

  return rdsTestResult;
};


//전화번호 체크
exports.phoneNumberCheck = async function (phoneNumber) {
  const connection = await pool.getConnection(async (conn) => conn);
  const phoneNumberCheckResult = await userDao.selectUserphoneNumber(connection, phoneNumber);
  connection.release();

  return phoneNumberCheckResult;
};

//이메일 체크

exports.emailCheck = async function (userEmail) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUseremail(connection, userEmail);
  connection.release();

  return emailCheckResult;
};

//비밀번호 체크
exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(
      connection,
      selectUserPasswordParams
  );
  connection.release();


  return passwordCheckResult[0];
};

//계정 체크
exports.accountCheck = async function (userEmail) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, userEmail);
  connection.release();

  return userAccountResult;
};

// 홈화면
exports.retrieveRestarurants = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);

  const restarurantsResult = [
      await userDao.selectUserDefaultAddress(connection, userId),
    await userDao.selectEvents(connection),
    await userDao.selectCategory(connection),
    await userDao.selectFranchises(connection, userId),
    await userDao.selectRecentlyOpenings(connection, userId),
    await userDao.selectfamous(connection, userId)
  ];
  connection.release();
  return restarurantsResult;
};


//골라먹는 맛집
// 인기 프랜차이즈
exports.retrieveFranchise = async function (userId, deliveryFee, minimunAmount) {
  if (!deliveryFee) {
    if (!minimunAmount) {
      // 1. C 치타배달 상관 X, D 배달비 상관 X, M 최소주문 상관 X
      const connection = await pool.getConnection(async (conn) => conn);
      const franchiseResult = await userDao.selectFranchises(connection, userId);

      connection.release();

      return franchiseResult;
    } else {
      // 2. C 치타배달 상관 X, D 배달비 상관 X, M 최소주문 적용
      const connection = await pool.getConnection(async (conn) => conn);
      const MfranchiseResult = await userDao.selectMFranchises(connection, userId, minimunAmount);

      connection.release();

      return franchiseResult;
    }
  } else {
    if (!minimunAmount) {
      // 3. C 치타배달 상관 X, D 배달비 적용, M 최소주문 상관 X
      const connection = await pool.getConnection(async (conn) => conn);
      const DfranchiseResult = await userDao.selectDFranchises(connection, userId, deliveryFee);

      connection.release();

      return franchiseResult;
    } else {
      // 4. C 치타배달 상관 X, D 배달비 적용, M 최소주문 적용
      const connection = await pool.getConnection(async (conn) => conn);
      const DMfranchiseResult = await userDao.selectDMFranchises(connection, userId, deliveryFee, minimunAmount);

      connection.release();

      return franchiseResult;
    }
  }
};
exports.retrieveCheetahFranchise = async function (userId, deliveryFee, minimunAmount) {
  if (!deliveryFee) {
    if (!minimunAmount) {
      // 5. C 치타배달 o, D 배달비 상관 X, M 최소주문 상관 X
      const connection = await pool.getConnection(async (conn) => conn);
      const franchiseResult = await userDao.selectCFranchises(connection, userId);

      connection.release();

      return franchiseResult;
    } else {
      // 6. C 치타배달 o, D 배달비 상관 X, M 최소주문 적용
      const connection = await pool.getConnection(async (conn) => conn);
      const MfranchiseResult = await userDao.selectCMFranchises(connection, userId, minimunAmount);

      connection.release();

      return franchiseResult;
    }
  } else {
    if (!minimunAmount) {
      // 7. C 치타배달 o, D 배달비 적용, M 최소주문 상관 X
      const connection = await pool.getConnection(async (conn) => conn);
      const DfranchiseResult = await userDao.selectCDFranchises(connection, userId, deliveryFee);

      connection.release();

      return franchiseResult;
    } else {
      // 8. C 치타배달 o, D 배달비 적용, M 최소주문 적용
      const connection = await pool.getConnection(async (conn) => conn);
      const DMfranchiseResult = await userDao.selectCDMFranchises(connection, userId, deliveryFee, minimunAmount);

      connection.release();

      return franchiseResult;
    }
  }
};

// 식당 메뉴창 API
exports.retrievemenu = async function (userId, restId) {
  const connection = await pool.getConnection(async (conn) => conn);

  const menuResult = [
    await userDao.selectRestImageUrl(connection, restId),
    await userDao.selectRestInfo(connection, userId, restId),
    await userDao.selectReview(connection, restId),
    await userDao.selectMenu(connection, restId)
  ];
  connection.release();
  return menuResult;
};

// 식당 정보 조회 API
exports.retrieveRestDetailInfo = async function (restId) {
  const connection = await pool.getConnection(async (conn) => conn);

  const RestDetailInfoResult = [
    await userDao.selectRestDetailInfo(connection, restId)
  ];
  connection.release();
  return RestDetailInfoResult;
};
//새로 들어왔어요
