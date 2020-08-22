import React, {useState, useRef, useEffect} from 'react';
import axios from 'axios';
import Card from './Card'
import './CardGame.css'

const CARD_API_URL = "https://deckofcardsapi.com/api/deck";

const CardGame = () => {
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        async function getDeck() {
            const res = await axios.get(`${CARD_API_URL}/new`);
            setDeck({
                id: res.data.deck_id,
                remaining: res.data.remaining
            });
        };
        getDeck();
    }, [])
    
    useEffect(() => {
        async function getCard() {
            const res = await axios.get(`${CARD_API_URL}/${deck.id}/draw`);
            setDeck(deck => ({
                id: deck.id,
                remaining: res.data.remaining
            }));
            if (deck.remaining === 1) {
                setAutoDraw(false);
                setGameOver(true);
            };
            const card = res.data.cards[0];
            setCards(cards => [...cards, {
                code: card.code,
                image: card.image
            }]);
        }

        if (autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async () => {
                await getCard();
            }, 1000)
        }

        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [autoDraw, deck]);
    

    const toggleAutoDraw = () => {
        setAutoDraw(a => !a)
    };

    async function playAgain() {
        const res = await axios.get(`${CARD_API_URL}/${deck.id}/shuffle`);
        setDeck({
            id: res.data.deck_id,
            remaining: res.data.remaining
        })
        setGameOver(false)
        setCards([])
    };

    const playAgainButton = <button className="CardGame-button" onClick={playAgain}>Play again?</button>;
    const autoDrawButton = <button className="CardGame-button" onClick={toggleAutoDraw}>
        {autoDraw ? "No more cards pls" : "Give cards pls"}
        </button>;

    return (
        <div className="CardGame">
            {gameOver ? playAgainButton : autoDrawButton}
            <div className="CardGame-cards">{cards ? cards.map(c => <Card key={c.code} image={c.image}/>) : ""}</div>
        </div>
    )
}

export default CardGame;