"use client";

interface GeneralInfoProps {
  price: string;
  description: string;
  onPriceChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export default function GeneralInfo({
  price,
  description,
  onPriceChange,
  onDescriptionChange,
}: GeneralInfoProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <h3 className="text-center text-xl font-inria font-bold">Preço:</h3>
        <div className="flex items-center gap-2 bg-linear-to-b from-lilas to-roxo/70 w-80.5 h-15.5 rounded-xl px-4 py-2">
          <span className="font-inria font-bold text-sm">R$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            className="bg-transparent font-inria text-sm outline-none w-full placeholder-gray-700"
            placeholder="0,00"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-center text-xl font-inria font-bold">Descrição:</h3>
        <div className="bg-linear-to-b from-lilas to-roxo/70 rounded-xl w-80.5 h-50 p-4">
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="bg-transparent font-inria text-sm outline-none w-full h-full resize-none placeholder-gray-700"
            placeholder="Mudar texto"
          />
        </div>
      </div>
    </div>
  );
}
