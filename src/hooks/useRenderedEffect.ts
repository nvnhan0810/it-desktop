import { DependencyList, useEffect, useState } from 'react';

export default function useRenderedEffect(
    callback: () => void,
    deps?: DependencyList | undefined,
): void {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (!mounted) {
            setMounted(true);
        } else {
            callback();
        }
    }, [deps]);
}