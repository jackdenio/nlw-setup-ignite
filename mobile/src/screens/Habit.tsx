import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { CheckBox } from "../components/CheckBox";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import { HabitsEmpty } from "../components/HabitsEmpty";
import clsx from "clsx";
import dayjs from "dayjs";

interface Params {
  date: string;
}

interface DayInfoProps {
  completeHabbir: string[];
  possibleHabits: {
    id: string;
    title: string;
  }[];
}

export function Habit(){
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
  const [completedHabits, setCompletedHabits] = useState<String[]>([]);

  const route = useRoute();
  const {date} = route.params as Params;

  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date());
  const dayOfWeek = parsedDate.format('dddd');
  const dayAndMonth = parsedDate.format('DD/MM');

  const habitsProgress = dayInfo?.possibleHabits.length 
  ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length) 
  : 0;

  async function fetchHabits() {
    try {
      setLoading(true);

      const response = await api.get('/day', { params: { date } })
      setDayInfo(response.data);
      setCompletedHabits(response.data.completedHabits);
      
      
    } catch (error) {
      console.log(error);
      Alert.alert('Ops', 'Não foi carregar as informações');
      
    } finally {
      setLoading(false);

    }
  }

  async function handleToggleHabit(habitId: string) {
    
    try {
      await api.patch(`/habits/${habitId}/toggle`)
      if(completedHabits.includes(habitId)) {
        setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId));
      } else {
        setCompletedHabits(prevState => [...prevState, habitId]);
      }

    } catch (error) {
      console.log(error);
      Alert.alert('Ops', 'Não foi possível atualizar o hábito');
      
    }


  }

  useEffect(() => {
    fetchHabits();
  }, [])

  if(loading) {
    return(
      <Loading />
    );
  }

  console.log(date);
  return(
    <View className="flex-1 bh-background px-8 pt-16">
      <ScrollView 
        showsVerticalScrollIndicator={false}
      >
        <BackButton />
        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>
        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>
        <ProgressBar progress={habitsProgress}/> 
        <View className={clsx("mt-6", {
          ["opacity-50"]: isDateInPast
        })}>
          {
            dayInfo?.possibleHabits ? 
            dayInfo?.possibleHabits.map(habit => (
              <CheckBox 
                key={habit.id}
                title={habit.title}
                checked={completedHabits.includes(habit.id)}
                disabled={isDateInPast}
                onPress={() => handleToggleHabit(habit.id)}
              />                
            ))

            :
            <HabitsEmpty />
            
          }      
        </View> 

        {
          isDateInPast && ( 
            <Text className="text-white mt-10 text-center">
              Você não pode modificar hábitos passados
            </Text>
           )
        }
        
      </ScrollView>      

    </View>
  )
}