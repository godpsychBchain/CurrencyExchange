// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {

	string public name; //when i deploy it in the blockchain its publicly accessible
	string public symbol;
	uint256 public decimals = 18;
	uint256 public totalSupply;

	//map account to address
	mapping(address => uint256) public balanceOf;
	mapping(address => mapping(address => uint256)) public allowance; 
	//my address mapped to the exchange address 

	event Transfer (
		address indexed from,
		address indexed to,
		uint256 value
		);

	event Approval (
		address indexed owner, 
		address indexed spender, 
		uint256 value
		);

	constructor(string memory _name, string memory _symbol, uint256 _totalSupply) { //memory can only be assigned to string variables

		name = _name;
		symbol = _symbol;
		totalSupply = _totalSupply * (10**decimals);
		balanceOf[msg.sender] = totalSupply;

}

	function _transfer(address _from, address _to, uint256 _value) internal {

		require(_to != address(0)); //is not zero address
		balanceOf[_from] = balanceOf[_from] - _value; //deducting value from the spender
        balanceOf[_to] = balanceOf[_to] + _value; //adding value from the sender to receiver
        //we have balanceOf declared in the main token
         // Require checks this condition before the transfer
        emit Transfer(_from, _to, _value); //both transfer and transferFrom has to emit the transfer event 
        //hence emit function is included here since it is common for both functions
	}


	function transfer(address _to, uint256 _value) public returns (bool success) {

		require(balanceOf[msg.sender] >= _value);
		
		_transfer(msg.sender, _to, _value);
        //function is committed
         //This event is to read what's written in the blockchain
        return true;

	}

	function approve(address _spender, uint256 _value) public returns (bool success) {

		allowance[msg.sender][_spender] = _value;

		require(_spender != address(0));
		emit Approval(msg.sender, _spender, _value);

		return true;

	}

	function transferFrom(address from, address to, uint256 value) public returns (bool success) {

		//approaval of tokens
		require(value <= balanceOf[from]); //chekcing that the value being sent is not more than the balance 
		require(value <= allowance[from][msg.sender]); //checking the value send is exactly what's been approved
		//reset tokens to initial value
		allowance[from][msg.sender] = allowance[from][msg.sender] - value;
		//send tokens
		_transfer(from, to, value);

		return true;

	}

	}