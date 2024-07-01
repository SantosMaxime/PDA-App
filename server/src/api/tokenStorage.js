let TokenList = [];

const addToken = (token) => {
    TokenList.push(token);
};

const removeToken = (token) => {
    TokenList = TokenList.filter((t) => t !== token);
};

const validateToken = (token) => {
    return TokenList.includes(token);
};

const clearTokens = () => {
    TokenList = [];
};

module.exports = {
    addToken,
    removeToken,
    validateToken,
    clearTokens,
    TokenList,
};
