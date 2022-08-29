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

interface IAcentCallee {
    function acentCall(address sender, uint amount0, uint amount1, bytes calldata data) external;
}
