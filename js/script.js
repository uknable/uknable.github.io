let cards = document.getElementsByClassName("project-cards");

let cardNames = ["facade", "tiles", "poem", "flower"];



for (let i=0; i<cards.length; i++) {

    cards[i].addEventListener("mouseout", (event) => {
        event.target.src = "../img/cards/" + cardNames[i] + "_card.gif";
    });
    cards[i].addEventListener("mouseover", (event) => {
        event.target.src = "../img/cards/" + cardNames[i] + "_anim.gif";
    });

}

