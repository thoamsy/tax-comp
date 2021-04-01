import React, { useRef, useState } from 'react';
import { taxesWholeYear } from '../lib/tax';

const Field = ({
  label,
  type = 'text',
  children,
  value,
  onChange,
  ...rest
}) => {
  const inputClassName =
    'mt-1 p-2 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0';
  return (
    <label className="block">
      <span className="text-gray-700">{label}</span>
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
  const icons = prevValue ? (value > prevValue ? isUp : isDown) : undefined;
  const needMore = value > prevValue;
  const difference =
    value !== prevValue && prevValue
      ? formatter.format(Math.abs(value - prevValue).toFixed(2))
      : false;

  return (
    <div className="w-1/2 h-32 md:h-24 flex flex-col items-center justify-center">
      <h2 className="text-lg md:text-2xl text-gray-700 font-bold">
        {formatter.format(value)}
      </h2>
      <h4 className="text-gray-400 text-sm">
        {label}
        <span className={needMore ? 'text-red-500' : 'text-green-300'}>
          {icons}
          {difference}
        </span>
      </h4>
    </div>
  );
};

const Stat = ({
  tax = 0,
  taxableIncome = 0,
  pendingTaxRevenue = 0,
  className = '',
  prev,
}) => {
  return (
    <div
      className={`rounded-lg divide-x divide-gray-200 shadow-md flex ${className}`}
    >
      <StatItem label="总纳税" prevValue={prev?.tax} value={tax} />
      <StatItem
        label="全年待纳税收入"
        prevValue={prev?.taxableIncome}
        value={taxableIncome}
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

const Form = () => {
  const [formValue, setFormValue] = useLocalStorage('formValue', {
    publicReserveFund: 12,
    endowmentInsurance: 8,
    medicalInsurance: 2.25,
    income: 25000,
    exempt: 1500,
  });
  const prevValue = useRef();

  const onChangeWithKey = (key) => (event) => {
    setFormValue((value) => {
      return {
        ...value,
        [key]: Number(event.target.value),
      };
    });
  };

  const [result, setResult] = useState({
    tax: 0,
    taxableIncome: 0,
    pendingTaxRevenue: 0,
  });

  return (
    <div className="w-screen px-4">
      <section className=" md:container md:mx-auto md:w-4/6">
        <h2 className="text-2xl font-bold mb-4">个税计算</h2>
        <Stat
          prev={prevValue.current}
          {...result}
          className="mb-4 min-w-full sm:w-full md:w-96"
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setResult((prev) => {
              prevValue.current = prev;
              return taxesWholeYear(formValue);
            });
          }}
          className="grid grid-cols-1 gap-4"
        >
          <Field
            value={formValue['income']}
            onChange={onChangeWithKey('income')}
            type="number"
            step="100"
            label="税前收入"
          />
          <Field
            value={formValue['exempt']}
            onChange={onChangeWithKey('exempt')}
            type="number"
            step="100"
            label="个税减免"
          />
          <Field
            value={formValue['publicReserveFund']}
            onChange={onChangeWithKey('publicReserveFund')}
            type="number"
            label="公积金"
            step="1"
            min="5"
          />
          <Field
            value={formValue['endowmentInsurance']}
            onChange={onChangeWithKey('endowmentInsurance')}
            type="number"
            label="养老保险"
            step="0.5"
            min="2"
          />
          <Field
            value={formValue['medicalInsurance']}
            onChange={onChangeWithKey('medicalInsurance')}
            type="number"
            label="其他"
            step="0.25"
            min="2"
          />
          <button className="bg-green-500 w-full active:bg-green-700 text-white p-2 rounded-md sm:w-32">
            查看
          </button>
        </form>
      </section>
    </div>
  );
};

export default Form;
