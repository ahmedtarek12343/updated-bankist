'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [
    { amount: 200 },
    { amount: 450 },
    { amount: -400 },
    { amount: 3000 },
    { amount: -650 },
    { amount: -130 },
    { amount: 70 },
    { amount: 1300 },
  ],
  locale: 'fr-FR',
  currency: 'EUR',
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [
    { amount: 5000 },
    { amount: 3400 },
    { amount: -150 },
    { amount: -790 },
    { amount: -3210 },
    { amount: -1000 },
    { amount: 8500 },
    { amount: -30 },
  ],
  locale: 'en-US',
  currency: 'USD',
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [
    { amount: 200 },
    { amount: -200 },
    { amount: 340 },
    { amount: -300 },
    { amount: -20 },
    { amount: 50 },
    { amount: 400 },
    { amount: -460 },
  ],
  locale: 'pt-PT',
  currency: 'EUR',
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [
    { amount: 430 },
    { amount: 1000 },
    { amount: 700 },
    { amount: 50 },
    { amount: 90 },
  ],
  interestRate: 1,
  locale: 'en-US',
  currency: 'USD',
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const body = document.querySelector('body');
const signUpForm = document.querySelector('.signUp__form-wrapper');
const clostBtn = document.querySelector('.ri-close-large-line');
const loginForm = document.querySelector('#loginForm');
const logoutBtn = document.querySelector('.logout__btn');
const welcomeBtn = document.querySelector('.welcome-link');
const welcomePage = document.querySelector('.welcome-section');
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const movValue = document.querySelector('.movements__value');
const newFullname = document.querySelector('#full_name');
const newPin = document.querySelector('#pin');
const newinterestRate = document.querySelector('#interestRate');
const newMovements = document.querySelector('#signupMovements');
const logo = document.querySelector('.logo');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnSignup = document.querySelector('.signUp__btn');
const closeLogin = document.querySelector('.close-login');

const inputLocale = document.getElementById('loc');
const inputCurrency = document.getElementById('cur');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const gradient = document.querySelector(
  '.custom-shape-divider-bottom-1751910423'
);

const startLogOutTimer = function () {
  const tick = function () {
    //in each call, print the remaining time
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      logOut();
    }
    time--;
  };
  // Set time to 5 minutes
  let time = 120;

  tick();
  //call the timer every second
  const timer = setInterval(tick, 1000);
  return timer;
  //when 0 second, log the user out
};

// Event Handler
let currentAccount, timer;

let arr = [0, 1, 2, 2, 3, 0, 4, 2];
arr = [...new Set(arr)];
console.log(arr, arr.length);

const displayMovements = function (movements, sort = false) {
  console.log(accounts);

  const movs = sort
    ? movements
        .toSorted((a, b) => a.amount - b.amount)
        .map(m => {
          return {
            amount: m.amount,
            from: m.from || undefined,
            to: m.to || undefined,
          };
        })
    : movements;

  const newMov = movements
    .toSorted((a, b) => a.amount - b.amount)
    .map(m => {
      return {
        amount: m,
        from: m.from || undefined,
        to: m.to || undefined,
      };
    });
  console.log(newMov);

  containerMovements.innerHTML = '';
  movs.forEach(function (mov, i) {
    const type = mov.amount > 0 ? 'deposit' : 'withdrawal';
    const toFrom = mov.from
      ? `From: ${mov.from}`
      : mov.to
      ? `To: ${mov.to}`
      : '';

    const diffCur = mov.diffCurrency || 0;

    const formattedMov = new Intl.NumberFormat(currentAccount.locale, {
      style: 'currency',
      currency: diffCur || currentAccount.currency,
    }).format(mov.amount);

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type} </div><span class="movements__toFrom">${toFrom}</span>
          <div class="movements__value">${formattedMov} </div>
          </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov.amount, 0);
  labelBalance.textContent = `${new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(acc.balance)}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov.amount > 0)
    .reduce((acc, mov) => acc + mov.amount, 0);

  labelSumIn.textContent = `${new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(incomes)}`;

  const outcomes = acc.movements
    .filter(mov => mov.amount < 0)
    .reduce((acc, mov) => acc + Math.abs(mov.amount), 0);

  labelSumOut.textContent = `${new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(outcomes)}`;

  const interest = acc.movements
    .filter(mov => mov.amount > 0)
    .map(deposit => (deposit.amount * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(interest)}`;
};

const createUsernames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  //Display Movements
  displayMovements(acc.movements);

  //Display Balance
  calcDisplayBalance(acc);

  //Display income/outcome/interest
  calcDisplaySummary(acc);
};

const logOut = function () {
  welcomePage.style.opacity = 1;
  welcomePage.style.display = 'flex';
  containerApp.style.opacity = 0;
  containerApp.style.visibility = 'hidden';
  containerApp.style.transform = 'translateY(100px)';
  loginForm.style.display = 'flex';
  logoutBtn.style.display = 'none';
  labelWelcome.textContent = `Login to continue`;
  gradient.style.display = 'block';
  loginForm.classList.remove('show-login');
  body.style.overflow = 'hidden';
};

//API

btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    welcomePage.style.opacity = 0;
    welcomePage.style.display = 'none';
    containerApp.style.opacity = 1;
    containerApp.style.visibility = 'visible';
    containerApp.style.transform = 'translateY(0)';
    labelWelcome.textContent = `Hello, ${currentAccount.owner.split(' ')[0]}`;
    loginForm.style.display = 'none';
    logoutBtn.style.display = 'block';
    gradient.style.display = 'none';
    body.style.overflow = 'scroll';
    //clear fields
    inputLoginUsername.value = inputLoginPin.value = '';
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  } else {
    alert('Wrong email or password, Please try again!');
    inputLoginUsername.value = inputLoginPin.value = '';
  }
});

logoutBtn.addEventListener('click', logOut);

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    accounts.includes(receiverAcc) &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Doing the transfer
    currentAccount.movements.push({
      amount: -amount,
      to: receiverAcc.owner,
    });
    receiverAcc.movements.push({
      amount: amount,
      from: currentAccount.owner,
      diffCurrency: currentAccount.currency,
    });

    //update UI
    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  } else {
    alert(
      'check the name and the balance, it must be lower than you Current Balance'
    );
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.pin === Number(inputClosePin.value) &&
    inputCloseUsername.value === currentAccount.username
  ) {
    accounts.splice(
      accounts.findIndex(acc => acc === currentAccount),
      1
    );
    console.log(accounts);
    logOut();
  } else {
    alert('Wrong pin or username, please try again!');
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);
  console.log(loanAmount);
  console.log(
    currentAccount.movements.some(mov => mov.amount >= loanAmount * 0.1)
  );

  if (isNaN(currentAccount.loans) || currentAccount.loans === undefined) {
    currentAccount.loans = 0;
  }

  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov.amount >= loanAmount * 0.1)
  ) {
    setTimeout(function () {
      currentAccount.movements.push({
        amount: loanAmount,
        from: 'National Bank ',
      });
      if (currentAccount.loans + loanAmount > 30000) {
        alert('You have reached maximum loans (+30000)');
        inputLoanAmount.value = '';
        return;
      } else currentAccount.loans += loanAmount;

      clearInterval(timer);
      timer = startLogOutTimer();
      updateUI(currentAccount);
    }, 2500);
  } else {
    alert('Loan requirements arent met');
    inputLoanAmount.value = '';
    return;
  }

  inputLoanAmount.value = '';
});

welcomeBtn.addEventListener('click', function (e) {
  e.preventDefault();

  signUpForm.classList.add('show');
});

clostBtn.addEventListener('click', function () {
  signUpForm.classList.remove('show');
  newFullname.value =
    newPin.value =
    newinterestRate.value =
    newMovements.value =
      '';
});

btnSignup.addEventListener('click', function () {
  const Exists = accounts.some(
    acc => acc.owner === newFullname.value && acc.pin === Number(newPin.value)
  );

  if (Exists) {
    alert('Account already exists, Please log-in');
    newFullname.value =
      newPin.value =
      newinterestRate.value =
      newMovements.value =
        '';
    return;
  }

  const newMov = newMovements.value.split('\n').map(mov => {
    return { amount: Number(mov) };
  });

  if (newMov.length < 3) {
    alert('Please enter more elements');
    return;
  }
  accounts.push({
    owner: newFullname.value,
    pin: Number(newPin.value),
    interestRate: Number(newinterestRate.value),
    movements: newMov,
    locale: inputLocale.value,
    currency: inputCurrency.value,
  });

  if (
    newFullname.value &&
    newPin.value &&
    newinterestRate.value &&
    newMovements.value
  ) {
    createUsernames(accounts);
    alert(
      `Account Created! Please Log-in\nUserName: ${
        accounts.at(-1).username
      }\nPin: ${accounts.at(-1).pin}`
    );
    newFullname.value =
      newPin.value =
      newinterestRate.value =
      newMovements.value =
        '';
  }

  signUpForm.classList.remove('show');
});

logo.addEventListener('click', function () {
  loginForm.classList.add('show-login');
});

closeLogin.addEventListener('click', function () {
  loginForm.classList.remove('show-login');
});

let sortedState = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sortedState);
  sortedState = !sortedState;
});
