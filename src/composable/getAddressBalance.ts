import Web3 from 'web3'
const ethereum = (window as any).ethereum;
const web3 = new Web3(ethereum);

export async function getAddressBalance(address:string):Promise<number>{
  const balanceInWei = await web3.eth.getBalance(address);
  const balanceInEther = web3.utils.fromWei(balanceInWei, 'ether')
  return Number(balanceInEther);
}