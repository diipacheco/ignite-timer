/* eslint-disable react/jsx-no-constructed-context-values */
import {
  createContext, useState, ReactNode, useReducer,
  useEffect,
} from 'react';

import { differenceInSeconds } from 'date-fns';
import { cyclesReducer, Cycle } from '../reducers/cycles/reducer';
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  makeCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions';

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface ICyclesContext {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  // eslint-disable-next-line no-unused-vars
  createNewCycle: (data: CreateCycleData) => void;
  // eslint-disable-next-line no-unused-vars
  setSecondsPassed: (seconds: number) => void;
  interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as ICyclesContext);

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  }, (initialState) => {
    const storageStateAsJson = localStorage.getItem('@ignite-timer:cycles-state-1.0.0');

    if (storageStateAsJson) {
      return JSON.parse(storageStateAsJson);
    }
    return initialState;
  });
  const { cycles, activeCycleId } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.createdAt));
    }

    return 0;
  });

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      createdAt: new Date(),
    };

    dispatch(addNewCycleAction(newCycle));
    setAmountSecondsPassed(0);
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction());
  }

  function markCurrentCycleAsFinished() {
    dispatch(makeCurrentCycleAsFinishedAction());
  }

  useEffect(() => {
    const stateJson = JSON.stringify(cyclesState);

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJson);
  }, [cyclesState]);

  return (
    <CyclesContext.Provider value={{
      cycles,
      activeCycle,
      activeCycleId,
      amountSecondsPassed,
      setSecondsPassed,
      createNewCycle,
      interruptCurrentCycle,
      markCurrentCycleAsFinished,
    }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
