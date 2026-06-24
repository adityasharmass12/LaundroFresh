// ===== EmailJS Setup =====
var serviceId = "YOUR_SERVICE_ID";
var templateId = "YOUR_TEMPLATE_ID";
var publicKey = "YOUR_PUBLIC_KEY";

// only init emailjs if real credentials are provided
if (publicKey !== "YOUR_PUBLIC_KEY") {
    emailjs.init(publicKey);
}

// ===== Services Data =====
// array of all the services we offer with name and price
var services = [
    { name: "Wash & Fold", price: 149 },
    { name: "Dry Cleaning", price: 299 },
    { name: "Premium Wash", price: 399 },
    { name: "Ironing & Pressing", price: 99 },
    { name: "Stain Removal", price: 199 },
    { name: "Curtain Cleaning", price: 349 },
    { name: "Blanket Wash", price: 249 },
    { name: "Shoe Cleaning", price: 179 },
    { name: "Leather Care", price: 499 },
    { name: "Wedding Dress", price: 999 },
    { name: "Suit Pressing", price: 199 },
    { name: "Silk Treatment", price: 349 },
    { name: "Carpet Cleaning", price: 599 },
    { name: "Sofa Cleaning", price: 799 },
    { name: "Express Wash (2hr)", price: 249 },
    { name: "Bulk Laundry (10kg)", price: 449 }
];

// this array holds whatever the user adds to their cart
var cart = [];

// ===== DOM Elements =====
var serviceListDiv = document.getElementById("serviceList");
var cartItemsDiv = document.getElementById("cartItems");
var cartEmptyMsg = document.getElementById("cartEmptyMsg");
var cartTotalSpan = document.getElementById("cartTotal");
var proceedBookBtn = document.getElementById("proceedBookBtn");
var serviceTypeInput = document.getElementById("serviceType");

// ===== Render the Service List =====
// loop through each service and create a card with name, price, and add button
function renderServiceList() {
    serviceListDiv.innerHTML = ""; // clear any old content

    for (var i = 0; i < services.length; i++) {
        var service = services[i];

        // create the card container
        var card = document.createElement("div");
        card.className = "service-card";

        // info section (name + price)
        var info = document.createElement("div");
        info.className = "service-card-info";

        var nameSpan = document.createElement("span");
        nameSpan.className = "service-card-name";
        nameSpan.textContent = service.name;

        var priceSpan = document.createElement("span");
        priceSpan.className = "service-card-price";
        priceSpan.textContent = "₹" + service.price;

        info.appendChild(nameSpan);
        info.appendChild(priceSpan);

        // add button
        var addBtn = document.createElement("button");
        addBtn.className = "service-add-btn";
        addBtn.textContent = "Add";

        // using a closure here so each button knows which service it's for
        // without this, all buttons would reference the last service in the loop
        addBtn.addEventListener("click", (function(svc) {
            return function() {
                addToCart(svc);
            };
        })(service));

        card.appendChild(info);
        card.appendChild(addBtn);
        serviceListDiv.appendChild(card);
    }
}

// ===== Add to Cart =====
// push the service into the cart array and re-render
function addToCart(service) {
    // add a copy of the service to cart
    // using Object spread so each cart item is independent
    cart.push({ name: service.name, price: service.price });
    renderCart();
}

// ===== Remove from Cart =====
// remove the item at the given index and re-render
function removeFromCart(index) {
    cart.splice(index, 1); // removes 1 item at position 'index'
    renderCart();
}

// ===== Render the Cart =====
// shows all items in the cart, or the empty message if nothing's there
function renderCart() {
    cartItemsDiv.innerHTML = ""; // clear old items

    if (cart.length === 0) {
        // show the empty message when cart has nothing
        var emptyMsg = document.createElement("p");
        emptyMsg.className = "cart-empty-msg";
        emptyMsg.id = "cartEmptyMsg";
        emptyMsg.textContent = "Your cart is empty. Add services from the list!";
        cartItemsDiv.appendChild(emptyMsg);
    } else {
        // loop through cart and create a row for each item
        for (var i = 0; i < cart.length; i++) {
            var item = cart[i];

            var row = document.createElement("div");
            row.className = "cart-item";

            var info = document.createElement("div");
            info.className = "cart-item-info";

            var nameSpan = document.createElement("span");
            nameSpan.className = "cart-item-name";
            nameSpan.textContent = item.name;

            var priceSpan = document.createElement("span");
            priceSpan.className = "cart-item-price";
            priceSpan.textContent = "₹" + item.price;

            info.appendChild(nameSpan);
            info.appendChild(priceSpan);

            // remove button for this specific cart item
            var removeBtn = document.createElement("button");
            removeBtn.className = "cart-remove-btn";
            removeBtn.textContent = "Remove";

            // same closure trick as above so each button knows its index
            removeBtn.addEventListener("click", (function(idx) {
                return function() {
                    removeFromCart(idx);
                };
            })(i));

            row.appendChild(info);
            row.appendChild(removeBtn);
            cartItemsDiv.appendChild(row);
        }
    }

    // update the total
    updateTotal();
}

// ===== Calculate and Display Total =====
function updateTotal() {
    var total = 0;
    var serviceNames = [];
    for (var i = 0; i < cart.length; i++) {
        total = total + cart[i].price;
        serviceNames.push(cart[i].name);
    }
    cartTotalSpan.textContent = "₹" + total;

    // Update Proceed to Book button and form input
    if (cart.length > 0) {
        proceedBookBtn.style.display = "block";
        serviceTypeInput.value = serviceNames.join(", ") + " (Total: ₹" + total + ")";
    } else {
        proceedBookBtn.style.display = "none";
        serviceTypeInput.value = "";
    }
}

// ===== Initialize =====
// render the service list when page loads
renderServiceList();
// render the cart (will show empty message initially)
renderCart();

// ===== Booking Form Handler =====
var bookingForm = document.getElementById("bookingForm");
var bookingMessage = document.getElementById("bookingMessage");

bookingForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var name = document.getElementById("fullName").value;
    var email = document.getElementById("emailAddress").value;
    var service = document.getElementById("serviceType").value;
    var date = document.getElementById("pickupDate").value;

    // check if emailjs credentials are configured
    if (publicKey === "YOUR_PUBLIC_KEY" || serviceId === "YOUR_SERVICE_ID" || templateId === "YOUR_TEMPLATE_ID") {
        // simulation mode - just log and show success
        console.log("Simulation mode: EmailJS credentials not set.", { name: name, email: email, service: service, date: date });
        bookingForm.reset();
        bookingMessage.classList.remove("hidden");
    } else {
        // real emailjs send
        var templateParams = {
            to_name: name,
            to_email: email,
            from_name: "LaundroFresh",
            service_type: service,
            pickup_date: date
        };

        emailjs.send(serviceId, templateId, templateParams)
            .then(function() {
                bookingForm.reset();
                bookingMessage.classList.remove("hidden");
            })
            .catch(function(error) {
                console.error("EmailJS failed:", error);
                bookingForm.reset();
                bookingMessage.classList.remove("hidden");
            });
    }
});

// ===== Newsletter Form Handler =====
var newsletterForm = document.getElementById("newsletterForm");
var newsletterMessage = document.getElementById("newsletterMessage");

newsletterForm.addEventListener("submit", function(event) {
    event.preventDefault();
    newsletterForm.reset();
    newsletterMessage.classList.remove("hidden");
    setTimeout(function() {
        newsletterMessage.classList.add("hidden");
    }, 5000);
});
