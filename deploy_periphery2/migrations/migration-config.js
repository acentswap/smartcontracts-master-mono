function getNetworkConfig(network, accounts) {
    if(["acent", "bsc-fork"].includes(network)) {
        console.log(`Deploying with ${network} config.`)
        return {
            factoryAddress: '0x9c70BB7d5771cc1B66C9aD7560d6e1Cb629fDA94',
            wrappedAddress: '0x5246656f1a43C43E5687Bf676E1a5a58dE6EbC30'
        }
    }else if(["acenttest", "bsc-fork"].includes(network)) {
        console.log(`Deploying with ${network} config.`)
        return {
            factoryAddress: '0x745b3eF0c262d17f07779F8453bF6358B296F9F8',
            wrappedAddress: '0x'
        }
    }
}

module.exports = { getNetworkConfig };
