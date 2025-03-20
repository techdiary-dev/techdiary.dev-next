import { formatRelative } from "date-fns";
import { bn } from "date-fns/locale";

const formatRelativeLocale: any = {
  lastWeek: "'গত' eeee 'সময়' p",
  yesterday: "'গতকাল' 'সময়' p",
  today: "'আজ' 'সময়' p",
  tomorrow: "'আগামীকাল' 'সময়' p",
  nextWeek: "eeee 'সময়' p",
  other: "dd MMMM yyyy 'সময়' p",
};

export const relativeTime = (date: Date) => {
  return formatRelative(date, new Date(), {
    locale: {
      ...bn,
      formatRelative: (token: string) => formatRelativeLocale[token],
    },
  });
};
