function getNetworkConfig(network, accounts) {
    if(["acent", "bsc-fork"].includes(network)) {
        console.log(`Deploying with ${network} config.`)
        return {
            feeToSetterAddress: '0x745b3eF0c262d17f07779F8453bF6358B296F9F8',
        }
    } else if (['acenttest', 'bscTestnet-fork'].includes(network)) {
        console.log(`Deploying with ${network} config.`)
        return {
            feeToSetterAddress: '0x745b3eF0c262d17f07779F8453bF6358B296F9F8',
        }
    } else if (['development'].includes(network)) {
        console.log(`Deploying with ${network} config.`)
        return {
            feeToSetterAddress: '0x5E59260fCc6214CC3e0b7fbb18d660d8C8A4372b',
        }
    } else if (['acent', 'acent-fork'].includes(network)) {
        console.log(`Deploying with ${network} config.`)
        return {
            feeToSetterAddress: '0xCd1137C4dF9C001CBc87D6741ce7c8dF77eCaE9D',
        }
    } else if (['acentTestnet', 'acentTestnet-fork'].includes(network)) {
        console.log(`Deploying with ${network} config.`)
        return {
            feeToSetterAddress: '0x0F4538A12C3B09f752Ae2Ae9000364D106f8e4BE',
        }
    } else {
        throw new Error(`No config found for network ${network}.`)
    }
}

module.exports = { getNetworkConfig };
