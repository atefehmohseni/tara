# Tara
Tara is a photo sharing application for photographers who love pitch their photos and for companies who are looking for specific photos!

## 📖 How to use Tara:
- Sign up with your `name` and `email` address
- Click on `Pitch Your Photos` to upload your pictures with a price set you want
- Click on `Challenge Photographers` to submit a request to photographers with price you are willing to pay. Uploading a `logo` that depicts your photoshooting request would increase your visibiliy!

## 🛠 Technology:
- Application logic is open-source and is an Ethereum smart contract written in Solidity
- All images are being stored on `IPFS`
- ReactJS and NodeJS powers the client and backend


## 👩🏻‍💻 Development:

### Prerequisites

- Truffle v5.1.42 (core: 5.1.42)
- Solidity v0.5.16 (solc-js)
- Node v14.13.1
- Web3.js v1.2.1


### Setup

- Clone the repo using git clone (https://github.com/atefehmohseni/tara.git)
- `cd tara` 
- Have a local blockchain running on port 8545 (e.g. using [Ganache](https://www.trufflesuite.com/ganache))
- Have a local [IPFS](https://docs.ipfs.io/install/) daemon running on port 5001
- Run `truffle migrate --reset` 
- Run `npm install` and then `npm run start`
- Open up your browser and the project should be up on localhost:3000

### Contract interaction on a local blockchain
- Ensure your browser has a plugin (e.g. [Metamask](https://metamask.io/)) that allows you to interact with the Ethereum blockchain
- Ensure you have a local blockchain running (e.g. on Ganache)
- Select Localhost:8545 or Custom RPC depending on which port your Ganache blockchain is running on
- Interact with the web interface

## ✅ Testing
You can run the tests by running `truffle test` from the main directory


## 🚀  Future Goals & TODOs

Check out our Scrum board [here](https://github.com/atefehmohseni/tara/projects/1)