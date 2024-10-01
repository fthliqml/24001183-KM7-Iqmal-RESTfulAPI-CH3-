const fs = require("fs");
const baseUrl = "http://localhost:3000";

// using fetch to read file. It can be another way by using fs.readFile or etc
async function getJSON(fileName) {
  const response = await fetch(`${baseUrl}/data/${fileName}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  const cars = await response.json();
  return cars;
}

// write file function
function writeFile(file, content) {
  fs.writeFile(file, content, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

module.exports = {
  getJSON,
  writeFile,
};
