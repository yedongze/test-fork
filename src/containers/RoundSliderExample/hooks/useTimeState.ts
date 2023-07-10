import moment from '../../../utils/moment';
import { useState, useEffect, useCallback } from 'react';
import { Moment } from "moment";

const MOMENT_FORMAT =
  "dddd, DD [ de ] MMMM [ del ] YYYY, hh:mm:ss a";


enum ClockTypes {
  BEDTIME = "bedtime",
  WAKEUP = "wakeup",
};

enum DateTimeFormats {
  CURRENT_DATE_TIME = "YYYY/MM/DD HH:mm:ss",
  TIME = "HH:mm",
  TWENTY_FOUR_HOURS = "HH:mm:ss",
  MOMENT_FORMAT = "dddd, DD [ de ] MMMM [ del ] YYYY, hh:mm:ss a",
}

type AlarmTimeType = {
  bedtime: Moment,
  wakeup: Moment,
  currentDateTime: string,
};


const useTimeState = () => {
  // Este valor es para validar la fecha actual del día de hoy contra 
  // la validación de la sumatoria de las horas de sueño + la alarma
  // si supera las 24 horas, entonces se deberán de cambiar los colores.
  const actualMomentDate = moment();
  const [time, setTime] = useState<Array<string>>([]);
  const [loading, setLoading] = useState(true);
  const [intervalId, setIntervalId] = useState(0);
  const [currentTime, setCurrentTime] = useState<string>(
    moment().format(MOMENT_FORMAT),
  );
  const [alarmRange, setAlarmRange] = useState<AlarmTimeType>({
    bedtime: moment(),
    wakeup: moment(),
    currentDateTime: moment().format("")
  })
  useEffect(() => {
    const finalDayHour = moment("23:59", "HH:mm");
    let arrTime: string[] = [];
    let initialDayHour;
    for (
      initialDayHour = moment("00:00", "HH:mm");
      initialDayHour.toDate() <= finalDayHour.toDate();
      initialDayHour.add(1, "m")
    ) {
      arrTime.push(initialDayHour.format("HH:mm"));
    }
    setTime(arrTime);
  }, []);

  /** Key puede ser bedtime o wakeup */
  const handleSetime = useCallback((key: ClockTypes) => (value: string): void => {
    let [
      hours,
      minutes,
    ] = value.split(':');
    const H = parseInt(hours, 10);
    const M = parseInt(minutes, 10);
    if(moment.isMoment(alarmRange[key])) {
      setAlarmRange((alarm: AlarmTimeType): AlarmTimeType => {
        alarm[key]
          .set({
            hours: H,
            minutes: M,
          });
        alarm.currentDateTime = alarm[key]
          .format(DateTimeFormats.CURRENT_DATE_TIME);
        return alarm;
    });
    }
  }, [alarmRange])

  useEffect(() => {
    if (time.length > 0) {
      setLoading(false);
    }
  }, [time]);

  /* useEffect(() => {
    const [
      bhours,
      bminutes,
    ] = alarmRange
      .bedtime
      .format(DateTimeFormats.TIME)
      .split(":");
    const [
      whours,
      wminutes,
    ] =
      alarmRange
      .wakeup
      .format(DateTimeFormats.TIME)
      .split(":");
    const H24 = moment()
      .add(1, 'day');
    const isMoreThanOneDay = moment()
      .add({
        hours: parseInt(bhours, 10),
        minutes: parseInt(bminutes, 10),
      })
      .add({
        hours: parseInt(whours, 10),
        minutes: parseInt(wminutes, 10),
      })
      const isAfterThanToday = isMoreThanOneDay
        .isAfter(H24.format(DateTimeFormats.CURRENT_DATE_TIME))
    if (isAfterThanToday) {
      console.log("La sumatoria de la fecha entre el ")
    }
  },[alarmRange.currentDateTime]) */
  

  const createTimer = useCallback(() => {
    let interval: any;
    interval = setInterval(() => {
      setCurrentTime(moment().format(MOMENT_FORMAT));
    }, 1000);
    setIntervalId(interval)
    return () => {
      clearInterval(interval);
    };
  }, [])

  const stopTimer = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  }, [intervalId])

  return {
    createTimer,
    stopTimer,
    time,
    loading,
    currentTime,
    actualMomentDate,
    alarmRange,
    handlers: {
      handleSetime,
    },
  };
};

export default useTimeState;
