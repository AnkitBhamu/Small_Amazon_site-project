function loadFromLocalStorage() {
  let cart_items = JSON.parse(localStorage.getItem("cart_items"));

  // fresh loading into  local cart from browser
  cart_items = JSON.parse(localStorage.getItem("cart_items"));
  if (!cart_items) cart_items = [];
  cart_items.forEach((element) => {
    element.del_id = "0";
    element.ship_price = 0;
  });

  return cart_items;
}

function remove_from_cart(cart_items, item_id) {
  let index = cart_items.findIndex((element, i) => {
    return item_id === element.id;
  });

  if (index != -1) {
    cart_items.splice(index, 1);
    localStorage.setItem("cart_items", JSON.stringify(cart_items));
  }
}

function addToCart(item_id, price, i) {
  let index = cart_items.findIndex((ele) => ele.id === item_id);
  let item_quantity = Number(document.getElementById(i).value);

  if (index === -1) {
    let cart_data = { id: item_id, quantity: item_quantity, price: price };
    cart_items.push(cart_data);
    let element = document.querySelector(".cart_quantity");
    element.innerHTML = cart_items.length;
  } else {
    cart_items[index].quantity += item_quantity;
  }

  localStorage.setItem("cart_items", JSON.stringify(cart_items));
}

export let cart_items = loadFromLocalStorage();
export { remove_from_cart };
export { addToCart };
