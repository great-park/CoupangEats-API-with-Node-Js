module.exports = {
    selectTestData,
    selectUseremail,
    selectUserphoneNumber,
    insertUserInfo,
    selectUserPassword,
    selectUserAccount
};

async function selectTestData(connection) {
    const selectQuery = `
    select * from User
                `;
    const [Rows] = await connection.query(selectQuery);
    return Rows;
}



// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
    INSERT INTO User(userEmail, password, phoneNumber, userName)
    VALUES (?, ?, ?, ?);
  `;
  const insertUserInfoRow = await connection.query(
      insertUserInfoQuery,
      insertUserInfoParams
  );

  return insertUserInfoRow;
}

//전화번호 체크
async function selectUserphoneNumber(connection, phoneNumber) {
  const selectUserphoneNumberQuery = `
                SELECT phoneNumber, userName
                FROM User
                WHERE phoneNumber = ?;
                `;
  const [phoneNumberRows] = await connection.query(selectUserphoneNumberQuery, phoneNumber);
  return phoneNumberRows;
}

//이메일 체크

async function selectUseremail(connection, userEmail) {
    const selectUseremailQuery = `
                SELECT userEmail, userId
                FROM User
                WHERE userEmail = ?;
                `;
    const [emailRows] = await connection.query(selectUseremailQuery, userEmail);
    return emailRows;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT userEmail, userName, password
        FROM User
        WHERE userEmail = ? AND password = ?;
        `;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );
  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 userId 값도 가져온다.)
async function selectUserAccount(connection, userEmail) {
  const selectUserAccountQuery = `
        SELECT userId, status
        FROM User
        WHERE userEmail = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      userEmail
  );
  console.log("---Dao selectUserAccount")
  console.log(selectUserAccountRow)
  console.log(selectUserAccountRow[0])
  return selectUserAccountRow[0];
}







