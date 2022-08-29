const { assert } = require("chai");

const ADEToken = artifacts.require('ADEToken');

contract('ADEToken', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.ade = await ADEToken.new(1000, { from: minter });
    });


    it('mint', async () => {
        await this.ade.mint(alice, 1000, { from: minter });
        assert.equal((await this.vvs.balanceOf(alice)).toString(), '1000');
    })
});
