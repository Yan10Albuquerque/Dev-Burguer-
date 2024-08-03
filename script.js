const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")


let cart = [];

cartBtn.addEventListener("click", function() {
    cartModal.style.display = "flex"
})

cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
})


menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        
        addToCart(name, price)
    }
})


function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        // se o item ja existir, soma +!
        existingItem.quantity += 1
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }
    UpdateCartModal()
}

function UpdateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>
            
            <button class="remove-btn" data-name="${item.name}">:
                Remover
            </button>
            
        </div>
        `

        total += item.price * item.quantity;


        cartItemsContainer.append(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    cartCounter.innerText = cart.length;
}


cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index]

        if(item.quantity > 1){
            item.quantity -= 1;
            UpdateCartModal();
            return;
        }

        cart.splice(index, 1);
        UpdateCartModal();
    }
}

addressInput.addEventListener("input", function(){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
})

checkoutBtn.addEventListener("click", function(){
    const IsOpen = checkRestaurantOpen();
    if(!IsOpen){
        Toastify({
            text: "Desculpe, o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast()
        return;
    }



    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //enviar o pedido
    const cartItems = cart.map((item) => {
        return (
            `${item.name}, Qntd: ${item.quantity} - R$ ${item.price * item.quantity} | `
        )
    }).join("")

    const message = encodeURIComponent("Boa noite, segue meu pedido: " + cartItems )
    const phone = "2198146621"
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    UpdateCartModal();

})


function checkRestaurantOpen(){
    const date = new Date();
    const hours = date.getHours();
    return hours >= 18 && hours < 22;
}

    const spanItem = document.getElementById("date-span");
    const IsOpen = checkRestaurantOpen();

    if(IsOpen){
        spanItem.classList.remove("bg-red-500");
        spanItem.classList.add("bg-green-600");
    }else{
        spanItem.classList.remove("bg-green-600");
        spanItem.classList.add("bg-red-500");
}