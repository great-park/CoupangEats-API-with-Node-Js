module.exports = {
  selectTestData
  // insertUserInfo,
  // selectUserphoneNumber,
  // selectUserPassword,
  // selectUserAccount
};

// test
async function selectTestData(connection) {
  const Query = `
  select * from User
  `;
  const [Row] = await connection.query(Query);
  return Row;
}



// // 유저 생성
// async function insertUserInfo(connection, insertUserInfoParams) {
//   const insertUserInfoQuery = `
//     INSERT INTO User(phoneNumber, townName, userName, userImageUrl, password)
//     VALUES (?, ?, ?, ?, ?);
//   `;
//   const insertUserInfoRow = await connection.query(
//       insertUserInfoQuery,
//       insertUserInfoParams
//   );
//
//   return insertUserInfoRow;
// }
//
// //전화번호 체크
// async function selectUserphoneNumber(connection, phoneNumber) {
//   const selectUserphoneNumberQuery = `
//                 SELECT phoneNumber, userName
//                 FROM User
//                 WHERE phoneNumber = ?;
//                 `;
//   const [phoneNumberRows] = await connection.query(selectUserphoneNumberQuery, phoneNumber);
//   return phoneNumberRows;
// }
//
// // 패스워드 체크
// async function selectUserPassword(connection, selectUserPasswordParams) {
//   const selectUserPasswordQuery = `
//         SELECT phoneNumber, userName, password
//         FROM User
//         WHERE phoneNumber = ? AND password = ?;
//         `;
//   const selectUserPasswordRow = await connection.query(
//       selectUserPasswordQuery,
//       selectUserPasswordParams
//   );
//   return selectUserPasswordRow;
// }
//
// // 유저 계정 상태 체크 (jwt 생성 위해 userId 값도 가져온다.)
// async function selectUserAccount(connection, phoneNumber) {
//   const selectUserAccountQuery = `
//         SELECT userId, status
//         FROM User
//         WHERE phoneNumber = ?;`;
//   const selectUserAccountRow = await connection.query(
//       selectUserAccountQuery,
//       phoneNumber
//   );
//   console.log("---Dao selectUserAccount")
//   console.log(selectUserAccountRow)
//   console.log(selectUserAccountRow[0])
//   return selectUserAccountRow[0];
// }
//
//
//




