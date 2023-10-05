const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Token contract", async function(){
let tokenA;
let tokenB;
let signer;
let weth;
let uniswapV2Factory;
let uniswapV2Router02;





const TOKEN_B_AMOUNT = ethers.parseEther("1000");
let getInit;

beforeEach(async function(){
  signer = await ethers.getSigners()

  const TokenA= await ethers.getContractFactory("TokenA");
  tokenA = await TokenA.connect(signer[0]).deploy();

  const TokenB = await ethers.getContractFactory("TokenB");
  tokenB= await TokenB.connect(signer[0]).deploy()

  const WETH9= await ethers.getContractFactory("WETH9")
  weth = await WETH9.connect(signer[0]).deploy()

  const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory")
  uniswapV2Factory = await UniswapV2Factory.connect(signer[0]).deploy(signer[0].address)

  const UniswapV2Router02 =await ethers.getContractFactory("UniswapV2Router02")
  uniswapV2Router02 = await UniswapV2Router02.connect(signer[0]).deploy(uniswapV2Factory.target, weth.target);
  const Getinit= await ethers.getContractFactory("CalHash");
  getInit = await Getinit.deploy();
console.log (await getInit.connect(signer[0]).getInitHash());
})
describe("Deployment", async function(){
  it("check  name , symbol, totalSupply of TokenA", async function(){
    console.log("Check Name" , await tokenA.name())
    console.log("check symbol", await tokenA.symbol())
    console.log("check totalSupply of tokenA", await tokenA.balanceOf(signer[0].address)) 
    expect(await tokenA.name()).to.be.equal("TokenA")
    expect(await tokenA.symbol()).to.be.equal("TA")
    expect(await tokenA.balanceOf(signer[0].address)).to.be.equal(await ethers.parseEther("100000"))
 
 }) 
 it("check name,symbol,totalSupply of TokenB", async function(){
   console.log("check Name", await tokenB.name())
   console.log("check symbol", await tokenB.symbol())
   console.log("check totalSupply of tokenB", await tokenB.balanceOf(signer[0].address))
   console.log("token address" , await tokenA.address)
   console.log("token address" , await tokenA.target)
 }) 
 it.only("check addLiquidity function" ,async function(){
  await tokenA.connect(signer[0]).approve( uniswapV2Router02.target,TOKEN_A_AMOUNT)
  await tokenB.connect(signer[0]).approve( uniswapV2Router02.target,TOKEN_B_AMOUNT)
  await uniswapV2Router02.addLiquidity(tokenA.target,tokenB.target,TOKEN_A_AMOUNT,TOKEN_B_AMOUNT,1,1,signer[0].address,1696019916 )
  
 })
 it("check addLiquidityETH", async function(){
await token.connect(signer[0]).approve(uniswapV2Router02.target,)
 })
 
   
})

})