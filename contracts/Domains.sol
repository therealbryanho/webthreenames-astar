// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import { StringUtils } from "./libraries/StringUtils.sol";
import { Base64 } from "./libraries/Base64.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

struct Record {
    string avatar;
    string twitterTag;
    string website;
    string email;
    string description;
}

enum RecordType {
    AVATAR,
    TWITTER,
    WEBSITE,
    EMAIL,
    DESCRIPTION
}

contract Domains is ERC721 {
    //mapping(string => address) public domains;
    //mapping(string => string) public avatars;

    mapping(string => Record) public records;
    mapping(uint => string) public names;
    mapping(string => uint) public ids;

    string public tld;
    address payable public owner;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public tierOnePrice; 
    uint256 public tierTwoPrice; 
    uint256 public tierThreePrice; 

    string svgPartOne = '<svg className="avatarSVG" xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"> <path fill="url(#B)" d="M0 0h270v270H0z"/><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><path className="st0" d="M270.3,270.3H0V18.7C0,8.4,8.4,0,18.7,0h233c10.3,0,18.7,8.4,18.7,18.7v251.6L270.3,270.3L270.3,270.3z"/><g>  <linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="34.0468" y1="92.9487" x2="93.2178" y2="33.7777"><stop offset="1.209320e-03" stop-color="#E2007D"/><stop offset="0.5" stop-color="#0075D1"/><stop offset="1" stop-color="#00E2FF"/></linearGradient>  <path fill="url(#SVGID_2_)" className="st1" d="M59.2,21.9c2.9-0.3,6-0.2,8.7,0c3.6,0.5,6.8,1.1,10,2.3c13.7,5.2,22.5,15,26.2,29.2c0.7,2.7,1,5.6,1.5,8.4   c0,1.5,0,2.9,0,4.4c-0.1,0.6-0.3,1.2-0.3,1.8c-1.5,16.9-13.9,31.5-30.4,35.8c-3.2,0.8-5.8,1.5-8.2,1.7c-0.9,0-2.5,0-3.4,0   c-0.5-0.1-2-0.2-2.5-0.3c-18.5-1.1-34.6-15.3-38-33.4c-0.4-2.1-0.6-4.2-1-6.3c0-1.5,0-2.9,0-4.4c0.1-0.6,0.2-1.2,0.3-1.8   C23.6,42.2,35.7,27.6,52.2,23C54.5,22.4,56.6,22,59.2,21.9z M95.7,68.9c0.2-0.9,0.4-1.3,0.4-1.7c1.9-14-5.7-27.6-18.6-33.5   c-6.1-2.8-13-1.1-17.2,4.2c-2.4,3-3.7,6.4-4.3,10.1c-0.1,0.4,0,0.8,0,1.4c5.5,0,10.8,0,16.6,0c-0.8-0.3-1.2-0.6-1.6-0.7   c-3.1-0.7-5.1-2.5-5.7-5.6c-0.6-2.9,0.4-5.3,2.9-7c2.5-1.7,5.7-1.6,8.4,0.2c2.2,1.5,3.5,3.6,3.9,6c0.6,2.9,0.6,6,1,8.9   c0.1,0.9,0.2,2.2,0.8,2.6C87.9,57.6,92.5,62.3,95.7,68.9z M79.9,63.8c-2.8,4.7-5.6,9.2-8.4,13.8c0.5-0.2,1-0.6,1.4-1   c2-2,4.5-2.7,7.2-1.9c2.7,0.8,4.2,2.7,4.8,5.3c1,4.4-2.6,8.6-7.5,8.9c-4.6,0.2-8.6-1.7-12.4-4.1c-1.3-0.8-2.2-0.9-3.6-0.3   c-3.3,1.3-6.7,2.5-10.1,3.3c-2.5,0.6-5.2,0.5-8,0.7c0.4,0.4,0.8,0.7,1.3,1c4.9,3.6,10.5,5.7,16.6,6.2c8.4,0.6,16.2-1.4,22.5-6.9   C92.6,81.2,87.9,68.7,79.9,63.8z M52.2,32.8c-0.8,0.3-1.2,0.4-1.6,0.5C38.1,38.7,30,52.2,31.2,65.8c0.3,3.3,1.4,6.2,3.7,8.6   c4.4,4.6,9.8,5.5,15.7,4.2c1.6-0.3,3.2-1,4.6-1.4c-2.7-5-5.2-9.7-7.8-14.3c-0.1,0.5,0,1,0.1,1.5c0.8,3,0.3,5.6-2.1,7.6   c-2.2,1.9-4.8,2.3-7.5,1.1c-2.8-1.2-4.1-3.6-4.2-6.5c-0.1-3,1.1-5.6,3.3-7.5c2.3-2,4.8-3.8,7.4-5.4c1.3-0.8,1.9-1.5,2-3.1   c0.2-4.4,1.2-8.6,3.1-12.6C50.2,36.4,51.2,34.8,52.2,32.8z M56.6,59c1.1,5,3.6,8.9,6.9,12.5c3.7-3.5,6-7.5,7.3-12.2   C66,57.8,61.4,57.9,56.6,59z"/>  </g><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#D1DEFE"/><stop offset="1" stop-color="#D7FBFC" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
    string svgPartTwo = '</text></svg>';

    error Unauthorized();
    error AlreadyRegistered();
    error InvalidName(string name);

   constructor(string memory _tld, uint256 _tierOnePrice, uint256 _tierTwoPrice, uint256 _tierThreePrice) payable ERC721("Astar Name Service", "ANS") {
       owner = payable(msg.sender);
        tld = _tld;
        tierOnePrice = _tierOnePrice;
        tierTwoPrice = _tierTwoPrice;
        tierThreePrice = _tierThreePrice;
        _tokenIds.increment();
    }

    function isOwner() public view returns (bool) {
        return msg.sender == owner;
    }

    modifier onlyOwner() {
        require(isOwner());
        _;
    }

    function walletOfOwner(address _owner) public view returns (uint256[] memory){
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory ownedTokenIds = new uint256[](ownerTokenCount);
        uint256 currentTokenId = 1;
        uint256 ownedTokenIndex = 0;
    
        while (ownedTokenIndex < ownerTokenCount && currentTokenId <= _tokenIds.current()) {
            address currentTokenOwner = ownerOf(currentTokenId);
        
            if (currentTokenOwner == _owner) {
                ownedTokenIds[ownedTokenIndex] = currentTokenId;
                ownedTokenIndex++;
            }
            currentTokenId++;
        }
        return ownedTokenIds;
    }

    function setPrice(uint256 _tierOnePrice, uint256 _tierTwoPrice, uint256 _tierThreePrice) public onlyOwner {
        tierOnePrice = _tierOnePrice;
        tierTwoPrice = _tierTwoPrice;
        tierThreePrice = _tierThreePrice;
    }

    function withdraw() public onlyOwner {
        uint amount = address(this).balance;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed to withdraw funds");
    } 

    function getAllNames() public view returns (string[] memory) {
        string[] memory allNames = new string[](_tokenIds.current()-1);
        for (uint i = 1; i < _tokenIds.current(); i++) {
            allNames[i-1] = names[i];
        }

        return allNames;
    }

    function valid(string calldata name) public pure returns(bool) {
        return StringUtils.strlen(name) >= 3 && StringUtils.strlen(name) <= 30;
    }

    function price(string calldata name) public view returns(uint) {
        uint len = StringUtils.strlen(name);
        require(len > 0);
        if (len == 3) {
          return tierOnePrice; 
        } else if (len <= 6) {
	        return tierTwoPrice; 
        } else {
	        return tierThreePrice; 
        }
    }

    function registerForAddress(string calldata name, address _receiver) public onlyOwner {
        if (ids[name] != 0) revert AlreadyRegistered();
        if (!valid(name)) revert InvalidName(name);

        uint256 newRecordId = _tokenIds.current();

        _safeMint(_receiver, newRecordId);
        names[newRecordId] = name;
        ids[name] = newRecordId;

        _tokenIds.increment();
    }
  	
	function register(string calldata name) public payable {
        if (ids[name] != 0) revert AlreadyRegistered();
        if (!valid(name)) revert InvalidName(name);

        uint256 _price = this.price(name);
        if (msg.sender != owner) {
            require(msg.value >= _price, "Not enough funds paid");
        }
            
        uint256 newRecordId = _tokenIds.current();

        _safeMint(msg.sender, newRecordId);
        names[newRecordId] = name;
        ids[name] = newRecordId;

        _tokenIds.increment();
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(isSet(names[tokenId]), "Address unknown");

        string memory _name = string(abi.encodePacked(names[tokenId], ".", tld));

        uint256 length = StringUtils.strlen(_name);
        string memory strLen = Strings.toString(length);

        string memory avatar;

        // If using the basic avatar
        if(isSet(records[names[tokenId]].avatar)) {
            avatar = records[names[tokenId]].avatar;
        } else {
            string memory finalSvg = string(abi.encodePacked(svgPartOne, _name, svgPartTwo));
            avatar = string(abi.encodePacked('data:image/svg+xml;base64,',Base64.encode(bytes(finalSvg))));
        }

        string memory json = Base64.encode(
            bytes(
                string(
                abi.encodePacked(
                    '{"name": "',
                    _name,
                    '", "description": "A domain on the Astar name service", "image": "',
                    avatar,
                    '","length":"',
                    strLen,
                    '"}'
                )
                )
            )
        );

        return string( abi.encodePacked("data:application/json;base64,", json));
    }

    function getId(string calldata name) public view returns(uint) {
        require(ids[name] != 0);
        return ids[name];
    }

	// This will give us the domain owners' address
    function getAddress(string calldata name) public view returns (address) {
       return ownerOf(getId(name));
    }

    function setRecord(string calldata name, string calldata record, RecordType recordType) public {
		// Check that the owner is the transaction sender
        if (msg.sender != getAddress(name)) revert Unauthorized();

        if(recordType == RecordType.AVATAR) {
            records[name].avatar = record;
        } else if(recordType == RecordType.TWITTER) {
            records[name].twitterTag = record;
        } else if(recordType == RecordType.WEBSITE) {
            records[name].website = record;
        } else if(recordType == RecordType.EMAIL) {
            records[name].email = record;
        } else if(recordType == RecordType.DESCRIPTION) {
            records[name].description = record;
        }
    }

    // One string is in memory cause https://forum.openzeppelin.com/t/stack-too-deep-when-compiling-inline-assembly/11391/4
    function setRecords(string calldata name, string memory _avatar, string calldata _twitterTag, string calldata _website, string calldata _email, string calldata _description) public {
        if (msg.sender != getAddress(name)) revert Unauthorized();

        records[name].avatar = _avatar;
        records[name].twitterTag = _twitterTag;
        records[name].website = _website;
        records[name].email = _email;
        records[name].description = _description;
    }

    function getRecord(string calldata name, RecordType recordType) public view returns(string memory) {
        if(recordType == RecordType.AVATAR) {
            return records[name].avatar;
        } else if(recordType == RecordType.TWITTER) {
            return records[name].twitterTag;
        } else if(recordType == RecordType.WEBSITE) {
            return records[name].website;
        } else if(recordType == RecordType.EMAIL) {
            return records[name].email;
        } else if(recordType == RecordType.DESCRIPTION) {
            return records[name].description;
        }

        revert("Record not found");
    }

    function getRecords(string calldata name) public view returns(string[] memory, address) {
        address addr = getAddress(name);
        string[] memory allRecords = new string[](5);

        allRecords[0] = records[name].avatar;
        allRecords[1] = records[name].twitterTag;
        allRecords[2] = records[name].website;
        allRecords[3] = records[name].email;
        allRecords[4] = records[name].description;

        return (allRecords, addr);
    }

    function isSet(string memory name) public pure returns(bool) {
        return StringUtils.strlen(name) != 0;
    }
}