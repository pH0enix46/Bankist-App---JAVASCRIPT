"use strict";

// Data
// Amra ekhane map na use kore obj use orlam karon real life e all the data is coming from WEB API, whenever we get data from API, the data usually comes in the form of objects
const account1 = {
  owner: "MD JOY",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2022-11-18T21:31:17.178Z",
    "2022-12-23T07:42:02.383Z",
    "2023-01-28T09:15:04.904Z",
    "2023-04-01T10:17:24.185Z",
    "2023-05-08T14:11:59.604Z",
    "2023-07-26T17:01:17.194Z",
    "2024-04-25T23:36:17.929Z",
    "2024-05-01T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account2 = {
  owner: "ABDUR RAHIM",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2022-11-01T13:15:33.035Z",
    "2022-11-30T09:48:16.867Z",
    "2022-12-25T06:04:23.907Z",
    "2023-01-25T14:18:46.235Z",
    "2023-02-05T16:33:06.386Z",
    "2023-09-10T14:43:26.374Z",
    "2023-12-25T18:49:59.371Z",
    "2024-03-26T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const accounts = [account1, account2]; // accounts array containing all these objects in here
// console.log(accounts);

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/*
ekta kotha valo kore mone rakhte hobe amra function muloto use korai jate sobar jonno eksathe ekta logic e kaj kora jay✅✅✅
*/

let currentAccount, timer; // globally use korar jonno

// For movementsDates function✅✅✅
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 24 * 60));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0); // 0 based ejonno + 1 kore dilam
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;

    return new Intl.DateTimeFormat(locale).format(date);
  }
  // else if use koreu kora jay but else if na use kore evabe korle valo readability paua jay
};
// ⛔⛔⛔

// formatting the currencies function✅✅✅
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};
// ⛔⛔⛔

// movements gulo k display te boshalam✅✅✅
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ""; // innerHTML property er kaj holo get/set kora, ekhane empty set korlam. jate surute je text gulo chilo jegulo jeno empty hoy

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements; // sort orginal k mutate kore dey tai slice method er maddhome ekta shallow copy kore nilam, by default sort = false mane starting e unsort hoye asbe
  // console.log(movs);

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
    // insertAdjacentHTML is a method/function in JavaScript that allows you to insert HTML elements or text into the DOM at a specified position relative to an element(containerMovements). jar 1st arguments holo position (4 type of position: "beforebegin" "afterbegin" "beforeend" "afterend"). position type valo kore bojhar jonno MDN e jai. ar 2nd arguments holo where the HTML content will be inserted based on the position(1st arguments)
  });
};
// console.log(containerMovements.innerHTML);
// ⛔⛔⛔

// User name create korlam✅✅✅
// const user = "MD JOY"; // mj
// console.log(user.toLowerCase().split(" "));
// const userName = user
//   .toLowerCase()
//   .split(" ")
//   .map((name) => name[0])
//   .join("");
// console.log(userName); // mj (just think easy😸)
const createUsernames = function (accs) {
  // amader to new array lagbe na just modify korbo, so forEach use korbo
  accs.forEach(function (acc) {
    // create new property userName (ekhane userName create hobe owner er upor base kore)
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);
// console.log(accounts);
// ⛔⛔⛔

// total balance k display korlam✅✅✅
const calcDisplayBalance = function (acc) {
  // ekhane ekta jinis kheal kori accounts theke asse currentAccount then ekhane ese holo acc mane era sobai same but kajer porisor alada, they're pointing to the same place in the heap/memory
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0); // new property create korlam

  const formattedMov = formatCur(acc.balance, acc.locale, acc.currency);
  labelBalance.textContent = formattedMov;
  // console.log(acc);
};
// ⛔⛔⛔

// it's for summary display✅✅✅
const calcDisplaySummary = function (acc) {
  // based on DEPOSIT
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  // based on WITHDRAWAL
  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  // interestRate is based on deposit
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => deposit * (acc.interestRate / 100))
    .filter((interest, i, arr) => {
      // console.log(arr);
      return interest >= 1;
    })
    .reduce((acc, interest) => acc + interest, 0);

  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};
// ⛔⛔⛔

// for UPDATE✅✅✅
const updateUI = function (acc) {
  // Display movements🟢
  displayMovements(acc);

  // Display balance🟢
  calcDisplayBalance(acc);

  // Display summary🟢
  calcDisplaySummary(acc);
};
// ⛔⛔⛔

// log out timer function(for inactivity)✅✅✅
const startLogOutTimer = function () {
  // Set time to 5 minutes
  let time = 300;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--; // mane 1 seconds kore komte thakbe
  };
  // Call the timer every second
  tick(); // tick() immediately call kore dilam UI te ta show korbe
  const timer = setInterval(tick, 1000); // then tar 1sec pore tick function abar call hobe evabe cholte thakbe (we're passing a reference to the tick function, not call the function)
  // console.log(timer); // 5 asbe eta fixed mane timer ache
  return timer; // start e value 5 then timer stop kore abar start dile value 6 evabe, its for reference jate kore pore onno kono jaygay clear kora jay then abar start diya jay

  // // bad solve:
  // let time = 100;
  // // Call the timer every seconds
  // const timer = setInterval(function () {
  //   const min = String(Math.trunc(time / 60)).padStart(2, 0); // 1
  //   const sec = String(time % 60).padStart(2, 0); // 40
  //   // In each call, print the remaining time to UI
  //   labelTimer.textContent = `${min}:${sec}`;

  //   // When 0 seconds, stop timer and log out user
  //   if (time === 0) {
  //     clearInterval(timer);
  //     labelWelcome.textContent = "Log in to get started";
  //     containerApp.style.opacity = 0;
  //   }

  //   // Decrease 1s
  //   time--; // mane 1 seconds kore komte thakbe
  // }, 1000); // 1 sec por function call hobe, but amader k to immediately call korte hobe
};
// ⛔⛔⛔

// for login✅✅✅
btnLogin.addEventListener("click", function (e) {
  // console.log(`login`);
  e.preventDefault(); // html e by default btn e click korle page reload hoy. preventDefault() is a method/function used to stop the default behavior of an event. now problem solved
  // arekta jinis 'user' ar 'pin' option e enter keyword press korle eta auto btn '-->' er event ghotabe

  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  ); // amra kintu agei userName name e property create korchi
  // console.log(currentAccount); // suppose user mj use korlo taile mj(MD JOY) er gota object chole asbe, so its an object now based on accounts

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display welcome message and UI🟢
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0] // ekhane currentAccount.owner.split(" ") ja return korbe tar 1st element nibo like ['MD', 'JOY'] er 0 index
    }`;
    containerApp.style.opacity = 100;

    // Current date and time(DateTimeFormat✅✅)------
    const now = new Date();
    // labelDate.textContent = new Intl.DateTimeFormat("en-US").format(now);
    // Intl object/function (Internationalization API), DateTimeFormat() method/object/function
    // new Intl.DateTimeFormat() in JavaScript is a tool for formatting dates and times based on the user's locale, making sure they're displayed in a way that's familiar and readable. format() method/function/object er kaj holo convert kora based on now variable
    const options = {
      // MDN e search kore esob fixed jinish dekhe nibo
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      // month: "long",
      // month: "2-digit",
      year: "numeric",
      weekday: "long",
    };
    // const locale = navigator.language; // navigator.language is a property jar kaj holo its retrieves the preferred language of the user's browser
    // console.log(locale);
    // labelDate.textContent = new Intl.DateTimeFormat("en-US", options).format(now);
    // labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
    //   now
    // );
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // -----------------------

    // Bad way to set date and time
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0); // padStart works with only strings
    // const month = `${now.getMonth() + 1}`.padStart(2, 0); // 0 based ejonno + 1 kore dilam
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min} ${
    //   hour < 12 ? `AM` : `PM`
    // }`;

    // clear input fields🟢
    inputLoginUsername.value = inputLoginPin.value = ""; // right to left jabe
    inputLoginPin.blur(); // blur() method/function er kaj holo its remove focus from the inputLoginPin element

    // call the log out function
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    // console.log(timer);
    //suppose A user e login korlam start e timer chilo na if kaj korbe na then porer line e timer set hobe 5, then next user B te login korle timer kintu ache js engine e so if kaj korbe timer clear hoye jabe then porer line e abar timer set hoye jabe 6
    // 5 6 7 .... egulo asole reference. jate kore kaj korte easy hoy (situation bojha jay)

    // UPDATE🟢
    updateUI(currentAccount);
  } else {
    alert(`Bro, are you drunk?😸`);
  }
});
// ⛔⛔⛔

// for transfer✅✅✅
btnTransfer.addEventListener("click", function (e) {
  // console.log(e);
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  // console.log(amount, receiverAcc);
  // Clear
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc && // receiverAcc k agei check kore nilam karon receiverAcc na thaka mane undefined r undefined.userName currentAccount.userName er soman na tar mane sotto hoye jacche eta to chai na tai agei check korlam, tai na thakle ekhan theke false hoye jabe
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    // console.log(`Transfer valid!`);
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount); // UPDATE🟢

    // Reset timer
    // console.log(timer);
    clearInterval(timer); // login jokhon chilo tokhon to timer 5 hoye gechilo but ekhon timer clear kore dilam
    timer = startLogOutTimer(); // then abar timer new kore set kore dilam ekhon timer = 6
  } else {
    alert(`hey hey, relax! Don't hurry😾`);
  }
});
// ⛔⛔⛔

// for loan(any deposit should be 10% or more of the requested loan)✅✅✅
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value); // floor er type coercion ache tai auto number hoye jabe

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
    // kono ekta movements (mov >= amount * 0.1) ei condition e true hole (currentAccount.movements.some((mov) => mov >= amount * 0.1)) ei total true hobe
  ) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 1500);
  } else {
    alert(`Sorry! it's not possible 😿`);
  }

  inputLoanAmount.value = "";
});
// ⛔⛔⛔

// for close account✅✅✅
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  // console.log(`delete!`);

  if (
    inputCloseUsername.value === currentAccount.userName &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    ); // findIndex method/function er kaj find er moto but findIndex returns the 1st index number that matches a specified condition. findIndex call the call-back function
    // console.log(index);
    accounts.splice(index, 1); // only index bad jabe. karon count 1. r count suru hoy start theke, ekhane start index
    containerApp.style.opacity = 0; // Hide UI
    labelWelcome.textContent = `Log in to get started 🔐`;
    alert(`your account has been closed⛔`);
  } else {
    alert(`Bro why?😾`);
  }

  inputCloseUsername.value = inputClosePin.value = "";
});
// ⛔⛔⛔

// for short✅✅✅
let sorted = false; // by default not sorted
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted); // here sorted = true
  sorted = !sorted; // 1st click korle sorted holo then ekhane ese to sorted ture hobe karon globally sorted false chilo, then again click korle displayMovements method er sorted false hobe(!sorted mane false hobe), then ehane ese same !sorted =!true = fasle hobe, then again click kore same vabe cholbe..... easy chinta kori😸
});
// ⛔⛔⛔

// // click the total balance✅✅✅
// // etar maddhome current user er movement k porjachalona korte parbo
// labelBalance.addEventListener("click", function () {
//   const movementsUI3 = Array.from(
//     document.querySelectorAll(".movements__value")
//   );
//   console.log(movementsUI3);

//   const movementsUI = Array.from(
//     document.querySelectorAll(".movements__value"), // array like object
//     (el) => Number(el.textContent.replace("৳", ""))
//   );
//   console.log(movementsUI);

//   // console.log(movementsUI.map((el) => Number(el.textContent.replace("৳", ""))));

//   const movementsUI2 = [...document.querySelectorAll(".movements__value")];
//   console.log(movementsUI2);

//   // Array.from() use kora better
// });
// // ⛔⛔⛔

// // click the total balance✅✅✅
// labelBalance.addEventListener("click", function () {
//   [...document.querySelectorAll(".movements__row")].forEach(function (row, i) {
//     if (i % 2 === 0) row.style.backgroundColor = `orangered`; // 0, 2, 4, 6 .....
//     if (i % 3 === 0) row.style.backgroundColor = "blue"; // 0, 3, 6, 9.....
//     // 1st if e 6 ache abar 2nd if eu 6 ache but jeta age declare korchi seta show korbe
//   });
// });

// // FAKE ALWAYS LOGGED IN---FOR TEST✅✅✅
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;
// // ⛔⛔⛔

// //  NumberFormat TEST✅✅✅
// const num = 3884764.23;
// console.log(`US: `, new Intl.NumberFormat("en-US").format(num));
// // Intl object/function (Internationalization API), NumberFormat() method/object/function
// // new Intl.NumberFormat() er kaj holo its formatting numbers according to the locale-specific formatting rules. format() method/function/object er kaj holo convert kora based on now variable
// console.log(`Germany: `, new Intl.NumberFormat("de-DE").format(num));
// console.log(`Syria: `, new Intl.NumberFormat("ar-SY").format(num));
// console.log(
//   `Local Browser ${navigator.language}: `,
//   new Intl.NumberFormat(navigator.language).format(num) // navigator.language is a property jar kaj holo its retrieves the preferred language of the user's browser
// );

// const options = {
//   // MDN e search kore esob fixed jinish dekhe nibo
//   // style: "unit",
//   // style: "percent",
//   style: "currency",
//   // unit: "mile-per-hour",
//   // unit: "celsius",
//   currency: "EUR",
//   // useGrouping: true,
// };
// console.log(
//   `Local Browser ${navigator.language}: `,
//   new Intl.NumberFormat(navigator.language, options).format(num)
// );
// console.log(`Germany: `, new Intl.NumberFormat("de-DE", options).format(num));
// Intl in JavaScript helps ensure dates and times are displayed correctly according to different languages and regions
// // ⛔⛔⛔
