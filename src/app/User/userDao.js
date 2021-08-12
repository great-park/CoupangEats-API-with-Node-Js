module.exports = {
    selectTestData,getUserInfo,
    selectUseremail,
    selectUserphoneNumber,
    insertUserInfo,
    selectUserPassword,
    selectUserAccount,
    selectUserDefaultAddress,
    selectEvents,
    selectCategory,
    selectFranchises, selectFranchisesNoUserId, selectRecentlyOpenNoUserId, selectFamousNoUserId,
    selectRecentlyOpen, selectMRecentlyOpen, selectDRecentlyOpen, selectDMRecentlyOpen, selectCRecentlyOpen, selectCMRecentlyOpen, selectCDRecentlyOpen, selectCDMRecentlyOpen,
    selectFamous, selectMFamous, selectDFamous, selectDMFamous, selectCFamous, selectCMFamous, selectCDFamous, selectCDMFamous,
    selectMFranchises, selectDFranchises, selectDMFranchises, selectCFranchises, selectCMFranchises, selectCDFranchises, selectCDMFranchises,
    selectRestInfo, selectRestInfoNoUser, selectRestImageUrl, selectReview, selectMenu,
    updateDefaultAddress,
    updatePaymentAccount, updatePaymentCard, initializationPayment, EMDCheck, addUserAddressNoI, addUserAddress,
    getUserAddress, patchUserAddressNoI, patchUserAddress, addBookmarks, BookmarksCheck, getBookmarks
};

async function selectTestData(connection) {
    const selectQuery = `
    select * from User
                `;
    const [Rows] = await connection.query(selectQuery);
    return Rows;
}


async function getUserInfo(connection, userEmail) {
    const selectQuery = `
    select userName, phoneNumber from User where userEmail = ?
                `;
    const [Rows] = await connection.query(selectQuery, userEmail);
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
               eupMyeonDongCode, userLatitude, userLongitude
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
        select eventImageUrl from Event;
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


// 홈화면 인기프랜차이즈 (1번)
async function selectFranchises(connection, userId) {
    const selectFranchisesQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
           , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and categoryId = 25 and (star > 4.5)
group by restId order by rand();
        `;
    const [selectFranchisesRow] = await connection.query(
        selectFranchisesQuery, userId
    );

    return selectFranchisesRow;
}

// 홈화면 인기 프랜차이즈 로그인 x
async function selectFranchisesNoUserId(connection) {
    const selectFranchisesNoUserIdQuery = `
        select Restaurant.restId, restName, repRestImageUrl, restIcon,
               case when deliveryFee = 0
                        then '무료'
                    else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
                , star, count(reviewId)
        from Restaurant
                 left outer join Review R on Restaurant.restId = R.restId
                 inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
        where categoryId = 25 and (star > 4.5)
        group by restId order by rand();
        `;
    const [selectFranchisesNoUserIdRow] = await connection.query(
        selectFranchisesNoUserIdQuery
    );

    return selectFranchisesNoUserIdRow;
}


// 홈화면 새로 들어왔어요! (=1번)
async function selectRecentlyOpen(connection, userId) {
    const selectRecentlyOpenQuery = `
        select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
               case when deliveryFee = 0
                        then '무료'
                    else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
               , star, count(reviewId), distance_KM
        from Restaurant
                 left outer join Review R on Restaurant.restId = R.restId
                 inner join (SELECT userId, userAddressId,restId,
                                    #거리계산
                                        
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
          
AS distance_KM
                             FROM Restaurant, UserAddress
                             where userId = ?
                             ORDER BY distance_KM) DistanceInfo
                 inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
        where distance_KM < 20 and (TIMESTAMPDIFF(MONTH ,Restaurant.createdAt, CURRENT_TIMESTAMP)) < 1
        group by restId order by rand();
        `;
    const [selectRecentlyOpenRow] = await connection.query(
        selectRecentlyOpenQuery, userId
    );

    return selectRecentlyOpenRow;
}

// 홈화면 새로 들어왔어요 로그인 x
async function selectRecentlyOpenNoUserId(connection) {
    const selectRecentlyOpenNoUserIdQuery = `
        select Restaurant.restId, restName, repRestImageUrl, restIcon,
               case when deliveryFee = 0
                        then '무료'
                    else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
                , star, count(reviewId)
        from Restaurant
                 left outer join Review R on Restaurant.restId = R.restId
                 inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
        where (TIMESTAMPDIFF(MONTH ,Restaurant.createdAt, CURRENT_TIMESTAMP)) < 1
        group by restId order by rand();
        `;
    const [selectRecentlyOpenNoUserIdRow] = await connection.query(
        selectRecentlyOpenNoUserIdQuery
    );

    return selectRecentlyOpenNoUserIdRow;
}



// 홈화면 골라먹는 맛집(=1번)
async function selectFamous(connection, userId) {
    const selectFamousQuery = `
        select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
               case when deliveryFee = 0
                        then '무료'
                    else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
                , star, count(reviewId), distance_KM
        from Restaurant
                 left outer join Review R on Restaurant.restId = R.restId
                 inner join (SELECT userId, userAddressId,restId,
                                    #거리계산

                                 left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
        cos(radians(restLongitude) - radians(userLongitude)) +
        sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)

AS distance_KM
                             FROM Restaurant, UserAddress
                             where userId = ?
                             ORDER BY distance_KM) DistanceInfo

                 inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
        where distance_KM < 20
        group by restId order by rand();
        `;
    const [selectFamousRow] = await connection.query(
        selectFamousQuery, userId
    );

    return selectFamousRow;
}

// 홈화면 골라먹는 맛집 로그인 x
async function selectFamousNoUserId(connection) {
    const selectFamousNoUserIdQuery = `
        select Restaurant.restId, restName, repRestImageUrl, restIcon,
               case when deliveryFee = 0
                        then '무료'
                    else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
                , star, count(reviewId)
        from Restaurant
                 left outer join Review R on Restaurant.restId = R.restId
                 inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
        group by restId order by rand();
        `;
    const [selectFamousNoUserIdRow] = await connection.query(
        selectFamousNoUserIdQuery
    );

    return selectFamousNoUserIdRow;
}

// 골라먹는 맛집 2번
async function selectMFamous(connection, userId, minimumAmount) {
    const selectMFamousQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
           , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and minimumAmount < ?
group by restId order by rand();
        `;
    const [selectMFamousRow] = await connection.query(
        selectMFamousQuery, [userId, minimumAmount]
    );

    return selectMFamousRow;
}

// 골라먹는 맛집 3번
async function selectDFamous(connection, userId, deliveryFee) {
    const selectDFamousQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
         , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and Restaurant.deliveryFee < ?
group by restId order by rand();
        `;
    const [selectDFamousRow] = await connection.query(
        selectDFamousQuery, [userId, deliveryFee]
    );

    return selectDFamousRow;
}

// 골라먹는 맛집 4번
async function selectDMFamous(connection, userId, deliveryFee, minimumAmount) {
    const selectDMFamousQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
         , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
          
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and Restaurant.deliveryFee < ?  and minimumAmount < ?
group by restId order by rand();
        `;
    const [selectDMFamousRow] = await connection.query(
        selectDMFamousQuery, [userId, deliveryFee, minimumAmount]
    );

    return selectDMFamousRow;
}

// 골라먹는 맛집 5번
async function selectCFamous(connection, userId) {
    const selectCFamousQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
           , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
          
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and Cheetah = 'Y'
group by restId order by rand();
        `;
    const [selectCFamousRow] = await connection.query(
        selectCFamousQuery, userId
    );

    return selectCFamousRow;
}

// 골라먹는 맛집 6번
async function selectCMFamous(connection, userId, minimumAmount) {
    const selectCMFamousQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
           , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
          
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and minimumAmount < ? and Cheetah = 'Y'
group by restId order by rand();
        `;
    const [selectCMFamousRow] = await connection.query(
        selectCMFamousQuery, [userId, minimumAmount]
    );

    return selectCMFamousRow;
}

// 골라먹는 맛집 7번
async function selectCDFamous(connection, userId, deliveryFee) {
    const selectCDFamousQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
         , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and Restaurant.deliveryFee < ? and Cheetah = 'Y'
group by restId order by rand();
        `;
    const [selectCDFamousRow] = await connection.query(
        selectCDFamousQuery, [userId, deliveryFee]
    );

    return selectCDFamousRow;
}

// 골라먹는 맛집 8번
async function selectCDMFamous(connection, userId, deliveryFee, minimumAmount) {
    const selectCDMFamousQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
         , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and Restaurant.deliveryFee < ? and minimumAmount < ? and Cheetah = 'Y'
group by restId order by rand();
        `;
    const [selectCDMFamousRow] = await connection.query(
        selectCDMFamousQuery, [userId, deliveryFee, minimumAmount]
    );

    return selectCDMFamousRow;
}


//*****************************************************************//
// 인기프랜차이즈 2번
async function selectMFranchises(connection, userId, minimumAmount) {
    const selectMFranchisesQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
           , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and categoryId = 25 and (star > 4.5) and minimumAmount < ?
group by restId order by rand();
        `;
    const [selectMFranchisesRow] = await connection.query(
        selectMFranchisesQuery, [userId, minimumAmount]
    );

    return selectMFranchisesRow;
}

// 인기프랜차이즈 3번
async function selectDFranchises(connection, userId, deliveryFee) {
    const selectDFranchisesQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
         , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and categoryId = 25 and (star > 4.5) and Restaurant.deliveryFee < ?
group by restId order by rand();
        `;
    const [selectDFranchisesRow] = await connection.query(
        selectDFranchisesQuery, [userId, deliveryFee]
    );

    return selectDFranchisesRow;
}

// 인기프랜차이즈 4번
async function selectDMFranchises(connection, userId, deliveryFee, minimumAmount) {
    const selectDMFranchisesQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
         , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and categoryId = 25 and (star > 4.5) and Restaurant.deliveryFee < ?  and minimumAmount < ?
group by restId order by rand();
        `;
    const [selectDMFranchisesRow] = await connection.query(
        selectDMFranchisesQuery, [userId, deliveryFee, minimumAmount]
    );

    return selectDMFranchisesRow;
}

// 인기프랜차이즈 5번
async function selectCFranchises(connection, userId) {
    const selectCFranchisesQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
           , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and categoryId = 25 and (star > 4.5) and Cheetah = 'Y'
group by restId order by rand();
        `;
    const [selectCFranchisesRow] = await connection.query(
        selectCFranchisesQuery, userId
    );

    return selectCFranchisesRow;
}

// 인기프랜차이즈 6번
async function selectCMFranchises(connection, userId, minimumAmount) {
    const selectCMFranchisesQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
           , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and categoryId = 25 and (star > 4.5)  and minimumAmount < ? and Cheetah = 'Y'
group by restId order by rand();
        `;
    const [selectCMFranchisesRow] = await connection.query(
        selectCMFranchisesQuery, [userId, minimumAmount]
    );

    return selectCMFranchisesRow;
}

// 인기프랜차이즈 7번
async function selectCDFranchises(connection, userId, deliveryFee) {
    const selectCDFranchisesQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
         , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and categoryId = 25 and (star > 4.5)  and Restaurant.deliveryFee < ? and Cheetah = 'Y'
group by restId order by rand();
        `;
    const [selectCDFranchisesRow] = await connection.query(
        selectCDFranchisesQuery, [userId, deliveryFee]
    );

    return selectCDFranchisesRow;
}

// 인기프랜차이즈 8번
async function selectCDMFranchises(connection, userId, deliveryFee, minimumAmount) {
    const selectCDMFranchisesQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
         , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and categoryId = 25 and (star > 4.5)  and Restaurant.deliveryFee < ? and minimumAmount < ? and Cheetah = 'Y'
group by restId order by rand();
        `;
    const [selectCDMFranchisesRow] = await connection.query(
        selectCDMFranchisesQuery, [userId, deliveryFee, minimumAmount]
    );

    return selectCDMFranchisesRow;
}
//***************************************************//
//새로 들어왔어요 2번
async function selectMRecentlyOpen(connection, userId, minimumAmount) {
    const selectMRecentlyOpenQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
           , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and (TIMESTAMPDIFF(MONTH ,Restaurant.createdAt, CURRENT_TIMESTAMP)) < 1 and minimumAmount < ?
group by restId order by rand();
        `;
    const [selectMRecentlyOpenRow] = await connection.query(
        selectMRecentlyOpenQuery, [userId, minimumAmount]
    );

    return selectMRecentlyOpenRow;
}

// 새로 들어왔어요 3번
async function selectDRecentlyOpen(connection, userId, deliveryFee) {
    const selectDRecentlyOpenQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
         , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
      
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and (TIMESTAMPDIFF(MONTH ,Restaurant.createdAt, CURRENT_TIMESTAMP)) < 1 and Restaurant.deliveryFee < ?
group by restId order by rand();
        `;
    const [selectDRecentlyOpenRow] = await connection.query(
        selectDRecentlyOpenQuery, [userId, deliveryFee]
    );

    return selectDRecentlyOpenRow;
}

// 새로 들어왔어요 4번
async function selectDMRecentlyOpen(connection, userId, deliveryFee, minimumAmount) {
    const selectDMRecentlyOpenQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
         , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
          
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and (TIMESTAMPDIFF(MONTH ,Restaurant.createdAt, CURRENT_TIMESTAMP)) < 1 and Restaurant.deliveryFee < ?  and minimumAmount < ?
group by restId order by rand();
        `;
    const [selectDMRecentlyOpenRow] = await connection.query(
        selectDMRecentlyOpenQuery, [userId, deliveryFee, minimumAmount]
    );

    return selectDMRecentlyOpenRow;
}

// 새로 들어왔어요 5번
async function selectCRecentlyOpen(connection, userId) {
    const selectCRecentlyOpenQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
           , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
          
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and (TIMESTAMPDIFF(MONTH ,Restaurant.createdAt, CURRENT_TIMESTAMP)) < 1 and Cheetah = 'Y'
group by restId order by rand();
        `;
    const [selectCRecentlyOpenRow] = await connection.query(
        selectCRecentlyOpenQuery, userId
    );

    return selectCRecentlyOpenRow;
}

// 새로 들어왔어요 6번
async function selectCMRecentlyOpen(connection, userId, minimumAmount) {
    const selectCMRecentlyOpenQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
           , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
      
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and (TIMESTAMPDIFF(MONTH ,Restaurant.createdAt, CURRENT_TIMESTAMP)) < 1  and minimumAmount < ? and Cheetah = 'Y'
group by restId order by rand();
        `;
    const [selectCMRecentlyOpenRow] = await connection.query(
        selectCMRecentlyOpenQuery, [userId, minimumAmount]
    );

    return selectCMRecentlyOpenRow;
}

// 새로 들어왔어요 7번
async function selectCDRecentlyOpen(connection, userId, deliveryFee) {
    const selectCDRecentlyOpenQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
         , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and (TIMESTAMPDIFF(MONTH ,Restaurant.createdAt, CURRENT_TIMESTAMP)) < 1 and Restaurant.deliveryFee < ? and Cheetah = 'Y'
group by restId order by rand();
        `;
    const [selectCDRecentlyOpenRow] = await connection.query(
        selectCDRecentlyOpenQuery, [userId, deliveryFee]
    );

    return selectCDRecentlyOpenRow;
}

// 새로 들어왔어요 8번
async function selectCDMRecentlyOpen(connection, userId, deliveryFee, minimumAmount) {
    const selectCDMRecentlyOpenQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
         , star, count(reviewId), distance_KM
from Restaurant
left outer join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where distance_KM < 20 and (TIMESTAMPDIFF(MONTH ,Restaurant.createdAt, CURRENT_TIMESTAMP)) < 1  and Restaurant.deliveryFee < ? and minimumAmount < ? and Cheetah = 'Y'
group by restId order by rand();
        `;
    const [selectCDMRecentlyOpenRow] = await connection.query(
        selectCDMRecentlyOpenQuery, [userId, deliveryFee, minimumAmount]
    );

    return selectCDMRecentlyOpenRow;
}


// // 식당 이미지
async function selectRestImageUrl(connection, restId) {
    const selectRestImageUrlQuery = `
        select restId ,restImageUrl
        from RestaurantImage where restId = ?;
        `;
    const [selectRestImageUrlRow] = await connection.query(
        selectRestImageUrlQuery, restId
    );

    return selectRestImageUrlRow;
}


// 식당 정보
async function selectRestInfo(connection, userId, restId) {
    const selectRestInfoQuery = `
        select restName, star, COUNT(reviewId) as reviewCount,
               
                   left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)
            as distance_KM, Cheetah,
               case when deliveryFee = 0
                        then '무료'
                    else CONCAT(deliveryFee, '원')
                   end as deliveryFee
                , case when minimumAmount = 0 then '없음' else CONCAT(minimumAmount, '원') end as minimumAmount
        from Restaurant
                 left outer join Review R on Restaurant.restId = R.restId
                 inner join UserAddress UA on R.userId = UA.userId
        where UA.userId = ? and Restaurant.restId = ?
        group by R.restId;
        `;
    const [selectRestInfoRow] = await connection.query(
        selectRestInfoQuery, [userId, restId]
    );

    return selectRestInfoRow;
}

// 식당 정보 비 회원
async function selectRestInfoNoUser(connection,restId) {
    const selectRestInfoNoUserQuery = `
        select restName, star, COUNT(reviewId) as reviewCount, Cheetah,
               case when deliveryFee = 0
                        then '무료'
                    else CONCAT(deliveryFee, '원')
                   end as deliveryFee
                , case when minimumAmount = 0 then '없음' else CONCAT(minimumAmount, '원') end as minimumAmount
        from Restaurant
                 left outer join Review R on Restaurant.restId = R.restId
        where Restaurant.restId = ?
        group by R.restId;
        `;
    const [selectRestInfoNoUserRow] = await connection.query(
        selectRestInfoNoUserQuery, restId);

    return selectRestInfoNoUserRow;
}


// // 식당 당 리뷰
async function selectReview(connection, restId) {
    const selectReviewQuery = `
        select reviewId, reviewImageUrl, reviewContent, star
        from Review
        where restId = ?;
        `;
    const [selectReviewRow] = await connection.query(
        selectReviewQuery, restId
    );

    return selectReviewRow;
}
// // 식당 당 메뉴
async function selectMenu(connection, restId) {
    const selectMenuQuery = `
        select menuId, subMenuCategory, menuName, CONCAT(menuPrice,'원') as menuprice, menuImageUrl, menuInfo
        from Menu
        where restId = ?;
        `;
    const [selectMenuRow] = await connection.query(
        selectMenuQuery, restId
    );

    return selectMenuRow;
}

// 기본 주소 변경
async function updateDefaultAddress(connection, userId, userAddressId) {
    const updateDefaultAddressQuery = `
        update DefaultAddress SET userAddressId = ? where userId = ?;
  `;
    const updateDefaultAddressRow = await connection.query(updateDefaultAddressQuery, [userAddressId, userId]);
    return updateDefaultAddressRow[0];
}

// 대표 결제수단 초기화
async function initializationPayment(connection, userId) {
    const initializationPaymentQuery = `
        Update RepPayment SET cardId = null, accountId = null where userId = ?;
  `;
    const initializationPaymentRow = await connection.query(initializationPaymentQuery, userId);
    return initializationPaymentRow[0];
}



// 대표 결제 수단 변경 -계좌
async function updatePaymentAccount(connection, userId, accountId) {
    const updatePaymentAccountQuery = `
        Update RepPayment SET accountId = ? where userId = ?;
  `;
    const PaymentAccountRow = await connection.query(updatePaymentAccountQuery, [accountId, userId]);
    return PaymentAccountRow[0];
}


// 대표 결제 수단 변경 -카드
async function updatePaymentCard(connection, userId, cardId) {
    const updatePaymentCardQuery = `
        Update RepPayment SET cardId = ? where userId = ?;
  `;
    const PaymentCardRow = await connection.query(updatePaymentCardQuery, [cardId, userId]);
    return PaymentCardRow[0];
}

// 유효한 읍면동인지 확인
async function EMDCheck(connection, eupMyeonDongName) {
    const EMDCheckQuery = `
        select eupMyeonDongName from EupMyeonDong where eupMyeonDongName = ?;
  `;
    const [EMDCheckRow] = await connection.query(EMDCheckQuery, eupMyeonDongName);
    return EMDCheckRow;
}

// 배달지 주소 추가
async function addUserAddress(connection,userId,eupMyeonDongName, detailAddress, addressCategory, introduction) {
    const addUserAddressQuery = `
        insert into UserAddress(userId, eupMyeonDongCode, detailAddress, addressCategory, introduction)
        values (?,(select eupMyeonDongCode from EupMyeonDong where eupMyeonDongName = ?),?,?,?);
  `;
    const addUserAddressRow = await connection.query(
        addUserAddressQuery,
        [userId,eupMyeonDongName, detailAddress, addressCategory, introduction]
    );

    return addUserAddressRow;
}

// 배달지 주소 추가 길안내 x
async function addUserAddressNoI(connection,userId,eupMyeonDongName, detailAddress,addressCategory) {
    const addUserAddressNoIQuery = `
        insert into UserAddress(userId, eupMyeonDongCode, detailAddress, addressCategory)
        values (?,(select eupMyeonDongCode from EupMyeonDong where eupMyeonDongName = ?),?,?);
  `;
    const addUserAddressNoIRow = await connection.query(
        addUserAddressNoIQuery,
        [userId,eupMyeonDongName, detailAddress,addressCategory]
    );

    return addUserAddressNoIRow;
}

// 배달지 목록 조회
async function getUserAddress(connection,userId) {
    const getUserAddressQuery = `
        select UA.userId, UA.userAddressId,
               case when addressCategory = 'home' then '집'
                    else
                        case when addressCategory = 'company' then '회사'
                             else
                                 case when addressCategory = 'etc' then '기타'
                                     end
                            end
                   end as homeAddressCategory,
               CONCAT(sidoName,' ',sigunguName,' ',eupMyeonDongName,' ',detailAddress) as restAddress
        from UserAddress UA
                 inner join EupMyeonDong EMD on UA.eupMyeonDongCode = EMD.eupMyeonDongCode
                 inner join SiGunGu SGG on EMD.siGunGuCode = SGG.sigunguCode
                 inner join SiDo SD on SGG.sidoId = SD.siDoId
        where userId = ?;
  `;
    const getUserAddressRow = await connection.query(getUserAddressQuery, userId);
    return getUserAddressRow;
}

// 배달지 주소 수정
async function patchUserAddress(connection,eupMyeonDongName, detailAddress, addressCategory, introduction, userAddressId, userId) {
    const patchUserAddressQuery = `
        Update UserAddress SET eupMyeonDongCode = (select eupMyeonDongCode from EupMyeonDong where eupMyeonDongName =? )
                             ,detailAddress = ? ,addressCategory = ? ,introduction = ?
        where userAddressId = ? and userId = ?;
  `;
    const patchUserAddressRow = await connection.query(
        patchUserAddressQuery,
        [eupMyeonDongName, detailAddress, addressCategory, introduction, userAddressId, userId]
    );

    return patchUserAddressRow;
}


// 배달지 주소 수정 길안내 x
async function patchUserAddressNoI(connection,eupMyeonDongName, detailAddress,addressCategory, userAddressId, userId) {
    const patchUserAddressNoIQuery = `
        Update UserAddress SET eupMyeonDongCode = (select eupMyeonDongCode from EupMyeonDong where eupMyeonDongName =? )
                             ,detailAddress = ? ,addressCategory = ?
        where userAddressId = ? and userId = ?;
  `;
    const patchUserAddressNoIRow = await connection.query(
        patchUserAddressNoIQuery,
        [eupMyeonDongName, detailAddress,addressCategory, userAddressId, userId]
    );

    return patchUserAddressNoIRow;
}
// 즐겨찾기 추가
async function addBookmarks(connection, userId, restId) {
    const addBookmarksQuery = `
        insert into Bookmarks(userId, restId) values(?,?);
  `;
    const addBookmarksRow = await connection.query(
        addBookmarksQuery,
        [userId, restId]
    );

    return addBookmarksRow;
}

// 즐겨찾기 중복 확인

async function BookmarksCheck(connection, userId, restId) {
    const BookmarksCheckQuery = `
        select restId from Bookmarks where userId = ? and restId = ?;
  `;
    const BookmarksCheckRow = await connection.query(
        BookmarksCheckQuery,
        [userId, restId]
    );

    return BookmarksCheckRow;
}
// 즐겨찾기 목록 조회

async function getBookmarks(connection, userId) {
    const getBookmarksQuery = `
        select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon, Cheetah,
               case when deliveryFee = 0
                        then '무료배달'
                    else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
                , star, count(reviewId) as reviewCount, distance_KM
        from Restaurant
                 left outer join Review R on Restaurant.restId = R.restId
                 inner join (SELECT userId, userAddressId,restId,
                                    #거리계산

                                 left((6371 * acos(cos(radians(userLatitude)) * cos(radians(restLatitude)) *
                                 cos(radians(restLongitude) - radians(userLongitude)) +
                                 sin(radians(userLatitude)) * sin(radians(restLatitude)))), 4)

AS distance_KM
                             FROM Restaurant, UserAddress
                             where userId = ?
                             ORDER BY distance_KM) DistanceInfo
                 inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
                 inner join Bookmarks B on CPR.restId = B.restId
        group by restId
  `;
    const getBookmarksRow = await connection.query(
        getBookmarksQuery,
        userId
    );

    return getBookmarksRow;
}