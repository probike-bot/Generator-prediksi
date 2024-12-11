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

        // Hasil prediksi konsisten tanpa angka ganda dan menambahkan satu angka tambahan
        const predictedNumber = generateFinalPredictedNumber(allNumbers);

        // Tampilkan hasil
        resultElement.textContent = predictedNumber;
    });

    // Fungsi untuk menghasilkan angka prediksi dengan angka tambahan
    function generateFinalPredictedNumber(numbers) {
        const uniqueNumbers = Array.from(new Set(numbers)); // Hilangkan angka yang sama
        const result = [];

        // Hashing konsisten berdasarkan input
        const hash = createHash(numbers);

        // Ambil angka unik dari input
        while (result.length < 5 && uniqueNumbers.length > 0) {
            const index = hash % uniqueNumbers.length;
            const selectedNumber = uniqueNumbers.splice(index, 1)[0];
            result.push(selectedNumber);
        }

        // Pilih satu angka tambahan yang tidak ada di input
        const allPossibleNumbers = Array.from({ length: 10 }, (_, i) => i); // [0, 1, 2, ..., 9]
        const remainingNumbers = allPossibleNumbers.filter(num => !result.includes(num));
        if (remainingNumbers.length > 0) {
            const randomIndex = hash % remainingNumbers.length;
            const additionalNumber = remainingNumbers[randomIndex];

            // Masukkan angka tambahan dalam posisi acak
            const randomPosition = hash % (result.length + 1);
            result.splice(randomPosition, 0, additionalNumber);
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
});
