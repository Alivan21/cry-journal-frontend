import { matchQuery, MutationCache, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      void queryClient.invalidateQueries({
        predicate: (query) =>
          // invalidate all matching tags at once
          // or everything if no meta is provided
          mutation.meta?.invalidates?.some((queryKey) => matchQuery({ queryKey }, query)) ?? true,
      });
    },
  }),
});

// example usage of meta.invalidates:
/*
useMutation({
  mutationFn: updateLabel,
  meta: {
    invalidates: [['issues'], ['labels']],
  },
})
*/
