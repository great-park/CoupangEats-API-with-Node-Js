module.exports = {
    selectCartId, selectmenuPerCartCheck, insertAdditionalMenuPerCart, insertMenuPerCart, insertCart
};

// 카트 인덱스 체크
async function selectCartId(connection, cartId) {
    const selectCartIdQuery = `
        select cartId from Cart where cartId = ?;
                `;
    const [CartIdRows] = await connection.query(selectCartIdQuery, cartId);
    return CartIdRows;
}

// 같은 카트 내 메뉴 인덱스 중복 체크
async function selectmenuPerCartCheck(connection, cartId, menuId) {
    const selectmenuPerCartCheckQuery = `
        select menuId from MenuPerCart where cartId = ? and menuId = ?;
                `;
    const [menuPerCartCheckRows] = await connection.query(selectmenuPerCartCheckQuery, [cartId, menuId]);
    return menuPerCartCheckRows;
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
        INSERT INTO Cart(userId, restId, userAddressId)
        VALUES (?, ?, (select repTotalAddressId from User where userId = ?));
  `;
    const insertCartRow = await connection.query(
        insertCartQuery,
        CartParams
    );

    return insertCartRow;
}