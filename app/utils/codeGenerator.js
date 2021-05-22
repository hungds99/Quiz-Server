const CodeGenerator = {
  generatePin: () => {
    let min = 0;
    let max = 999999;
    return ("0" + (Math.floor(Math.random() * (max - min + 1)) + min)).substr(
      -6
    );
  },
};

module.exports = CodeGenerator;
