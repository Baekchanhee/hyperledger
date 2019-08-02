// ExpressJS Setup
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
// Constants
const PORT = 8080;
const HOST = '0.0.0.0';


 // Hyperledger Bridge
const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const ccpPath = path.resolve(__dirname, '..', 'network' ,'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

app.use(bodyParser.urlencoded({ extended: false }));

// Index page
app.get('/', function (req, res) {
  fs.readFile('./index.html', function (error, data) {
              res.send(data.toString());

  });
});

// Qeury all cars page
app.get('/api/query', async function (req, res) {
		// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('mycc');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        const result = await contract.evaluateTransaction('queryAllBloods');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        var obj = JSON.parse(result);
	    res.status(200).json(obj);
});

app.get('/api/querykey/', function (req, res) {
    fs.readFile('./querykey.html', function (error, data) {
        res.send(data.toString());
    });
});

// Query car handle
// localhost:8080/api/querycar?carno=CAR5
app.get('/api/querykey/:id', async function (req, res) {
                // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
    try {

    var key = req.params.id;
	console.log(key);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('mycc');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        const result = await contract.evaluateTransaction('queryAllBloods');
        //var obj = result
        //console.log("result는"+obj);
        var jsonobj = JSON.parse(result);
        console.log("jsonOBj는"+jsonobj);
        var lists = ''
        for(var i = 0; i < jsonobj.length; i++){
            //var obj = JSON.parse(result[i]);
            var obj = jsonobj[i];
            console.log("obj는"+obj);
            
            
            if(obj.Record.owner == key){
                //lists += '<tr id='+i+'><td>증서번호</td><td>'+obj.Key+'</td><td>헌혈종류</td><td>'+obj.Record.kind+'</td><td>혈액량</td><td>'+obj.Record.volume+'</td><td>혈액형</td><td>'+obj.Record.type+'</td><td><input type="button" value="소유자 변경" onClick="window.open("http://www.daum.net")"></td></tr>'
                lists += '<tr id='+i+'><td>'+obj.Key+'</td><td>'+obj.Record.kind+'</td><td>'+obj.Record.volume+'</td><td>'+obj.Record.type+'</td><td><input type="button" value="send" onClick="window.open('+"'http://localhost:8080/api/send?id="+obj.Key+"'"+')"></td></tr>'
                //<button onclick="window.open('http://localhost:8000/api/send?id='+obj.Key','window_name','width=430,height=500,location=no,status=no,scrollbars=yes');">button</button>
            }
        }
        lists += '</table>'
    

        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        //var obj = JSON.parse(result)
        //res.status(200).json(obj);
        res.send(lists);
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(400).json(`{response: ${error}`);
    }
});

// Create car page
app.get('/api/createkey', function (req, res) {
  fs.readFile('./createkey.html', function (error, data) {
              res.send(data.toString());
  });
});
// Create car handle
app.post('/api/createkey/', async function (req, res) {
    try {
	var key = req.body.key;
    var kind = req.body.kind;
    var volume = req.body.volume;
    var type = req.body.type;
    var owner = req.body.owner;


        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } }); 

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('mycc');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
//        await contract.submitTransaction('createCar', 'CAR11', 'Hnda', 'Aord', 'Bla', 'Tom');
        await contract.submitTransaction('createBlood', key, kind, volume, type, owner);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

        res.status(200).json({response: 'Transaction has been submitted'});

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(400).json(error);
    }   

});

app.get('/api/send', function (req, res) {
    fs.readFile('./send.html', function (error, data) {
                res.send(data.toString());
    });
  });

app.post('/api/send/', async function (req, res) {
    try {
	var key = req.body.key;
    var owner = req.body.owner;
    

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } }); 

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('mycc');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
//        await contract.submitTransaction('createCar', 'CAR11', 'Hnda', 'Aord', 'Bla', 'Tom');
        await contract.submitTransaction('changeBloodOwner', key, owner);
        console.log('Transaction has been submitted key:'+ key + 'owner:'+owner);
        
        // Disconnect from the gateway.
        await gateway.disconnect();

        res.status(200).json({response: 'key:'+key+'owner:'+owner});

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(400).json(error);
    }   

});


// server start
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);


