module.exports = {
    selectTestData,
    selectUseremail,
    selectUserphoneNumber,
    insertUserInfo,
    selectUserPassword,
    selectUserAccount,
    selectUserDefaultAddress,
    selectEvents,
    selectCategory,
    selectFranchises,
    selectRecentlyOpenings,
    selectfamous
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


// 홈화면 회원의 기본 주소
async function selectUserDefaultAddress(connection, userId) {
    const selectUserDefaultAddressQuery = `
        select DA.userId, DA.userAddressId as defaultAddressId,
               case when addressCategory = 'home' then '집'
                    else
                        case when addressCategory = 'company' then '회사'

                             else
                                 case when addressCategory = 'etc' then detailAddress
                                     end
                            end
                   end as homeAddress,
               eupMyeonDongCode, userLatitue, userHardness
        from UserAddress
                 inner join DefaultAddress DA on UserAddress.userAddressId = DA.userAddressId;
        `;
    const [selectUserDefaultAddressRow] = await connection.query(
        selectUserDefaultAddressQuery,
        userId
    );

    return selectUserDefaultAddressRow;
}

// 이벤트 배너
async function selectEvents(connection) {
    const selectEventsQuery = `
        select eventImageUrl, connectUrl from Event;
        `;
    const [selectEventsRow] = await connection.query(
        selectEventsQuery
    );

    return selectEventsRow;
}

// 홈화면 식당 카테고리
async function selectCategory(connection) {
    const selectCategoryQuery = `
        select categoryName, categoryImageUrl from Category;
        `;
    const [selectCategoryRow] = await connection.query(
        selectCategoryQuery
    );

    return selectCategoryRow;
}


// 홈화면 인기프랜차이즈
async function selectFranchises(connection, userId) {
    const selectFranchisesQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon, deliveryFee, star, count(reviewId), distance
from Restaurant
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       CONCAT(
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
           , 'km')
AS distance
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where categoryId = 25 and (star > 4.5)
group by restId;
        `;
    const [selectFranchisesRow] = await connection.query(
        selectFranchisesQuery, userId
    );

    return selectFranchisesRow;
}

// 홈화면 새로 들어왔어요!
async function selectRecentlyOpenings(connection, userId) {
    const selectRecentlyOpeningsQuery = `
        select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon, deliveryFee, star, count(reviewId), distance
        from Restaurant
                 inner join Review R on Restaurant.restId = R.restId
                 inner join (SELECT userId, userAddressId,restId,
                                    #거리계산
                                        CONCAT(
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
           , 'km')
AS distance
                             FROM Restaurant, UserAddress
                             where userId = ?
                             ORDER BY distance) DistanceInfo
                 inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
        where (TIMESTAMPDIFF(MONTH ,Restaurant.createdAt, CURRENT_TIMESTAMP)) < 1
        group by restId;
        `;
    const [selectRecentlyOpeningsRow] = await connection.query(
        selectRecentlyOpeningsQuery, userId
    );

    return selectRecentlyOpeningsRow;
}



// 홈화면 골라먹는 맛집!
async function selectfamous(connection, userId) {
    const selectfamousQuery = `
        select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon, deliveryFee, star, count(reviewId), distance
        from Restaurant
                 inner join Review R on Restaurant.restId = R.restId
                 inner join (SELECT userId, userAddressId,restId,
                                    #거리계산
                                        CONCAT(
    left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
        cos(radians(restHardness) - radians(userHardness)) +
        sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
    , 'km')
AS distance
                             FROM Restaurant, UserAddress
                             where userId = ?
                             ORDER BY distance) DistanceInfo
                 inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
        group by restId;
        `;
    const [selectfamousRow] = await connection.query(
        selectfamousQuery, userId
    );

    return selectfamousRow;
}
