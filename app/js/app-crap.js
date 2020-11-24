import S3FileUpload from 'react-s3';

export function App() {
   
   function init() {
      // TODO: refactor conditional
      if (typeof web3 !== 'undefined') {
        // If a web3 instance is already provided by Meta Mask.
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        // Specify default instance if no web3 instance provided
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        web3 = new Web3(App.web3Provider);
      }
      return App.initContract();
    }
    
    function upload(event){
     
  
        const config = {
          bucketName: 'tara.bootcamp.prj',
          dirName: 'photos', /* optional */
          region: 'us-west-2',
          accessKeyId: 'AKIAJR2JXMA5LLDWVMCQ',
          secretAccessKey: 'Enter secretAccessKey'
        }
        S3FileUpload.uploadFile(event.target.files[0], config)
        .then((data) => {
            console.log(data.location);
        })
        .catch((err) => {
          alert(err);
        })
      }
  }

  export default App
