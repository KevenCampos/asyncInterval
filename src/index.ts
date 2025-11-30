type asyncIntervalBase = {
    delay: number;
    onError?: (error: any) => void;
    functionToExec: () => Promise<void>;
}

type asyncIntervalWithTimeout = asyncIntervalBase & {
    timeout: number;
    onExcededTimeout?: () => void;
}

type asyncIntervalNoTimeout = asyncIntervalBase & {
    timeout?: never;
    onExcededTimeout?: never;
}

type asyncIntervalParams = asyncIntervalWithTimeout | asyncIntervalNoTimeout;

export function asyncInterval(data: asyncIntervalParams) {
    let timeoutId: NodeJS.Timeout | null = null;
    let stopped = false;

    const executeFunction = async () => {
        if (stopped) return;

        if (data?.timeout) {
            const timeoutPromise = new Promise<void>((_, reject) => {
                setTimeout(() => {
                    reject(new Error("timeout"));
                }, data.timeout);
            });

            try {
                await Promise.race([data.functionToExec(), timeoutPromise]);
            } catch (error: any) {
                if (error.message === "timeout") {
                    data.onExcededTimeout?.();
                } else {
                    data.onError?.(error);
                }
            }
        } else {
            try {
                await data.functionToExec();
            } catch (error) {
                data?.onError?.(error);
            }
        }
    };

    const loop = async () => {
        await executeFunction();
        if (!stopped) {
            timeoutId = setTimeout(loop, data.delay);
        }
    };

    loop();

    return {
        stop: () => {
            stopped = true;
            if (timeoutId) clearTimeout(timeoutId);
        }
    };
}