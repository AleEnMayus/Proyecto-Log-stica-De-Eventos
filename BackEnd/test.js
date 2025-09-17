const bcrypt = require("bcrypt");

(async () => {
  const hash = "$2b$10$5T4ZWBSEEG9LTAakSLEizuLysHaoKZ.pnbHYKh1kcoHEDfU6eEj.C";
  const plain = "miSecreta1234"; // lo mismo que mandaste en Postman
  const match = await bcrypt.compare(plain, hash);
  console.log("Result:", match);
})();
