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
    await userDao.selectRecentlyOpen(connection, userId),
    await userDao.selectFamous(connection, userId)
  ];
  connection.release();
  return restarurantsResult;
};


//골라먹는 맛집
exports.retrievefamous = async function (userId, deliveryFee, minimunAmount) {
  if (!deliveryFee) {
    if (!minimunAmount) {
      // 1. C 치타배달 상관 X, D 배달비 상관 X, M 최소주문 상관 X
      const connection = await pool.getConnection(async (conn) => conn);
      const FamousResult = await userDao.selectFamous(connection, userId);
      console.log('1번')
      connection.release();

      return FamousResult;
    } else {
      // 2. C 치타배달 상관 X, D 배달비 상관 X, M 최소주문 적용
      const connection = await pool.getConnection(async (conn) => conn);
      const MFamousResult = await userDao.selectMFamous(connection, userId, minimunAmount);
      console.log('2번')
      connection.release();

      return MFamousResult;
    }
  } else {
    if (!minimunAmount) {
      // 3. C 치타배달 상관 X, D 배달비 적용, M 최소주문 상관 X
      const connection = await pool.getConnection(async (conn) => conn);
      const DFamousResult = await userDao.selectDFamous(connection, userId, deliveryFee);
      console.log('3번')
      connection.release();

      return DFamousResult;
    } else {
      // 4. C 치타배달 상관 X, D 배달비 적용, M 최소주문 적용
      const connection = await pool.getConnection(async (conn) => conn);
      const DMFamousResult = await userDao.selectDMFamous(connection, userId, deliveryFee, minimunAmount);
      console.log('4번')
      connection.release();

      return DMFamousResult;
    }
  }
};
exports.retrieveCheetahfamous = async function (userId, deliveryFee, minimunAmount) {
  if (!deliveryFee) {
    if (!minimunAmount) {
      // 5. C 치타배달 o, D 배달비 상관 X, M 최소주문 상관 X
      const connection = await pool.getConnection(async (conn) => conn);
      const CFamousResult = await userDao.selectCFamous(connection, userId);
      console.log('5번')
      connection.release();

      return CFamousResult;
    } else {
      // 6. C 치타배달 o, D 배달비 상관 X, M 최소주문 적용
      const connection = await pool.getConnection(async (conn) => conn);
      const CMFamousResult = await userDao.selectCMFamous(connection, userId, minimunAmount);
      console.log('6번')
      connection.release();

      return CMFamousResult;
    }
  } else {
    if (!minimunAmount) {
      // 7. C 치타배달 o, D 배달비 적용, M 최소주문 상관 X
      const connection = await pool.getConnection(async (conn) => conn);
      const CDFamousResult = await userDao.selectCDFamous(connection, userId, deliveryFee);
      console.log('7번')
      connection.release();

      return CDFamousResult;
    } else {
      // 8. C 치타배달 o, D 배달비 적용, M 최소주문 적용
      const connection = await pool.getConnection(async (conn) => conn);
      const CDMFamousResult = await userDao.selectCDMFamous(connection, userId, deliveryFee, minimunAmount);
      console.log('8번')
      connection.release();

      return CDMFamousResult;
    }
  }
};
// 인기 프랜차이즈
exports.retrieveFranchise = async function (userId, deliveryFee, minimunAmount) {
  if (!deliveryFee) {
    if (!minimunAmount) {
      // 1. C 치타배달 상관 X, D 배달비 상관 X, M 최소주문 상관 X
      const connection = await pool.getConnection(async (conn) => conn);
      const franchiseResult = await userDao.selectFranchises(connection, userId);
      console.log('1번')
      connection.release();

      return franchiseResult;
    } else {
      // 2. C 치타배달 상관 X, D 배달비 상관 X, M 최소주문 적용
      const connection = await pool.getConnection(async (conn) => conn);
      const MfranchiseResult = await userDao.selectMFranchises(connection, userId, minimunAmount);
      console.log('2번')
      connection.release();

      return MfranchiseResult;
    }
  } else {
    if (!minimunAmount) {
      // 3. C 치타배달 상관 X, D 배달비 적용, M 최소주문 상관 X
      const connection = await pool.getConnection(async (conn) => conn);
      const DfranchiseResult = await userDao.selectDFranchises(connection, userId, deliveryFee);
      console.log('3번')
      connection.release();

      return DfranchiseResult;
    } else {
      // 4. C 치타배달 상관 X, D 배달비 적용, M 최소주문 적용
      const connection = await pool.getConnection(async (conn) => conn);
      const DMfranchiseResult = await userDao.selectDMFranchises(connection, userId, deliveryFee, minimunAmount);
      console.log('4번')
      connection.release();

      return DMfranchiseResult;
    }
  }
};
exports.retrieveCheetahFranchise = async function (userId, deliveryFee, minimunAmount) {
  if (!deliveryFee) {
    if (!minimunAmount) {
      // 5. C 치타배달 o, D 배달비 상관 X, M 최소주문 상관 X
      const connection = await pool.getConnection(async (conn) => conn);
      const CfranchiseResult = await userDao.selectCFranchises(connection, userId);
      console.log('5번')
      connection.release();

      return CfranchiseResult;
    } else {
      // 6. C 치타배달 o, D 배달비 상관 X, M 최소주문 적용
      const connection = await pool.getConnection(async (conn) => conn);
      const CMfranchiseResult = await userDao.selectCMFranchises(connection, userId, minimunAmount);
      console.log('6번')
      connection.release();

      return CMfranchiseResult;
    }
  } else {
    if (!minimunAmount) {
      // 7. C 치타배달 o, D 배달비 적용, M 최소주문 상관 X
      const connection = await pool.getConnection(async (conn) => conn);
      const CDfranchiseResult = await userDao.selectCDFranchises(connection, userId, deliveryFee);
      console.log('7번')
      connection.release();

      return CDfranchiseResult;
    } else {
      // 8. C 치타배달 o, D 배달비 적용, M 최소주문 적용
      const connection = await pool.getConnection(async (conn) => conn);
      const CDMfranchiseResult = await userDao.selectCDMFranchises(connection, userId, deliveryFee, minimunAmount);
      console.log('8번')
      connection.release();

      return CDMfranchiseResult;
    }
  }
};
// 새로 들어왔어요 API
exports.retrieveRecentlyOpen = async function (userId, deliveryFee, minimunAmount) {
  if (!deliveryFee) {
    if (!minimunAmount) {
      // 1. C 치타배달 상관 X, D 배달비 상관 X, M 최소주문 상관 X
      const connection = await pool.getConnection(async (conn) => conn);
      const RecentlyOpenResult = await userDao.selectRecentlyOpen(connection, userId);
      console.log('1번')
      connection.release();

      return RecentlyOpenResult;
    } else {
      // 2. C 치타배달 상관 X, D 배달비 상관 X, M 최소주문 적용
      const connection = await pool.getConnection(async (conn) => conn);
      const MRecentlyOpenResult = await userDao.selectMRecentlyOpen(connection, userId, minimunAmount);
      console.log('2번')
      connection.release();

      return MRecentlyOpenResult;
    }
  } else {
    if (!minimunAmount) {
      // 3. C 치타배달 상관 X, D 배달비 적용, M 최소주문 상관 X
      const connection = await pool.getConnection(async (conn) => conn);
      const DRecentlyOpenResult = await userDao.selectDRecentlyOpen(connection, userId, deliveryFee);
      console.log('3번')
      connection.release();

      return DRecentlyOpenResult;
    } else {
      // 4. C 치타배달 상관 X, D 배달비 적용, M 최소주문 적용
      const connection = await pool.getConnection(async (conn) => conn);
      const DMRecentlyOpenResult = await userDao.selectDMRecentlyOpen(connection, userId, deliveryFee, minimunAmount);
      console.log('4번')
      connection.release();

      return DMRecentlyOpenResult;
    }
  }
};
exports.retrieveCheetahRecentlyOpen = async function (userId, deliveryFee, minimunAmount) {
  if (!deliveryFee) {
    if (!minimunAmount) {
      // 5. C 치타배달 o, D 배달비 상관 X, M 최소주문 상관 X
      const connection = await pool.getConnection(async (conn) => conn);
      const CRecentlyOpenResult = await userDao.selectCRecentlyOpen(connection, userId);
      console.log('5번')
      connection.release();

      return CRecentlyOpenResult;
    } else {
      // 6. C 치타배달 o, D 배달비 상관 X, M 최소주문 적용
      const connection = await pool.getConnection(async (conn) => conn);
      const CMRecentlyOpenResult = await userDao.selectCMRecentlyOpen(connection, userId, minimunAmount);
      console.log('6번')
      connection.release();

      return CMRecentlyOpenResult;
    }
  } else {
    if (!minimunAmount) {
      // 7. C 치타배달 o, D 배달비 적용, M 최소주문 상관 X
      const connection = await pool.getConnection(async (conn) => conn);
      const CDRecentlyOpenResult = await userDao.selectCDRecentlyOpen(connection, userId, deliveryFee);
      console.log('7번')
      connection.release();

      return CDRecentlyOpenResult;
    } else {
      // 8. C 치타배달 o, D 배달비 적용, M 최소주문 적용
      const connection = await pool.getConnection(async (conn) => conn);
      const CDMRecentlyOpenResult = await userDao.selectCDMRecentlyOpen(connection, userId, deliveryFee, minimunAmount);
      console.log('8번')
      connection.release();

      return CDMRecentlyOpenResult;
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


