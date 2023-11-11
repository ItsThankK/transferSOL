// Import Solana web3 functinalities
const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction
} = require("@solana/web3.js");


// Making a keypair and getting the private key
// const newPair = Keypair.generate();
// console.log("Below is what you will paste into your code:\n")
// console.log(newPair.secretKey);

const DEMO_FROM_SECRET_KEY = new Uint8Array(
  // paste your secret key inside this empty array
  // then uncomment transferSol() at the bottom
  [
      97,  49, 106,  53,  22, 165,  14, 225, 234, 223, 181,
      37,   2,  21,  15, 159, 161, 104, 241,  28, 111,  67,
     223,  69, 182, 163,  80, 215,  95, 178, 209, 126,  24,
      23,  69,  20,  99,  31,   5, 143, 132,  16,   4, 204,
      13, 111,  94, 100,  77, 118,  97, 170,  23, 174,  30,
       9, 125,  34,  27,  47,  51, 100,  88, 194
  ]            
);

const transferSol = async() => {
  const connection = new Connection("http://127.0.0.1:8899", "confirmed");

  // Get Keypair from Secret Key
  var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);

  // (Optional) - Other things you can try: 
  // 1) Form array from userSecretKey
  // const from = Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
  // 2) Make a new Keypair (starts with 0 SOL)
  // const from = Keypair.generate();

  // Generate another Keypair (account we'll be sending to)
  const to = Keypair.generate();

  const walletBalanceFrom = await connection.getBalance(from.publicKey);
  console.log(`-- from Wallet balance: ${parseInt(walletBalanceFrom) / LAMPORTS_PER_SOL} SOL`);
  const walletBalanceTo = await connection.getBalance(to.publicKey);
  console.log(`-- to Wallet balance: ${parseInt(walletBalanceTo) / LAMPORTS_PER_SOL} SOL \n`);

  // Aidrop 2 SOL to Sender wallet
  console.log("Airdopping some SOL to Sender wallet!");
  const fromAirDropSignature = await connection.requestAirdrop(
      new PublicKey(from.publicKey),
      2 * LAMPORTS_PER_SOL
  );

  // Latest blockhash (unique identifer of the block) of the cluster
  let latestBlockHash = await connection.getLatestBlockhash();

  // Confirm transaction using the last valid block height (refers to its time)
  // to check for transaction expiration
  await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: fromAirDropSignature
  });

  console.log("Airdrop completed for the Sender account\n");

  // Send money from "from" wallet and into "to" wallet
  var transaction = new Transaction().add(
      SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: to.publicKey,
          lamports: LAMPORTS_PER_SOL / 100
      })
  );

  // Sign transaction
  var signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [from]
  );
  console.log('==> Signature is', signature);
  console.log("\n");

  const walletBalanceFromAfter = await connection.getBalance(from.publicKey);
  console.log(`-> from Wallet balance: ${parseInt(walletBalanceFromAfter) / LAMPORTS_PER_SOL} SOL`);
  const walletBalanceToAfter = await connection.getBalance(to.publicKey);
  console.log(`-> to Wallet balance: ${parseInt(walletBalanceToAfter) / LAMPORTS_PER_SOL} SOL \n`);
}

transferSol();