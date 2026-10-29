'use client'

import { MantineProvider } from "@mantine/core";
import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

const log = (msg: string) => console.log(`${(performance.now() / 1000).toFixed(2)}s ${msg}`);

export function Providers({children}: {children: ReactNode}) {
    const [queryClient] = useState(
        () => new QueryClient({
            mutationCache: new MutationCache({
                onMutate: () => log("1. Кэш onMutate"),
                onSuccess: () => log("4. Кэш onSuccess"),
                onError: () => log("4. Кэш onError"),
                onSettled: () => log("5. Кэш onSettled")
            })
        })
    );
    return (
        <MantineProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </MantineProvider>
    );
}