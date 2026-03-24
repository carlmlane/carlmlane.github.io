'use client';

type FormattedDateProps = {
  readonly dateStr: string;
  readonly style?: 'long' | 'short';
  readonly className?: string;
};

const FormattedDate = ({ dateStr, style = 'long', className }: FormattedDateProps) => (
  <time dateTime={dateStr} className={className} suppressHydrationWarning>
    {new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: style,
      day: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(dateStr))}
  </time>
);

export default FormattedDate;
