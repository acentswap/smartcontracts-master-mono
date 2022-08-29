const { assert } = require("chai");
const BigNumber = require("bignumber.js");
BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_FLOOR, DECIMAL_PLACES: 0 });

const ADEInitMintable = artifacts.require('ADEInitMintable');

contract('ADEInitMintable', ([alice, bob, carol, dev, minter]) => {
    const _supplyPerYear = "1000000000000000000000000"; // 1-million wei
    beforeEach(async () => {
        this.adeInitMintable = await ADEInitMintable.new(_supplyPerYear, { from: minter });
    });


    it('distributeSupply', async () => {
        const supplyPerBlock = new BigNumber("600000000000000000000000").multipliedBy(6).dividedBy(365).dividedBy(86400);
        await this.adeInitMintable.distributeSupply([alice, bob], ["100000000000000000000000", "300000000000000000000000"],  { from: minter });
        assert.equal((await this.adeInitMintable.balanceOf(alice)).toString(), '100000000000000000000000');
        assert.equal((await this.adeInitMintable.balanceOf(bob)).toString(), '300000000000000000000000');
        assert.equal((await this.adeInitMintable.SUPPLY_PER_BLOCK()).toString(), supplyPerBlock.toString());
    });

    it('should only be called once before nextDistributionWindow', async () => {
        await this.adeInitMintable.distributeSupply([alice, bob], ["100000000000000000000000", "300000000000000000000000"],  { from: minter });
        assert.equal((await this.adeInitMintable.balanceOf(alice)).toString(), '100000000000000000000000');
        assert.equal((await this.adeInitMintable.balanceOf(bob)).toString(), '300000000000000000000000');

        // 364th day
        await network.provider.send("evm_increaseTime", [86400 * 364]);
        await network.provider.send("evm_mine");
        try {
            await this.adeInitMintable.distributeSupply([alice, bob], ["100000000000000000000000", "300000000000000000000000"],  { from: minter });
        } catch (err) {
            assert.include(err.message, "Not ready");
            assert.equal((await this.adeInitMintable.balanceOf(alice)).toString(), '100000000000000000000000');
            assert.equal((await this.adeInitMintable.balanceOf(bob)).toString(), '300000000000000000000000');
        }

        // 365th day
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");
        await this.adeInitMintable.distributeSupply([alice, bob], ["50000000000000000000000", "150000000000000000000000"],  { from: minter });
        assert.equal((await this.adeInitMintable.balanceOf(alice)).toString(), '150000000000000000000000');
        assert.equal((await this.adeInitMintable.balanceOf(bob)).toString(), '450000000000000000000000');
    });
});
