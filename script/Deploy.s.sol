// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {Potluck} from "../src/Potluck.sol";

contract Deploy is Script {
    function run() external returns (Potluck potluck) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);
        potluck = new Potluck();
        vm.stopBroadcast();

        console2.log("Potluck deployed to:", address(potluck));
        console2.log("Chain ID:", block.chainid);
    }
}
