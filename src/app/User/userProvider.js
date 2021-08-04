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

// 홈화면 골라먹는 맛집
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




