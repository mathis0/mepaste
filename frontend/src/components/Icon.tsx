import { INK_2 } from "../theme";

type Props = {
  d: string;
  s?: number;
  sw?: number;
  c?: string;
  fill?: string;
};

export function Icon({ d, s = 20, sw = 1.6, c = INK_2, fill = "none" }: Props) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={fill}>
      <path
        d={d}
        stroke={c}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
