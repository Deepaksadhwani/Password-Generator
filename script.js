const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generatebutton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_+{}[]\/;"<>.?,'
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider()
//defualt strength circle color to grey 
setIndicator("#ccc")

//set passLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%"
};

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
};
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

function generateRandomNumber() {
    return getRandomInt(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInt(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInt(65, 91));
}

function generateSymbol() {
    const randNum = getRandomInt(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum) || (hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && password >= 6) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

function shuffle(array) {
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

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied"
    }
    catch (e) {
        copyMsg.innerText = "Failed"
    }
    // to make copy span visible 
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active")
    }, 2000);
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    // special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange)
})

inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) {
        copyContent();
    }
})

generateBtn.addEventListener("click", () => {
    if (checkCount <= 0)
        return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    let arrayForFunction = [];

    if (uppercaseCheck.checked) {
        arrayForFunction.push(generateUpperCase);
    };

    if (lowercaseCheck.checked) {
        arrayForFunction.push(generateLowerCase);
    }
    if (numbersCheck.checked) {
        arrayForFunction.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        arrayForFunction.push(generateSymbol);
    }

    for (let i = 0; i < arrayForFunction.length; i++) {
        password += arrayForFunction[i]();
    }

    for (let i = 0; i < passwordLength - arrayForFunction.length; i++) {
        let randomIndex = getRandomInt(0, arrayForFunction.length);
        password += arrayForFunction[randomIndex]();
    }

    password = shuffle(Array.from(password));

    passwordDisplay.value = password;
    calcStrength();
}); 