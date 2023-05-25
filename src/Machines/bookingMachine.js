import { assign, createMachine } from 'xstate';

const bookingMachine = createMachine(
  {
    id: 'buy plane tickets',
    initial: 'initial',
    context: {
      passangers: [],
      selectedCountry: '',
    },
    states: {
      initial: {
        on: {
          START: {
            target: 'search',
          },
        },
      },
      search: {
        on: {
          CONTINUE: {
            target: 'passengers',
            actions: assign({
              selectedCountry: (contex, event) => event.selectedCountry,
            }),
          },
          CANCEL: {
            target: 'initial',
            actions: 'CleanContext',
          },
        },
      },
      tickets: {
        on: {
          FINISH: {
            target: 'initial',
            actions: 'cleanContext',
          },
          CANCEL: {
            target: 'initial',
            actions: 'cleanContext',
          },
        },
      },
      passengers: {
        on: {
          DONE: 'tickets',
          CANCEL: {
            target: 'initial',
            actions: 'cleanContext',
          },
          RETURN: {
            target: 'search',
            actions: 'cleanContextPassengers',
          },
          ADD: {
            // le doy target de passengers a passengers mismo porque no quiero salir de pasajeros.
            target: 'passengers',
            actions: assign((context, event) => ({
              passangers: [...context.passangers, event.newPassenger], // Copia del array con el nuevo pasajero
            })),
          },
        },
      },
    },
  },
  {
    actions: {
      cleanContext: assign({
        selectedCountry: '',
        passangers: [],
      }),
      cleanContextPassengers: assign({
        passangers: [],
      }),
      listado: assign({
        passangers: (context, event) => event.passangers,
      }),
    },
  }
);

export default bookingMachine;
