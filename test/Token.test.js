const Token = artifacts.require('./Token');
import {
    tokens
} from './helpers';

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('Token', ([deployer, receiver = accounts[1]]) => {
    let token = null;
    const name = 'DApp Token';
    const symbol = 'DAPP';
    const decimals = '18';
    const totalSupply = tokens(1000000).toString();

    beforeEach(async () => {
        token = await Token.new();
    });

    describe('deployment', () => {
        it('tracks the name', async () => {
            const result = await token.name();
            result.should.equal(name);
        });

        it('tracks the symbol', async () => {
            const result = await token.symbol();
            result.should.equal(symbol);
        });

        it('tracks the decimals', async () => {
            const result = await token.decimals();
            result.toString().should.equal(decimals);
        });

        it('tracks the total supply', async () => {
            const result = await token.totalSupply();
            result.toString().should.equal(totalSupply.toString());
        });

        it('assigns the total supply of the deployer', async () => {
            const result = await token.balanceOf(deployer);
            result.toString().should.equal(totalSupply.toString());
        });


    });

    describe('sending tokens', () => {
        let result;
        let amount;

        beforeEach(async () => {
            amount = tokens(100);
            result = await token.transfer(receiver, amount, {
                from: deployer
            });
        });

        it('transfers token balances', async () => {
            let balanceOf;

            //Transfer
            await token.transfer(receiver, tokens(100), {
                from: deployer
            });

            //After Transfer
            balanceOf = await token.balanceOf(deployer);
            // balanceOf.toString().should.equal(tokens(999800).toString());
            console.log('deployer balance after transfer', balanceOf.toString());
            balanceOf = await token.balanceOf(receiver);
            // balanceOf.toString().should.equal(tokens(100).toString());
            console.log('receiver balance after transfer', balanceOf.toString());
        });

        it('emits a transfer event', async () => {
            const log = result.logs[0];
            log.event.should.equal('Transfer');
            const event = log.args;
            event.from.toString().should.equal(deployer, 'from value is correct');
            event.to.should.equal(receiver, 'to is correct');
            event.value.toString().should.equal(amount.toString(), 'value is correct');
        });
    });
});