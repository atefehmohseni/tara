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
    
    //@notice information about each photography request
    //@dev photography request by busincess acount holders
    struct PhotographyRequest {
        address requestMaker;
        string logo;// ipfs hash to the logo
        string description;
        uint price;
        uint id;
    }
    // @notice a counter to keep number of photos
    // @ an identifier for photos
    using SafeMath for uint256;
    uint256 public photoCounter;

    uint256 public photographyRequestCounter;

    //@dev Circuit Breaker flag
    bool public stopped = false;

    //@notice keep track of all photos
    //@dev mapping from photoID to it's meta data
    mapping(uint256 => Photo) public photos;

    //@notice keep track of all photography requests
    //@dev dynamic array to keep track of photoshooting requests
    mapping(uint256 => PhotographyRequest) public photographyRequests;

    // @notice photo album of each user
    // @notice keeps an array of photoes belong to each user
    mapping(address => uint256[]) public usersPhotos; 

    // // @notice keeps who owns which photo
    // // @notice keeps a mapping between photoID and address of it's owner
    // mapping (uint => address) public photoOwner;

    event AddNewPhoto(uint256 _photoID);
    event DenialSubmitRequest();
    event AddNewPhotographyRequest(uint256 _reqID);
    event NotValidBuyer(uint _photoID);
    event SellPhoto(uint _photoID);
    event StartEmergancyFreez();

    address private owner;

    modifier stopInEmergency { require(!stopped); _; }
    modifier onlyOwner {require(msg.sender == owner); _;}

    constructor()
    public
    {
        owner = msg.sender;
    }

    function callForEmergancy()
    private 
    onlyOwner
    {

        if(msg.sender == owner)
        {
            stopped = true;
            emit StartEmergancyFreez();
        }
    }

    function addPhoto(string memory _photourl, string memory _photoname, string memory _photoDesc, uint _photoPrice)
    stopInEmergency
    public 
    {
        photoCounter += 1;
        photos[photoCounter] = Photo(_photourl, photoCounter, _photoname, _photoDesc, msg.sender ,_photoPrice);
       // photoOwner[photoCounter]= msg.sender;
        usersPhotos[msg.sender].push(photoCounter);
        emit AddNewPhoto(photoCounter);
       
       
    }

    //@notice business users add new photo request and the price they are willing to pay
    //@dev this function let business users to add they photography requests
    function addPhotographyRequest(string memory _logo, string memory _desc, uint _price)
    stopInEmergency
    public
    {
        photographyRequestCounter += 1;

        photographyRequests[photographyRequestCounter] = PhotographyRequest(msg.sender, _logo, _desc, _price, photographyRequestCounter);
        
        emit AddNewPhotographyRequest(photographyRequestCounter);
    }

    function checkBuyer(uint _photoID) 
    public
    returns (bool)
    {
        if (photos[_photoID].photoOwner != msg.sender &&
            msg.sender.balance >= photos[_photoID].photoPrice)
        {
            return true;
        }
        emit NotValidBuyer(_photoID);
        return false;
    }

    //@notice sell photos
    //@dev sell photo  = change the owner of a photo to a new address
    function sellPhoto(uint _photoID)
    public payable stopInEmergency
    returns (bool)
    {
        if (checkBuyer(_photoID)==true)
        {
            (bool success, ) = msg.sender.call.value((photos[_photoID].photoPrice)/10)("");
            require(success, "Transfer failed.");
            photos[_photoID].photoOwner = msg.sender;
            emit SellPhoto(_photoID);
            return true;
        }
        return false;
    }
}