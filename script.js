let cart = [];
let total = 0;

function addToCart(name, price) {
    let found = false;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name === name) {
            cart[i].qty = cart[i].qty + 1;
            found = true;
        }
    }
    if (found === false) {
        cart.push({ name: name, price: price, qty: 1 });
    }
    total = total + price;
    renderCart();
}

function removeFromCart(name, price) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name === name) {
            if (cart[i].qty > 1) {
                cart[i].qty = cart[i].qty - 1;
                total = total - price;
            } else {
                cart.splice(i, 1);
                total = total - price;
            }
            break;
        }
    }
    renderCart();
}

function renderCart() {
    let cartList = document.getElementById("cartList");
    let totalDisplay = document.getElementById("totalDisplay");
    
    cartList.innerHTML = "";
    
    if (cart.length === 0) {
        cartList.innerHTML = "<p id='emptyMessage'>No items added</p>";
        totalDisplay.innerText = "0";
        return;
    }
    
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let row = document.createElement("div");
        row.className = "cart-item-row";
        row.innerHTML = "<span>" + item.name + " (x" + item.qty + ")</span><span>₹" + (item.price * item.qty) + "</span>";
        cartList.appendChild(row);
    }
    
    totalDisplay.innerText = total;
}

let bookForm = document.getElementById("bookForm");
let bookBtn = document.getElementById("bookBtn");
let bookingMessage = document.getElementById("bookingMessage");
let bookingError = document.getElementById("bookingError");
let cartError = document.getElementById("cartError");

// Insert your EmailJS Public Key here
let EMAILJS_PUBLIC_KEY = "ScxUNJavcLQmdDxk8"; 
emailjs.init(EMAILJS_PUBLIC_KEY);

bookForm.onsubmit = function(e) {
    e.preventDefault();
    
    bookingMessage.style.display = "none";
    bookingError.style.display = "none";
    cartError.style.display = "none";
    
    if (cart.length === 0) {
        cartError.style.display = "block";
        return;
    }
    
    let userName = document.getElementById("name").value;
    let userEmail = document.getElementById("email").value;
    let userPhone = document.getElementById("phone").value;
    
    let serviceNames = "";
    for (let i = 0; i < cart.length; i++) {
        serviceNames = serviceNames + cart[i].name + " (x" + cart[i].qty + "), ";
    }
    
    let currentDate = new Date().toLocaleString();

    let submitData = {
        name: userName,
        email: userEmail,
        phone: userPhone,
        services: serviceNames,
        amount: total,
        booking_date: currentDate
    };
    
    // Insert your EmailJS Service ID and Template ID here
    let EMAILJS_SERVICE_ID = "service_za7jljt";
    let EMAILJS_TEMPLATE_ID = "template_wbn9e0b";
    
    bookBtn.innerText = "Processing...";
    
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, submitData)
    .then(function() {
        bookingMessage.style.display = "block";
        bookForm.reset();
        cart = [];
        total = 0;
        renderCart();
        bookBtn.innerText = "Book Now";
    })
    .catch(function() {
        bookingError.style.display = "block";
        bookBtn.innerText = "Book Now";
    });
};

let newsForm = document.getElementById("newsForm");
let newsMessage = document.getElementById("newsMessage");

newsForm.onsubmit = function(e) {
    e.preventDefault();
    newsMessage.style.display = "block";
    newsForm.reset();
};
