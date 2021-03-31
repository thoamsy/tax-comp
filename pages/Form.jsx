import React, { useState } from 'react';
import { taxesWholeYear } from './tax';

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

const StatItem = ({ label, value }) => (
  <div class="w-1/2 h-24 flex flex-col items-center justify-center">
    <h2 className="text-2xl text-red-500 font-bold">{value}</h2>
    <h4 className="text-gray-400 text-xs">{label}</h4>
  </div>
);

const formatter = new Intl.NumberFormat();
const Stat = ({
  tax = 0,
  taxableIncome = 0,
  pendingTaxRevenue = 0,
  className = '',
}) => {
  return (
    <div
      className={`rounded-lg divide-x divide-gray-200 shadow-md flex ${className}`}
    >
      <StatItem label="总纳税" value={formatter.format(tax)} />
      <StatItem
        label="每月待纳税收入"
        value={formatter.format(pendingTaxRevenue)}
      />
      <StatItem
        label="全年待纳税收入"
        value={formatter.format(taxableIncome)}
      />
    </div>
  );
};

const Form = () => {
  const [formValue, setFormValue] = useState({
    publicReserveFund: 12,
    medicalInsurance: 2.25,
    endowmentInsurance: 8,
    income: 25000,
    exempt: 1500,
  });

  const onChangeWithKey = (key) => (event) => {
    setFormValue((value) => ({
      ...value,
      [key]: event.target.value,
    }));
  };

  const [result, setResult] = useState({
    tax: 0,
    taxableIncome: 0,
    pendingTaxRevenue: 0,
  });

  return (
    <section className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">个税计算</h2>
      <Stat {...result} className="mb-4 w-96" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setResult(taxesWholeYear(formValue));
        }}
        className="grid grid-cols-1 gap-4"
      >
        <Field
          value={formValue['income']}
          onChange={onChangeWithKey('income')}
          type="digit"
          label="税前收入"
        />
        <Field
          value={formValue['exempt']}
          onChange={onChangeWithKey('exempt')}
          type="digit"
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
          value={formValue['medicalInsurance']}
          onChange={onChangeWithKey('medicalInsurance')}
          type="number"
          label="医疗保险"
          step="0.25"
          min="2"
        />
        <Field
          value={formValue['endowmentInsurance']}
          onChange={onChangeWithKey('endowmentInsurance')}
          type="number"
          label="养老保险"
          step="0.5"
          min="2"
        />
        <button className="bg-green-500 active:bg-green-700 text-white p-2 rounded-md w-24">
          查看
        </button>
      </form>
    </section>
  );
};

export default Form;
