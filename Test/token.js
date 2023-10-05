const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Token Contract", async function(){
    let tokenA;
    let tokenB;
    let signer;
    let weth9;
    let uniswapV2Factory;
   // let uniswapV2ERC20
    let uniswapV2Pair;
    let uniswapV2Router02;
    const TOKEN_A_AMOUNT = ethers.parseEther("1000");
    const TOKEN_B_AMOUNT = ethers.parseEther("1000");
    let calHash;
    let init;
    let tokenC;
    let amountTokenMin;

   async function _addLiquidity(){
        let approval_A = ethers.parseEther("100")
        let approval_B = ethers.parseEther("100")

        await tokenA.connect(signer[0]).approve(uniswapV2Router02.target,approval_A);
        await tokenB.connect(signer[0]).approve(uniswapV2Router02.target, approval_B)

        console.log("Token A Approval : ", approval_A);
        console.log("Token B Approval : ", approval_B);

        console.log("Token A Balance Before AddLiquidity : ",  await tokenA.balanceOf(signer[0].address));
        console.log("Token B Balance Before AddLiquidity  : ",  await tokenB.balanceOf(signer[0].address));

        await uniswapV2Router02.addLiquidity(tokenA.target,tokenB.target,approval_A,approval_B,1,1,signer[0].address, 1726775237)

        console.log("Token A Balance After AddLiquidity : ",  await tokenA.balanceOf(signer[0].address));
        console.log("Token B Balance After AddLiquidity  : ",  await tokenB.balanceOf(signer[0].address));
   }

    beforeEach(async function(){
        signer =  await ethers.getSigners();
        const TokenA = await ethers.getContractFactory("TokenA");
        // console.log("TokenA",TokenA);
        tokenA = await TokenA.connect(signer[0]).deploy();
        //tokenA = await TokenA.connect(target)
        // console.log("tokenA", tokenA);
        const TokenB = await ethers.getContractFactory("TokenB");
        // console.log("TokenB",TokenB );
        tokenB = await TokenB.connect(signer[0]).deploy();
        // console.log("TokenB",tokenB);
        const WETH9 = await ethers.getContractFactory("WETH9")
        weth9 =await WETH9.connect(signer[0]).deploy();

        const TokenC= await ethers.getContractFactory("TokenC")
        tokenC = await TokenC.connect(signer[0]).deploy();

        const UniSwapV2Factory= await ethers.getContractFactory("UniswapV2Factory")
        uniswapV2Factory = await UniSwapV2Factory.connect(signer[0]).deploy(signer[0].address);

        const UniswapV2Pair = await ethers.getContractFactory("UniswapV2Pair");
        uniswapV2Pair = await UniswapV2Pair.connect(signer[0]).deploy();

        const UniswapV2Router02 =await ethers.getContractFactory("UniswapV2Router02");
        uniswapV2Router02 = await UniswapV2Router02.connect(signer[0]).deploy(uniswapV2Factory.target,weth9.target)

       const CalHash = await ethers.getContractFactory("CalHash");
       calHash = await CalHash.connect(signer[0]).deploy();
       init = await calHash.getInitHash();
       console.log("init", init)


      
    //    const UniswapV2ERC20 = await ethers.getContractFactory("UniswapV2ERC20")
    //     uniswapV2ERC20 = await UniswapV2ERC20.connect(signer[0]).deploy();


    })
    it("Contract Address Of Contract",async function(){
        console.log("User  Address : ", signer[0].address)
        console.log("TokenA Contract Address : ",tokenA.target)
        console.log("Contract Address Of TokenB : ", tokenB.target)
        console.log("Contract Address Of WETH9 : ", weth9.target)
       // console.log ("tokaA",tokenA )
        console.log("UniSwapV2Factory Contract Address : ",uniswapV2Factory.target)
        // console.log("UniswapV2ERC20 Contract Address : ",uniswapV2ERC20.target )
        console.log("UniswapV2Pair Contract Address : ",uniswapV2Pair.target )
        console.log("UniswapV2Router02 Contract Address : ", uniswapV2Router02.target )
    })
    it("Check Name,symbol,TotalSupply of tokenA", async function(){
        console.log("Check the Name of TokenA ", await tokenA.name());
        console.log("Check the Symbol of TokenA ", await tokenA.symbol());
        console.log("Check the TotalSupply Of TokenA ", await tokenA.balanceOf(signer[0].address));
        console.log("Check The TotalSupply Of TokenB", await tokenB.balanceOf(signer[0].address));
        expect( await tokenA.name()).to.be.equal("TokenA");
        expect(await tokenA.symbol()).to.be.equal("TA");
        expect(await tokenA.balanceOf(signer[0].address)).to.be.equal(TOKEN_A_AMOUNT)
    })
    it("Check Name,symbol,TotalSupply of tokenB", async function(){
        console.log("Check the Name of TokenB ", await tokenB.name());
        console.log("Check the Symbol of TokenB ", await tokenB.symbol());
        console.log("Check the TotalSupply of TokenB ", await tokenB.balanceOf(signer[0].address));
        expect( await tokenB.name()).to.be.equal("TokenB");
    })
    it("Check AddLiquidity Function" ,async function(){

            let approval_A = ethers.parseEther("100")
        await tokenA.connect(signer[0]).approve(uniswapV2Router02.target,approval_A)

        let approval_B = ethers.parseEther("200")
        await tokenB.connect(signer[0]).approve(uniswapV2Router02.target,approval_B)


        await uniswapV2Router02.addLiquidity(tokenA.target,tokenB.target,approval_A,approval_B,1,1,signer[0].address, 1726775237)

         let pair =  await uniswapV2Factory.getPair(tokenA.target,tokenB.target);
         console.log("Pair Address : ", pair);

        let uniswapV2PairAttach = await uniswapV2Pair.connect(signer[0]).attach(pair);

        console.log("Check Reserve After addLiquidity : ",await uniswapV2PairAttach.getReserves());

        let liquidity = await uniswapV2PairAttach.balanceOf(signer[0]);
        console.log("Check liquidity : ", liquidity);


    })
    it("Check addLiquidityEth",async function(){
        approval_A= ethers.parseEther("100")
        await tokenA.connect(signer[0]).approve(uniswapV2Router02.target,approval_A)
    
         let addEth = ethers.parseEther("50")
         //await weth9.connect(signer[0]).approve(uniswapV2ROuter02.target,addEth)

        await uniswapV2Router02.addLiquidityETH(tokenA.target,approval_A,1,1,signer[0].address,1726775237,{value:addEth})

        let pair = await uniswapV2Factory.getPair(tokenA.target,weth9.target);
        console.log("Pair Address : ", pair)
        
        let uniswapV2PairAttach = await uniswapV2Pair.connect(signer[0]).attach(pair);
        console.log("Check Reserve After addLiquidity", await uniswapV2PairAttach.getReserves());
        let liquidity = await uniswapV2PairAttach.balanceOf(signer[0]);
        console.log("Check Liquidity : ", liquidity)

    })
    it("Check removeLiquidity", async function(){
        approval_A = ethers.parseEther("100")
        await tokenA.connect(signer[0]).approve(uniswapV2Router02.target,approval_A)

        approval_B = ethers.parseEther("200")
        await tokenB.connect(signer[0]).approve(uniswapV2Router02.target,approval_B)

        await uniswapV2Router02.addLiquidity(tokenA.target,tokenB.target,approval_A,approval_B,1,1,signer[0].address, 1726775237)

        let pair = await uniswapV2Factory.getPair(tokenA.target,tokenB.target)
        console.log("Pair address : ", pair)

        let uniswapV2PairAttach = await uniswapV2Pair.connect(signer[0]).attach(pair)
        console.log("Check Reserve  After addLiquidity : " ,await uniswapV2PairAttach.getReserves());
        let liquidity = await uniswapV2PairAttach.balanceOf(signer[0]);
        console.log("Check Liquidity : ", liquidity);

    //**remove liquidity */
    
    await uniswapV2PairAttach.connect(signer[0]).approve(uniswapV2Router02.target,liquidity);

    await uniswapV2Router02.connect(signer[0]).removeLiquidity(tokenA.target,tokenB.target,liquidity,1,1,signer[0].address,1726775237);

    console.log("Check Reserve after Removing liquidity : ", await uniswapV2PairAttach.getReserves());

    })
    it("check RemoveliquidityEth : ", async function(){
        approval_A = ethers.parseEther("100")
        await tokenA.connect(signer[0]).approve(uniswapV2Router02.target,approval_A)
        let addEth = ethers.parseEther("50")
        // removeLiquidityETH(
        //     address token,
        //     uint liquidity,
        //     uint amountTokenMin,
        //     uint amountETHMin,
        //     address to,
           // uint deadline
      await uniswapV2Router02.connect(signer[0]).addLiquidityETH(tokenA.target,approval_A,1,1,signer[0].address,1726775237,{value:addEth})
        let pair = await uniswapV2Factory.getPair(tokenA.target,weth9.target)
        console.log("Pair Address : ", pair)

        let uniswapV2PairAttach = await uniswapV2Pair.connect(signer[0]).attach(pair)
        console.log("Check Reserve After addLiquidityEth", await uniswapV2PairAttach.getReserves())
        let liquidity = await uniswapV2PairAttach.balanceOf(signer[0])
        console.log("Check liquidity", liquidity)

        // **removingliquidityEth**

        await uniswapV2PairAttach.connect(signer[0]).approve(uniswapV2Router02.target,liquidity)
        console.log("check")

        await uniswapV2Router02.connect(signer[0]).removeLiquidityETH(tokenA.target,liquidity,1,1,signer[0].address,1726775237)

        console.log("Check Reserve after Removing liquidityEth : ", await uniswapV2PairAttach.getReserves());

    })
    it(" check swapExactTokensForTokens Function", async function(){
        await _addLiquidity();
    
        let pair= await uniswapV2Factory.connect(signer[0]).getPair(tokenA.target,tokenB.target);
        console.log("pair Address : ", pair)
        let uniswapV2PairAttach = await uniswapV2Pair.connect(signer[0]).attach(pair)
    
        console.log(`Check Reserve after addLiquidity and before swap ${await uniswapV2PairAttach.getReserves()}`)
        let liquidity = await uniswapV2PairAttach.balanceOf(signer[0]);
        console.log("Check Liquidity: ", liquidity);
        
        // swapExactTokensForTokens(
        //     uint amountIn,
        //     uint amountOutMin,
        //     address[] calldata path,
        //     address to,
        approval_A=ethers.parseEther("100");
        await tokenA.connect(signer[0]).approve(uniswapV2Router02.target,approval_A)

        let amountIn = ethers.parseEther("50");
        let amountOutMin= ethers.parseEther("1");

        await uniswapV2Router02.connect(signer[0]).swapExactTokensForTokens(amountIn,amountOutMin,[tokenA.target,tokenB.target],signer[0].address,1726775237)
        
        console.log(`Check Reserve after swap  ${await uniswapV2PairAttach.getReserves()}`)

        // console.log("Check liquidity tokens : ", liquidity);
        let finalTokenA_Balance = await tokenA.balanceOf(signer[0].address)
        let finalTokenB_Balance = await tokenB.balanceOf(signer[0].address)
        console.log("Token A Final Balance After Swapping : ", finalTokenA_Balance);
        console.log("Token B Final Balance After Swapping: ", finalTokenB_Balance);
    })
    it("Check swapTokensForExactTokens Function", async function(){
      await  _addLiquidity();

      let pair = await uniswapV2Factory.connect(signer[0]).getPair(tokenA.target,tokenB.target)
      console.log("Check Pair Address : ", pair)

      let uniswapV2PairAttach = await uniswapV2Pair.connect(signer[0]).attach(pair)
      console.log(`Check Reserve after addLiquidity and before swap ${await uniswapV2PairAttach.getReserves()}`)
      let liquidity = await uniswapV2PairAttach.balanceOf(signer[0]);
      console.log("Check Liquidity: ", liquidity);

    //   swapTokensForExactTokens(
    //     uint amountOut,
    //     uint amountInMax,
    //     address[] calldata path,
    //     address to,
    //     uint deadline
    approval_A = ethers.parseEther("100")
    await tokenA.connect(signer[0]).approve(uniswapV2Router02.target,approval_A)
    
    let amountOut = ethers.parseEther("10")
    let amountInMax = ethers.parseEther("100")

    await uniswapV2Router02.connect(signer[0]).swapTokensForExactTokens(amountOut,amountInMax,[tokenA.target,tokenB.target],signer[0].address,1726775237)
    console.log(`Check Reserve after swap  ${await uniswapV2PairAttach.getReserves()}`)

    console.log("Check liquidity tokens : ", liquidity);
    let finalTokenA_Balance = await tokenA.balanceOf(signer[0].address)
    let finalTokenB_Balance = await tokenB.balanceOf(signer[0].address)
    console.log("Token A Final Balance After Swapping : ", finalTokenA_Balance);
    console.log("Token B Final Balance After Swapping: ", finalTokenB_Balance);
    })
    it(" Check swapExactETHForTokens", async function(){
       approval_A = ethers.parseEther("100")
       await tokenA.connect(signer[0]).approve(uniswapV2Router02.target,approval_A)

       let addEth = ethers.parseEther("50")

       await uniswapV2Router02.addLiquidityETH(tokenA.target,approval_A,1,1,signer[0].address,1726775237,{value:addEth})

       let pair = await uniswapV2Factory.getPair(tokenA.target,weth9.target);
       console.log("Pair Address : ", pair)
       
       let uniswapV2PairAttach = await uniswapV2Pair.connect(signer[0]).attach(pair);
       console.log("Check Reserve After addLiquidity", await uniswapV2PairAttach.getReserves());
       let liquidity = await uniswapV2PairAttach.balanceOf(signer[0]);
       console.log("Check Liquidity : ", liquidity)

        //swapExactETHForTokens(
        //uint amountOutMin,
        //address[] calldata path,
        //address to,
        //uint deadline)

        approval_A = ethers.parseEther("20")
         await tokenA.connect(signer[0]).approve(uniswapV2Router02.target,approval_A)

         let amountOutMin = ethers.parseEther("1")

         await uniswapV2Router02.connect(signer[0]).swapExactETHForTokens(amountOutMin,[weth9.target,tokenA.target],signer[0].address,1726775237,{value:addEth})
         console.log(`Check Reserve after swap  ${await uniswapV2PairAttach.getReserves()}`)

         console.log("Check liquidity tokens : ", liquidity);
         let finalTokenA_Balance = await tokenA.balanceOf(signer[0].address)
         let finalTokenB_Balance = await tokenB.balanceOf(signer[0].address)
         console.log("Token A Final Balance After Swapping : ", finalTokenA_Balance);
         console.log("Token B Final Balance After Swapping: ", finalTokenB_Balance);
    })
    it("Check swapTokensForExactETH", async function(){
        approval_A = ethers.parseEther("200")
       await tokenA.connect(signer[0]).approve(uniswapV2Router02.target,approval_A)

       let addEth = ethers.parseEther("100")

       await uniswapV2Router02.addLiquidityETH(tokenA.target,approval_A,1,1,signer[0].address,1726775237,{value:addEth})

       let pair = await uniswapV2Factory.getPair(tokenA.target,weth9.target);
       console.log("Pair Address : ", pair)
       
       let uniswapV2PairAttach = await uniswapV2Pair.connect(signer[0]).attach(pair);
       console.log("Check Reserve After addLiquidity", await uniswapV2PairAttach.getReserves());
       let liquidity = await uniswapV2PairAttach.balanceOf(signer[0]);
       console.log("Check Liquidity : ", liquidity)

    //    swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
        approval_A = ethers.parseEther("100")

        await tokenA.connect(signer[0]).approve(uniswapV2Router02.target,approval_A)
        
        let amountOut = ethers.parseEther("10")
        let amountInMax = ethers.parseEther("100")
        
       await uniswapV2Router02.connect(signer[0]).swapTokensForExactETH(amountOut,amountInMax,[tokenA.target,weth9.target],signer[0].address,1726775237)

       console.log(`Check Reserve after swap  ${await uniswapV2PairAttach.getReserves()}`)

         console.log("Check liquidity tokens : ", liquidity);
         let finalTokenA_Balance = await tokenA.balanceOf(signer[0].address)
         let finalTokenB_Balance = await tokenB.balanceOf(signer[0].address)
         console.log("Token A Final Balance After Swapping : ", finalTokenA_Balance);
         console.log("Token B Final Balance After Swapping: ", finalTokenB_Balance);
    })
    it("Check swapExactTokensForETH", async function(){
        approval_A = ethers.parseEther("200")
       await tokenA.connect(signer[0]).approve(uniswapV2Router02.target,approval_A)

       let addEth = ethers.parseEther("100")

       await uniswapV2Router02.addLiquidityETH(tokenA.target,approval_A,1,1,signer[0].address,1726775237,{value:addEth})

       let pair = await uniswapV2Factory.getPair(tokenA.target,weth9.target);
       console.log("Pair Address : ", pair)
       
        //swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        approval_A = ethers.parseEther("100")
        console.log("check")
        await tokenA.connect(signer[0]).approve(uniswapV2Router02.target,approval_A)
         
        let amountIn = ethers.parseEther("100")
        let amountOutMin = ethers.parseEther("10")

        await uniswapV2Router02.connect(signer[0]).swapExactTokensForETH(amountIn, amountOutMin,[tokenA.target,weth9.target],signer[0].address,1726775237)
        let uniswapV2PairAttach = await uniswapV2Pair.connect(signer[0]).attach(pair);
        console.log(`Check Reserve after swap  ${await uniswapV2PairAttach.getReserves()}`)
        let liquidity = await uniswapV2PairAttach.balanceOf(signer[0])
         console.log("Check liquidity tokens : ", liquidity);
         let finalTokenA_Balance = await tokenA.balanceOf(signer[0].address)
         let finalTokenB_Balance = await tokenB.balanceOf(signer[0].address)
         console.log("Token A Final Balance After Swapping : ", finalTokenA_Balance);
         console.log("Token B Final Balance After Swapping: ", finalTokenB_Balance);
        
})
it("Check swapETHForExactTokens ", async function(){
    approval_A = ethers.parseEther("200")
    await tokenA.connect(signer[0]).approve(uniswapV2Router02.target,approval_A)

    let addEth = ethers.parseEther("100")

    await uniswapV2Router02.addLiquidityETH(tokenA.target,approval_A,1,1,signer[0].address,1726775237,{value:addEth})

    let pair = await uniswapV2Factory.getPair(tokenA.target,weth9.target);
    console.log("Pair Address : ", pair)

    // swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)

    approval_A=ethers.parseEther("100")
    await tokenA.connect(signer[0]).approve(uniswapV2Router02.target,approval_A)
    
    let amountOut = ethers.parseEther("10")
     
    await uniswapV2Router02.connect(signer[0]).swapETHForExactTokens(amountOut,[weth9.target,tokenA.target],signer[0].address,1726775237,{value:addEth})
   
    let uniswapV2PairAttach = await uniswapV2Pair.connect(signer[0]).attach(pair)
    console.log(`Check Reserve after swap  ${await uniswapV2PairAttach.getReserves()}`)
    let liquidity = await uniswapV2PairAttach.balanceOf(signer[0])
         console.log("Check liquidity tokens : ", liquidity);
         let finalTokenA_Balance = await tokenA.balanceOf(signer[0].address)
         let finalTokenB_Balance = await tokenB.balanceOf(signer[0].address)
         console.log("Token A Final Balance After Swapping : ", finalTokenA_Balance);
         console.log("Token B Final Balance After Swapping: ", finalTokenB_Balance);

})
it("Check swapSupportingFeeOnTransferTokens", async function(){
    approval_A = ethers.parseEther("100")
    await tokenA.connect(signer[0]).approve(uniswapV2Router02.target,approval_A)
    console.log("check")

    approval_C= ethers.parseEther("100")
    await tokenC.connect(signer[0]).approve(uniswapV2Router02.target,approval_C)
    console.log("check")
    await uniswapV2Router02.connect(signer[0]).addLiquidity(tokenA.target,tokenC.target,approval_A,approval_C,1,1,signer[0].address,1726775237)
    
    // swapExactTokensForTokensSupportingFeeOnTransferTokens(
    //     uint amountIn,
    //     uint amountOutMin,
    //     address[] calldata path,
    //     address to,
    //     uint deadline
    approval_A = ethers.parseEther("100")
    await tokenA.connect(signer[0]).approve(uniswapV2Router02.target,approval_A)

    let amountIn = ethers.parseEther("100")
    let amountOutMin =ethers.parseEther("1")
    let pair= await uniswapV2Factory.connect(signer[0]).getPair(tokenA.target,tokenC.target);
    let uniswapV2PairAttach = await uniswapV2Pair.connect(signer[0]).attach(pair)
    console.log(`Check Reserve befor swap  ${await uniswapV2PairAttach.getReserves()}`)
    let liquidity = await uniswapV2PairAttach.balanceOf(signer[0])
         console.log("Check liquidity tokens : ", liquidity);
         let initialTokenA_Balance = await tokenA.balanceOf(signer[0].address)
         let initialTokenB_Balance = await tokenB.balanceOf(signer[0].address)
         console.log("Token A initial Balance After Swapping : ", initialTokenA_Balance);
         console.log("Token B initial Balance After Swapping: ", initialTokenB_Balance);
    
   
    await uniswapV2Router02.connect(signer[0]).swapExactTokensForTokensSupportingFeeOnTransferTokens(amountIn,amountOutMin,[tokenA.target,tokenC.target],signer[0].address,1726775237)
   
//    let pair= await uniswapV2Factory.connect(signer[0]).getPair(tokenA.target,tokenC.target);
  
    // let uniswapV2PairAttach = await uniswapV2Pair.connect(signer[0]).attach(pair)
    console.log(`Check Reserve after swap  ${await uniswapV2PairAttach.getReserves()}`)
     liquidity = await uniswapV2PairAttach.balanceOf(signer[0])
         console.log("Check liquidity tokens : ", liquidity);
         let finalTokenA_Balance = await tokenA.balanceOf(signer[0].address)
         let finalTokenB_Balance = await tokenB.balanceOf(signer[0].address)
         console.log("Token A Final Balance After Swapping : ", finalTokenA_Balance);
         console.log("Token B Final Balance After Swapping: ", finalTokenB_Balance);

})
it("Check swapExactETHForTokensSupportingFeeOnTransferTokens",async function(){
    let addEth = ethers.parseEther("50")

    approval_C = ethers.parseEther("100")
    await tokenC.connect(signer[0]).approve(uniswapV2Router02.target,approval_C)
    console.log("check")
    

     await uniswapV2Router02.connect(signer[0]).addLiquidityETH(tokenC.target,approval_C,1,1,signer[0].address,1726775237,{value:addEth})

     let pair= await uniswapV2Factory.connect(signer[0]).getPair(weth9.target,tokenC.target);
    let uniswapV2PairAttach = await uniswapV2Pair.connect(signer[0]).attach(pair)
    console.log(`Check Reserve befor swap  ${await uniswapV2PairAttach.getReserves()}`)
    let liquidity = await uniswapV2PairAttach.balanceOf(signer[0])
         console.log("Check liquidity tokens : ", liquidity);
         let initialweth9_Balance = await weth9.balanceOf(signer[0].address)
         let initialTokenC_Balance = await tokenC.balanceOf(signer[0].address)
         console.log("weth9 initial Balance After Swapping : ", initialweth9_Balance);
         console.log("Token c initial Balance After Swapping: ",initialTokenC_Balance);
    //  swapExactETHForTokensSupportingFeeOnTransferTokens(
    //     uint amountOutMin,
    //     address[] calldata path,
    //     address to,
    //     uint deadline
   
    let amountOutMin = ethers.parseEther("1")

    await uniswapV2Router02.connect(signer[0]).swapExactETHForTokensSupportingFeeOnTransferTokens(amountOutMin,[weth9.target,tokenC.target],signer[0].address,1726775237,{value:addEth})

    //  let pair= await uniswapV2Factory.connect(signer[0]).getPair(weth9.target,tokenC.target);
  
    //  let uniswapV2PairAttach = await uniswapV2Pair.connect(signer[0]).attach(pair)
    console.log(`Check Reserve after swap  ${await uniswapV2PairAttach.getReserves()}`)
         let finalweth9_Balance = await weth9.balanceOf(signer[0].address)
         let finalTokenC_Balance = await tokenC.balanceOf(signer[0].address)
         console.log("weth9 Final Balance After Swapping : ", finalweth9_Balance);
         console.log("Token c Final Balance After Swapping: ", finalTokenC_Balance);

})
it("Check swapExactTokensForTokensSupportingFeeOnTransferTokens", async function(){
    approval_A = ethers.parseEther("100")
    await tokenA.connect(signer[0]).approve(uniswapV2Router02.target,approval_A)

    approval_C = ethers.parseEther("100")
    await tokenC.connect(signer[0]).approve(uniswapV2Router02.target,approval_C)

    await uniswapV2Router02.connect(signer[0]).addLiquidity(tokenA.target,tokenC.target,approval_A,approval_C,1,1,signer[0].address,1726775237)

    let pair= await uniswapV2Factory.connect(signer[0]).getPair(tokenA.target,tokenC.target);
    let uniswapV2PairAttach = await uniswapV2Pair.connect(signer[0]).attach(pair)
    console.log(`Check Reserve befor swap  ${await uniswapV2PairAttach.getReserves()}`)
    let liquidity = await uniswapV2PairAttach.balanceOf(signer[0])
         console.log("Check liquidity tokens : ", liquidity);
         let initialTokenA_Balance = await tokenA.balanceOf(signer[0].address)
         let initialTokenC_Balance = await tokenC.balanceOf(signer[0].address)
         console.log("Token A initial Balance After Swapping : ", initialTokenA_Balance);
         console.log("Token C initial Balance After Swapping: ", initialTokenC_Balance);

    // swapExactTokensForTokensSupportingFeeOnTransferTokens(
    //     uint amountIn,
    //     uint amountOutMin,
    //     address[] calldata path,
    //     address to,
    //     uint deadline
    await tokenA.connect(signer[0]).approve(uniswapV2Router02.target,approval_A)
    let amountIn = ethers.parseEther("100")
    let amountOutMin = ethers.parseEther("1")
    await uniswapV2Router02.connect(signer[0]).swapExactTokensForTokensSupportingFeeOnTransferTokens(amountIn,amountOutMin,[tokenA.target,tokenC.target],signer[0].address,1726775237)
    
   // let pair= await uniswapV2Factory.connect(signer[0]).getPair(tokenA.target,tokenC.target);
   // let uniswapV2PairAttach = await uniswapV2Pair.connect(signer[0]).attach(pair)
   console.log(`Check Reserve after swap  ${await uniswapV2PairAttach.getReserves()}`)
   liquidity = await uniswapV2PairAttach.balanceOf(signer[0])
       console.log("Check liquidity tokens : ", liquidity);
       let finalweth9_Balance = await weth9.balanceOf(signer[0].address)
       let finalTokenC_Balance = await tokenC.balanceOf(signer[0].address)
       console.log("weth9 Final Balance After Swapping : ", finalweth9_Balance);
       console.log("Token c Final Balance After Swapping: ", finalTokenC_Balance);

})
it("Check swapExactTokensForETHSupportingFeeOnTransferTokens ", async function(){
    approval_C = ethers.parseEther("100")
    await tokenC.connect(signer[0]).approve(uniswapV2Router02.target,approval_C)

    let addEth = ethers.parseEther("50")

    await uniswapV2Router02.addLiquidityETH(tokenC.target,approval_C,1,1,signer[0].address,1726775237,{value:addEth})

    let pair= await uniswapV2Factory.connect(signer[0]).getPair(tokenC.target,weth9.target);
    let uniswapV2PairAttach = await uniswapV2Pair.connect(signer[0]).attach(pair)
    console.log(`Check Reserve befor swap  ${await uniswapV2PairAttach.getReserves()}`)
    let liquidity = await uniswapV2PairAttach.balanceOf(signer[0])
         console.log("Check liquidity tokens : ", liquidity);
         let initialweth9_Balance = await tokenA.balanceOf(signer[0].address)
         let initialTokenC_Balance = await tokenC.balanceOf(signer[0].address)
         console.log("weth9 initial Balance After Swapping: ", initialTokenC_Balance);
         console.log("Token C initial Balance After Swapping: ", initialweth9_Balance);

//     swapExactTokensForETHSupportingFeeOnTransferTokens(
//         uint amountIn,
//         uint amountOutMin,
//         address[] calldata path,
//         address to,
//         uint deadline
    approval_C = ethers.parseEther("100")
    await tokenC.connect(signer[0]).approve(uniswapV2Router02.target,approval_C)
    let amountIn = ethers.parseEther("100")
     let amountOutMin = ethers.parseEther("1")
    await uniswapV2Router02.connect(signer[0]).swapExactTokensForETHSupportingFeeOnTransferTokens(amountIn,amountOutMin,[tokenC.target,weth9.target],signer[0].address,1726775237)

    console.log(`Check Reserve after swap  ${await uniswapV2PairAttach.getReserves()}`)
    liquidity = await uniswapV2PairAttach.balanceOf(signer[0])
        console.log("Check liquidity tokens : ", liquidity);
        let finalweth9_Balance = await weth9.balanceOf(signer[0].address)
        let finalTokenC_Balance = await tokenC.balanceOf(signer[0].address)
        console.log("weth9 Final Balance After Swapping : ", finalweth9_Balance);
        console.log("Token c Final Balance After Swapping: ", finalTokenC_Balance);
 })
 it.only("Check removeLiquidityETHSupportingFeeOnTransferTokens", async function(){

    approval_C = ethers.parseEther("100")
    await tokenC.connect(signer[0]).approve(uniswapV2Router02.target,approval_C)
    let addEth = ethers.parseEther("100")
    await uniswapV2Router02.connect(signer[0]).addLiquidityETH(tokenC.target,approval_C,1,1,signer[0].address,1726775237,{value:addEth})
    let pair = await uniswapV2Factory.getPair(tokenC.target,weth9.target)
    console.log("Pair Address : ", pair)

    let uniswapV2PairAttach = await uniswapV2Pair.connect(signer[0]).attach(pair)
    console.log("Check Reserve After addLiquidityEth", await uniswapV2PairAttach.getReserves())
    let liquidity = await uniswapV2PairAttach.balanceOf(signer[0])
    console.log("Check liquidity", liquidity)

    // removeLiquidityETHSupportingFeeOnTransferTokens(
    //     address token,
    //     uint liquidity,
    //     uint amountTokenMin,
    //     uint amountETHMin,
    //     address to,
    //     uint deadline
    await uniswapV2PairAttach.connect(signer[0]).approve(uniswapV2Router02.target,liquidity)
    approval_C = ethers.parseEther("100")
    await tokenC.connect(signer[0]).approve(uniswapV2Router02.target,approval_C)
    let amountTokenMin = ethers.parseEther("1")
    let amountETHMin =ethers.parseEther("1")
    await uniswapV2Router02.connect(signer[0]).removeLiquidityETHSupportingFeeOnTransferTokens(tokenC.target,liquidity,amountTokenMin,amountETHMin,signer[0].address,1726775237)
   
 })

})


























    //    let approval_A= ethers.parseEther("100");
    //  await tokenA.connect(signer[0]).approve(uniswapV2ROuter02.target, approval_A )

    //  let approval_B = ethers.parseEther("200")
    //     await tokenB.connect(signer[0]).approve(uniswapV2ROuter02.target, approval_B)

    //     await uniswapV2ROuter02.addLiquidity(tokenA.target,tokenB.target,approval_A,approval_B,1,1,signer[0].address,1726775237)
    //     let pair = await uniswapV2Factory.getPair(tokenA.target,tokenB.target)
    //     console.log("Pair Address : ", pair );
    //     let uniswapV2PairAttach = await uniswapV2Pair.connect(signer[0]).attach(pair);

    //    console.log("Check Reserve After addLiquidity : ",await uniswapV2PairAttach.getReserves()) 

    //    let liquidity =await uniswapV2PairAttach.balanceOf(signer[0].address);
    //    console.log("Check Liquidity ", liquidity);


   



// const {expect} = require("chai")
// const {ethers} = require("hardhat")

// describe("Token Contract", async function(){
//     let tokenA;
//     let tokenB;
//     let signer;
//     let weth;
//     let uniswapV2Factory

// beforeEach(async function(){
//     signer = await ethers.getSigners()
//     const TokenA = await ethers.getContractFactory("TokenA");
//     tokenA = await TokenA.connect(signer[0]).deploy();
//     console.log("contract address", tokenA.target)
//     const TokenB = await  ethers.getContractFactory("TokenB");
//     tokenB = await TokenB.connect(signer[0]).deploy()
    
//     const WETH9 = await ethers.getContractFactory("WETH9");
//     weth = await WETH9.connect(signer[0]).deploy()

//     const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory")
//     uniswapV2Factory= await UniswapV2Factory.connect(signer[0]).deploy()

    
   
//    })
//    describe("Contract Address ", async function(){
//     it ("Deployment Of Contract", async function(){
//         console.log("contract address", tokenA.target)
//     } )
// })
// })
