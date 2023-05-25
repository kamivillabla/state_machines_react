import React from 'react';
import './Nav.css';

export const Nav = ({ state, send }) => {
  const goToWelcome = () => {
    send('CANCEL');
  };
  const goToAtras = () => {
    send('RETURN');
  };
  return (
    <nav className='Nav'>
      <h1 className='Nav-logo'>Book a fly ✈</h1>
      {state.matches('passengers') && (
        <button onClick={goToAtras} className='Nav-cancel button-secondary'>
          atras
        </button>
      )}
      {!state.matches('initial') && !state.matches('tickets') && (
        <button onClick={goToWelcome} className='Nav-cancel button-secondary'>
          Cancelar
        </button>
      )}
    </nav>
  );
};
