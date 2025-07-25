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
                    <span class="productButton__plusMinus">
                        <img src="${minus}" alt="" />
                    </span>
                        <p class="productButton__counter">1</p>
                    <span class="productButton__plusMinus">
                        <img src="${plus}" alt="" />
                    </span>
                </span>
            </button>
            <div class="product__text">
                <p class="product__cat">${item.category}</p>
                <h2 class="product__name">${item.name}</h2>
                <p class="product__price">$${item.price}</p>
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
    }
  });
});
