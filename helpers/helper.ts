
import { pageIcons } from "@/constants/pages";

export function getPageIconAndPath(pathname: string) : {
    icon: string;
    color: string;
} {
    return pageIcons[pathname]  ; 
}

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes?.toString().padStart(2, "0")}:${remainingSeconds
    ?.toString()
    .padStart(2, "0")}`;
};

export const paginate = <T>(
  data: T[],
  currentPage: number,
  itemsPerPage: number
): T[] => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data?.slice(startIndex, endIndex);
};

export const getTotalPages = (
  totalQuestions: number,
  questionsPerPage: number
) => {
  return Math.ceil(totalQuestions / questionsPerPage);
};

// Returns ISO date strings (YYYY-MM-DD) — locale-independent, safe for SSR
export const getToday = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const getFirstDayOfMonth = (): string => {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  // Format as YYYY-MM-DD without timezone shift
  const yyyy = first.getFullYear();
  const mm = String(first.getMonth() + 1).padStart(2, "0");
  const dd = String(first.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const updateSearchParams = (
  queryParams: URLSearchParams,
  key: string,
  value: string
) => {
  if (queryParams.has(key)) {
    queryParams.set(key, value);
  } else {
    queryParams.append(key, value);
  }

  return queryParams;
};