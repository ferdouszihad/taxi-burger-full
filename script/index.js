const loadCategory = () => {
  const uri = "https://taxi-kitchen-api.vercel.app/api/v1/categories";

  fetch(uri) // promise kortesi j ami tomake response
    .then((res) => res.json()) //promise kortesi ami tomake data
    .then((data) => displayCategory(data.categories));
};

let cart = [];
let total = 0;

const displayCategory = (categories) => {
  //   console.log(categories);
  // 1. jekhane rakho setake dhore niye asho
  const catContainer = document.getElementById("category-container");
  catContainer.innerHTML = "";

  for (let cat of categories) {
    //3 - Create html element
    const categoryCard = document.createElement("div");
    categoryCard.innerHTML = `
          <a href="#food" id="cat-btn-${cat.id}" onclick="loadFoods(${cat.id})" class="btn justify-start btn-block shadow btn-category">
            <img
              src="${cat.categoryImg}"
              alt=""
              class="w-10"
            />${cat.categoryName}
          </a>`;

    //4- Append the element
    catContainer.append(categoryCard);
  }
};
///////////////////////////////////////////

const loadFoods = (id) => {
  //1 - food container k hide korbo + loading k show korbo
  document.getElementById("loading-spinner").classList.remove("hidden");
  document.getElementById("food-container").classList.add("hidden");

  const url = id
    ? `https://taxi-kitchen-api.vercel.app/api/v1/categories/${id}`
    : `https://taxi-kitchen-api.vercel.app/api/v1/foods/random`;

  //1 - sobaike niye eshe active class remove kore dao.

  const catBtns = document.querySelectorAll(".btn-category");
  catBtns.forEach((btn) => btn?.classList?.remove("active"));

  //2 - Jake click kora hoise take active class dao
  const currentBtn = document.getElementById(`cat-btn-${id}`);
  console.log(currentBtn);
  currentBtn?.classList?.add("active");

  fetch(url) // promise kortesi j ami tomake response
    .then((res) => res.json()) //promise kortesi ami tomake data
    .then((data) => displayFoods(data.foods));
};

const loadRandomData = () => {
  const url = `https://taxi-kitchen-api.vercel.app/api/v1/foods/random`;
  fetch(url) // promise kortesi j ami tomake response
    .then((res) => res.json()) //promise kortesi ami tomake data
    .then((data) => displayFoods(data.foods));
};
const displayFoods = (foods) => {
  const foodContainer = document.getElementById("food-container");
  foodContainer.innerHTML = "";

  foods.forEach((food) => {
    const foodCard = document.createElement("div");
    foodCard.innerHTML = `
     <div onclick="loadFoodDetails(${food.id})" class="p-5 bg-white flex gap-3 shadow rounded-xl">
            <div class="img flex-1">
              <img
                src="${food.foodImg}"
                alt=""
                
                class="w-[160px] rounded-xl h-[160px] object-cover food-img"
              />
            </div>
            <div class="flex-2">
              <h1 class="text-xl font-bold food-title">
                ${food.title}
              </h1>

              <div class="badge badge-warning">${food.category}</div>

              <div class="divider divider-end">
                <h2 class="text-yellow-600 font-semibold">
                  $ <span class="food-price">${food.price}</span> BDT
                </h2>
              </div>

              <button id="add-btn-${food.id}" onclick="addtoCart(this)" class="btn btn-warning">
                <i class="fa-solid fa-square-plus"></i>
                Add This Item
              </button>
            </div>
          </div>
    `;
    foodContainer.append(foodCard);

    document
      .getElementById(`add-btn-${food.id}`)
      .addEventListener("click", (e) => {
        e.stopPropagation();
      });
  });

  //2 - food container k show korbo + loading k hide korbo
  document.getElementById("loading-spinner").classList.add("hidden");
  document.getElementById("food-container").classList.remove("hidden");
};

////////////////////////////////////

const loadFoodDetails = (id) => {
  const url = `https://taxi-kitchen-api.vercel.app/api/v1/foods/${id}`;

  fetch(url) // promise kortesi j ami tomake response
    .then((res) => res.json()) //promise kortesi ami tomake data
    .then((data) => displayDetails(data.details)); //object
};
const displayDetails = (food) => {
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML = "";
  const ecode = food.video.split("=")[1];
  console.log(food.video.split("=")[1]);

  detailsContainer.innerHTML = `
        <iframe width="800" height="430" src="https://www.youtube.com/embed/${ecode}?si=mtV9WFTunGfEXlK8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

  
  `;
  document.getElementById("my_modal_3").showModal();
};

///////////////////////////////////////

loadCategory();
loadFoods(11);

// loadRandomData();

const addtoCart = (btn) => {
  const card = btn.parentNode.parentNode;

  const foodTitle = card.querySelector(".food-title").innerText;

  const foodImg = card.querySelector(".food-img").src;

  const foodPrice = card.querySelector(".food-price").innerText;

  const foodPriceNum = Number(foodPrice);

  //   console.log(foodTitle, foodImg, foodPriceNum);

  const isExist = cart.find((item) => item.foodTitle == foodTitle);
  if (isExist) {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].foodTitle == foodTitle) {
        cart[i].quantity++;
        break;
      }
    }
  } else {
    const selectedItem = {
      id: cart.length + 1,
      quantity: 1,
      foodTitle: foodTitle,
      foodImg: foodImg,
      foodPrice: foodPriceNum,
    };

    cart.push(selectedItem);
  }
  console.log(cart);

  total = total + foodPriceNum;

  displayCart(cart);
  displayTotal(total);
};

const displayTotal = (val) => {
  document.getElementById("cart-total").innerHTML = val;
};

const displayCart = (cart) => {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";
  for (let item of cart) {
    const newItem = document.createElement("div");
    newItem.innerHTML = `
     <div class="p-1 bg-white flex gap-3 shadow rounded-xl relative">
            <div class="img">
              <span class="hidden cart-id">${item.id}</span>
              <img
                src="${item.foodImg}"
                alt=""
                class="w-[50px] rounded-xl h-[50px] object-cover"
              />
            </div>
            <div class="flex-1">
              <h1  class="text-xs font-bold food-title">
                ${item.foodTitle}
              </h1>

              <div class="">
                <h2 class="text-yellow-600 font-semibold">
                 ${item.quantity} x $ <span class="item-price">${item.foodPrice}</span> BDT
                </h2>
                
              </div>
            </div>
            <div onclick="removeCart(this)"
              class="w-6 h-6 flex justify-center items-center bg-red-600 rounded-full absolute -top-1 -right-1 text-white cursor-pointer"
            >
              <i class="fa-solid fa-xmark"></i>
            </div>
          </div>
    `;

    cartContainer.append(newItem);
  }
};

const removeCart = (btn) => {
  const item = btn.parentNode;

  const id = Number(item.querySelector(".cart-id").innerText);

  const foodPrice = Number(item.querySelector(".item-price").innerText);

  cart = cart.filter((item) => item.id != id);

  total = 0;
  cart.forEach((item) => (total += item.foodPrice));

  displayCart(cart);
  displayTotal(total);
};
