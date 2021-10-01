const { ethers } = require("hardhat");

const main = async () => {
    const poemContractFactory = await hre.ethers.getContractFactory('PoetPortal');
    const poemContract = await poemContractFactory.deploy({
        value: hre.ethers.utils.parseEther('0.1'),
    });

    // Wait for contract to be mined.
    await poemContract.deployed();

    // Print local address
    console.log("Contract deployed to --", poemContract.address);
    // console.log("Contract deployed by:", owner.address);

    let contractBalance = await hre.ethers.provider.getBalance(
        poemContract.address
    );
    console.log(
        'Contract balance: ',
        hre.ethers.utils.formatEther(contractBalance)
    );

    let poemTxn = await poemContract.poem('a poem');
    await poemTxn.wait();

    contractBalance = await hre.ethers.provider.getBalance(
        poemContract.address);
    console.log(
        'Contract balance: ',
        hre.ethers.utils.formatEther(contractBalance)
    );

    let allPoems = await poemContract.getAllPoems();
    console.log(allPoems);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();