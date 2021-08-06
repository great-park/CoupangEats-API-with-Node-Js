module.exports = {
    selectRestDetailInfo ,
    selectRestMenuInfo, selectRestAdditionalMenu
};

// 식당 자세한 정보
async function selectRestDetailInfo(connection, restId) {
    const selectRestDetailInfoQuery = `
        select restName, restPhoneNumber, CONCAT(sidoName,'',sigunguName,'',eupMyeonDongName,'',detailAddress),
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
               additionalMenuPrice
        from AdditionalMenu inner join Menu M on AdditionalMenu.subMenuCategory = M.subMenuCategory
        where menuId = ?;
        `;
    const [selectRestAdditionalMenuRow] = await connection.query(
        selectRestAdditionalMenuQuery, menuId
    );

    return selectRestAdditionalMenuRow;
}
