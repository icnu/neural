import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TokenModule", (m) => {
  const token = m.contract("Token");
  m.call(token, 'mint', ['0x970DAFAC3e3538A0Ace890c9F8093F2278E35253', BigInt(100000000)]);
  return { token };
});
