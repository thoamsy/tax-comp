import React, { useState } from 'react';

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
const Form = () => {
  const [formValue, setFormValue] = useState({
    publicReserveFund: 12,
    medicalInsurance: 2.25,
    endowmentInsurance: 8,
  });

  const onChangeWithKey = (key) => (event) => {
    setFormValue((value) => ({
      ...value,
      [key]: event.target.value,
    }));
  };

  return (
    <section className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">个税计算</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
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
