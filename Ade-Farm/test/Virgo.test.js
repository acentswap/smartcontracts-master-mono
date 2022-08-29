const { expectRevert, time } = require('@openzeppelin/test-helpers');
const ADEToken = artifacts.require('ADEToken');
const Spica = artifacts.require('Spica');
const Virgo = artifacts.require('Virgo');
const MockERC20 = artifacts.require('libs/MockERC20');

contract('Virgo', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        // 1000 per block = 5256000000 per year
        this.ade = await ADEToken.new(5256000000, { from: minter });
        this.spica = await Spica.new(this.ade.address, { from: minter });
        this.lp1 = await MockERC20.new('LPToken', 'LP1', '1000000', { from: minter });
        this.lp2 = await MockERC20.new('LPToken', 'LP2', '1000000', { from: minter });
        this.lp3 = await MockERC20.new('LPToken', 'LP3', '1000000', { from: minter });
        this.virgo = await Virgo.new(this.ade.address, this.spica.address, dev, '100', { from: minter });
        await this.ade.transferOwnership(this.virgo.address, { from: minter });
        await this.spica.transferOwnership(this.virgo.address, { from: minter });

        await this.lp1.transfer(bob, '2000', { from: minter });
        await this.lp2.transfer(bob, '2000', { from: minter });
        await this.lp3.transfer(bob, '2000', { from: minter });

        await this.lp1.transfer(alice, '2000', { from: minter });
        await this.lp2.transfer(alice, '2000', { from: minter });
        await this.lp3.transfer(alice, '2000', { from: minter });
    });
    it('real case', async () => {
      this.lp4 = await MockERC20.new('LPToken', 'LP1', '1000000', { from: minter });
      this.lp5 = await MockERC20.new('LPToken', 'LP2', '1000000', { from: minter });
      this.lp6 = await MockERC20.new('LPToken', 'LP3', '1000000', { from: minter });
      this.lp7 = await MockERC20.new('LPToken', 'LP1', '1000000', { from: minter });
      this.lp8 = await MockERC20.new('LPToken', 'LP2', '1000000', { from: minter });
      this.lp9 = await MockERC20.new('LPToken', 'LP3', '1000000', { from: minter });
      await this.virgo.add('2000', this.lp1.address, true, { from: minter });
      await this.virgo.add('1000', this.lp2.address, true, { from: minter });
      await this.virgo.add('500', this.lp3.address, true, { from: minter });
      await this.virgo.add('500', this.lp3.address, true, { from: minter });
      await this.virgo.add('500', this.lp3.address, true, { from: minter });
      await this.virgo.add('500', this.lp3.address, true, { from: minter });
      await this.virgo.add('500', this.lp3.address, true, { from: minter });
      await this.virgo.add('100', this.lp3.address, true, { from: minter });
      await this.virgo.add('100', this.lp3.address, true, { from: minter });
      assert.equal((await this.virgo.poolLength()).toString(), "10");

      await time.advanceBlockTo('170');
      await this.lp1.approve(this.virgo.address, '1000', { from: alice });
      assert.equal((await this.ade.balanceOf(alice)).toString(), '0');
      await this.virgo.deposit(1, '20', { from: alice });
      await this.virgo.withdraw(1, '20', { from: alice });
      assert.equal((await this.ade.balanceOf(alice)).toString(), '263');

      await this.ade.approve(this.virgo.address, '1000', { from: alice });
      await this.virgo.enterStaking('20', { from: alice });
      await this.virgo.enterStaking('0', { from: alice });
      await this.virgo.enterStaking('0', { from: alice });
      await this.virgo.enterStaking('0', { from: alice });
      assert.equal((await this.ade.balanceOf(alice)).toString(), '993');
      // assert.equal((await this.virgo.getPoolPoint(0, { from: minter })).toString(), '1900');
    })


    it('deposit/withdraw', async () => {
      await this.virgo.add('1000', this.lp1.address, true, { from: minter });
      await this.virgo.add('1000', this.lp2.address, true, { from: minter });
      await this.virgo.add('1000', this.lp3.address, true, { from: minter });

      await this.lp1.approve(this.virgo.address, '100', { from: alice });
      await this.virgo.deposit(1, '20', { from: alice });
      await this.virgo.deposit(1, '0', { from: alice });
      await this.virgo.deposit(1, '40', { from: alice });
      await this.virgo.deposit(1, '0', { from: alice });
      assert.equal((await this.lp1.balanceOf(alice)).toString(), '1940');
      await this.virgo.withdraw(1, '10', { from: alice });
      assert.equal((await this.lp1.balanceOf(alice)).toString(), '1950');
      assert.equal((await this.ade.balanceOf(alice)).toString(), '999');
      assert.equal((await this.ade.balanceOf(dev)).toString(), '0');

      await this.lp1.approve(this.virgo.address, '100', { from: bob });
      assert.equal((await this.lp1.balanceOf(bob)).toString(), '2000');
      await this.virgo.deposit(1, '50', { from: bob });
      assert.equal((await this.lp1.balanceOf(bob)).toString(), '1950');
      await this.virgo.deposit(1, '0', { from: bob });
      assert.equal((await this.ade.balanceOf(bob)).toString(), '125');
      await this.virgo.emergencyWithdraw(1, { from: bob });
      assert.equal((await this.lp1.balanceOf(bob)).toString(), '2000');
    })

    it('staking/unstaking', async () => {
      await this.virgo.add('1000', this.lp1.address, true, { from: minter });
      await this.virgo.add('1000', this.lp2.address, true, { from: minter });
      await this.virgo.add('1000', this.lp3.address, true, { from: minter });

      await this.lp1.approve(this.virgo.address, '10', { from: alice });
      await this.virgo.deposit(1, '2', { from: alice }); //0
      await this.virgo.withdraw(1, '2', { from: alice }); //1

      await this.ade.approve(this.virgo.address, '250', { from: alice });
      await this.virgo.enterStaking('240', { from: alice }); //3
      assert.equal((await this.spica.balanceOf(alice)).toString(), '240');
      assert.equal((await this.ade.balanceOf(alice)).toString(), '10');
      await this.virgo.enterStaking('10', { from: alice }); //4
      assert.equal((await this.spica.balanceOf(alice)).toString(), '250');
      assert.equal((await this.ade.balanceOf(alice)).toString(), '249');
      await this.virgo.leaveStaking(250);
      assert.equal((await this.spica.balanceOf(alice)).toString(), '0');
      assert.equal((await this.ade.balanceOf(alice)).toString(), '749');

    });

    it('update multiplier', async () => {
      await this.virgo.add('1000', this.lp1.address, true, { from: minter });
      await this.virgo.add('1000', this.lp2.address, true, { from: minter });
      await this.virgo.add('1000', this.lp3.address, true, { from: minter });

      await this.lp1.approve(this.virgo.address, '100', { from: alice });
      await this.lp1.approve(this.virgo.address, '100', { from: bob });
      await this.virgo.deposit(1, '100', { from: alice });
      await this.virgo.deposit(1, '100', { from: bob });
      await this.virgo.deposit(1, '0', { from: alice });
      await this.virgo.deposit(1, '0', { from: bob });

      await this.ade.approve(this.virgo.address, '100', { from: alice });
      await this.ade.approve(this.virgo.address, '100', { from: bob });
      await this.virgo.enterStaking('50', { from: alice });
      await this.virgo.enterStaking('100', { from: bob });

      await this.virgo.updateMultiplier('0', { from: minter });

      await this.virgo.enterStaking('0', { from: alice });
      await this.virgo.enterStaking('0', { from: bob });
      await this.virgo.deposit(1, '0', { from: alice });
      await this.virgo.deposit(1, '0', { from: bob });

      assert.equal((await this.ade.balanceOf(alice)).toString(), '700');
      assert.equal((await this.ade.balanceOf(bob)).toString(), '150');

      await time.advanceBlockTo('265');

      await this.virgo.enterStaking('0', { from: alice });
      await this.virgo.enterStaking('0', { from: bob });
      await this.virgo.deposit(1, '0', { from: alice });
      await this.virgo.deposit(1, '0', { from: bob });

      assert.equal((await this.ade.balanceOf(alice)).toString(), '700');
      assert.equal((await this.ade.balanceOf(bob)).toString(), '150');

      await this.virgo.leaveStaking('50', { from: alice });
      await this.virgo.leaveStaking('100', { from: bob });
      await this.virgo.withdraw(1, '100', { from: alice });
      await this.virgo.withdraw(1, '100', { from: bob });

    });

    it('should allow dev and only dev to update dev', async () => {
      assert.equal((await this.virgo.devaddr()).valueOf(), dev);
      await expectRevert(this.virgo.dev(bob, { from: bob }), 'dev: wut?');
      await this.virgo.dev(bob, { from: dev });
      assert.equal((await this.virgo.devaddr()).valueOf(), bob);
      await this.virgo.dev(alice, { from: bob });
      assert.equal((await this.virgo.devaddr()).valueOf(), alice);
    })

    it('distributeSupply', async () => {
     // Half 5256000000 = 500 per block
     await this.virgo.distributeSupply([alice], [2628000000], { from: minter });
     assert.equal((await this.virgo.adePerBlock()).valueOf(), 500);
    });

    describe('updateStakingRatio', () => {
     beforeEach(async () => {
      await this.virgo.add('1000', this.lp1.address, true, { from: minter });
      await this.virgo.add('2500', this.lp2.address, true, { from: minter });
      await this.virgo.add('4000', this.lp3.address, true, { from: minter });
     });

     it('allocPoint of VVS should be 25% by default', async () => {
      const poolInfo = await this.virgo.poolInfo(0);
      const totalAllocPoint = Math.floor(parseInt(await this.virgo.totalAllocPoint()) * 25 / 100);
      assert.equal(
       poolInfo.allocPoint.toString(),
       totalAllocPoint.toString()
      );
     });

     it('only owner can call', async () => {
      await expectRevert(this.virgo.updateStakingRatio(30, { from: alice }), 'Ownable: caller is not the owner\'');
     });

     it('should not accept ratio > 50', async () => {
      await expectRevert(this.virgo.updateStakingRatio(51, { from: minter }), 'updateStakingRatio: must be lte 50%');
     });

     it('should have correct allocPoint if increase ratio', async () => {
      await this.virgo.updateStakingRatio(30, { from: minter });

      this.lp4 = await MockERC20.new('LPToken', 'LP1', '1000000', { from: minter });
      await this.virgo.add('2500', this.lp4.address, true, { from: minter });

      const poolInfo = await this.virgo.poolInfo(0);
      const totalAllocPoint = Math.floor(parseInt(await this.virgo.totalAllocPoint()) * 30 / 100);

      assert.equal(
       poolInfo.allocPoint.toString(),
       totalAllocPoint.toString()
      );
     });

     it('should have correct allocPoint if decrease ratio', async () => {
      await this.virgo.updateStakingRatio(20, { from: minter });

      this.lp4 = await MockERC20.new('LPToken', 'LP1', '1000000', { from: minter });
      await this.virgo.add('2500', this.lp4.address, true, { from: minter });

      const poolInfo = await this.virgo.poolInfo(0);
      const totalAllocPoint = Math.floor(parseInt(await this.virgo.totalAllocPoint()) * 20 / 100);
      assert.equal(
       poolInfo.allocPoint.toString(),
       totalAllocPoint.toString()
      );
    });
   });
});
