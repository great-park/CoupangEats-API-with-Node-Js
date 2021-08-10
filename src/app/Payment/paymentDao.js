module.exports = {
    selectCartId, addOrder, addOrderNoCoupon, addTotalPayPrice
};



//cartId 체크
async function selectCartId(connection, cartId) {
    const selectCartIdQuery = `
        select cartId
        from \`Order\`
        where cartId = ?;
                `;
    const [CartIdRows] = await connection.query(selectCartIdQuery, cartId);
    return CartIdRows;
}

// Order 생성
async function addOrder(connection, addOrderParams) {
    const addOrderQuery = `
        INSERT INTO \`Order\`(cartId, reqManager, reqDelivery, disposableCheck, userCouponId)
        VALUES (?, ?, ?, ?, ?);
                `;
    const [addOrderRows] = await connection.query(addOrderQuery, addOrderParams);
    return addOrderRows;
}

// Order 생성, 쿠폰 x
async function addOrderNoCoupon(connection, addOrderNoCouponParams) {
    const addOrderNoCouponQuery = `
        INSERT INTO \`Order\`(cartId, reqManager, reqDelivery, disposableCheck)
        VALUES (?, ?, ?, ?);
                `;
    const [addOrderNoCouponRows] = await connection.query(addOrderNoCouponQuery, addOrderNoCouponParams);
    return addOrderNoCouponRows;
}


// Order에 최종금액 삽입
async function addTotalPayPrice(connection, addTotalPayPriceParams) {
    const addTotalPayPriceQuery = `
        UPDATE \`Order\`
        Set totalPayPrice = 
        (select(toalOrderPrice + TotalOrderPrice.deliveryFee) as totalPayPrice
        from (select SUM(totalPricePerMenu) as toalOrderPrice, deliveryFee
                from (select M.restId, case when additionalMenuPrice != 0 then (menuPrice * MPC.menuCount + TAMP.totalAMPirce)
                                        else menuPrice * MPC.menuCount end as totalPricePerMenu
                        from MenuPerCart MPC
                        inner join Menu M on M.menuId = MPC.menuId
                        left outer join AdditionalMenuPerCart AMC on AMC.menuId = MPC.menuId
                        left outer join AdditionalMenu AM on AMC.additionalMenuId = AM.additionalMenuId
                        inner join (select cartId, menuId, SUM(additionalMenuPrice) as totalAMPirce
                                        from AdditionalMenuPerCart AMC
                                        left outer join AdditionalMenu AM on AM.additionalMenuId = AMC.additionalMenuId
                                        group by menuId) TAMP on TAMP.menuId = MPC.menuId
                                        where MPC.cartId = ?
                                        group by MPC.menuId) PPM
                                        inner join Restaurant R on PPM.restId = R.restId) TotalOrderPrice)
        where cartId = ?;
                `;
    const [addTotalPayPriceRows] = await connection.query(addTotalPayPriceQuery, addTotalPayPriceParams);
    return addTotalPayPriceRows;
}