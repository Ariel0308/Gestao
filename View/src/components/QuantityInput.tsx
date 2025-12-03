type QuantityInputProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

const QuantityInput = ({ value, min = 1, max = 10, onChange }: QuantityInputProps) => {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-offwhite/30 px-4 py-2">
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        className="text-lg text-offwhite/80 disabled:text-offwhite/30"
        disabled={value <= min}
      >
        -
      </button>
      <span className="w-6 text-center text-sm font-semibold">{value}</span>
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        className="text-lg text-offwhite/80 disabled:text-offwhite/30"
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
};

export default QuantityInput;
