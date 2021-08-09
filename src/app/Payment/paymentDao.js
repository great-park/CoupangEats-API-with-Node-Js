module.exports = {
    selectCartId, addOrder
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
async function addOrder(connection, cartId) {
    const addOrderQuery = `
        INSERT INTO \`Order\`(cartId)
        VALUES (?);
                `;
    const [addOrderRows] = await connection.query(addOrderQuery, cartId);
    return addOrderRows;
}
