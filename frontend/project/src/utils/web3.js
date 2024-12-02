import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants';

export const connectWallet = async () => {
  try {
    if (!window.ethereum) throw new Error("Please install MetaMask!");
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
};

export const getContract = () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    return contract;
  } catch (error) {
    console.error("Error getting contract:", error);
    throw error;
  }
};

export const createDiaryEntry = async (ipfsHash) => {
  try {
    const contract = getContract();
    const tx = await contract.createDiaryEntry(ipfsHash);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error creating diary entry:", error);
    throw error;
  }
};

export const getUserEntries = async () => {
  try {
    const contract = getContract();
    const entries = await contract.getUserEntries();
    return entries;
  } catch (error) {
    console.error("Error getting user entries:", error);
    throw error;
  }
};

export const getDiaryEntry = async (tokenId) => {
  try {
    const contract = getContract();
    const entry = await contract.getDiaryEntry(tokenId);
    return entry;
  } catch (error) {
    console.error("Error getting diary entry:", error);
    throw error;
  }
};

export const setEntryPrivacy = async (tokenId, isPublic) => {
  try {
    const contract = getContract();
    const tx = await contract.setEntryPrivacy(tokenId, isPublic);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error setting entry privacy:", error);
    throw error;
  }
};