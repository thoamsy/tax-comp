import React, { useEffect, useMemo, useRef, useState } from 'react';
import isEqual from 'lodash/isEqual';
import { taxesWholeYear, taxesEachMonth } from '../lib/tax';

const Field = ({
  label,
  type = 'text',
  children,
  value,
  onChange,
  ...rest
}) => {
  const inputClassName =
    'mt-1 p-2 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white dark:focus:bg-gray-900 focus:ring-0 dark:bg-gray-800';
  return (
    <label className="block">
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
      {children ? (
        React.cloneElement(children, {
          className: inputClassName,
          type,
          value,
          onChange,
        })
      ) : (
        <input
          value={value}
          onChange={onChange}
          type={type}
          className={inputClassName}
          {...rest}
        />
      )}
    </label>
  );
};

const isUp = '📈';
const isDown = '📉';

const formatter = new Intl.NumberFormat();
const StatItem = ({ label, value, prevValue = 0 }) => {
  const icon = prevValue ? (value > prevValue ? isUp : isDown) : undefined;
  const needMore = value > prevValue;

  const showDifference = value !== prevValue && !!prevValue;
  const difference = formatter.format(Math.abs(value - prevValue).toFixed(2));

  return (
    <div className="w-1/2 h-32 md:h-24 flex flex-col items-center justify-center">
      <h2 className="text-lg md:text-2xl dark:text-white text-gray-700 font-bold">
        {formatter.format(value)}
      </h2>
      <h4 className="flex flex-col md:flex-row justify-around items-center text-gray-400 text-sm dark:text-gray-300">
        {label}
        {showDifference && (
          <span
            className={`
              ml-2
              ${
                needMore
                  ? ' text-red-500 dark:text-red-700'
                  : ' text-green-300 dark:text-green-600'
              }
              `}
          >
            {difference}
            {icon}
          </span>
        )}
      </h4>
    </div>
  );
};

const Stat = ({ tax = 0, incomeAfterTax = 0, className = '', prev }) => {
  return (
    <div
      className={`rounded-lg dark:bg-gray-800 dark:border-gray-700 divide-x dark:divide-gray-700 divide-gray-200 shadow-md flex ${className}`}
    >
      <StatItem label="总纳税" prevValue={prev?.tax} value={tax} />
      <StatItem
        label="税后收入"
        prevValue={prev?.incomeAfterTax}
        value={incomeAfterTax}
      />
    </div>
  );
};

const mockLocalStorage =
  typeof localStorage !== 'undefined'
    ? localStorage
    : { getItem() {}, setItem() {} };

// Hook
function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = mockLocalStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      mockLocalStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const Form = () => {
  const [formValue, setFormValue] = useLocalStorage('formValue', {
    publicReserveFund: 12,
    endowmentInsurance: 8,
    medicalInsurance: 2.25,
    income: 10000,
    exempt: 0,
  });
  const prevValue = useRef();
  const [incomeOfEachMonth, setIncomeOfEachMonth] = useState(() =>
    Array.from({ length: 12 }).fill(0),
  );

  const isSmall =
    typeof window !== 'undefined' ? window.innerWidth < 500 : false;

  const options = useMemo(
    () => ({
      darkMode: 'auto',
      xAxis: {
        type: 'category',
        data: months,
        nameTextStyle: {
          fontFamily: 'system-ui',
        },
      },
      yAxis: {
        offset: isSmall ? -5 : 0,
        type: 'value',
        scale: true,
        nameTextStyle: {
          fontFamily: 'system-ui',
        },
        axisLabel: {
          formatter(value) {
            return value / 1000 + 'K';
          },
        },
      },
      series: [
        {
          label: {
            show: !isSmall,
            position: 'top',
            fontFamily: 'system-ui',
          },
          data: incomeOfEachMonth,
          type: 'bar',
          name: '当月工资',
        },
      ],
    }),
    [incomeOfEachMonth],
  );

  const onChangeWithKey = (key) => (event) => {
    setFormValue((value) => {
      return {
        ...value,
        [key]: event.target.value ? Number(event.target.value) : '',
      };
    });
  };

  const [result, setResult] = useState({
    tax: 0,
    taxableIncome: 0,
    incomeAfterTax: 0,
  });

  const echartsContainer = useRef();
  const echartsInstance = useRef();

  useEffect(() => {
    // 初始化完成
    if (!echartsInstance.current) {
      return import('echarts').then((echarts) => {
        echartsInstance.current = echarts.init(echartsContainer.current);
        echartsInstance.current.setOption(options);
      });
    }

    echartsInstance.current.setOption(options);
    //  echartsContainer.current
  }, [incomeOfEachMonth, options]);

  return (
    <div className="w-screen px-4">
      <section className=" md:container md:mx-auto md:w-4/6">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">个税计算</h2>
        <Stat
          prev={prevValue.current}
          {...result}
          className="mb-4 min-w-full sm:w-full md:w-96"
        />
        <div
          ref={echartsContainer}
          className="h-80"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Charts 加载中
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setResult((prev) => {
              const next = taxesWholeYear(formValue);
              setIncomeOfEachMonth(
                taxesEachMonth(formValue).map((tax) => formValue.income - tax),
              );
              if (!isEqual(prev, next)) {
                prevValue.current = prev;
              }
              return next;
            });
          }}
          className="grid grid-cols-1 gap-4"
        >
          <Field
            value={formValue['income']}
            onChange={onChangeWithKey('income')}
            type="number"
            min="0"
            step="100"
            label="税前收入"
            required
          />
          <Field
            value={formValue['exempt']}
            onChange={onChangeWithKey('exempt')}
            type="number"
            step="100"
            min="0"
            label="个税减免"
            required
          />
          <Field
            value={formValue['publicReserveFund']}
            onChange={onChangeWithKey('publicReserveFund')}
            type="number"
            label="公积金"
            step="1"
            min="5"
            max="20"
            required
          />
          <Field
            value={formValue['endowmentInsurance']}
            onChange={onChangeWithKey('endowmentInsurance')}
            type="number"
            label="养老保险"
            max="10"
            step="0.5"
            min="2"
            required
          />
          <Field
            value={formValue['medicalInsurance']}
            onChange={onChangeWithKey('medicalInsurance')}
            type="number"
            label="其他"
            step="0.25"
            min="2"
            max="4"
            required
          />
          <button className="mt-3 dark:bg-green-700 bg-green-500 w-full active:bg-green-800 text-white p-2 rounded-md sm:w-32">
            查看
          </button>
        </form>
      </section>
    </div>
  );
};

export default Form;
