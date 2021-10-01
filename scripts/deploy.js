const main = async () => {
    const poemContractFactory = await hre.ethers.getContractFactory('PoetPortal');
    const poemContract = await poemContractFactory.deploy({
        value: hre.ethers.utils.parseEther('0.001'),
    });

    await poemContract.deployed();

    console.log('PoetPortal address: ', poemContract.address);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

runMain();