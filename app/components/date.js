import { parseISO, format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DateComponent({ dateString }) {
  if (!dateString) {
    return null;
  }

  const date = parseISO(dateString);

  if (!isValid(date)) {
    return <time dateTime={dateString}>{dateString}</time>;
  }

  return (
    <time dateTime={dateString}>
      {format(date, "d 'de' MMMM 'de' yyyy", { locale: es })}
    </time>
  );
}
