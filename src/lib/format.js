const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Jekyll: "%b %-d, %Y"  ->  "Jul 31, 2023"
export const formatDate = ({ y, m, d }) => `${MONTHS_SHORT[m - 1]} ${d}, ${y}`;
// Jekyll: "%b %Y"       ->  "Jul 2023"
export const formatMonthYear = ({ y, m }) => `${MONTHS_SHORT[m - 1]} ${y}`;
// Jekyll: "%Y %B"       ->  "2023 July"
export const formatYearMonthLong = ({ y, m }) => `${y} ${MONTHS_LONG[m - 1]}`;
