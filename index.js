const fs = require('fs');

const {RuntimeArgs, CLValueBuilder, Contracts,CasperClient,Keys}=require('casper-js-sdk') 
const { KeyObject } = require('crypto');

const client = new CasperClient("http://<node_ip>:7777/rpc") /// chain node

const contract = new Contracts.Contract(client)

const keys = Keys.Ed25519.loadKeyPairFromPrivateFile("./secret_key.pem")

const wasm = new Uint8Array(fs.readFileSync("./contract.wasm"))

const gas = "10000000000";

const chain_id=  "casper-test";


async function install(){

    const args = RuntimeArgs.fromMap({
        "message": CLValueBuilder.string("Hello world!")
    }) 
    const deploy  = contract.install(
        wasm,
        args,
        gas,
        keys.publicKey,
        chain_id,
        [keys]
    )
    
    try{
        return(

         await  client.putDeploy(deploy)
        )

    }catch(error){
        return error
    }

}
// install().then(deployHash => console.log("Deploy Hash : " + deployHash)).catch(error=>console.error(error))

async function update_msg (){

    contract.setContractHash("hash-e2bcd0e570e264cdd83dc01e39ab59fb5bc7a22ad7825942a8455fda86b5230b");
    const args = RuntimeArgs.fromMap({
        "message" : CLValueBuilder.string("Hello Again !")
    
    })

    const deploy = contract.callEntrypoint(

        "update_msg",
        args,
        keys.publicKey,
        chain_id,
        gas ,
        [keys]
    )

    try{
        return ( await client.putDeploy(deploy))
    }catch(error){
        return error
    }
    
}

// update_msg().then(deployHash => console.log("Deploy Hash : " + deployHash)).catch(error=>console.error(error))

function query_message(){
    contract.setContractHash("hash-e2bcd0e570e264cdd83dc01e39ab59fb5bc7a22ad7825942a8455fda86b5230b")
    return contract.queryContractData(["message"])
}

// query_message().then(result => console.log(result)).catch(error=>console.log(error))


