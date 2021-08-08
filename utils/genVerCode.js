function genVerCode(length = 8) {
  const numbers = "0123456789";
  var code = "";
  for (let i = 0; i < length; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  //   code = parseFloat(string);
  return code;
}

module.exports = genVerCode;
