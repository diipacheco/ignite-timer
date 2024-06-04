/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import * as zod from 'zod';
import { HandPalm, Play } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { differenceInSeconds } from 'date-fns';

import { NewCycleForm } from './components/NewCycleForm';
import { CountDown } from './components/CountDown';

import {
  HomeContainer,
  StartCountDownButton,
  StopCountDown,
} from './styles';

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser no mínimo de 5 minutos')
    .max(60, 'O ciclo precisa ser no máximo de 60 minutos'),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  createdAt: Date;
  updatedAt?: Date;
  finishedDate?: Date;
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    reset,
  } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  });

  function handleCreateNewCycle(data: NewCycleFormData) {
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

    reset();
  }

  function handleInterruptCycle() {
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

  const taskInputValue = watch('task');
  const isSubmitDisabled = !taskInputValue;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, '0');
  const seconds = String(secondsAmount).padStart(2, '0');

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.createdAt,
        );

        if (secondsDifference >= totalSeconds) {
          setCycles((state) => state.map((cycle) => {
            if (cycle.id === activeCycleId) {
              return {
                ...cycle,
                finishedDate: new Date(),
              };
            }
            return cycle;
          }));

          setAmountSecondsPassed(totalSeconds);

          clearInterval(interval);
        } else {
          setAmountSecondsPassed(secondsDifference);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [activeCycle, totalSeconds, activeCycleId]);

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`;
    } else {
      document.title = 'Ignite Timer';
    }
  }, [minutes, seconds, activeCycle]);

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <NewCycleForm />

        <CountDown />

        {activeCycle ? (
          <StopCountDown onClick={() => handleInterruptCycle()} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountDown>
        ) : (
          <StartCountDownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountDownButton>
        )}

      </form>
    </HomeContainer>
  );
}
