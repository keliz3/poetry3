import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import poetportal from './utils/PoetPortal.json';

const App = () => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [allPoems, setAllPoems] = useState([]);
    const contractAddress = "0xaEE8CaF69bf073BF9bf06B9F48CE46aDa6Fa3541";
    const [poetry, setPoetry] = useState("");

    const getAllPoems = async () => {
        try {
            const provider = ethers.getDefaultProvider("rinkeby");
            const poetportalContract = new ethers.Contract(contractAddress, poetportal.abi, provider);

            const poems = await poetportalContract.getAllPoems();

            let poemsCleaned = [];
            poems.forEach(poem => {
                poemsCleaned.push({
                    address: poem.poet,
                    timestamp: new Date(poem.timestamp * 1000),
                    poetry: poem.poetry
                });
            });

            setAllPoems(poemsCleaned);

            poetportalContract.on("NewPoem", (from, timestamp, poetry) => {
              console.log("NewPoem", from, timestamp, poetry);
              
              setAllPoems(prevState => [...prevState, {
                address: from,
                timestamp: new Date(timestamp * 1000),
                poetry: poetry
              }]);
            });
        } catch (error) {
            console.log(error);
        }
    }

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log("Make sure you have metamask!");
                return;
            }

            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length !== 0) {
                const account = accounts[0];
                setCurrentAccount(account);
            } else {
                console.log("No authorized account found.")
            }
        } catch (error) {
            console.log(error);
        }
    }

    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert("You need MetaMask.");
                return;
            }

            const accounts = await ethereum.request({ method: "eth_requestAccounts" });

            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error)
        }
    }

    const poem = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const poetportalContract = new ethers.Contract(contractAddress, poetportal.abi, signer);

                let count = await poetportalContract.getTotalPoems();
                console.log("Retrieved total poem count...", count.toNumber());

                const poemTxn = await poetportalContract.poem(poetry, { gasLimit: 400000 });
                console.log("Mining...", poemTxn.hash);

                await poemTxn.wait();
                console.log("Mined -- ", poemTxn.hash);

                count = await poetportalContract.getTotalPoems();
                console.log("Retrieved total poem count...", count.toNumber());

                setPoetry('');

            } else {
                console.log("Ethereum object doesn't exist.");
            }
        } catch (error) {
            console.log(error);
        }
    }

    function handleChange(event) {
      setPoetry(event.target.value);
    }

    // useEffect(() => {
    //   isEntity();
    // })

    useEffect(() => {
      checkIfWalletIsConnected();
    })

    useEffect(() => {
      getAllPoems();
    }, [currentAccount])

    return (
        <div className="mainContainer">

            <div className="dataContainer">
  
                <div className="header">
                    ✍(◔◡◔) poetry3
                </div>

                <div className="bio">
                    hey, i'm Kristin. this is a web3 poetry portal. connect your wallet and use the Rinkeby testnet to immortalize a few lines of poetry. 
                </div>

                {!currentAccount && (
                    <button className="connectButton" onClick={connectWallet}>connect your wallet →
                    </button>
                )}

                <form>
                  <div className="inputPoem">
                    <input className="poemArea" type="text" value={poetry} onChange={handleChange} placeholder="drop your text here."/>
                    </div>
                </form>

                <button className="waveButton" onClick={poem}>
                    share a poem →
                </button>

                {allPoems.slice(0).reverse().map((poem, index) => {
                    return (
                        <div key={index} className="poetry" style={{ marginTop: "16px", padding: "8px" }}>
                            <div>Address: {poem.address}</div>
                            <div>Time: {poem.timestamp.toString()}</div>
                            <div>Poem: {poem.poetry}</div>
                        </div>)
                })}

                <div>
                  <br></br>
                </div>

                
            </div>
        </div>
    );
}

export default App;