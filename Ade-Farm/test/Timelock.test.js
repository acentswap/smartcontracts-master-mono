const { expectRevert, time } = require('@openzeppelin/test-helpers');
const ethers = require('ethers');
const ADEToken = artifacts.require('ADEToken');
const Virgo = artifacts.require('Virgo');
const MockERC20 = artifacts.require('libs/MockERC20');
const Timelock = artifacts.require('Timelock');
const Spica = artifacts.require('Spica');

function encodeParameters(types, values) {
    const abi = new ethers.utils.AbiCoder();
    return abi.encode(types, values);
}

contract('Timelock', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.ade = await ADEToken.new(5256000000, { from: alice });
        this.timelock = await Timelock.new(bob, '28800', { from: alice }); //8hours
    });

    it('should not allow non-owner to do operation', async () => {
        await this.ade.transferOwnership(this.timelock.address, { from: alice });
        await expectRevert(
            this.ade.transferOwnership(carol, { from: alice }),
            'Ownable: caller is not the owner',
        );
        await expectRevert(
            this.ade.transferOwnership(carol, { from: bob }),
            'Ownable: caller is not the owner',
        );
        await expectRevert(
            this.timelock.queueTransaction(
                this.ade.address, '0', 'transferOwnership(address)',
                encodeParameters(['address'], [carol]),
                (await time.latest()).add(time.duration.hours(6)),
                { from: alice },
            ),
            'Timelock::queueTransaction: Call must come from admin.',
        );
    });

    it('should do the timelock thing', async () => {
        await this.ade.transferOwnership(this.timelock.address, { from: alice });
        const eta = (await time.latest()).add(time.duration.hours(9));
        await this.timelock.queueTransaction(
            this.ade.address, '0', 'transferOwnership(address)',
            encodeParameters(['address'], [carol]), eta, { from: bob },
        );
        await time.increase(time.duration.hours(1));
        await expectRevert(
            this.timelock.executeTransaction(
                this.ade.address, '0', 'transferOwnership(address)',
                encodeParameters(['address'], [carol]), eta, { from: bob },
            ),
            "Timelock::executeTransaction: Transaction hasn't surpassed time lock.",
        );
        await time.increase(time.duration.hours(8));
        await this.timelock.executeTransaction(
            this.ade.address, '0', 'transferOwnership(address)',
            encodeParameters(['address'], [carol]), eta, { from: bob },
        );
        assert.equal((await this.ade.owner()).valueOf(), carol);
    });

    it('should also work with Virgo', async () => {
        this.lp1 = await MockERC20.new('LPToken', 'LP', '10000000000', { from: minter });
        this.lp2 = await MockERC20.new('LPToken', 'LP', '10000000000', { from: minter });
        this.spica = await Spica.new(this.ade.address, { from: minter });
        this.virgo = await Virgo.new(this.ade.address, this.spica.address, dev, '0', { from: alice });
        await this.ade.transferOwnership(this.virgo.address, { from: alice });
        await this.spica.transferOwnership(this.virgo.address, { from: minter });
        await this.virgo.add('100', this.lp1.address, true, { from: alice });
        await this.virgo.transferOwnership(this.timelock.address, { from: alice });
        await expectRevert(
            this.virgo.add('100', this.lp1.address, true, { from: alice }),
            "Ownable: caller is not the owner",
        );

        const eta = (await time.latest()).add(time.duration.hours(9));
        await this.timelock.queueTransaction(
            this.virgo.address, '0', 'transferOwnership(address)',
            encodeParameters(['address'], [minter]), eta, { from: bob },
        );
        // await this.timelock.queueTransaction(
        //     this.virgo.address, '0', 'add(uint256,address,bool)',
        //     encodeParameters(['uint256', 'address', 'bool'], ['100', this.lp2.address, false]), eta, { from: bob },
        // );
        await time.increase(time.duration.hours(9));
        await this.timelock.executeTransaction(
            this.virgo.address, '0', 'transferOwnership(address)',
            encodeParameters(['address'], [minter]), eta, { from: bob },
        );
        await expectRevert(
            this.virgo.add('100', this.lp1.address, true, { from: alice }),
            "Ownable: caller is not the owner",
        );
        await this.virgo.add('100', this.lp1.address, true, { from: minter })
        // await this.timelock.executeTransaction(
        //     this.virgo.address, '0', 'add(uint256,address,bool)',
        //     encodeParameters(['uint256', 'address', 'bool'], ['100', this.lp2.address, false]), eta, { from: bob },
        // );
        // assert.equal((await this.virgo.poolInfo('0')).valueOf().allocPoint, '200');
        // assert.equal((await this.virgo.totalAllocPoint()).valueOf(), '300');
        // assert.equal((await this.virgo.poolLength()).valueOf(), '2');
    });
});
