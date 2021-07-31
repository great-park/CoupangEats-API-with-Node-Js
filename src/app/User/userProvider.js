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

// Provider: Read 비즈니스 로직 처리
//
// //전화번호 체크
// exports.phoneNumberCheck = async function (phoneNumber) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const phoneNumberCheckResult = await userDao.selectUserphoneNumber(connection, phoneNumber); // 확인 필요
//   connection.release();
//
//   return phoneNumberCheckResult;
// };
//
// //비밀번호 체크
// exports.passwordCheck = async function (selectUserPasswordParams) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const passwordCheckResult = await userDao.selectUserPassword(
//       connection,
//       selectUserPasswordParams
//   );
//   connection.release();
//
//
//   return passwordCheckResult[0];
// };

//계정 체크
exports.accountCheck = async function (phoneNumber) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, phoneNumber);
  connection.release();
  console.log("provider")
  console.log(userAccountResult)

  return userAccountResult;
};

