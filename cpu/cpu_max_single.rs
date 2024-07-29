use std::time::Instant;

fn is_prime(num: u64) -> bool {
    if num <= 1 {
        return false;
    }
    if num <= 3 {
        return true;
    }
    if num % 2 == 0 || num % 3 == 0 {
        return false;
    }
    let mut i = 5;
    while i * i <= num {
        if num % i == 0 || num % (i + 2) == 0 {
            return false;
        }
        i += 6;
    }
    true
}

fn calculate_primes(start: u64, end: u64) -> Vec<u64> {
    let mut primes = Vec::new();
    for num in start..=end {
        if is_prime(num) {
            primes.push(num);
        }
    }
    primes
}

fn main() {
    let max_number = 100_000_000; // Adjust this number to make the task more or less intensive

    let start_time = Instant::now();

    let primes = calculate_primes(1, max_number);

    println!(
        "Found {} prime numbers up to {} in {:?}",
        primes.len(),
        max_number,
        start_time.elapsed()
    );
}
