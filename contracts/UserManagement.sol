pragma solidity ^0.5.0;

///@title User Management Contract
///@notice Manage user's signup and profile information
///@dev store and update regular account and business account information
contract UserManagemet {
    
    ///@notice general user information
    ///@dev basic user information common among all accounts
    struct User {
        bytes32 userName;
        bytes32 password;
        string userEmail;
        bytes32 userID;
        uint userBirthDate;
        address userWalletAddress;
        bool activateAccount;
        bool businessAccount;
    }

    struct BusinessUserData {
        bytes32 companyName;
        string companyDescription;
    }

    ///@dev map business user's IDs to their business info
    mapping (bytes32 => BusinessUserData) businessInfo;

    //@dev map user emails to their signup info
    mapping (bytes32 => User) users;

    /// constructor!
    // constructor () public{
    // }

    modifier verifiedSignUpInfo(string memory _email)
    {
        require(users[keccak256(abi.encode(_email))].activateAccount == false);
          //ToDo emit failed signup
        _;
    }

    function userSignUp(bytes32 _name, bytes32 _password, string memory _email, uint _dob, address _wallet) 
    public verifiedSignUpInfo(_email) 
    {
        bytes32 userID = keccak256(abi.encode(_email));
        users[userID] = User(_name,_password, _email,userID,_dob,_wallet,true,false);
    }

}