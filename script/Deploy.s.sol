// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {Potluck} from "../src/Potluck.sol";

contract Deploy is Script {
    /// @dev The deployer key is supplied on the CLI — `--account <keystore>`
    ///      (preferred for mainnet) or `--private-key` (testnet only) — so no
    ///      private key ever passes through this script or the environment.
    function run() external returns (Potluck potluck) {
        vm.startBroadcast();
        potluck = new Potluck();
        vm.stopBroadcast();

        console2.log("Potluck deployed to:", address(potluck));
        console2.log("Chain ID:", block.chainid);
    }
}
