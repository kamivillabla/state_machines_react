import React, { useState, useEffect } from 'react';
import './Tickets.css';

export const Tickets = ({ send, context }) => {
  const [showGratitude, setShowGratitude] = useState(false);

  const finish = () => {
    send('FINISH');
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGratitude(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className='Tickets'>
      {showGratitude ? (
        <p className='Tickets-description description'>
          ¡Gracias por tu compra!
        </p>
      ) : (
        <p className='Tickets-description description'>
          Gracias por volar con book a fly 💚
        </p>
      )}

      <div className='Tickets-ticket'>
        <div className='Tickets-country'>{context.selectedCountry}</div>
        <div className='Tickets-passengers'>
          {context.passangers.map((passenger, index) => (
            <p key={`${passenger}${index}`}>{passenger}</p>
          ))}
          <span>✈</span>
        </div>
      </div>
      <button onClick={finish} className='Tickets-finalizar button'>
        Finalizar
      </button>
    </div>
  );
};
