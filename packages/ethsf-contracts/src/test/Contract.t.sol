// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.9;

// import { Test } from 'forge-std/Test.sol';
// import { Strings } from 'openzeppelin-contracts/utils/Strings.sol';
// import { Reputation } from '../Reputation.sol';
// import { InteractsWithWorldID } from './helpers/InteractsWithWorldID.sol';
// import 'forge-std/console.sol';

// contract ContractTest is Test, InteractsWithWorldID {
//     Reputation internal yourContract;
//     address reviewer = address(1);
//     address reviewee = address(2);
//     uint256 score = 5;

//     function setUp() public {
//         setUpWorldID();

//         // update any constructor parameters you need here!
//         yourContract = new Reputation(worldID);

//         vm.label(address(this), 'Sender');
//         vm.label(address(yourContract), 'Reputation');
//     }

//     function testCanCall() public {
//         registerIdentity(); // this simulates a World ID "verified" identity

//         console.log('here');
//         (uint256 nullifierHash, uint256[8] memory proof) = getProof(
//             string(abi.encodePacked(Strings.toHexString(reviewer), Strings.toHexString(reviewee))),
//             Strings.toString(score)
//         );
//         console.log('there');
//         yourContract.leaveFeedback(
//             Strings.toString(score),
//             getRoot(),
//             nullifierHash,
//             proof,
//             score,
//             '',
//             reviewee
//         );
//     }

//     // function testCannotDoubleCall() public {
//     //     vm.prank(reviewer);
//     //     registerIdentity();

//     //     (uint256 nullifierHash, uint256[8] memory proof) = getProof(
//     //         string(
//     //             bytes.concat(bytes(abi.encodePacked(reviewer)), bytes(abi.encodePacked(reviewee)))
//     //         ),
//     //         Strings.toString(score)
//     //     );
//     //     vm.prank(reviewer);
//     //     yourContract.leaveFeedback(
//     //         Strings.toString(score),
//     //         getRoot(),
//     //         nullifierHash,
//     //         proof,
//     //         score,
//     //         '',
//     //         reviewee
//     //     );

//     //     uint256 root = getRoot();
//     //     vm.prank(reviewer);
//     //     vm.expectRevert(Reputation.InvalidNullifier.selector);
//     //     yourContract.leaveFeedback(
//     //         Strings.toString(score),
//     //         getRoot(),
//     //         nullifierHash,
//     //         proof,
//     //         score,
//     //         '',
//     //         reviewee
//     //     );

//     //     // extra checks here
//     // }

//     // function testCannotCallWithInvalidSignal() public {
//     //     vm.prank(reviewer);
//     //     registerIdentity();

//     //     (uint256 nullifierHash, uint256[8] memory proof) = getProof(
//     //         string(
//     //             bytes.concat(bytes(abi.encodePacked(reviewer)), bytes(abi.encodePacked(reviewee)))
//     //         ),
//     //         Strings.toString(score)
//     //     );

//     //     uint256 root = getRoot();
//     //     vm.prank(reviewer);
//     //     vm.expectRevert(abi.encodeWithSignature('InvalidProof()'));
//     //     yourContract.leaveFeedback(
//     //         Strings.toString(score + 1),
//     //         getRoot(),
//     //         nullifierHash,
//     //         proof,
//     //         score,
//     //         '',
//     //         reviewee
//     //     );
//     //     // extra checks here
//     // }

//     // function testCannotCallWithInvalidProof() public {
//     //     vm.prank(reviewer);
//     //     registerIdentity();

//     //     (uint256 nullifierHash, uint256[8] memory proof) = getProof(
//     //         string(
//     //             bytes.concat(bytes(abi.encodePacked(reviewer)), bytes(abi.encodePacked(reviewee)))
//     //         ),
//     //         Strings.toString(score)
//     //     );

//     //     // this changes the proof, invalidating it
//     //     proof[0] ^= 42;

//     //     uint256 root = getRoot();
//     //     vm.prank(reviewer);
//     //     vm.expectRevert(abi.encodeWithSignature('InvalidProof()'));
//     //     yourContract.leaveFeedback(
//     //         Strings.toString(score),
//     //         getRoot(),
//     //         nullifierHash,
//     //         proof,
//     //         score,
//     //         '',
//     //         reviewee
//     //     );
//     //     // extra checks here
//     // }
// }
