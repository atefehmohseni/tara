pragma solidity ^0.5.0;

import "./SafeMath.sol";

contract PhotoMarketplace {
    //@notice information about each photo
    //@dev photo struct keeps the info about each photo
    struct Photo {
        string photoURL;
        uint photoID; //unique ID for each photo
        string photoname;
        string photoDescription;
        address photoOwner;
        uint photoPrice;
    }
    
    // @notice a counter to keep number of photos
    // @ an identifier for photos
    using SafeMath for uint256;
    uint256 public photoCounter;

    //@notice keep track of all photos
    // @dev mapping from photoID to it's meta data
    mapping(uint256 => Photo) public photos;

    // @notice photo album of each user
    // @notice keeps an array of photoes belong to each user
    mapping(address => uint256[]) public usersPhotos; 

    // // @notice keeps who owns which photo
    // // @notice keeps a mapping between photoID and address of it's owner
    // mapping (uint => address) public photoOwner;

    event AddNewPhoto(uint256 _photoID);

    function addPhoto(string memory _photourl, string memory _photoname, string memory _photoDesc, uint _photoPrice)
    public 
    {
        photos[photoCounter] = Photo(_photourl, photoCounter, _photoname, _photoDesc, msg.sender ,_photoPrice);
       // photoOwner[photoCounter]= msg.sender;
        usersPhotos[msg.sender].push(photoCounter);
        emit AddNewPhoto(photoCounter);
       
        photoCounter += 1;
    }

    function deletePhoto(bytes32 _photoId)
    public 
    {

    }

    //@notice sell photos
    //@dev sell photo  = change the owner of a photo to a new address
    function sellPhoto(bytes32 _photoID, address _newOwner)
    public
    {

    }

    //@notice business users add new photo request and the price they are willing to pay
    //@dev this function let business users to add they photography requests
    function addPhotoRequest(type name) {
        
    }

    function checkBuyerBalance(bytes32 _photoID)
    public
    {
        
    }
}