/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, useState, ReactNode } from 'react';

export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  createdAt: Date;
  updatedAt?: Date;
  finishedDate?: Date;
}

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
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function markCurrentCycleAsFinished() {
    setCycles((state) => state.map((cycle) => {
      if (cycle.id === activeCycleId) {
        return {
          ...cycle,
          finishedDate: new Date(),
        };
      }
      return cycle;
    }));
  }

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

    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(id);
    setAmountSecondsPassed(0);
  }

  function interruptCurrentCycle() {
    setCycles((state) => state.map((cycle) => {
      if (cycle.id === activeCycleId) {
        return {
          ...cycle,
          updatedAt: new Date(),
        };
      }
      return cycle;
    }));
    setActiveCycleId(null);
  }

  return (
    <CyclesContext.Provider value={{
      cycles,
      activeCycle,
      activeCycleId,
      markCurrentCycleAsFinished,
      amountSecondsPassed,
      setSecondsPassed,
      createNewCycle,
      interruptCurrentCycle,
    }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
