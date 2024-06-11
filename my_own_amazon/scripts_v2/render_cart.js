import { del_options } from "./delv_options.js";
import dayjs from "https://unpkg.com/dayjs@1.11.11/esm/index.js";
import { cart_items, remove_from_cart } from "./cart.js";
import { products } from "../data/products.js";

let pds_data = products;

function add_del_optionsHtml(index, check_id) {
  let today = dayjs();
  let html = "";
  del_options.forEach((element, i) => {
    let temp = `
    <div class="delv_buttons" data-index ="${index}" data-pid ="${
      element.id
    }" data-sp = ${element.ship_price}>
    <input
      type="radio"
      ${element.id === check_id ? "checked" : ""}
      class="delv_option_checked"
      name="del_option${index}"
      id=${i}
    />
    <div class="button_text" style="color: red;font-family: Arial, Helvetica, sans-serif;">${today
      .add(element.days, "days")
      .format("dddd,MMMM DD")}</div>
    <div></div>
    <div class="button_text" style="color: rgb(120,120,120);font-family: Arial, Helvetica, sans-serif;">${
      element.days === 7
        ? "FREE Shipping"
        : "Shipping - $" + (element.ship_price / 100).toFixed(2)
    }</div>
  </div>`;
    html += temp;
  });

  return html;
}

function update_cart(index, delopt_id, ship_price) {
  cart_items[index].del_id = delopt_id;
  cart_items[index].ship_price = ship_price;
  render_cart();
}

function update_summaryHTML(
  total_items,
  total_price,
  total_shipping,
  tbtax,
  total_tax,
  final_price
) {
  let temp = `
  <div class="order_summary">
  <div class="order_summary_text">Order Summary</div>
  <div class="order_summary_row">
    <div>Items(${total_items}):</div>
    <div class= "price">$${total_price}</div>
  </div>
  <div class="order_summary_row">
    <div>Shipping & handling:</div>
    <div class= "price">$${total_shipping}</div>
  </div>
  <div class="order_summary_subrow">
    <div></div>
    <div class="divider"></div>
  </div>
  <div class="order_summary_row">
    <div>Total before tax:</div>
    <div class= "price">$${tbtax}</div>
  </div>
  <div class="order_summary_row">
    <div>Estimated tax(10%):</div>
    <div class= "price">$${total_tax}</div>
  </div>
  <div class="total_divider"></div>
  <div class="order_summary_row_final">
    <div style="color: red; font-size: 20px; font-weight: bold">
      Order total:
    </div>
    <div class= "price" style="color: red; font-size: 20px; font-weight: bold">
      $${final_price}
    </div>
  </div>
  <div class="buy_button_container">
    <button class="buy_now_button">Place your order</button>
  </div>
  <div style="border: 1px solid rgb(233, 233, 233)"></div>
</div>`;

  document.querySelector(".bill").innerHTML = temp;
}

function render_cart() {
  if (!cart_items || cart_items.length === 0) {
    document.querySelector(
      ".chk_summary"
    ).innerHTML = `<div class="cart_empty"><img src="./images/icons/Empty Cart.jpeg" class="cart_empty_image"></img><div class="cart_empty_text">Cart is Empty!!</div></div>`;
    return;
  }

  let ele = document.querySelector(".items");
  let html = "";

  cart_items.forEach((element, i) => {
    let index = pds_data.findIndex((item, i) => {
      // console.log(item, element);
      return item.id === element.id;
    });

    if (index === -1) return;

    let temp = `
    <div class="item_details_container">
    <div class = "delv_date"><span style ="color: red">Delivery Date: </span><span>${dayjs().format(
      "dddd,MMMM DD"
    )}</span></Div>
    <img
      class="pd_image_checkout"
      src="${pds_data[index].image}"
      alt=""
    />
    <div class="pd_summary">
      <div class="pd_nm_chk">${pds_data[index].name}</div>
      <div class="pd_prc_chk">$${(pds_data[index].priceCents / 100).toFixed(
        2
      )}</div>
      <div class = "quant_container"><span class="pd_quant_chk">Quantity: ${
        element.quantity
      }</span>
      <a href = "../amazon_v2.html" class="quant_text">Update</a>
      <span class = "quant_text" data-pid ="${element.id}">Delete</span>
      </div>
    </div>

    <div class="delv_options">
      <div class="delv_text">Choose a delivery option</div>
      ${add_del_optionsHtml(i, element.del_id)}
  </div>
  </div>`;
    html += temp;
  });

  // console.log("html is : ", html);
  ele.innerHTML = html;

  // calculation for order summary
  let total_items = 0;
  let total_price = 0;
  let total_shipping = 0;
  cart_items.forEach((element) => {
    total_items += element.quantity;
    total_price += element.price * element.quantity;
    total_shipping += element.ship_price;
  });

  let tbtax = total_price + total_shipping;
  let total_tax = 0.1 * tbtax;
  let final_price = tbtax + total_tax;

  update_summaryHTML(
    total_items,
    total_price.toFixed(2),
    total_shipping.toFixed(2),
    tbtax.toFixed(2),
    total_tax.toFixed(2),
    final_price.toFixed(2)
  );

  document.querySelector(
    ".middle_checkout"
  ).innerHTML = `Checkout( ${total_items} items)`;

  // add event_listners to required elements
  // console.log("hello there11");
  document.querySelectorAll(".quant_text").forEach((element) => {
    element.addEventListener("click", () => {
      const { pid } = element.dataset;
      remove_from_cart(cart_items, pid);
      render_cart();
    });
  });

  document.querySelectorAll(".delv_buttons").forEach((element) => {
    element.addEventListener("click", () => {
      const { index, pid, sp } = element.dataset;
      update_cart(index, pid, sp / 100);
    });
  });
}

render_cart();
