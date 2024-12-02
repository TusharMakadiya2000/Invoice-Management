const Select = (props: any) => {
  return (
    <div className="">
      {props.label && (
        <label
          htmlFor="username"
          className="block text-sm font-medium leading-6 text-gray-900 dark:text-text-dark  "
        >
          {props.label}
        </label>
      )}
      <div className="hover:dark:bg-bgc-dark">
        <select
          name={props.name}
          className="block  shadow-sm  ring-inset focus:ring-2 focus:ring-inset w-full p-2 rounded-md border ring-0 outline-none sm:text-sm dark:ring-border-dark dark:border-border-dark dark:bg-transparent "
          {...(props.register && props.register(props.name))}
        >
          {/* <option value={""}>Select {props.label}</option> */}
          {props.items &&
            props.items.map((item: any) => (
              <option value={item.value} key={item.value}>
                {item.text}
              </option>
            ))}
        </select>

        {props.error && <div className="text-red-600">{props.error}</div>}
      </div>
    </div>
  );
};

export default Select;
