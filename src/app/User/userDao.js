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
    selectRecentlyOpen, selectMRecentlyOpen, selectDRecentlyOpen, selectDMRecentlyOpen, selectCRecentlyOpen, selectCMRecentlyOpen, selectCDRecentlyOpen, selectCDMRecentlyOpen,
    selectFamous, selectMFamous, selectDFamous, selectDMFamous, selectCFamous, selectCMFamous, selectCDFamous, selectCDMFamous,
    selectMFranchises, selectDFranchises, selectDMFranchises, selectCFranchises, selectCMFranchises, selectCDFranchises, selectCDMFranchises,
    selectRestInfo, selectRestImageUrl, selectReview, selectMenu
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


// 홈화면 인기프랜차이즈 (1번)
async function selectFranchises(connection, userId) {
    const selectFranchisesQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
           , star, count(reviewId), distance_KM
from Restaurant
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where categoryId = 25 and (star > 4.5)
group by restId;
        `;
    const [selectFranchisesRow] = await connection.query(
        selectFranchisesQuery, userId
    );

    return selectFranchisesRow;
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
                 inner join Review R on Restaurant.restId = R.restId
                 inner join (SELECT userId, userAddressId,restId,
                                    #거리계산
                                        
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
          
AS distance_KM
                             FROM Restaurant, UserAddress
                             where userId = ?
                             ORDER BY distance_KM) DistanceInfo
                 inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
        where (TIMESTAMPDIFF(MONTH ,Restaurant.createdAt, CURRENT_TIMESTAMP)) < 1
        group by restId;
        `;
    const [selectRecentlyOpenRow] = await connection.query(
        selectRecentlyOpenQuery, userId
    );

    return selectRecentlyOpenRow;
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
                 inner join Review R on Restaurant.restId = R.restId
                 inner join (SELECT userId, userAddressId,restId,
                                    #거리계산
                                        
    left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
        cos(radians(restHardness) - radians(userHardness)) +
        sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
    
AS distance_KM
                             FROM Restaurant, UserAddress
                             where userId = ?
                             ORDER BY distance_KM) DistanceInfo
                 inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
        group by restId;
        `;
    const [selectFamousRow] = await connection.query(
        selectFamousQuery, userId
    );

    return selectFamousRow;
}
// 골라먹는 맛집 2번
async function selectMFamous(connection, userId, minimunAmount) {
    const selectMFamousQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
           , star, count(reviewId), distance_KM
from Restaurant
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where minimunAmount < ?
group by restId;
        `;
    const [selectMFamousRow] = await connection.query(
        selectMFamousQuery, [userId, minimunAmount]
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
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where Restaurant.deliveryFee < ?
group by restId;
        `;
    const [selectDFamousRow] = await connection.query(
        selectDFamousQuery, [userId, deliveryFee]
    );

    return selectDFamousRow;
}

// 골라먹는 맛집 4번
async function selectDMFamous(connection, userId, deliveryFee, minimunAmount) {
    const selectDMFamousQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
         , star, count(reviewId), distance_KM
from Restaurant
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
          
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where Restaurant.deliveryFee < ?  and minimunAmount < ?
group by restId;
        `;
    const [selectDMFamousRow] = await connection.query(
        selectDMFamousQuery, [userId, deliveryFee, minimunAmount]
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
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
          
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where Cheetah = 'Y'
group by restId;
        `;
    const [selectCFamousRow] = await connection.query(
        selectCFamousQuery, userId
    );

    return selectCFamousRow;
}

// 골라먹는 맛집 6번
async function selectCMFamous(connection, userId, minimunAmount) {
    const selectCMFamousQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
           , star, count(reviewId), distance_KM
from Restaurant
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
          
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where minimunAmount < ? and Cheetah = 'Y'
group by restId;
        `;
    const [selectCMFamousRow] = await connection.query(
        selectCMFamousQuery, [userId, minimunAmount]
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
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where Restaurant.deliveryFee < ? and Cheetah = 'Y'
group by restId;
        `;
    const [selectCDFamousRow] = await connection.query(
        selectCDFamousQuery, [userId, deliveryFee]
    );

    return selectCDFamousRow;
}

// 골라먹는 맛집 8번
async function selectCDMFamous(connection, userId, deliveryFee, minimunAmount) {
    const selectCDMFamousQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
         , star, count(reviewId), distance_KM
from Restaurant
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where Restaurant.deliveryFee < ? and minimunAmount < ? and Cheetah = 'Y'
group by restId;
        `;
    const [selectCDMFamousRow] = await connection.query(
        selectCDMFamousQuery, [userId, deliveryFee, minimunAmount]
    );

    return selectCDMFamousRow;
}


//*****************************************************************//
// 인기프랜차이즈 2번
async function selectMFranchises(connection, userId, minimunAmount) {
    const selectMFranchisesQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
           , star, count(reviewId), distance_KM
from Restaurant
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where categoryId = 25 and (star > 4.5) and minimunAmount < ?
group by restId;
        `;
    const [selectMFranchisesRow] = await connection.query(
        selectMFranchisesQuery, [userId, minimunAmount]
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
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where categoryId = 25 and (star > 4.5) and Restaurant.deliveryFee < ?
group by restId;
        `;
    const [selectDFranchisesRow] = await connection.query(
        selectDFranchisesQuery, [userId, deliveryFee]
    );

    return selectDFranchisesRow;
}

// 인기프랜차이즈 4번
async function selectDMFranchises(connection, userId, deliveryFee, minimunAmount) {
    const selectDMFranchisesQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
         , star, count(reviewId), distance_KM
from Restaurant
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where categoryId = 25 and (star > 4.5) and Restaurant.deliveryFee < ?  and minimunAmount < ?
group by restId;
        `;
    const [selectDMFranchisesRow] = await connection.query(
        selectDMFranchisesQuery, [userId, deliveryFee, minimunAmount]
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
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where categoryId = 25 and (star > 4.5) and Cheetah = 'Y'
group by restId;
        `;
    const [selectCFranchisesRow] = await connection.query(
        selectCFranchisesQuery, userId
    );

    return selectCFranchisesRow;
}

// 인기프랜차이즈 6번
async function selectCMFranchises(connection, userId, minimunAmount) {
    const selectCMFranchisesQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
           , star, count(reviewId), distance_KM
from Restaurant
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where categoryId = 25 and (star > 4.5)  and minimunAmount < ? and Cheetah = 'Y'
group by restId;
        `;
    const [selectCMFranchisesRow] = await connection.query(
        selectCMFranchisesQuery, [userId, minimunAmount]
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
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where categoryId = 25 and (star > 4.5)  and Restaurant.deliveryFee < ? and Cheetah = 'Y'
group by restId;
        `;
    const [selectCDFranchisesRow] = await connection.query(
        selectCDFranchisesQuery, [userId, deliveryFee]
    );

    return selectCDFranchisesRow;
}

// 인기프랜차이즈 8번
async function selectCDMFranchises(connection, userId, deliveryFee, minimunAmount) {
    const selectCDMFranchisesQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
         , star, count(reviewId), distance_KM
from Restaurant
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where categoryId = 25 and (star > 4.5)  and Restaurant.deliveryFee < ? and minimunAmount < ? and Cheetah = 'Y'
group by restId;
        `;
    const [selectCDMFranchisesRow] = await connection.query(
        selectCDMFranchisesQuery, [userId, deliveryFee, minimunAmount]
    );

    return selectCDMFranchisesRow;
}
//***************************************************//
//새로 들어왔어요 2번
async function selectMRecentlyOpen(connection, userId, minimunAmount) {
    const selectMRecentlyOpenQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
           , star, count(reviewId), distance_KM
from Restaurant
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where (TIMESTAMPDIFF(MONTH ,Restaurant.createdAt, CURRENT_TIMESTAMP)) < 1 and minimunAmount < ?
group by restId;
        `;
    const [selectMRecentlyOpenRow] = await connection.query(
        selectMRecentlyOpenQuery, [userId, minimunAmount]
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
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
      
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where (TIMESTAMPDIFF(MONTH ,Restaurant.createdAt, CURRENT_TIMESTAMP)) < 1 and Restaurant.deliveryFee < ?
group by restId;
        `;
    const [selectDRecentlyOpenRow] = await connection.query(
        selectDRecentlyOpenQuery, [userId, deliveryFee]
    );

    return selectDRecentlyOpenRow;
}

// 새로 들어왔어요 4번
async function selectDMRecentlyOpen(connection, userId, deliveryFee, minimunAmount) {
    const selectDMRecentlyOpenQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
         , star, count(reviewId), distance_KM
from Restaurant
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
          
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where (TIMESTAMPDIFF(MONTH ,Restaurant.createdAt, CURRENT_TIMESTAMP)) < 1 and Restaurant.deliveryFee < ?  and minimunAmount < ?
group by restId;
        `;
    const [selectDMRecentlyOpenRow] = await connection.query(
        selectDMRecentlyOpenQuery, [userId, deliveryFee, minimunAmount]
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
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
          
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where (TIMESTAMPDIFF(MONTH ,Restaurant.createdAt, CURRENT_TIMESTAMP)) < 1 and Cheetah = 'Y'
group by restId;
        `;
    const [selectCRecentlyOpenRow] = await connection.query(
        selectCRecentlyOpenQuery, userId
    );

    return selectCRecentlyOpenRow;
}

// 새로 들어왔어요 6번
async function selectCMRecentlyOpen(connection, userId, minimunAmount) {
    const selectCMRecentlyOpenQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
           , star, count(reviewId), distance_KM
from Restaurant
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
      
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where (TIMESTAMPDIFF(MONTH ,Restaurant.createdAt, CURRENT_TIMESTAMP)) < 1  and minimunAmount < ? and Cheetah = 'Y'
group by restId;
        `;
    const [selectCMRecentlyOpenRow] = await connection.query(
        selectCMRecentlyOpenQuery, [userId, minimunAmount]
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
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where (TIMESTAMPDIFF(MONTH ,Restaurant.createdAt, CURRENT_TIMESTAMP)) < 1 and Restaurant.deliveryFee < ? and Cheetah = 'Y'
group by restId;
        `;
    const [selectCDRecentlyOpenRow] = await connection.query(
        selectCDRecentlyOpenQuery, [userId, deliveryFee]
    );

    return selectCDRecentlyOpenRow;
}

// 새로 들어왔어요 8번
async function selectCDMRecentlyOpen(connection, userId, deliveryFee, minimunAmount) {
    const selectCDMRecentlyOpenQuery = `
    select Restaurant.restId, DistanceInfo.userId, restName, repRestImageUrl, restIcon,
           case when deliveryFee = 0
                    then '무료'
                else CONCAT(FORMAT(deliveryFee, 0), '원') end as deliveryFee
         , star, count(reviewId), distance_KM
from Restaurant
inner join Review R on Restaurant.restId = R.restId
inner join (SELECT userId, userAddressId,restId,
       #거리계산
       
               left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
           
AS distance_KM
FROM Restaurant, UserAddress
where userId = ?
ORDER BY distance_KM) DistanceInfo
inner join CategoryPerRest CPR on Restaurant.restId = CPR.restId
where (TIMESTAMPDIFF(MONTH ,Restaurant.createdAt, CURRENT_TIMESTAMP)) < 1  and Restaurant.deliveryFee < ? and minimunAmount < ? and Cheetah = 'Y'
group by restId;
        `;
    const [selectCDMRecentlyOpenRow] = await connection.query(
        selectCDMRecentlyOpenQuery, [userId, deliveryFee, minimunAmount]
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
               
                   left((6371 * acos(cos(radians(userLatitue)) * cos(radians(restLatitue)) *
                                 cos(radians(restHardness) - radians(userHardness)) +
                                 sin(radians(userLatitue)) * sin(radians(restLatitue)))), 4)
            as distance_KM, Cheetah,
               case when deliveryFee = 0
                        then '무료'
                    else CONCAT(deliveryFee, '원')
                   end as deliveryFee
                , case when minimunAmount = 0 then '없음' else CONCAT(minimunAmount, '원') end as minimunAmount
        from Restaurant
                 inner join Review R on Restaurant.restId = R.restId
                 inner join UserAddress UA on R.userId = UA.userId
        where UA.userId = ? and Restaurant.restId = ?
        group by R.restId;
        `;
    const [selectRestInfoRow] = await connection.query(
        selectRestInfoQuery, [userId, restId]
    );

    return selectRestInfoRow;
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

