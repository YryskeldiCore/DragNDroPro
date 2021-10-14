import React, { useState } from 'react';

const Card = () => {

    const [cards, setCards] = useState([
        {id:1, order: 1, name: '1st Card'},
        {id:2, order: 2, name: '2nd Card'},
        {id:3, order: 3, name: '3rd Card'},
        {id:4, order: 4, name: '4th Card'},
    ]);

    const [currentCard, setCurrentCard] = useState(null);

    const dragStartHandler = (card) => {
        console.log('drag start', card.name);
        setCurrentCard(card);
    }

    const dragLeaveHandler = (e, name) => {
        console.log('drag leave', name);
        e.target.style.backgroundColor = 'white';
    }

    const dragOverHandler = (e, name) => {
        e.preventDefault();
        console.log('drag over', name);
        e.target.style.backgroundColor = 'red';
    }

    const dragEndHandler = (e, name) => {
        console.log('drag end', name);
        e.target.style.backgroundColor = 'white';
    }

    const dropHandler = (e, card) => {
        e.preventDefault()
        setCards(cards.map(c => {
            if(c.id === card.id){
                return {...c, order: currentCard.order};
            }
            if(c.id === currentCard.id){
                return {...c, order: card.order};
            }

            return c;
        }))
    }

    const sortCard = (a, b) => {
        if(a.order > b.order){
            return 1;
        } else {
            return -1;
        }
    }
    
    return(
        <div className="cards">
            {cards.sort(sortCard).map(card => (
                <div 
                    key={card.id}
                    draggable={true}
                    onDragStart={() => dragStartHandler(card)}
                    onDragLeave={(e) => dragLeaveHandler(e, card.name)}
                    onDragOver={(e) => dragOverHandler(e, card.name)}
                    onDragEnd={(e) => dragEndHandler(e, card.name)}
                    onDrop={(e) => dropHandler(e, card)}
                    className="card">
                        {card.name}
                </div>
            ))}
        </div>
    )
    
}

export default Card;