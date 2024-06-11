import { addToCart, cart_items } from "./cart.js";
import { products } from "../data/products.js";

async function render_added_confirmation(i) {
  let element2 = document.getElementById("added_" + i);
  element2.innerHTML = `<img class="added_icon" src = "./images/icons/checkmark.png"> </img>
  <div class="added_text">Item added to cart!</div>`;
  setTimeout(() => {
    element2.innerHTML = ``;
  }, 1000);
}

function render_products(data) {
  if (cart_items) {
    let element = document.querySelector(".cart_quantity");
    element.innerHTML = cart_items.length;
  }

  // console.log("data is : ",data);
  let html = "";
  data.forEach((element, index) => {
    let rating_image_path = element.rating.stars.toString()[0];
    let dot_index = element.rating.stars.toString().indexOf(".");

    if (dot_index == -1) rating_image_path += "0";
    else rating_image_path += element.rating.stars.toString()[dot_index + 1];
    // console.log("rating : ",rating_image_path);
    let temp = `
        <div class="product_container">
        <div class="image_container">
          <img class="product_image" src=${element.image} alt="">
        </div>
        <div class="product_name">${element.name}</div>
        <div class="product_star"><img class = "star_image" src = "./images/ratings/rating-${rating_image_path}.png"></img></div>
        <div class="product_price">${
          "$" + (element.priceCents / 100).toFixed(2)
        }</div>
        <div>
        <select class="cart_quant" id = ${index}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        </div>
        <div class="added_to_cart" id = added_${index}>
        </div>
        <div class="cart_button_container">
          <button class="add_to_cart" data-id=${element.id} data-price = ${(
      element.priceCents / 100
    ).toFixed(2)} data-index = ${index}>Add to Cart
          </button>
        </div>
      </div>
        `;
    html += temp;
  });
  let ele = document.querySelector(".products_grid");
  ele.innerHTML = html;

  // add event listner
  document.querySelectorAll(".add_to_cart").forEach((element) => {
    element.addEventListener("click", () => {
      console.log(element.dataset);
      addToCart(
        element.dataset.id,
        element.dataset.price,
        element.dataset.index
      );
      render_added_confirmation(element.dataset.index);
    });
  });
}

render_products(products);
