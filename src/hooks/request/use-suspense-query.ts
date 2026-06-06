import {
  QueryClient,
  type QueryKey,
  type UseSuspenseQueryOptions,
  useSuspenseQuery as useSuspenseQueryOriginal,
} from "@tanstack/react-query";
import type { ErrorResponse } from "@/common/types/base-response";

export const useSuspenseQuery = <
  TQueryFnData = unknown,
  TError = ErrorResponse,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  queryClient?: QueryClient
) => {
  return useSuspenseQueryOriginal<TQueryFnData, TError, TData, TQueryKey>(options, queryClient);
};
