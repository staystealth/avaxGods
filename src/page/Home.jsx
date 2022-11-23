import React, { useState } from 'react';

import { useGlobalContext } from '../context';
import { PageHOC, CustomInput, CustomButton } from '../components';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { contract, walletAddress, setShowAlert, gameData, setErrorMessage } = useGlobalContext();
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();
  
  //console.log({ contract });
  const handleClick = async () => {
    try {
      const playerExist = await contract.isPlayer(walletAddress);

      if(!playerExist) {
        await contract.registerPlayer(playerName, playerName, {
          gasLimit: 200000
      });

        setShowAlert({
          status: true,
          type: 'info',
          message: `${playerName} is beeing summoned!`
        });
      }
    } catch (error) {
      setErrorMessage(error);
    }
  };

  useEffect(() => {
    const checkForPlayerToken = async () => {
      const playerExist = await contract.isPlayer(walletAddress);
      const playerTokenExists = await contract.isPlayerToken(walletAddress);

      if(playerExist && playerTokenExists) navigate('/create-battle')
    }

    if(contract) checkForPlayerToken();
  }, [contract]);

  useEffect(() => {
    if(gameData.activeBattle) {
      navigate(`/battle/${gameData.activeBattle.name}`)
    }
  }, [gameData]);
  
  return (
    <div className='flex flex-col'>
      <CustomInput 
        label="Name"
        placeholder="Enter your player name"
        value={playerName}
        handleValueChange={setPlayerName}
      />
      <CustomButton 
        title="Register"
        handleClick={handleClick}
        restStyles="mt-6"
      />
    </div>
  )
};

export default PageHOC(
  Home,
  <>Welcome to Avax Gods <br /> a Web3 NFT Card Game</>,
  <>Connect your wallet to start playing <br /> the ultime Web3 Battle Card Game</>
);