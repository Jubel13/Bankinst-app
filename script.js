'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const mov = sort ? movements.slice().sort((a, b) => a - b) : movements; //with slice( mtehod, wecopy existing arrray, and not mutate it)
  mov.forEach(function (value, index) {
    const type = value > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements">
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
          <div class="movements__value">${value}€</div>
        </div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(function (accu, mov) {
    return accu + mov;
  }, 0);
  labelBalance.textContent = `${account.balance} €`;
};
// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (account) {
  const income = account.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (accu, mov) {
      return accu + mov;
    }, 0);
  labelSumIn.textContent = `${income}€`;

  const outcome = account.movements
    .filter(mov => mov < 0)
    .reduce((accu, mov) => accu + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((mov, i, arr) => {
      // console.log(arr);
      return mov > 1;
    })
    .reduce((accu, mov) => accu + mov, 0);

  labelSumInterest.textContent = `${interest}€`;
};

// calcDisplaySummary(account1.movements);

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserName(accounts);

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    currentAccount.balance > amount &&
    receiverAcc &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    receiverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
    inputCloseUsername.value = inputClosePin.value = '';
  }
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
// console.log(accounts);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
//SLICE => DOESN'T MUTATE ORIGINAL ARRAY

let arr = ['a', 'b', 'c', 'd', 'e'];

console.log(arr.slice(1));
console.log(arr.slice(0, -2));
console.log(arr);

//SPLICE => MUTATE ORIGINAL ARRAY

console.log(arr.splice(2, 3));
console.log(arr);

//REVERSE => mutate original array
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];

console.log(arr2.reverse());
console.log(arr2);

//CONCAT => DOESN'T MUTATE ARRAY
const letter = arr.concat(arr2);
console.log(letter);
console.log([...arr, ...arr2]);

//JOIN => join array become a string
console.log(letter.join(' - '));
*/
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposite ${movement} dollars`);
  } else {
    console.log(
      `Movement ${i + 1}: You withdraw ${Math.abs(movement)} dollars`
    );
  }
}
//in forEach method, the order of cuntion parameter in callback function is always : element of array, index, and the array himself
console.log(' ----- FOREACH -----');
movements.forEach(function (movement, index, arr) {
  if (movement > 0) {
    console.log(`Movement ${index + 1}: You deposite ${movement} dollars`);
  } else {
    console.log(
      `Movement ${index + 1}: You withdraw ${Math.abs(movement)} dollars`
    );
  }
});
*/
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key} : ${value}`);
});

const currencieUnique = new Set([
  'USD',
  'RUP',
  'EUR',
  'USD',
  'USD',
  'EUR',
  'RUP',
]);
console.log(currencieUnique);

currencieUnique.forEach(function(value, key, set){
  console.log(`${key} : ${value}`);
});

//in set, the key is the same as the value, with forEach method
*/

/*
//CODING CHALLENGE 1

const checkDogs = function (ageArr1, ageArr2) {
  const newAge1 = ageArr1.slice(1, 3);

  const dogsAge = newAge1.concat(ageArr2);
  dogsAge.forEach(function (value, index) {
    if (value >= 3) {
      console.log(
        `Dog number ${index + 1} is an adult, and is ${value} years old `
      );
    } else {
      console.log(`Dog number ${index + 1} is still a puppy`);
    }
  });
};

const julia = [3, 5, 2, 12, 7];
const kate = [4, 1, 15, 8, 3];
checkDogs(julia, kate);
*/

//MAP Method
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;
const movementsUSD = movements.map(function (mov) {
  return mov * eurToUsd;
});
console.log(movements);
console.log(movementsUSD);

const movementsToUSDfor = [];

for (const mov of movements) {
  movementsToUSDfor.push(mov * eurToUsd);
}
console.log(movementsToUSDfor);

const movementsUSDArrow = movements.map(mov => mov * eurToUsd);
console.log(movementsUSDArrow);

const movementDescription = movements.map(
  (mov, index) =>
    `Movement ${index + 1}: You ${mov > 0 ? 'deposite' : 'withdraw'} ${Math.abs(
      mov
    )} dollars`
);

console.log(movementDescription);
*/

//FILTER METHOD
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const deposit = movements.filter(function (mov) {
//   return mov > 0;
// });

// console.log(deposit);

// const depositFor = [];

// for (const mov of movements) {
//   if (mov > 0) {
//     depositFor.push(mov);
//   }
// }
// console.log(depositFor);

// const withdrawal = movements.filter(mov => mov < 0);

// console.log(withdrawal);

// //REDUCE METHOD
// //ACCUMULATOR => SNOWBALL

// const balance = movements.reduce(function (acc, curr, i, arr) {
//   console.log(`Iteration ${i} : ${acc}`);
//   return acc + curr;
// }, 0 /* this is initial accuulator */);

// console.log(balance);
// //Maximum value

// const max = movements.reduce(function (accu, current) {
//   if (accu > current) {
//     return accu;
//   } else {
//     return current;
//   }
// }, movements[0]);
// console.log(max);
/*
//CODING CHALLENGES 2

const calcAverageHumanAge = function (dogAges) {
  const humanAge = dogAges
    .map(function (age) {
      if (age <= 2) {
        return age * 2;
      } else {
        return age * 4 + 16;
      }
    })
    .filter(function (humanAge) {
      return humanAge >= 18;
    });
  console.log(humanAge);
  const average = humanAge.reduce(function (accu, value, index, arr) {
    return accu + value / arr.length;
  }, 0);
  return average;
};

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
*/
/*
//CODING CHALLENGE 3
const calcAverageHumanAge = dogAges =>
  dogAges
    .map(age => (age <= 2 ? age * 2 : age * 4 + 16))
    .filter(humanAge => humanAge >= 18)
    .reduce((accu, value, index, arr) => accu + value / arr.length, 0);

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));

/*
console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Sarah Smith');

console.log(account);

let accountFor = {};

for (const acc of accounts) {
  if (acc.owner === 'Sarah Smith') {
    accountFor = acc;
  }
}
console.log(accountFor);

*/
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

console.log(movements.includes(-130));

console.log(movements.some(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

//separate callback function

const deposit = mov => mov > 0;

console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

/*
//FLAT AND FLATMAP METHOD

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arr2 = [[[1, 2], 3], [[4, 5], 6], 7, 8];
console.log(arr2.flat(2));

const allMovements = accounts.map(acc => acc.movements);
console.log(allMovements);

const allmovementsSingleArr = allMovements.flat();
console.log(allmovementsSingleArr);

const totalBalance = allmovementsSingleArr.reduce((accu, mov) => accu + mov, 0);
console.log(totalBalance);

//chaining

const totalBalance2 = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((accu, mov) => accu + mov, 0);

console.log(totalBalance2);

const totalBalance3 = accounts
  .flatMap(acc => acc.movements)
  .reduce((accu, mov) => accu + mov, 0);
console.log(totalBalance3);
*/

/*
//Sort
//sort method sorting based on the order of string by default
const owners = ['Jonas', 'zach', 'Adam', 'Martha'];
console.log(owners.sort()); //mutate the array
console.log(owners);

//numbers
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//return < 0, A, B => keep order
//return > 0 , B, A => switch order

//ascending
movements.sort((a, b) => {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
});
console.log(movements);

//descending
// movements.sort((a, b) => {
//   if (a > b) {
//     return -1;
//   }
//   if (a < b) {
//     return 1;
//   }
// });
movements.sort((a, b) => b - a); // if a < b, b - a is positive, then switch order
console.log(movements);
*/
/*
const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));
console.log(arr);

const x = new Array(7);
console.log(x);
//fill method mutate the array

// x.fill(1);
x.map(x => 5); //not work
console.log(x);
// x.fill(1, 3, 6);
console.log(x);

arr.fill(23, 3, 6);
console.log(arr);

//Array.from() method

const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (curr, i) => i + 1);
console.log(z);

const random = Array.from({ length: 100 }, (curr, i) =>
  Math.trunc(Math.random() * 100)
);
console.log(random);

labelBalance.addEventListener('click', function () {
  const movementUi = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );

  // console.log(movementUi.map(el => el.textContent.replace('€', '')));
  console.log(movementUi);
});
*/

/*
const bankDepositSum = accounts
  .map(acc => acc.movements)
  .flat()
  .filter(mov => mov > 0)
  .reduce((accu, mov) => accu + mov);

console.log(bankDepositSum);

// const numDeposit = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 1000);

// console.log(numDeposit.length);
const numDeposit1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((accu, curr) => (curr >= 1000 ? accu + 1 : accu), 0);

console.log(numDeposit1000);

//prefixed ++ operator

let a = 10;
console.log(a++); //this one indeed increment a, but it return the original value, ++ operator must be placed infront of the variabel
console.log(a);
console.log(++a);

const sums = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (accu, curr) => {
      curr > 0 ? (accu.deposit += curr) : (accu.withdrawal += curr);
      return accu; //in curly braces, arrow fucntion needs return keywords
    },
    { deposit: 0, withdrawal: 0 }
  );

const { deposit, withdrawal } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (accu, curr) => {
      // curr > 0 ? (accu.deposit += curr) : (accu.withdrawal += curr);
      accu[curr > 0 ? 'deposit' : 'withdrawal'] += curr;
      return accu;
    },
    { deposit: 0, withdrawal: 0 }
  );
console.log(sums);
console.log(deposit, withdrawal);

const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');

  return capitalize(titleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another titel with an EXAMPLE'));
*/
//CODING CHALLENGE 4

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// console.log(
//   dogs.map((el, i, arr) => (dogs[i].recommendedFood = el.weight ** 0.75 * 28))
// );
dogs.forEach(
  dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
);
console.log(dogs);
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  dogSarah.curFood > dogSarah.recommendedFood
    ? // dogs.find(val => val.owners[0] === 'Sarah').curFood >
      //   dogs.find(val => val.owners[0] === 'Sarah').recommendedFood
      'Your dog is eating too much'
    : 'Your dog is eating too litlle'
);

// const ownersEatTooMuch = dogs.flatMap(el =>
//   el.curFood > el.recommendedFood ? el.owners : []
// );

const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);
const ownersEatTooLittle = dogs.flatMap(el =>
  el.curFood < el.recommendedFood ? el.owners : []
);
console.log(ownersEatTooLittle);
// console.log(dogs.find());

// console.log(
//   ownersEatTooMuch.reduce(
//     (accu, val, i, arr) => `${val} and ` + accu,
//     ` dogs eat too much`
//   )
// );
console.log(`${ownersEatTooMuch.join(' and ')}'s dog eat too much'}`);

console.log(
  ownersEatTooLittle.reduce(
    (accu, val, i, arr) => `${val} and ` + accu,
    ` dogs eat too little`
  )
);
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

console.log(
  dogs.some(
    dog =>
      dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood < dog.recommendedFood * 1.1
  )
);
const okay = dogs.filter(
  dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);
console.log(okay);
const sortedDogs = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(sortedDogs);
