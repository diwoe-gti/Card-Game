const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

document.querySelector(".score").textContent = score;

fetch("./data/cards.json")
.then ((res) => res.json())
.then((data) =>{
    // ทำซ้ำการ์ดเพื่อให้มีคู่
    cards = [...data, ...data];
    shuffleCards ();
    generateCards ();
});

function shuffleCards () {
    let currentIndex = cards.length,
        randomIndex,
        temporaryValue;
    while (currentIndex !== 0){
        randomIndex = Math.floor (Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards [randomIndex] = temporaryValue;
    }
}

function generateCards () {
    for (let card of cards) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name);
        cardElement.innerHTML = `
            <div class="front">
                <img class="front-image" src="${card.image}" />
            </div>
            <div class="back"></div>
        `;
        gridContainer.appendChild(cardElement); 
        cardElement.addEventListener("click", flipCard);
    } 
}

function flipCard() {
    // ไม่ให้คลิกระหว่างตรวจสอบคู่
    if (lockBoard) return;
    // ไม่ให้การคลิกการ์ดใบเดิมซ้ำ
    if (this === firstCard) return;

    // สั่งให้การ์ดพลิก
    this.classList.add("flipped");

    if (!firstCard) {
        // นี่คือการ์ดใบแรก
        firstCard = this;
        return;
    }

    // นี่คือการ์ดใบที่สอง
    secondCard = this;
    // ล็อกบอร์ดชั่วคราวเพื่อตรวจสอบ
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    // ถ้าเจอคู่: disableCards() (ทำให้หายไป), ถ้าไม่เจอ: unflipCards() (พลิกกลับ)
    isMatch ? disableCards() : unflipCards();
}

function disableCards () {

    firstCard.removeEventListener ("click", flipCard);

    secondCard.removeEventListener("click", flipCard); 

    // ใช้ setTimeout เพื่อให้ผู้เล่นเห็นการ์ดที่พลิกก่อน แล้วค่อยซ่อน
    setTimeout(() => {
        // ทำให้การ์ดหายไป
        firstCard.style.visibility = 'hidden'; 
        secondCard.style.visibility = 'hidden'; 
        
        // อัปเดตคะแนน
        score++;
        document.querySelector(".score").textContent = score;
        
        // รีเซ็ต
        resetBoard();
    }, 1000); 
}

function unflipCards () {
    setTimeout ( () => {
        // ลบ class "flipped" เพื่อพลิกการ์ดกลับ
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        // รีเซ็ต
        resetBoard();
    }, 1000);
}
        
function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function restart() {
    resetBoard ();
    shuffleCards() ;
    score = 0;
    document.querySelector(".score").textContent = score;
    // ลบการ์ดเดิมทั้งหมด
    gridContainer.innerHTML = "" ;
    // สร้างการ์ดชุดใหม่
    generateCards( );
}