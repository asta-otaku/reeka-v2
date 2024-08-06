function CounterRender({
  cat,
  counterStates,
  setCounterStates,
  tag,
  title,
}: {
  cat: string;
  counterStates: any;
  setCounterStates: any;
  tag: string;
  title: string;
}) {
  const decreaseCount = (option: string, category: string) =>
    setCounterStates({
      ...counterStates,
      [category]: {
        ...counterStates[category],
        [option]:
          counterStates[category][option] === 0
            ? 0
            : counterStates[category][option] - 1,
      },
    });

  const increaseCount = (arg: string, category: string) =>
    setCounterStates({
      ...counterStates,
      [category]: {
        ...counterStates[category],
        [arg]: counterStates[category][arg] + 1,
      },
    });

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex gap-1.5 items-center">
        <input type="checkbox" id={tag} className="accent-[#219653]" />
        <label
          htmlFor={tag}
          className="text-[#3A3A3A] font-medium text-xs cursor-pointer"
        >
          {title}
        </label>
      </div>
      <div className="bg-[#ECECEC] p-1 rounded-3xl flex gap-1.5 items-center">
        <button
          onClick={() => decreaseCount(tag, cat)}
          className="w-5 h-5 rounded-full bg-[#FAFAFA] text-xs"
        >
          -
        </button>
        <span className="text-sm">{counterStates[cat][tag]}</span>
        <button
          onClick={() => increaseCount(tag, cat)}
          className="w-5 h-5 rounded-full bg-[#FAFAFA] text-xs"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default CounterRender;
