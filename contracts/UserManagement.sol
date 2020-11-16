pragma solidity ^0.5.0;

///@title User Management Contract
///@notice Manage user's signup and profile information
///@dev store and update regular account and business account information
contract UserManagement {
    
    ///@notice general user information
    ///@dev basic user information common among all accounts
    struct User {
        string userName;
        string userEmail;
        bytes32 userID;
        address userWalletAddress;
        bool activateAccount;
        bool businessAccount;
    }

    struct BusinessUserData {
        string companyName;
        string companyDescription;
    }

    ///@dev map business user's address to their business info
    mapping (address => BusinessUserData) public businessInfo;

    //@dev map user address to their signup info
    mapping (address => User) public users;

    event newSignUP(address indexed _useraddress, bytes32 _userID);
    event failedSignUp(string _email);
    event newBusinessSignUp(string _companyname);

    /// constructor!
    // constructor () public{
    // }

    // modifier verifiedSignUpInfo(string memory _email)
    // {
    //     require(users[msg.sender].activateAccount == false);
    //     _;
    // }

    function userSignUp(string memory _name, string memory _email, address _wallet) 
    public 
    {
        if (users[msg.sender].activateAccount)
        {
            emit failedSignUp(_email);
        }
        else {
            bytes32 userID = keccak256(abi.encode(_email));
            users[_wallet] = User(_name, _email,userID,_wallet,true,false);
            emit newSignUP(_wallet, userID);
        }
    }
    
    //@notice signup business users
    //@dev add business info to an already registered user
    function businessSignUp (string memory _companyname, string memory _companydescription)
    public
    {   
        // users first should signup regularly 
        require(users[msg.sender].activateAccount);
        users[msg.sender].businessAccount = true;
        businessInfo[msg.sender] = BusinessUserData(_companyname, _companydescription);
        emit newBusinessSignUp(_companyname);
    }
}
