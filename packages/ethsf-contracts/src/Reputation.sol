// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { ByteHasher } from './helpers/ByteHasher.sol';
import { IWorldID } from './interfaces/IWorldID.sol';
import { Strings } from 'openzeppelin-contracts/utils/Strings.sol';
import 'forge-std/console.sol';

contract Reputation {
    using ByteHasher for bytes;

    ///////////////////////////////////////////////////////////////////////////////
    ///                                  ERRORS                                ///
    //////////////////////////////////////////////////////////////////////////////

    /// @notice Thrown when attempting to reuse a nullifier
    error InvalidNullifier();

    event ReviewLeft(
        address indexed reviewer,
        address indexed reviewee,
        string ipfs_hash,
        uint256 score
    );
    event ReputationUpdated(address indexed user, uint128 reputation, uint128 reviewsLeft);

    struct RunningAvg {
        uint128 sum;
        uint128 total;
    }

    /// @dev The World ID instance that will be used for verifying proofs
    IWorldID internal immutable worldId;

    /// @dev The World ID group ID (always 1)
    uint256 internal immutable groupId = 1;

    /// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
    mapping(uint256 => bool) internal nullifierHashes;

    /// @dev reviewer => Map(reviewee => ipfs_hash)
    mapping(address => mapping(address => string)) private reviews;

    /// @dev user reputation
    mapping(address => RunningAvg) reputation;

    /// @param _worldId The WorldID instance that will verify the proofs
    constructor(IWorldID _worldId) {
        worldId = _worldId;
    }

    /// @param root The root of the Merkle tree (returned by the JS widget).
    /// @param nullifierHash The nullifier hash for this proof, preventing double signaling (returned by the JS widget).
    /// @param proof The zero-knowledge proof that demostrates the claimer is registered with World ID (returned by the JS widget).
    /// @dev Feel free to rename this method however you want! We've used `claim`, `verify` or `execute` in the past.
    function leaveFeedback(
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof,
        uint256 _reputation,
        string memory ipfsHash,
        address reviewee
    ) public {
        // First, we make sure this person hasn't done this before
        if (nullifierHashes[nullifierHash]) revert InvalidNullifier();
        require(_reputation <= 5000);

        // We now verify the provided proof is valid and the user is verified by World ID
        worldId.verifyProof(
            root,
            groupId,
            abi.encodePacked(msg.sender).hashToField(),
            nullifierHash,
            abi.encodePacked(reviewee).hashToField(),
            proof
        );

        // We now record the user has done this, so they can't do it again (proof of uniqueness)
        nullifierHashes[nullifierHash] = true;
        reviews[msg.sender][reviewee] = ipfsHash;

        RunningAvg storage temp = reputation[reviewee];
        temp.sum += uint128(_reputation);
        temp.total += 1;

        emit ReviewLeft(msg.sender, reviewee, ipfsHash, _reputation);
        emit ReputationUpdated(reviewee, (temp.sum / temp.total), temp.total);
    }

    function getReputation(address user)
        external
        view
        returns (uint128 reputationScore, uint256 reviewsLeft)
    {
        RunningAvg memory temp = reputation[user];
        require(temp.total != 0);

        reputationScore = temp.sum / temp.total;
        reviewsLeft = temp.total;
    }
}
