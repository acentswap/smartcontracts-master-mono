const { advanceBlockTo } = require('@openzeppelin/test-helpers/src/time');
const { assert } = require('chai');
const ADEToken = artifacts.require('ADEToken');
const Spica = artifacts.require('Spica');

contract('Spica', ([alice, bob, carol, dev, minter]) => {
  beforeEach(async () => {
    this.ade = await ADEToken.new(1000, { from: minter });
    this.spica = await Spica.new(this.ade.address, { from: minter });
  });

  it('mint', async () => {
    await this.spica.mint(alice, 1000, { from: minter });
    assert.equal((await this.spica.balanceOf(alice)).toString(), '1000');
  });

  it('burn', async () => {
    await advanceBlockTo('800');
    await this.spica.mint(alice, 1000, { from: minter });
    await this.spica.mint(bob, 1000, { from: minter });
    assert.equal((await this.spica.totalSupply()).toString(), '2000');
    await this.spica.burn(alice, 200, { from: minter });

    assert.equal((await this.spica.balanceOf(alice)).toString(), '800');
    assert.equal((await this.spica.totalSupply()).toString(), '1800');
  });

  it('safeADETransfer', async () => {
    assert.equal(
      (await this.ade.balanceOf(this.spica.address)).toString(),
      '0'
    );
    await this.ade.mint(this.spica.address, 1000, { from: minter });
    await this.spica.safeADETransfer(bob, 200, { from: minter });
    assert.equal((await this.ade.balanceOf(bob)).toString(), '200');
    assert.equal(
      (await this.ade.balanceOf(this.spica.address)).toString(),
      '800'
    );
    await this.spica.safeADETransfer(bob, 2000, { from: minter });
    assert.equal((await this.ade.balanceOf(bob)).toString(), '1000');
  });
});
