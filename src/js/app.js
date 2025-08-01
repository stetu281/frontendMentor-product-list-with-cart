import "../scss/main.scss";
import data from "../assets/data/data.json" with { type: "json" };
const images = importAll(
  require.context("../assets/images", false, /\.(jpg)$/),
);
import cartIcon from "../assets/images/icon-add-to-cart.svg";
import plus from "../assets/images/icon-increment-quantity.svg";
import minus from "../assets/images/icon-decrement-quantity.svg";
window.handleRemoveClick = handleRemoveClick;

//render Product Items to Grid
const grid = document.querySelector(".productGrid");

data.map((item, index) => {
  const li = document.createElement("li");
  li.classList = "product";
  li.dataset.id = index;
  li.innerHTML = `
                <picture class="product__img" data-thumbnail=${item.image.thumbnail}>
                <source media="(min-width: 1440px)" srcset="assets/${item.image.desktop}" width="502" height="480" />
                <source media="(min-width: 768px)" srcset="assets/${item.image.tablet}" width="427" height="424" />
                <img src="assets/${item.image.mobile}" alt="${item.name}" height="424" width="654" />
            </picture>
            <button class="productButton">
                <img src="${cartIcon}" alt="" />
                <p>Add to Cart</p>
                <span class="productButton__overlay">
                    <span class="productButton__plusMinus" data-action="sub">
                        <img src="${minus}" alt="" />
                    </span>
                        <p class="productButton__counter">1</p>
                    <span class="productButton__plusMinus" data-action="add">
                        <img src="${plus}" alt="" />
                    </span>
                </span>
            </button>
            <div class="product__text">
                <p class="product__cat">${item.category}</p>
                <h2 class="product__name">${item.name}</h2>
                <p class="product__price">$<span>${item.price.toFixed(2)}</span></p>
            </div>
    `;

  grid.appendChild(li);
});

//import all Images
function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

//Product List Item Button
const buttons = document.querySelectorAll(".productButton");
let cartArray = [];

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    if (!e.target.matches("span")) {
      e.target.classList.add("productButton--show");

      const product = e.target.parentElement;
      let cartItemData = {
        id: product.dataset.id,
        name: product.querySelector("h2.product__name").innerText,
        price: product.querySelector("p.product__price span").innerText,
        image: e.target.previousElementSibling.dataset.thumbnail,
        qty: 1,
      };
      renderCartItem(cartItemData);
      cartArray.push(cartItemData);
      updateCartItemsCount();
      checkEmptyCart();
    }
  });
});

//Overlay Counter for List Item Button
const counters = document.querySelectorAll(".productButton__overlay");

counters.forEach((counter) => {
  counter.addEventListener("click", (e) => {
    let num = e.target.parentElement.querySelector("p");
    let id = e.target.parentElement.parentElement.parentElement.dataset.id;

    if (e.target && e.target.matches("span.productButton__plusMinus")) {
      if (e.target.dataset.action === "add") {
        num.innerText++;
        updateCartItem(id, parseInt(num.innerText), 1);
        updateCartItemsCount();
      } else {
        if (num.innerText == 1) {
          e.target.parentElement.parentElement.classList.remove(
            "productButton--show",
          );
          removeCartItem(id);
          removeFromCartArray(id);
          updateCartItemsCount();
          checkEmptyCart();
        } else {
          num.innerText--;
          updateCartItem(id, parseInt(num.innerText), 0);
          updateCartItemsCount();
          checkEmptyCart;
        }
      }
    }
  });
});

//Confirm Order Button
document.querySelector(".cart__button").addEventListener("click", (e) => {
  let sum = 0;

  if (cartArray.length === 0) {
    e.target.innerText = "Cart is empty";
    setTimeout(() => {
      e.target.innerText = "Confirm order";
    }, 2000);
  } else {
    document.querySelector(".confirm").classList.add("confirm--open");

    cartArray.map((item) => {
      sum += item.qty * item.price;
      const li = document.createElement("li");
      li.innerHTML = `
      <img src="assets/${item.image}" alt="" />
      <div class="confirm__itemText">
        <h3>Vanilla Bean Creme Brullee</h3>
        <p>
          <span class="confirm__qty">${item.qty}x</span><span class="confirm__price">@ $${item.price}</span>
        </p>
      </div>
      <p class="confirm__total">$${(item.qty * item.price).toFixed(2)}</p>
  `;

      document.querySelector(".confirm__list").appendChild(li);
    });

    document.querySelector(".confirm__orderTotalNum").innerText =
      sum.toFixed(2);

    document.querySelector(".confirm__button").addEventListener("click", () => {
      window.location.reload();
    });
  }
});

//render Cart Item
function renderCartItem(data) {
  const li = document.createElement("li");
  li.classList = "cartItem";
  li.innerHTML = `
    <div class="cartItem__text" data-cartItemId=${data.id}>
      <h3>${data.name}</h3>
      <p>
          <span class="cartItem__qty"><span>${data.qty}</span>x</span>
          <span class="cartItem__price">@ <span>${data.price}</span></span>
          <span class="cartItem__total">$<span>${data.price}</span></span>
      </p>
    </div>
    <button class="cartItem__remove" onclick="handleRemoveClick(this)"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg></button>
  `;

  document.querySelector(".cart__listContainer").appendChild(li);

  updateOrderTotal(parseFloat(data.price), 1);
}

function handleRemoveClick(e) {
  let id = e.parentElement.firstElementChild.dataset.cartitemid;
  let total = parseFloat(
    e.parentElement.firstElementChild.querySelector(".cartItem__total span")
      .innerText,
  );
  const orderTotal = document.querySelector(".cart__orderTotal span");
  let orderTotalNum = parseFloat(orderTotal.innerText);

  removeCartItem(id);
  removeFromCartArray(id);
  updateCartItemsCount();

  orderTotal.innerText = (orderTotalNum - total).toFixed(2);

  document
    .querySelector(`[data-id="${id}"] > button`)
    .classList.remove("productButton--show");

  document
    .querySelector(`[data-id="${id}"] > button`)
    .querySelector(".productButton__counter").innerText = 1;
}

function updateCartItem(id, qty, operator) {
  let item = document.querySelector(`[data-cartitemid="${id}"]`);
  let itemQty = item.querySelector(".cartItem__qty span");
  let itemPrice = parseFloat(
    item.querySelector(".cartItem__price span").innerText,
  );
  let itemTotal = item.querySelector(".cartItem__total span");
  itemQty.innerText = qty;
  itemTotal.innerText = (qty * itemPrice).toFixed(2);
  updateOrderTotal(itemPrice, operator);
  updateCartArray(id, qty);
}

function removeCartItem(id) {
  const item = document.querySelector(`[data-cartitemid="${id}"]`);

  const itemPrice = parseFloat(
    item.querySelector(".cartItem__price span").innerText,
  );
  console.log(itemPrice);
  updateOrderTotal(itemPrice, 0);

  item.parentElement.remove();
}

function updateOrderTotal(price, operator) {
  const orderTotal = document.querySelector(".cart__orderTotal span");
  let orderTotalNum = parseFloat(orderTotal.innerText);
  if (operator === 1) {
    orderTotal.innerText = (orderTotalNum + price).toFixed(2);
  } else {
    orderTotal.innerText = (orderTotalNum - price).toFixed(2);
  }
}

function updateCartArray(id, qty) {
  for (const item of cartArray) {
    if (item.id === id) {
      item.qty = qty;
    }
  }
}

function removeFromCartArray(id) {
  const index = cartArray.map((item) => item.id).indexOf(id);
  index >= 0 && cartArray.splice(index, 1);
}

function updateCartItemsCount() {
  let cartCount = cartArray.reduce((n, { qty }) => n + qty, 0);

  document.querySelector(".cart__count").innerText = cartCount;
}

function checkEmptyCart() {
  if (cartArray.length >= 1) {
    document.querySelector(".cart__empty").classList.add("hide");
  } else {
    document.querySelector(".cart__empty").classList.remove("hide");
  }
}
