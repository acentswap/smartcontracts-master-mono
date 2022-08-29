// SPDX-License-Identifier: MIT

pragma solidity >= 0.6.12;

import "./ADEInitMintable.sol";

contract ADEToken is ADEInitMintable {

    constructor (
        uint256 _supplyPerYear
    ) ADEInitMintable(_supplyPerYear) public {}

    /// @notice Creates `_amount` token to `_to`. Must only be called by the owner ().
    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }
}
