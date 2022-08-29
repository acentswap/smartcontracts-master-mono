pragma solidity =0.5.16;

import '../AcentERC20.sol';

contract ERC20 is AcentERC20 {
    constructor(uint _totalSupply) public {
        _mint(msg.sender, _totalSupply);
    }
}
