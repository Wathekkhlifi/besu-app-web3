// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Test {
     uint valeur;

  constructor() public {
  }


    function getValeur() external view returns(uint) {
        return valeur;
    }

    function setValeur(uint _val) external  {
        valeur = _val;
    }
}
