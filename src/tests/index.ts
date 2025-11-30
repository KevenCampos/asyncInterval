import { asyncInterval } from "..";

// Exemple usage with timeout
asyncInterval({ delay: 1000, timeout: 1000,
    functionToExec: async () => {
        // If the function takes more than 1 second (timeout param), the onExcededTimeout will be called
    },

    onExcededTimeout: () => {
        // Called when the function execution exceeds the timeout limit
    }
})


// Exemple usage without timeout
asyncInterval({ delay: 1000,
    functionToExec: async () => {
        // Function to be executed every "delay" milliseconds
    },
    onError: (error) => {
        // Handle any errors that occur during function execution
        // Erros does not stop the loop, before errors are handled, the loop will continue executing in the next delay cycle
    }
});

// Stopping the loop example
const loopingProcess = asyncInterval({ delay: 1000,
    functionToExec: async () => {
        // Function to be executed every "delay" milliseconds
    }
});

// To stop the looping execution
setTimeout(() => {
    loopingProcess.stop();
}, 5000);
