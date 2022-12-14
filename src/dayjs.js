import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isBetween from 'dayjs/plugin/isBetween';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';

dayjs.extend(utc);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);

/**
 * 根据区间计算每六分钟的间隔 list
 * @param startTime 计算开始时间
 * @param endTime 计算结束时间
 * @param options<paddingLeft> 是否向前补齐
 * @param options<paddingRight> 是否向后补齐
 */
export function mockDataTime(startTime, endTime, options = {
  interval: 5, 
  paddingRight: true,
  paddingLeft: true,
}) {
  const before = dayjs(startTime);
  const after = dayjs(endTime);
  const diff = after.diff(before, 'minute');
  const num = Math.floor(diff / options.interval) + (options.paddingLeft ? 1 : 0) + (options.paddingRight ? 1 : 0);
  const times = [];
  let mid = '';
  for (let i = 0; i < num; i++) {
    if (i === 0) {
      const start = before.minute();
      const val = start + options.interval - (start % options.interval);
      const min = val - ((options.paddingLeft && val >= options.interval) ? options.interval : 0);
      if (min > 59) {
        mid = before.set('hour', before.hour() + 1);
      } else {
        mid = before.minute(min);
      }
    } else {
      mid = mid.add(options.interval, 'minute');
    }

    if (mid.isSameOrBefore(after)) {
      times.push({
        id: mid.format('YYYYMMDDHHmm'),
        time: mid.format('HH:mm'),
        fullTime: mid,
        formatTime: mid.format('YYYY.MM.DD HH:mm'),
      });
    } else if (mid.isSameOrAfter(after) && options.paddingRight) {
      times.push({
        id: mid.format('YYYYMMDDHHmm'),
        time: mid.format('HH:mm'),
        fullTime: mid,
        formatTime: mid.format('YYYY.MM.DD HH:mm'),
      });
    }
  }

  return times;
}

// eslint-disable-next-line no-shadow
export const date = (date, fmt = 'YYYY-MM-DD') => {
  let str = '';
  const dayObject = dayjs(date);
  if (date && dayObject.isValid()) {
    str = dayObject.format(fmt);
  }
  return str;
};

export const time = (d, fmt = 'YYYY-MM-DD HH:mm:ss') => date(d, fmt);

export const minute = (d, fmt = 'YYYY-MM-DD HH:mm') => date(d, fmt);

export const second = (d, fmt = 'HH:mm:ss') => date(d, fmt);

export const month = (d, fmt = 'YYYY-MM') => date(d, fmt);

export const day = (d, fmt = 'MM/DD') => date(d, fmt);

export const hour = (d, fmt = 'HH:mm') => date(d, fmt);

export const formatTime = (dataTime, idx) => {
  if (!dataTime) return '';

  if (idx === 0) {
    return '现在';
  }

  const dayObject = dayjs(dataTime);
  // eslint-disable-next-line no-shadow
  let hour = '';
  if (dayObject.isValid()) {
    hour = dayObject.format('HH:mm');
  }

  if (idx > 0) {
    return hour === '00:00' ? '明天' : hour;
  }
  return '';
};

export function formatNearTime(dataTime) {
  let timeStr = '--:--';
  if (!dataTime) return timeStr;
  const dayObject = dayjs(parseInt(`${dataTime}000`, 10));
  if (dayObject.isValid()) {
    timeStr = dayObject.format('HH:mm');
  }
  return timeStr;
}

export const weekOmit = {
  0: '周日',
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
};

export const FormmatTime = (time)=>{
  let timeFormmat = time;
  if(time.indexOf('.')>0){
    timeFormmat = time.replace(/\./g,'-');
  }
  return timeFormmat;
}

export function secondsFormat( s ) {
  var day = Math.floor( s/ (24*3600) ); // Math.floor()向下取整
  var hour = Math.floor( (s - day*24*3600) / 3600);
  var minute = Math.floor( (s - day*24*3600 - hour*3600) /60 );
  var second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
  let result = '';
  if (day > 0) {
    result += day + "天" + hour + "小时" + minute + "分钟";
  } else if (hour > 0) {
    result += hour + "小时" + minute + "分钟";
  } else if (minute > 0) {
    result += minute + "分钟";
  } else {
    result += second + "秒钟";
  }
  return result;
}
export default dayjs;
