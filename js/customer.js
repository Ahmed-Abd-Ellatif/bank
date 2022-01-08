const readDataFromStorage = () => {
  let data;
  try {
    data = JSON.parse(localStorage.getItem('customers'));
    if (!Array.isArray(data)) throw new Error("data isn't array");
  } catch (exp) {
    data = [];
  }
  return data;
};
const setDataToStorage = (myData) => {
  if (!Array.isArray(myData)) myData = [];
  myData = JSON.stringify(myData);
  localStorage.setItem('customers', myData);
};
const createMyOwnElement = (
  element,
  parent,
  classes = '',
  textContent = '',
  attributes = []
) => {
  const el = document.createElement(element);
  parent.appendChild(el);
  if (classes != '') el.classList = classes;
  if (textContent != '') el.textContent = textContent;
  attributes.forEach((attribute) => {
    el.setAttribute(attribute.attName, attribute.attrVal);
  });
  return el;
};
const customersData = readDataFromStorage();
const customersContent = document.querySelector('#addCustomer');
const contentIndex = document.querySelector('#content');
const addPalace = document.querySelector('#editCustomer');
const withdrawPalance = document.querySelector('#withdraw');

const transactions = document.querySelector('#transactions');
const userMainHeads = [
  { name: 'id', dataStore: 'value', default: 5000, isDefault: true },
  { name: 'name', dataStore: 'value', default: null, isDefault: false },
  { name: 'address', dataStore: 'value', default: null, isDefault: false },
  { name: 'phone', dataStore: 'value', default: null, isDefault: false },
  {
    name: 'accountNumber',
    dataStore: 'value',
    default: null,
    isDefault: false,
  },
  {
    name: 'initialBalance',
    dataStore: 'value',
    default: null,
    isDefault: false,
  },
];

if (customersContent) {
  customersContent.addEventListener('submit', function (e) {
    e.preventDefault();
    let customers = {};
    userMainHeads.forEach((head) => {
      if (head.isDefault)
        customers[head.name] =
          customersData.length == 0
            ? 5000
            : customersData[customersData.length - 1][head.name] + 1;
      else customers[head.name] = this.elements[head.name][head.dataStore];
      customers.transactions = [];
    });
    customersData.push(customers);
    this.reset();
    setDataToStorage(customersData);
    window.location.replace('index.html');
  });
}

function drawElements() {
  contentIndex.innerHTML = '';
  if (customersData.length == 0) {
    const tr = createMyOwnElement(
      'tr',
      contentIndex,
      'alert alert-danger text-center'
    );
    createMyOwnElement('td', tr, '', 'No Customers Yet', [
      { attName: 'colspan', attrVal: 6 },
    ]);
  } else {
    customersData.forEach((customer, i) => {
      const tr = createMyOwnElement('tr', contentIndex);
      userMainHeads.forEach((head) =>
        createMyOwnElement('td', tr, '', customer[head.name])
      );

      const td = createMyOwnElement('td', tr);

      const showBtn = createMyOwnElement('button', td, 'btn', 'Show');
      showBtn.addEventListener('click', (e) => showCustomer(customer));
      const delBtn = createMyOwnElement('button', td, 'btn', 'Delete');
      delBtn.addEventListener('click', (e) => deleteCustomer(customer));
      const addBtn = createMyOwnElement('button', td, 'btn', 'addPalance');

      addBtn.addEventListener('click', () =>
        addPalance(customersData, customer.id)
      );
      const withdrawBtn = createMyOwnElement('button', td, 'btn', 'Withdraw');
      withdrawBtn.addEventListener('click', (e) =>
        withdraw(customersData, customer.id)
      );
    });
  }
}

// if (contentIndex) drawElements();
// deleteCustomer = (customersData, id, tr) => {
//   myData = customersData.filter((u) => u.id != id);
//   setDataToStorage(myData);
//   drawElements();
// };

if (contentIndex) drawElements();

function addPalance(customersData, id) {
  localStorage.setItem('id', JSON.stringify(id));
  window.location.replace('addpalance.html');
}

function withdraw(customersData, id) {
  localStorage.setItem('id', JSON.stringify(id));
  window.location.replace('withdraw.html');
}

if (addPalace) {
  addPalace.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!isNaN(this.elements.amount.value)) {
      let id = JSON.parse(localStorage.getItem('id'));
      console.log(id);
      objIndex = customersData.findIndex((obj) => obj.id == id);
      customersData[objIndex].transactions.push({
        type: 'add',
        val: this.elements.amount.value,
      });
      setDataToStorage(customersData);
      console.log(customersData);
    } else {
      alert('please enter a number');
    }
    this.reset();
  });
}

if (withdrawPalance) {
  withdrawPalance.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!isNaN(this.elements.amount.value)) {
      let id = JSON.parse(localStorage.getItem('id'));
      console.log(id);
      objIndex = customersData.findIndex((obj) => obj.id == id);
      customersData[objIndex].transactions.push({
        type: 'withdraw',
        val: this.elements.amount.value,
      });
      setDataToStorage(customersData);
      console.log(customersData);
    } else {
      alert('please enter a number');
    }
    this.reset();
  });
}
function showCustomer(customer) {
  localStorage.setItem('customer', JSON.stringify(customer));
  window.location.replace('single.html');
}

const single = document.querySelector('#single');
console.log(single);

if (single) {
  try {
    let customer = JSON.parse(localStorage.getItem('customer'));
    if (!customer) throw new Error();
    const tr = createMyOwnElement('tr', single);
    userMainHeads.forEach((head) =>
      createMyOwnElement('td', tr, '', customer[head.name])
    );
    const td = createMyOwnElement('td', tr);
    const addBtn = createMyOwnElement('button', td, 'btn', 'addPalance');
    addBtn.addEventListener('click', () =>
      addPalance(customersData, customer.id)
    );
    const withdrawBtn = createMyOwnElement('button', td, 'btn', 'Withdraw');
    withdrawBtn.addEventListener('click', (e) =>
      withdraw(customersData, customer.id)
    );
    const showBtn = createMyOwnElement('button', td, 'btn', 'Show');
    showBtn.addEventListener('click', (e) => showCustomer(customer));
    if (transactions) {
      customer.transactions.forEach((trans) => {
        const tr = createMyOwnElement('tr', transactions);
        createMyOwnElement('td', tr, '', trans.type);
        createMyOwnElement('td', tr, '', trans.val);
      });
    }
  } catch (e) {
    const tr = createMyOwnElement('tr', single, '');
    createMyOwnElement('td', tr, '', 'No Customers Yet', [
      { attName: 'colspan', attrVal: 6 },
    ]);
  }
}
