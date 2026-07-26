import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "./api";
import { rowDataWithFallback } from "@/lib/table/utils";

export function useCategories() {
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  return rowDataWithFallback(categoriesData?.data);
}
