document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input[type="text"]');
    const resultElement = document.getElementById('predicted-numbers');
    const resetButton = document.getElementById('reset-button');

    // Reset button functionality
    resetButton.addEventListener('click', () => {
        inputs.forEach(input => {
            input.value = '';
        });
        resultElement.textContent = 'Belum ada hasil';
        inputs[0].focus();
    });

    // Prevent non-numeric characters in input fields and move focus
    inputs.forEach((input, index) => {
        input.setAttribute('autocomplete', 'off'); // Disable autocomplete

        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^0-9]/g, ''); // Hanya angka

            // Pindahkan ke kolom berikutnya setelah 4 angka
            if (input.value.length === 4 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        // Tambahkan event keydown untuk memindahkan fokus menggunakan tombol Backspace
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });

    // Submit button functionality
    document.getElementById('number-form').addEventListener('submit', function (e) {
        e.preventDefault();

        // Ambil nilai input
        const inputValues = Array.from(inputs).map(input => input.value);
        if (inputValues.some(val => val.length !== 4)) {
            alert('Setiap kolom harus memiliki tepat 4 angka!');
            return;
        }

        // Gabungkan semua angka menjadi array
        const allNumbers = inputValues.flatMap(num => num.split('').map(Number));

        // Hasil prediksi konsisten tanpa angka ganda
        const predictedNumber = generateConsistentPredictedNumber(allNumbers);

        // Tampilkan hasil
        resultElement.textContent = predictedNumber;
    });

    // Fungsi untuk menghasilkan angka prediksi unik dan konsisten
    function generateConsistentPredictedNumber(numbers) {
        // Hashing konsisten berdasarkan input
        const hash = createHash(numbers);

        const uniqueNumbers = Array.from(new Set(numbers)); // Hilangkan angka yang sama
        const result = [];

        // Ambil 5 angka unik dari input berdasarkan hash
        while (result.length < 5 && uniqueNumbers.length > 0) {
            const index = hash % uniqueNumbers.length;
            const selectedNumber = uniqueNumbers.splice(index, 1)[0];
            result.push(selectedNumber);
        }

        // Tambahkan angka paling jarang muncul ke hasil di posisi acak berdasarkan hash
        const frequency = calculateFrequency(numbers);
        const leastFrequentNumber = findLeastFrequentNumber(frequency);

        if (leastFrequentNumber !== null) {
            const randomPosition = hash % (result.length + 1);
            result.splice(randomPosition, 0, leastFrequentNumber);
        }

        return result.join('');
    }

    // Fungsi untuk menghitung hash konsisten dari angka input
    function createHash(numbers) {
        let hash = 0;
        for (let i = 0; i < numbers.length; i++) {
            hash = (hash * 31 + numbers[i]) % 1000000007; // Prime modulus for large numbers
        }
        return hash;
    }

    // Fungsi untuk menghitung frekuensi angka
    function calculateFrequency(numbers) {
        const frequency = {};
        numbers.forEach(num => {
            frequency[num] = (frequency[num] || 0) + 1;
        });
        return frequency;
    }

    // Fungsi untuk menemukan angka yang jarang muncul
    function findLeastFrequentNumber(frequency) {
        let leastFrequent = null;
        let minFrequency = Infinity;

        for (const [number, count] of Object.entries(frequency)) {
            if (count < minFrequency) {
                minFrequency = count;
                leastFrequent = parseInt(number);
            }
        }

        return leastFrequent;
    }
});
