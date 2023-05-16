const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-Btn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength color to grey
setIndicator("#ccc");

// set passwordLength
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;

  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

// changing indicator color
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  // shadow
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// generating random output
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// get number
function generateRandomNumber() {
  return getRndInteger(0, 9);
}

// get lowercase
function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

// get uppercase
function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

// get symbols
function generateSymbol() {
  const randomNumber = getRndInteger(0, symbols.length);
  return symbols.charAt(randomNumber);
}

// checking strength of the password and setting rules and color of strength indicator
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

// copy button
async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  // to make copy  span visible
  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

// shuffle the generated password
function shufflePassword(array) {
  // fisher yates method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

// change in check box
function handleCheckCoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });
  // special rule
  // if (passwordLength < checkCount) {
  //   passwordLength = checkCount;
  //   handleSlider();
  // }
}

// listener on check box
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckCoxChange);
});

// slider number change
inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

// copy button if password is not generated then copy button will not work
copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

// generate button
generateBtn.addEventListener("click", () => {
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // let's start the journey to find new password
  console.log("starting the journey");
  // remove old password
  password = "";

  // checkbox items
  // if(uppercaseCheck.checked){
  //   password += generateUpperCase();
  // }
  // if(lowercaseCheck.checked){
  //   password += generateLowerCase();
  // }
  // if(numbersCheck.checked){
  //   password += generateRandomNumber();
  // }
  // if(symbolsCheck.checked){
  //   password += generateSymbol();
  // }

  let funArr = [];
  if (uppercaseCheck.checked) funArr.push(generateUpperCase);

  if (lowercaseCheck.checked) funArr.push(generateLowerCase);

  if (numbersCheck.checked) funArr.push(generateRandomNumber);

  if (symbolsCheck.checked) funArr.push(generateSymbol);

  // compulsory addition
  for (let i = 0; i < funArr.length; i++) {
    password += funArr[i]();
  }
  console.log("compulsory addition done");

  // remaining addition
  for (let i = 0; i < passwordLength - funArr.length; i++) {
    let RandIndex = getRndInteger(0, funArr.length);
    password += funArr[RandIndex]();
  }
  console.log("remaining addition done");

  // shuffle the password
  password = shufflePassword(Array.from(password));
  console.log("shuffling done");

  // show in UI
  passwordDisplay.value = password;
  console.log("UI addition done");

  // calculate strength
  calcStrength();
});
