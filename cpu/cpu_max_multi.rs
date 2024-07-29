use std::sync::{Arc, Mutex};
use std::thread;
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

fn calculate_primes(start: u64, end: u64, primes: Arc<Mutex<Vec<u64>>>) {
    for num in start..=end {
        if is_prime(num) {
            let mut primes = primes.lock().unwrap();
            primes.push(num);
        }
    }
}

fn main() {
    let max_number = 100_000_000; // Adjust this number to make the task more or less intensive
    let num_threads = 4; // Adjust the number of threads as needed
    let range_per_thread = max_number / num_threads;

    let primes = Arc::new(Mutex::new(Vec::new()));
    let mut handles = vec![];

    let start_time = Instant::now();

    for i in 0..num_threads {
        let primes = Arc::clone(&primes);
        let start = i * range_per_thread + 1;
        let end = if i == num_threads - 1 {
            max_number
        } else {
            (i + 1) * range_per_thread
        };

        let handle = thread::spawn(move || {
            calculate_primes(start, end, primes);
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    let primes = primes.lock().unwrap();
    println!(
        "Found {} prime numbers up to {} in {:?}",
        primes.len(),
        max_number,
        start_time.elapsed()
    );
}
