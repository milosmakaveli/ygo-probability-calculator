import React, { useState, useEffect } from 'react';
import './Calculator.css'
import Logo from '../assets/logo.png'

function Calculator() {
    const [deckSize, setDeckSize] = useState(40);
    const [handSize, setHandSize] = useState(6);
    const [cards, setCards] = useState([{ name: 'Thunder Dragon', copies: 3, min: 1, max: 3 }]);
    const [probability, setProbability] = useState(null);
    const [remainingCards, setRemainingCards] = useState(40);
    const [deckSizeInput, setDeckSizeInput] = useState("40");

    useEffect(() => {
        if (deckSize && handSize) {
            const remaining = deckSize - handSize;
            setRemainingCards(remaining);
        }
    }, [deckSize, handSize]);

    // Recalculate probability whenever any relevant input changes
    useEffect(() => {
        const N = parseInt(deckSize);
        const n = parseInt(handSize);
        let finalProbability = 1;

        for (let card of cards) {
            const K = Math.min(3, Math.max(1, parseInt(card.copies)));
            const min = Math.max(0, parseInt(card.min));
            const max = Math.min(K, parseInt(card.max));
            let cardProbability = 0;

            for (let i = min; i <= max; i++) {
                cardProbability = cardProbability + hypergeometric(N, K, n, i);
            }

            finalProbability = finalProbability * cardProbability;
        }

        setProbability((finalProbability * 100).toFixed(2));
    }, [deckSize, handSize, cards]);

    // Handle changes to card properties (name, copies, min, max)
    const handleCardChange = (index, field, value) => {
        const newCards = [...cards];
        newCards[index][field] = value;
        setCards(newCards);
    };

    // Handle card name change
    const handleNameChange = (index, value) => {
        const newCards = [...cards];
        newCards[index].name = value;
        setCards(newCards);
    };

    const addCard = () => {
        setCards([...cards, { name: '', copies: 3, min: 1, max: 3 }]);
    };

    const removeCard = (index) => {
        const newCards = [...cards];
        newCards.splice(index, 1);
        setCards(newCards);
    };

    // Calculate the factorial
    const factorial = n => {
        if (n <= 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
    };

    // Combination formula: n choose r
    const combination = (n, r) => {
        if (r < 0 || r > n) return 0;
        return factorial(n) / (factorial(r) * factorial(n - r));
    };

    // Hypergeometric probability function
    const hypergeometric = (N, K, n, k) => {
        return combination(K, k) * combination(N - K, n - k) / combination(N, n);
    };

    const handleDeckSizeChange = e => {
        const value = e.target.value;
        if (value === "") {
            setDeckSizeInput("");
        } else {
            setDeckSizeInput(value);
            const parsedValue = parseInt(value, 10);

            if (!isNaN(parsedValue)) {
                if (parsedValue < 40) {
                    setDeckSize(40);  
                } else if (parsedValue > 60) {
                    setDeckSize(60);  
                } else {
                    setDeckSize(parsedValue);  
                }
            }
        }
    };

    // Handle hand size input and ensure it's between 1 and 6
    const handleHandSizeChange = e => {
        let newHandSize = parseInt(e.target.value);
        if (newHandSize < 1) newHandSize = 1;
        if (newHandSize > 6) newHandSize = 6;
        setHandSize(newHandSize);
    };

    return (
        <div className="Calculator">
            <div className="logo-container">
                <img src={Logo} alt="Yu-Gi-Oh Logo" className="logo" />
            </div>

            <h3>Yu-Gi-Oh! GOAT Format Deck Probability Calculator</h3>
            <p>
                Easily improve your deck with the power of math! Make better decisions during deck-building.
            </p>
            <hr />
            <div className="input-group">
                <label>Deck Size (40–60):</label>
                <input
                    type="number"
                    value={deckSizeInput}
                    onChange={handleDeckSizeChange}
                    min="40"
                    max="60"
                />
            </div>

            <div className="input-group">
                <label>Hand Size (1–6):</label>
                <input
                    type="number"
                    value={handSize}
                    onChange={handleHandSizeChange}
                    min="1"
                    max="6"
                />
            </div>

            <div className="remaining-cards">
                <h4>Remaining Cards in Deck: {remainingCards}</h4>
            </div>
            <h4>Cards you want to see in your opening hand:</h4>
            {cards.map((card, index) => (
                <div key={index} className="card-input">
                    <div className="card-input-fields">
                        <button className="add-card-next" onClick={addCard} title='Add Card'>+</button>

                        <div className="card-input-field">
                            <label>Card Name:</label>
                            <input
                                type="text"
                                placeholder="Card Name"
                                value={card.name}
                                onChange={e => handleNameChange(index, e.target.value)}
                            />
                        </div>

                        <div className="card-input-field">
                            <label>Amt:</label>
                            <input
                                type="number"
                                value={card.copies}
                                min="1"
                                max="3"
                                onChange={e => handleCardChange(index, 'copies', e.target.value)}
                            />
                        </div>

                        <div className="card-input-field">
                            <label>Min:</label>
                            <input
                                type="number"
                                value={card.min}
                                min="0"
                                max={card.copies}
                                onChange={e => handleCardChange(index, 'min', e.target.value)}
                            />
                        </div>

                        <div className="card-input-field">
                            <label>Max:</label>
                            <input
                                type="number"
                                value={card.max}
                                min="0"
                                max={card.copies}
                                onChange={e => handleCardChange(index, 'max', e.target.value)}
                            />
                        </div>

                        {cards.length > 1 && (
                            <button className="remove-card" onClick={() => removeCard(index)} title='Remove Card'>
                                X
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {probability !== null && (
                <div className="result visible">
                    <h5>Chances you open this hand are: {probability}%</h5>
                </div>
            )}
        </div>
    );
}

export default Calculator;
