const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;

    if (num % 2 === 0 || num % 3 === 0) return false;

    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }

    return true;
}

function calculatePrimes(start, end) {
    const primes = [];
    for (let i = start; i <= end; i++) {
        if (isPrime(i)) {
            primes.push(i);
        }
    }
    return primes;
}

if (isMainThread) {
    const maxNumber = 100_000_000;
    const numWorkers = 4; // Adjust this number based on the number of CPU cores available
    const range = Math.floor(maxNumber / numWorkers);
    const promises = [];

    console.log('Starting prime number calculation...');
    const start = new Date();

    for (let i = 0; i < numWorkers; i++) {
        const startRange = i * range + 1;
        const endRange = (i === numWorkers - 1) ? maxNumber : (i + 1) * range;
        promises.push(new Promise((resolve, reject) => {
            const worker = new Worker(__filename, { workerData: { start: startRange, end: endRange } });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
            });
        }));
    }

    Promise.all(promises).then(results => {
        const primes = results.flat();
        console.log(`Found ${primes.length} prime numbers up to ${maxNumber}, time taken ${(new Date() - start) / 1000} sec`);
    }).catch(err => console.error(err));

} else {
    const primes = calculatePrimes(workerData.start, workerData.end);
    parentPort.postMessage(primes);
}
