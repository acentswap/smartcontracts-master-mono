
function getNetworkConfig(network, accounts) {
    if(["acentph", "bsc-fork"].includes(network)) {
        console.log(`Deploying with BSC MAINNET config.`)
        return {
            adminAddress: '0x745b3eF0c262d17f07779F8453bF6358B296F9F8', // General Admin
            feeAccount: '0x745b3eF0c262d17f07779F8453bF6358B296F9F8', // Proxy Admin
            virgoAddress: '0xF3d76399cCF7E0e1f12f3b73Bf7e0639afb2ba29',
            virgoAdminOwner: '0x745b3eF0c262d17f07779F8453bF6358B296F9F8', 
            REWARDS_START: 2234,
            TOKENS_PER_BLOCK: 10,
            TIMELOCK_DELAY_SECS: 3600 * 6,
            INITIAL_MINT: '1000000',
        }
    } else if (['acenttest', 'sk-testnet-fork'].includes(network)) {
        console.log(`Deploying with BSC testnet config.`)
        return {
            adminAddress: '0x745b3eF0c262d17f07779F8453bF6358B296F9F8', // General Admin
            feeAccount: '0x745b3eF0c262d17f07779F8453bF6358B296F9F8', // Proxy Admin
            virgoAddress: '0x',
            virgoAdminOwner: '0x', 
            farmAdmin: '0x',
            REWARDS_START: 2234,
            TOKENS_PER_BLOCK: 10,
            TIMELOCK_DELAY_SECS: 3600 * 6,
            INITIAL_MINT: '25000',
            masterApeAddress: '0x', 
        }
    } else if (['development'].includes(network)) {
        console.log(`Deploying with development config.`)
        return {
            adminAddress: '0x6c905b4108A87499CEd1E0498721F2B831c6Ab13', // General Admin
            feeAccount: '0xCEf34e4db130c8A64493517985b23af5B13E8cc6', // Proxy Admin
            masterApeAddress: '0x',
            masterApeAdminOwner: '0x',
            farmAdmin: '0x',
            STARTING_BLOCK: 0,
            TOKENS_PER_BLOCK: 10,
            TIMELOCK_DELAY_SECS: 3600 * 6,
            INITIAL_MINT: '25000',
        }
    } else {
        throw new Error(`No config found for network ${network}.`)
    }
}

module.exports = { getNetworkConfig };
