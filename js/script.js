"use strict";

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2023-07-11T23:36:17.929Z",
    "2023-11-18T21:31:17.178Z",
    "2023-12-23T07:42:02.383Z",
    "2023-03-08T14:11:59.604Z",
    "2023-03-12T10:51:36.790Z",
    "2024-02-12T17:01:17.194Z",
    "2024-02-13T10:17:24.185Z",
    "2024-02-14T09:15:04.904Z",
  ],
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2023-04-25T18:49:59.371Z",
    "2023-11-01T13:15:33.035Z",
    "2023-11-30T09:48:16.867Z",
    "2023-12-25T06:04:23.907Z",
    "2023-02-26T12:01:20.894Z",
    "2024-02-10T14:43:26.374Z",
    "2024-02-11T14:18:46.235Z",
    "2024-02-12T16:33:06.386Z",
  ],
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2023-01-28T09:15:04.904Z",
    "2023-04-01T10:17:24.185Z",
    "2023-05-27T17:01:17.194Z",
    "2023-07-11T23:36:17.929Z",
    "2023-11-18T21:31:17.178Z",
    "2023-12-23T07:42:02.383Z",
    "2023-03-08T14:11:59.604Z",
    "2023-03-12T10:51:36.790Z",
  ],
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2023-01-25T14:18:46.235Z",
    "2023-02-05T16:33:06.386Z",
    "2023-03-10T14:43:26.374Z",
    "2023-04-25T18:49:59.371Z",
    "2023-11-01T13:15:33.035Z",
  ],
};

const accounts = [account1, account2, account3, account4];

const transactionContainer = document.querySelector(".transcation"),
  loginBtn = document.querySelector(".user-login button"),
  inputUserName = document.querySelector(".user-name"),
  inputUserPin = document.querySelector(".user-pin"),
  info = document.querySelector(".info"),
  totalAmounts = document.querySelector(".balance"),
  accountDetails = document.querySelector(".acc-details"),
  dateAndTime = document.querySelector(".date-time span"),
  labelCashIn = document.querySelector(".cash-in span"),
  labelCashOut = document.querySelector(".cash-out span"),
  labelInterest = document.querySelector(".cash-interest span"),
  transferBtn = document.querySelector(".opration-transfer button"),
  recieverInput = document.getElementById("transfer"),
  inputTransferAmount = document.getElementById("transfer-money"),
  inputLoanAmount = document.getElementById("loan-amount"),
  requestLoanBtn = document.querySelector(".opration-loan button"),
  closeUSerName = document.getElementById("user"),
  closeUserPin = document.getElementById("pin"),
  closeBtn = document.querySelector(".close-account button"),
  sortBtn = document.querySelector(".summary button"),
  labelLogout = document.querySelector(".logout-timer span");

console.log(labelLogout, sortBtn);

//displayTotalAmount
const displayTotalAmount = function (accounts) {
  accounts.balance = accounts.movements.reduce(
    (acc, amount) => acc + amount,
    0
  );

  totalAmounts.textContent = `${accounts.balance}€`;
};

//calc days passed
const formatedDays = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round((date1 - date2) / (1000 * 60 * 60 * 24));

  const dayPassed = calcDaysPassed(new Date(), date);

  if (dayPassed === 0) return "Today";
  if (dayPassed === 1) return "Yesterday";
  if (dayPassed <= 7) return `${dayPassed} days ago`;

  return Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

//diplayTransactions
const diplayTransaction = function (acc, sort = false) {
  transactionContainer.innerHTML = "";

  const amnts = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  amnts.forEach((amount, i) => {
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatedDays(date);
    let type = amount > 0 ? "deposite" : "withdraw";
    const html = ` <div class="transcation-row">
                     <div class="${type}">${i + 1} ${type}</div>
                     <div class="transcation-date">${displayDate}</div>
                     <div class="transcation-value">${amount}</div>
                  </div>`;

    transactionContainer.insertAdjacentHTML("afterbegin", html);
  });
};

//summary
const transcationHistory = function (account) {
  const cashIn = account.movements
    .filter((transaction) => transaction > 0)
    .reduce((acc, transaction) => acc + transaction, 0);
  labelCashIn.textContent = `${cashIn}€`;

  const cashOut = account.movements
    .filter((transaction) => transaction < 0)
    .reduce((acc, transaction) => acc + transaction, 0);
  labelCashOut.textContent = `${Math.abs(cashOut)}€`;

  const totalInterest = account.movements
    .filter((transaction) => transaction > 0)
    .map((deposite) => (deposite * account.interestRate) / 100)
    .filter((interest) => interest > 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelInterest.textContent = `${Math.abs(totalInterest)}€`;
};

//making userName
const makeUserName = function (accounts) {
  accounts.forEach((acc) => {
    const userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => {
        return name[0];
      })
      .join("");
    acc.userName = userName;
  });
};
makeUserName(accounts);

//update transaction
const updateTransaction = function (acc) {
  displayTotalAmount(acc);
  diplayTransaction(acc);
  transcationHistory(acc);
};

//setting timer logout
let timer;
const logoutTimer = function () {
  let time = 600;
  const immediateTimer = function () {
    const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String(time % 60).padStart(2, 0);

    //display timer
    labelLogout.textContent = `${minutes}:${seconds}`;

    //when the timer reaches to zero, log out the user
    if (time === 0) {
      clearInterval(timer);
      accountDetails.style.opacity = 0;
      info.textContent = `Login to get started`;
    }
    time--;
  };
  immediateTimer();
  timer = setInterval(immediateTimer, 1000);
  return timer;
};

//userLogin
let currentAccount;

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();

  currentAccount = accounts.find((acc) => acc.userName === inputUserName.value);

  if (currentAccount?.pin === +inputUserPin.value) {
    accountDetails.style.opacity = 100;
    //getting date and time
    const currentDate = new Date();
    const time = `${currentDate.getHours()}`.padStart(2, 0);
    if (time >= 6 && time <= 12) {
      info.textContent = `Good Morning ${currentAccount.owner.split(" ")[0]},`;
    } else if (time > 12 && time < 18) {
      info.textContent = `Good Afternoon ${
        currentAccount.owner.split(" ")[0]
      },`;
    } else {
      info.textContent = `Good Evening ${currentAccount.owner.split(" ")[0]},`;
    }

    dateAndTime.textContent = Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(currentDate);

    updateTransaction(currentAccount);

    logoutTimer();
  }
  inputUserName.value = inputUserPin.value = "";
});

//transfer Money
transferBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = Math.floor(inputTransferAmount.value);
  const recieverAccount = accounts.find(
    (account) => account.userName === recieverInput.value
  );

  if (
    amount > 0 &&
    recieverAccount &&
    currentAccount?.balance >= amount &&
    recieverAccount?.userName !== currentAccount?.userName
  ) {
    recieverAccount.movements.push(amount);
    currentAccount.movements.push(-amount);

    //update current date
    currentAccount.movementsDates.push(new Date());
    recieverAccount.movementsDates.push(new Date());
    updateTransaction(currentAccount);

    //reset the timer
    clearInterval(timer);
    timer = logoutTimer();
  }
  inputTransferAmount.value = recieverInput.value = "";
});

//reqest loan
requestLoanBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((movement) => movement > amount * 0.1)
  ) {
    currentAccount.movements.push(amount);

    //update current date
    currentAccount.movementsDates.push(new Date());
    updateTransaction(currentAccount);

    //reset the timer
    clearInterval(timer);
    timer = logoutTimer();
  }
});

//close account
closeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    closeUSerName.value === currentAccount.userName &&
    +closeUserPin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (account) => account.userName === currentAccount.userName
    );
    accounts.splice(index, 1);
    accountDetails.style.opacity = 0;
    info.textContent = `Login to get started`;
  }
});

//sorting
let sorted = false;
sortBtn.addEventListener("click", (e) => {
  diplayTransaction(currentAccount, !sorted);
  sorted = !sorted;
});
