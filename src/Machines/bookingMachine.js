import { assign, createMachine } from 'xstate';
import { fetchCountries } from '../Utils/api';

// maquina hija de search
const fillCountries = {
  initial: 'loading',
  states: {
    loading: {
      // invoca un servicio
      invoke: {
        id: 'getCountries',
        // la función que llamamos en el servicio
        src: () => fetchCountries,
        // cuando finalice exitosamente
        onDone: {
          target: 'success',
          actions: assign({
            countries: (contex, event) => event.data,
          }),
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: 'Fallo el request',
          }),
        },
      },
    },
    success: {},
    failure: {
      on: {
        RETRY: { target: 'loading' },
      },
    },
  },
};
const bookingMachine = createMachine(
  {
    id: 'buy plane tickets',
    initial: 'initial',
    context: {
      passangers: [],
      selectedCountry: '',
      countries: [],
      error: '',
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
        ...fillCountries,
      },
      tickets: {
        after: {
          5000: {
            target: 'initial',
            actions: ['cleanContext', 'showGratitude'],
          },
        },
        on: {
          FINISH: {
            target: 'initial',
            actions: ['cleanContext', 'showGratitude'],
          },
        },
      },
      passengers: {
        on: {
          DONE: {
            target: 'tickets',
            cond: 'moreThanOnePassenger',
          },
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
    },
    guards: {
      moreThanOnePassenger: (context) => {
        return context.passangers.length > 0;
      },
    },
  }
);

export default bookingMachine;
