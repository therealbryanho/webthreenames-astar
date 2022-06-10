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

    string svgPartOne = '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"> <path fill="url(#B)" d="M0 0h270v270H0z"/><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><path className="st0" d="M270.3,270.3H0V18.7C0,8.4,8.4,0,18.7,0h233c10.3,0,18.7,8.4,18.7,18.7v251.6H270.3z"/><g><path className="st1" fill="#FFF" d="M98.4,55.5c0.2,1.4,0.2,2.7,0.2,4.1c0,19-15.5,34.3-34.4,34.3c-13.3,0-25.5-7.8-31.1-19.9l5.5-2.7    c6.4,14.2,23.2,20.4,37.3,14C86,80.7,92.5,70.7,92.5,59.6c0-0.3,0-0.6,0-0.9L98.4,55.5z M64.3,25.3c14,0,26.7,8.5,31.9,21.6    l-5.9,1.9c-6-14.4-22.5-21.2-36.9-15.2c-10.5,4.4-17.4,14.7-17.3,26.1c0,0.2,0,0.4,0,0.6l-5.7,4.7c-0.3-1.7-0.4-3.5-0.4-5.3    C30,40.7,45.3,25.3,64.3,25.3C64.3,25.3,64.3,25.3,64.3,25.3z"/><polygon className="st1" fill="#FFF" points="26,73.4 59.6,45.9 58.2,57.3 77.8,46.2 76.8,57.1 102.5,48.9 67.7,68.1 70.3,57.2 50.1,69 51.5,60.6       "/></g><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#17b6d7"/><stop offset="1" stop-color="#9714b3" stop-opacity=".5"/><stop offset="1" stop-color="#280bfd" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
    string svgPartTwo = '</text></svg>';

    error Unauthorized();
    error AlreadyRegistered();
    error InvalidName(string name);

   constructor(string memory _tld, uint256 _tierOnePrice, uint256 _tierTwoPrice, uint256 _tierThreePrice) payable ERC721("Boba Name Service", "BNS") {
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
                    '", "description": "A domain on the Boba name service", "image": "',
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