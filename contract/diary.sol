// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DiaryNFT {
    // Struct to store diary entry details
    struct DiaryEntry {
        address owner;       // Entry owner's address
        string ipfsHash;     // Reference to encrypted content on IPFS
        uint256 timestamp;   // When the entry was created
        bool isPublic;       // Privacy control flag
    }

    // Counter for token IDs
    uint256 private _nextTokenId = 1;

    // Mapping to store diary entries
    mapping(uint256 => DiaryEntry) private _diaryEntries;

    // Mapping to track user's entries
    mapping(address => uint256[]) private _userEntries;

    // Mapping for token ownership
    mapping(uint256 => address) private _tokenOwners;
    mapping(address => uint256) private _ownedTokensCount;

    // Events for transparency and tracking
    event DiaryEntryCreated(
        uint256 indexed tokenId, 
        address indexed owner, 
        uint256 timestamp
    );
    event EntryPrivacyUpdated(
        uint256 indexed tokenId, 
        bool isPublic
    );
    event Transfer(
        address indexed from, 
        address indexed to, 
        uint256 indexed tokenId
    );

    /**
     * Mint a new diary entry as an NFT
     * @param _ipfsHash IPFS hash of the encrypted entry
     * @return tokenId of the newly minted entry
     */
    function createDiaryEntry(string memory _ipfsHash) public returns (uint256) {
        uint256 newTokenId = _nextTokenId;
        _nextTokenId++;

        // Create and store diary entry
        _diaryEntries[newTokenId] = DiaryEntry({
            owner: msg.sender,
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp,
            isPublic: false
        });

        // Update token ownership
        _tokenOwners[newTokenId] = msg.sender;
        _ownedTokensCount[msg.sender]++;

        // Track user's entries
        _userEntries[msg.sender].push(newTokenId);

        // Emit events
        emit DiaryEntryCreated(newTokenId, msg.sender, block.timestamp);
        emit Transfer(address(0), msg.sender, newTokenId);

        return newTokenId;
    }

    /**
     * Retrieve all entries owned by the caller
     * @return array of token IDs owned by the caller
     */
    function getUserEntries() public view returns (uint256[] memory) {
        return _userEntries[msg.sender];
    }


    function getDiaryEntry(uint256 _tokenId) public view returns (
        string memory ipfsHash, 
        uint256 timestamp, 
        bool isPublic
    ) {
        // Ensure only owner can view private entries
        require(
            _diaryEntries[_tokenId].isPublic || 
            _diaryEntries[_tokenId].owner == msg.sender,
            "Unauthorized access to private entry"
        );

        DiaryEntry memory entry = _diaryEntries[_tokenId];
        return (entry.ipfsHash, entry.timestamp, entry.isPublic);
    }

    /**
     * Toggle privacy of a specific diary entry
     * @param _tokenId token ID of the diary entry to update
     * @param _public new public status
     */
    function setEntryPrivacy(uint256 _tokenId, bool _public) public {
        // Ensure only the owner can change privacy settings
        require(
            _diaryEntries[_tokenId].owner == msg.sender, 
            "Only entry owner can change privacy"
        );

        _diaryEntries[_tokenId].isPublic = _public;
        emit EntryPrivacyUpdated(_tokenId, _public);
    }

    /**
     * Transfer token to another address
     * @param _to recipient address
     * @param _tokenId token ID to transfer
     */
    function transferToken(address _to, uint256 _tokenId) public {
        require(_to != address(0), "Invalid recipient");
        require(_diaryEntries[_tokenId].owner == msg.sender, "Not token owner");

        // Update ownership in user entries
        address from = msg.sender;
        
        // Remove from sender's entries
        _removeTokenFromOwnerEnumeration(from, _tokenId);
        
        // Add to recipient's entries
        _userEntries[_to].push(_tokenId);

        // Update ownership tracking
        _tokenOwners[_tokenId] = _to;
        _ownedTokensCount[from]--;
        _ownedTokensCount[_to]++;

        // Update entry owner
        _diaryEntries[_tokenId].owner = _to;

        // Emit transfer event
        emit Transfer(from, _to, _tokenId);
    }

    /**
     * Internal function to remove token from owner's enumeration
     */
    function _removeTokenFromOwnerEnumeration(address _from, uint256 _tokenId) internal {
        uint256[] storage userEntryList = _userEntries[_from];
        
        for (uint256 i = 0; i < userEntryList.length; i++) {
            if (userEntryList[i] == _tokenId) {
                // Replace with last element and pop
                userEntryList[i] = userEntryList[userEntryList.length - 1];
                userEntryList.pop();
                break;
            }
        }
    }

    /**
     * Get total number of tokens
     */
    function totalSupply() public view returns (uint256) {
        return _nextTokenId - 1;
    }

    /**
     * Get owner of a specific token
     * @param _tokenId token ID to check
     * @return owner address
     */
    function ownerOf(uint256 _tokenId) public view returns (address) {
        return _tokenOwners[_tokenId];
    }

    /**
     * Get number of tokens owned by an address
     * @param _owner address to check
     * @return number of tokens
     */
    function balanceOf(address _owner) public view returns (uint256) {
        return _ownedTokensCount[_owner];
    }
}
