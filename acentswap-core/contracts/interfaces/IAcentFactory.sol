pragma solidity >=0.5.0;

/*
 * AcentSwapFinance 
 * App:             https://acentswap.finance
 * Medium:          https://acent-swap.medium.com    
 * Twitter:         https://twitter.com/acent_swap 
 * Telegram:        https://t.me/acent_swap
 * Announcements:   https://t.me/acent_swap_news
 * GitHub:          https://github.com/AcentSwapFinance
 */

interface IAcentFactory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);

    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);

    function createPair(address tokenA, address tokenB) external returns (address pair);

    function setFeeTo(address) external;
    function setFeeToSetter(address) external;
}
