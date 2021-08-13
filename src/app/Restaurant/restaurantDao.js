module.exports = {
    selectRestDetailInfo , userOrderCheck,
    selectRestMenuInfo, selectRestAdditionalMenu, selectReview, increaseGood, increaseBad, postReview
};

// 식당 자세한 정보
async function selectRestDetailInfo(connection, restId) {
    const selectRestDetailInfoQuery = `
        select restName, restPhoneNumber, CONCAT(sidoName,' ',sigunguName,' ',eupMyeonDongName,' ',detailAddress) as restAddress,
               managerName, registrationNumber, businessName, operationHour, restIntroduction, notice, originInfo, allergyInfo, nutritionInfo
        from Restaurant
                 inner join EupMyeonDong EMD on Restaurant.eupMyeonDongId = EMD.eupMyeonDongId
                 inner join SiGunGu SGG on EMD.siGunGuCode = SGG.sigunguCode
                 inner join SiDo SD on SGG.sidoId = SD.siDoId
        where restId = ?;
        `;
    const [selectRestDetailInfoRow] = await connection.query(
        selectRestDetailInfoQuery, restId
    );

    return selectRestDetailInfoRow;
}

async function selectRestMenuInfo(connection, menuId) {
    const selectRestMenuInfoQuery = `
        select restId, menuId, menuImageUrl, menuName, menuInfo, menuPrice 
        from Menu where menuId = ?;
        `;
    const [selectRestMenuInfoRow] = await connection.query(
        selectRestMenuInfoQuery, menuId
    );

    return selectRestMenuInfoRow;
}


async function selectRestAdditionalMenu(connection, menuId) {
    const selectRestAdditionalMenuQuery = `
        select additionalMenuCategory,
               case when additionalMenuPrice = 0
                        then additionalMenuContents
                    else
                        CONCAT(additionalMenuContents,'(+',additionalMenuPrice,'원)') end as additionalMenuContents,
               additionalMenuPrice, additionalMenuId
        from AdditionalMenu inner join Menu M on AdditionalMenu.subMenuCategory = M.subMenuCategory
        where menuId = ?;
        `;
    const [selectRestAdditionalMenuRow] = await connection.query(
        selectRestAdditionalMenuQuery, menuId
    );

    return selectRestAdditionalMenuRow;
}

async function selectReview(connection, restId) {
    const selectReviewQuery = `
        select reviewId, reviewContent, reviewImageUrl, goodCount, badCount, star, userName, menuName,
               case when YEAR(curdate()) != YEAR(R.createdAt)
      then DATE_FORMAT(R.createdAT,'%Y년 %m월 %d일')
      else
          case when TIMESTAMPDIFF(DAY, R.createdAt, curdate()) > 6
              then DATE_FORMAT(R.createdAt, '%c월 %e일')
              else
                  case when TIMESTAMPDIFF(DAY,R.createdAt, current_timestamp ) > 2
                      then DATE_FORMAT(R.createdAt, '%e일 전')
                      when TIMESTAMPDIFF(DAY,R.createdAt, current_timestamp) = 2
                      then DATE_FORMAT(R.createdAt, '그저께')
                      when TIMESTAMPDIFF(DAY,R.createdAt, current_timestamp) = 1
                      then DATE_FORMAT(R.createdAt, '어제')
                      else
                          case when TIMESTAMPDIFF(HOUR, R.createdAt, current_timestamp) >1
                              then DATE_FORMAT(R.createdAt, '%H시간 전')
                              else
                                  case when TIMESTAMPDIFF(MINUTE, R.createdAt, current_timestamp) > 1
                                      then DATE_FORMAT(R.createdAt, '%i분 전')
                                      else DATE_FORMAT(R.createdAt, '%s초 전')
        end
        end
        end
        end
        end as reviewCreatedAt
from Review R
inner join User U on R.userId = U.userId
inner join Menu M on R.menuId = M.menuId
where R.restId = ?;
        `;
    const [selectReviewRow] = await connection.query(selectReviewQuery, restId);

    return selectReviewRow;
}


// 좋아요
async function increaseGood(connection, restId, reviewId) {
    const increaseGoodQuery = `
        Update Review Set goodCount = goodCount + 1 where restId = ? and reviewId = ?;
        `;
    const [increaseGoodRow] = await connection.query(increaseGoodQuery, [restId, reviewId]);

    return increaseGoodRow;
}


// 싫어요
async function increaseBad(connection, restId, reviewId) {
    const increaseBadQuery = `
        Update Review Set badCount = badCount + 1 where restId = ? and reviewId = ?;
        `;
    const [increaseBadRow] = await connection.query(increaseBadQuery, [restId, reviewId]);

    return increaseBadRow;
}
// 리뷰 작성
async function postReview(connection,restId, menuId, userId, reviewContent, reviewImageUrl, star) {
    const postReviewQuery = `
        INSERT INTO Review(restId, menuId, userId, reviewContent, reviewImageUrl, star) values (?,?,?,?,?,?);
        `;
    const [postReviewRow] = await connection.query(postReviewQuery, [restId, menuId, userId, reviewContent, reviewImageUrl, star]);

    return postReviewRow;
}

// 결제했는지 체크
async function userOrderCheck(connection, userId, menuId) {
    const userOrderCheckQuery = `
        select userId, C.cartId, menuId
        from \`Order\`
                 inner join Cart C on \`Order\`.cartId = C.cartId
                 inner join MenuPerCart MPC on \`Order\`.cartId = MPC.cartId
        where userId = ?
          and menuId = ?;     
        `;
    const [userOrderCheckRow] = await connection.query(userOrderCheckQuery, [userId, menuId]);

    return userOrderCheckRow;
}