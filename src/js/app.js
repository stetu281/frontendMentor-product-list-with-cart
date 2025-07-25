import "../scss/main.scss";
import data from "../assets/data/data.json" with { type: "json" };
const images = importAll(
  require.context("../assets/images", false, /\.(jpg)$/),
);
import cartIcon from "../assets/images/icon-add-to-cart.svg";
import plus from "../assets/images/icon-increment-quantity.svg";
import minus from "../assets/images/icon-decrement-quantity.svg";

//render Product Items to Grid
const grid = document.querySelector(".productGrid");

data.map((item, index) => {
  const li = document.createElement("li");
  li.classList = "product";
  li.dataset.id = index;
  li.innerHTML = `
                <picture class="product__img">
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

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    if (!e.target.matches("span")) {
      e.target.classList.add("productButton--show");

      const product = e.target.parentElement;
      let cartItemData = {
        id: product.dataset.id,
        name: product.querySelector("h2.product__name").innerText,
        price: product.querySelector("p.product__price span").innerText,
        qty: 1,
      };
      renderCartItem(cartItemData);
    }
  });
});

//Overlay Counter for List Item Button
const counters = document.querySelectorAll(".productButton__overlay");

counters.forEach((counter) => {
  counter.addEventListener("click", (e) => {
    let num = e.target.parentElement.querySelector("p");

    if (e.target && e.target.matches("span.productButton__plusMinus")) {
      if (e.target.dataset.action === "add") {
        num.innerText++;
      } else {
        if (num.innerText == 1) {
          e.target.parentElement.parentElement.classList.remove(
            "productButton--show",
          );
        } else {
          num.innerText--;
        }
      }
    }
  });
});

//render Cart Item
function renderCartItem(data) {
  console.log(data);
  const li = document.createElement("li");
  li.classList = "cartItem";
  li.innerHTML = `
    <div class="cartItem__text">
      <h3>${data.name}</h3>
      <p>
          <span class="cartItem__qty">${data.qty}x</span>
          <span class="cartItem__price">@ ${data.price}</span>
          <span class="cartItem__total">$${data.qty * data.price}</span>
      </p>
    </div>
    <button class="cartItem__remove"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg></button>
  `;

  document.querySelector(".cart__listContainer").appendChild(li);
}
