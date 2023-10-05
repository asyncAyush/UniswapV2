//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenC is ERC20 {
    constructor() ERC20("TokenA", "TA") {
        _mint(msg.sender, 1000 *10** decimals());
    }

  function _transfer(address sender, address reciver, uint256 amount) internal virtual override{
    super._transfer(sender,address(this),(amount*10/100));
    super._transfer(sender,reciver,amount -(amount*10/100));
  }
}