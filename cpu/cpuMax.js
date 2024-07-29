// Max out CPU by calculating prime numbers
function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;

  if (num % 2 === 0 || num % 3 === 0) return false;

  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }

  return true;
}

function calculatePrimes(max) {
  const primes = [];
  for (let i = 2; i <= max; i++) {
    if (isPrime(i)) {
      primes.push(i);
    }
  }
  return primes;
}

console.log('Starting prime number calculation...');
const start = new Date();
const maxNumber = 100_000_000; // Adjust this number to make the task more or less intensive
const primes = calculatePrimes(maxNumber);
console.log(`Found ${primes.length} prime numbers up to ${maxNumber}, time taken ${(new Date() - start) / 1000} sec`);
