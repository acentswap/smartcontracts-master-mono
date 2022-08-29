const { expectRevert, time } = require('@openzeppelin/test-helpers');
const { assert } = require("chai");
const ADEToken = artifacts.require('ADEToken');
const Spica = artifacts.require('Spica');
const Virgo = artifacts.require('Virgo');
const VirgoAdmin = artifacts.require('VirgoAdmin');
const MockERC20 = artifacts.require('MockERC20');

contract('VirgoAdmin', ([alice, newOwner, newOwner1, dev, minter]) => {
 beforeEach(async () => {
  // 1000 per block = 5256000000 per year
  this.vvs = await ADEToken.new(5256000000, { from: minter });
  this.spica = await Spica.new(this.vvs.address, { from: minter });
  this.craft = await Virgo.new(this.vvs.address, this.spica.address, dev, '100', { from: minter });
  this.virgoAdmin = await VirgoAdmin.new(this.craft.address, { from: minter });

  await this.vvs.transferOwnership(this.craft.address, { from: minter });
  await this.spica.transferOwnership(this.craft.address, { from: minter });
  await this.craft.transferOwnership(this.virgoAdmin.address, { from: minter });

  this.lp1 = await MockERC20.new('LPToken', 'LP1', '1000000', { from: minter });
 });

 describe('add', () => {
  it('only owner can call', async () => {
   await expectRevert(this.virgoAdmin.add(1000, this.lp1.address, true, { from: alice }), 'Ownable: caller is not the owner\'');
  });

  it('can call add', async () => {
   await this.virgoAdmin.add(1000, this.lp1.address, true, { from: minter });
   assert.equal(await this.craft.poolLength(), 2);
  });
 });

 describe('set', () => {
  beforeEach(async () => {
   await this.virgoAdmin.add(1000, this.lp1.address, true, { from: minter });
  });

  it('only owner can call', async () => {
   await expectRevert(this.virgoAdmin.set(1, 2000, true, { from: alice }), 'Ownable: caller is not the owner\'');
  });

  it('can call set', async () => {
   await this.virgoAdmin.set(1, 2000, true, { from: minter });
   const pool = await this.craft.poolInfo(1);
   assert.equal(pool.allocPoint, 2000);
  });
 });

 describe('distributeSupply', () => {
  beforeEach(() => {
   this.teamAddresses = [alice];
   this.teamAmount = [1000];
  });
  it('only owner can call', async () => {
   await expectRevert(this.virgoAdmin.distributeSupply(
    this.teamAddresses,
    this.teamAmount,
    { from: alice }
   ), 'Ownable: caller is not the owner\'');
  });

  it('can call distributeSupply', async () => {
   await this.virgoAdmin.distributeSupply(
    this.teamAddresses,
    this.teamAmount,
    { from: minter }
   );
   assert.equal(await this.vvs.balanceOf(alice), 1000);
  });
 });

 describe('updateStakingRatio', () => {
  it('only owner can call', async () => {
   await expectRevert(this.virgoAdmin.updateStakingRatio(10, { from: alice }), 'Ownable: caller is not the owner\'');
  });

  it('can call distributeSupply', async () => {
   await this.virgoAdmin.updateStakingRatio(10, { from: minter });
   assert.equal(await this.craft.vvsStakingRatio(), 10);
  });
 });

 describe('enableTransferOwnership', () => {
  it('only owner can call', async () => {
   await expectRevert(this.virgoAdmin.enableTransferOwnership(newOwner, { from: alice }), 'Ownable: caller is not the owner\'');
  });

  it('can call enableTransferOwnership', async () => {
   const timelock = await this.virgoAdmin.TRANSFER_OWNERSHIP_TIMELOCK();
   await this.virgoAdmin.enableTransferOwnership(newOwner, { from: minter });
   assert.equal((await this.virgoAdmin.newOwner()).toString(), newOwner);
   assert.equal(
    (await this.virgoAdmin.transferOwnershipTimeLock()).toString(),
    (await time.latest()).add(timelock).toString()
   );
  });

  it('changing newOwner resets the timer', async () => {
   const timelock = await this.virgoAdmin.TRANSFER_OWNERSHIP_TIMELOCK();
   await this.virgoAdmin.enableTransferOwnership(newOwner, { from: minter });
   await time.increase(timelock);
   await this.virgoAdmin.enableTransferOwnership(newOwner1, { from: minter });

   assert.equal((await this.virgoAdmin.newOwner()).toString(), newOwner1);
   assert.equal(
    (await this.virgoAdmin.transferOwnershipTimeLock()).toString(),
    (await time.latest()).add(timelock).toString()
   );
  });
 });

 describe('transferOwnership', () => {
  it('only owner can call', async () => {
   await expectRevert(this.virgoAdmin.transferOwnership({ from: alice }), 'Ownable: caller is not the owner\'');
  });

  it('cannot call when timelock timestamp not reached', async () => {
   await this.virgoAdmin.enableTransferOwnership(newOwner, { from: minter });

   await time.increase(
    (await this.virgoAdmin.TRANSFER_OWNERSHIP_TIMELOCK())
     .sub(time.duration.seconds(1)));
   await expectRevert(this.virgoAdmin.transferOwnership({ from: minter }), "VirgoAdmin: transferOwnership not ready");

  });

  it('can transferOwnership after timelock timestamp', async () => {
   await this.virgoAdmin.enableTransferOwnership(newOwner, { from: minter });

   await time.increase(await this.virgoAdmin.TRANSFER_OWNERSHIP_TIMELOCK());
   await time.increase(time.duration.seconds(1));
   await this.virgoAdmin.transferOwnership({ from: minter });
   assert.equal((await this.craft.owner()).toString(), newOwner);
  });
 });
});
