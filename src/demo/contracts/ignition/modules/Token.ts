import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TokenModule", (m) => {
  const token = m.contract("Token");
  m.call(token, 'mint', ['0xa262aAFeC5987ec44AcCBDB56bA17adB195a34FF', BigInt(100000000)]);
  return { token };
});
