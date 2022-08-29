pragma solidity >= 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./ADEToken.sol";

// Spica with Governance.
contract Spica is ERC20('Spica Token', 'SPICA'), Ownable {
    /// @notice Creates `_amount` token to `_to`. Must only be called by the owner (Virgo).
    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }

    function burn(address _from ,uint256 _amount) public onlyOwner {
        _burn(_from, _amount);
    }

    // The ADE TOKEN!
    ADEToken public ade;

    constructor(
        ADEToken _ade
    ) public {
        ade = _ade;
    }

    // Safe ADE transfer function, just in case if rounding error causes pool to not have enough ADEs.
    function safeADETransfer(address _to, uint256 _amount) public onlyOwner {
        uint256 adeBal = ade.balanceOf(address(this));
        if (_amount > adeBal) {
            ade.transfer(_to, adeBal);
        } else {
            ade.transfer(_to, _amount);
        }
    }
}
