module.exports = {
     selectmenuPerCartCheck, insertAdditionalMenuPerCart, insertMenuPerCart, insertCart,
    selectCartAddress, selectCartRestInfo,
    selectCartMenuInfo,selectDeliveryFee, selectCartCard,selectCartAccount, selectCartReq,
    addReq, selectCartCheck
};

// 같은 카트 내 메뉴 인덱스 중복 체크
async function selectmenuPerCartCheck(connection, cartId, menuId) {
    const selectmenuPerCartCheckQuery = `
        select menuId from MenuPerCart where cartId = ? and menuId = ?;
                `;
    const [menuPerCartCheckRows] = await connection.query(selectmenuPerCartCheckQuery, [cartId, menuId]);
    return menuPerCartCheckRows;
}
// 카트 존재 확인

async function selectCartCheck(connection, cartId) {
    const selectCartCheckQuery = `
        select cartId from Cart where cartId = ?;
                `;
    const [selectCartCheckRows] = await connection.query(selectCartCheckQuery,cartId);
    return selectCartCheckRows;
}

//  insertAdditionalMenuPerCart
async function insertAdditionalMenuPerCart(connection, AdditionalMenuPerCartParams) {
    const insertAdditionalMenuPerCartQuery = `
        INSERT INTO AdditionalMenuPerCart(cartId, menuId, additionalMenuId)
        VALUES (?, ?, ?);
  `;
    const insertAdditionalMenuPerCartRow = await connection.query(
        insertAdditionalMenuPerCartQuery,
        AdditionalMenuPerCartParams
    );

    return insertAdditionalMenuPerCartRow;
}

// insertMenuPerCart
async function insertMenuPerCart(connection, MenuPerCartParams) {
    const insertMenuPerCartQuery = `
        INSERT INTO MenuPerCart(cartId, menuId, menuCount)
        VALUES (?, ?, ?);
  `;
    const insertMenuPerCartRow = await connection.query(
        insertMenuPerCartQuery,
        MenuPerCartParams
    );

    return insertMenuPerCartRow;
}

//insertCart
async function insertCart(connection, CartParams) {
    const insertCartQuery = `
        INSERT INTO Cart(userId, restId, userAddressId, repPaymentId)
        VALUES (?, ?, (select userAddressId from DefaultAddress where userId = ?), (select repPaymentId from RepPayment where userId = ?));
  `;
    const insertCartRow = await connection.query(
        insertCartQuery,
        CartParams
    );

    return insertCartRow;
}

//카트 내 주소

async function selectCartAddress(connection, cartId) {
    const selectCartAddressQuery = `
        select
            case when addressCategory = 'home' then '집'
                 else
                     case when addressCategory = 'company' then '회사'

                          else
                              case when addressCategory = 'etc' then '기타'
                                  end
                         end
                end as addressCategory,
            CONCAT(sidoName,' ',sigunguName,' ',eupMyeonDongName,' ',detailAddress) as address
        from User
                 inner join DefaultAddress DA on User.userId = DA.userId
                 inner join UserAddress UA on UA.userAddressId = DA.userAddressId
                 inner join EupMyeonDong EMD on UA.eupMyeonDongCode = EMD.eupMyeonDongCode
                 inner join SiGunGu SGG on EMD.siGunGuCode = SGG.sigunguCode
                 inner join SiDo SD on SGG.sidoId = SD.siDoId
                 inner join Cart C on C.userId = User.userId
        where cartId = ?;
                `;
    const [CartAddressRows] = await connection.query(selectCartAddressQuery, cartId);
    return CartAddressRows;
}

// 카트- 식당 이름, 치타배달
async function selectCartRestInfo(connection, cartId) {
    const selectCartRestInfoQuery = `
        select restName, Cheetah
        from Restaurant
                 inner join Cart C on Restaurant.restId = C.restId
        where cartId = ?;
                `;
    const [CartRestInfoRows] = await connection.query(selectCartRestInfoQuery, cartId);
    return CartRestInfoRows;
}

// 카트 -메인 메뉴, 추가 메뉴 정보들
async function selectCartMenuInfo(connection, cartId) {
    const  selectCartMenuInfoQuery = `
        select MPC.menuId,menuName, 
               group_concat( case when additionalMenuPrice !=0
                                then CONCAT(additionalMenuContents,'(+',additionalMenuPrice,'원)')
                                    else additionalMenuContents end
            ) as totalAdditionalMenuContents,
               case when additionalMenuPrice != 0
                    then CONCAT((menuPrice*MPC.menuCount + TAMP.totalAMPirce), '원')
                    else CONCAT(menuPrice*MPC.menuCount, '원') end as totalPricePerMenu
        from MenuPerCart MPC
                 inner join Menu M on M.menuId = MPC.menuId
                 left outer join AdditionalMenuPerCart AMC on AMC.menuId = MPC.menuId
                 left outer join AdditionalMenu AM on AMC.additionalMenuId = AM.additionalMenuId
                 inner join (select cartId ,menuId ,SUM(additionalMenuPrice) as totalAMPirce from AdditionalMenuPerCart AMC
                left outer join AdditionalMenu AM on AM.additionalMenuId = AMC.additionalMenuId group by menuId) TAMP on TAMP.menuId = MPC.menuId
        where MPC.cartId = ?
        group by MPC.menuId;
                `;
    const [CartMenuInfoRows] = await connection.query( selectCartMenuInfoQuery, cartId);
    return CartMenuInfoRows;
}

async function selectDeliveryFee(connection, cartId) {
    const  selectDeliveryFeeQuery = `
        select case when deliveryFee = 0
                        then '+0원'
                    else CONCAT('+',deliveryFee, '원') end as deliveryFee
        from Restaurant inner join Cart C on Restaurant.restId = C.restId where cartId = ?;
                `;
    const [selectDeliveryFeeRows] = await connection.query(selectDeliveryFeeQuery, cartId);
    return selectDeliveryFeeRows;
}

// // 카트 -총 주문금액 연산, 배달비
//
// async function selectCartOrderPrice(connection, cartId) {
//     const selectCartOrderPriceQuery = `
//         select CONCAT(SUM(totalPricePerMenu), '원') as toalOrderPrice,
//                case when deliveryFee = 0
//                         then '0원'
//                     else CONCAT(deliveryFee, '원') end as deliveryFee
//         from
//             (select M.restId,
//                     case when additionalMenuPrice != 0
//                         then CONCAT((menuPrice*MPC.menuCount + TAMP.totalAMPirce), '원')
//                          else CONCAT(menuPrice*MPC.menuCount, '원') end as totalPricePerMenu
//              from MenuPerCart MPC
//                       inner join Menu M on M.menuId = MPC.menuId
//                       left outer join AdditionalMenuPerCart AMC on AMC.menuId = MPC.menuId
//                       left outer join AdditionalMenu AM on AMC.additionalMenuId = AM.additionalMenuId
//                       inner join (select cartId ,menuId ,SUM(additionalMenuPrice) as totalAMPirce from AdditionalMenuPerCart AMC
//                     left outer join AdditionalMenu AM on AM.additionalMenuId = AMC.additionalMenuId group by menuId) TAMP on TAMP.menuId = MPC.menuId
//              where MPC.cartId = ?
//              group by MPC.menuId
//             ) PPM inner join Restaurant R on PPM.restId = R.restId;
//                 `;
//     const [CartOrderPriceRows] = await connection.query(selectCartOrderPriceQuery, cartId);
//     return CartOrderPriceRows;
// }

// // 총 결제 금액
// async function selectCartTotalPrice(connection, cartId) {
//     const selectCartTotalPriceQuery = `
//         select CONCAT((toalOrderPrice + TotalOrderPrice.deliveryFee),'원') as totalPayPrice from
//             (select CONCAT(SUM(totalPricePerMenu), '원') as toalOrderPrice,
//                     case when deliveryFee = 0
//                              then '0원'
//                          else CONCAT(deliveryFee, '원') end as deliveryFee
//              from
//                  (select M.restId,
//                          case when additionalMenuPrice != 0
//                                 then CONCAT((menuPrice*MPC.menuCount + TAMP.totalAMPirce), '원')
//                               else CONCAT(menuPrice*MPC.menuCount, '원') end as totalPricePerMenu
//                   from MenuPerCart MPC
//                            inner join Menu M on M.menuId = MPC.menuId
//                            left outer join AdditionalMenuPerCart AMC on AMC.menuId = MPC.menuId
//                            left outer join AdditionalMenu AM on AMC.additionalMenuId = AM.additionalMenuId
//                            inner join (select cartId ,menuId ,SUM(additionalMenuPrice) as totalAMPirce from AdditionalMenuPerCart AMC
//                             left outer join AdditionalMenu AM on AM.additionalMenuId = AMC.additionalMenuId group by menuId) TAMP on TAMP.menuId = MPC.menuId
//                   where MPC.cartId = ?
//                   group by MPC.menuId
//                  ) PPM inner join Restaurant R on PPM.restId = R.restId) TotalOrderPrice ;
//                 `;
//     const [CartTotalPriceRows] = await connection.query(selectCartTotalPriceQuery, cartId);
//     return CartTotalPriceRows;
// }


//카드 결제
async function selectCartCard(connection, cartId) {
    const selectCartCardQuery = `
        select cardName, cardNumber from Card
        inner join (select cartId,cardId, accountId, Cart.repPaymentId from Cart
        inner join RepPayment RP on Cart.repPaymentId = RP.repPaymentId
         where cartId = ?) RPM on RPM.cardId = Card.cardId;
                `;
    const [CartCardRows] = await connection.query(selectCartCardQuery, cartId);
    return CartCardRows;
}


async function selectCartAccount(connection, cartId) {
    const selectCartAccountQuery = `
        select bankName, accountNumber from Account A
        inner join (select cartId,cardId, accountId, Cart.repPaymentId from Cart
        inner join RepPayment RP on Cart.repPaymentId = RP.repPaymentId
        where cartId = ?) RPM on RPM.accountId = A.accountId;
                `;
    const [CartAccountRows] = await connection.query(selectCartAccountQuery, cartId);
    return CartAccountRows;
}

// 요청사항 조회
async function selectCartReq(connection, cartId) {
    const selectCartReqQuery = `
        select reqDelivery, reqManager from Cart where cartId =?;
                `;
    const [CartReqRows] = await connection.query(selectCartReqQuery, cartId);
    return CartReqRows;
}

// 요청사항 입력
async function addReq(connection, reqManager, reqDelivery, cartId) {
    const addReqQuery = `
        update Cart SET reqManager = ?, reqDelivery=? where cartId = ?;
  `;
    const addReqRow = await connection.query(
        addReqQuery, [reqManager, reqDelivery, cartId]
    );

    return addReqRow;
}