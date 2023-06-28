export function fTime(sec: number ) {
    const d = Number(sec);
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);
    const hDisplay = h > 0 ? `${h.toString().length > 1 ? `${h}` : `${0}${h}`}` : '00';
    const mDisplay = m > 0 ? `${m.toString().length > 1 ? `${m}` : `${0}${m}`}` : '00';
    const sDisplay = s > 0 ? `${s.toString().length > 1 ? `${s}` : `${0}${s}`}` : '00';
    return `${hDisplay}:${mDisplay}`;
  }

export const fDuration = (d1: Date, d2: Date) => {
  let ms1 = d1?.getTime();
  let ms2 = d2?.getTime();
  return Math.ceil((ms2 - ms1) / (24*60*60*1000));
};