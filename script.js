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
        // Hapus autocomplete/pilihan history
        input.setAttribute('autocomplete', 'off');

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

        // Gabungkan semua angka menjadi string untuk hashing
        const concatenatedNumbers = inputValues.join('');

        // Hasil prediksi dengan logika konsisten
        const predictedNumber = generateConsistentNumber(concatenatedNumbers);

        // Tampilkan hasil
        resultElement.textContent = predictedNumber;
    });

    // Fungsi untuk menghasilkan angka konsisten berbasis hashing
    function generateConsistentNumber(input) {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const charCode = input.charCodeAt(i);
            hash = (hash * 31 + charCode) % 1000000; // Menghasilkan angka 6 digit
        }

        let result = hash.toString().padStart(6, '0'); // Pastikan 6 digit

        // Pastikan probabilitas angka double 20%
        result = ensureLimitedDouble(result);

        // Pastikan tidak ada triple
        return ensureNoTriple(result);
    }

    // Fungsi untuk memastikan probabilitas angka double adalah 20%
    function ensureLimitedDouble(number) {
        const digits = number.split('');
        for (let i = 0; i < digits.length - 1; i++) {
            if (digits[i] === digits[i + 1] && Math.random() > 0.2) {
                // Jika double ditemukan dan probabilitas lebih dari 20%, ubah angka berikutnya
                digits[i + 1] = ((parseInt(digits[i + 1]) + 1) % 10).toString();
            }
        }
        return digits.join('');
    }

    // Fungsi untuk memastikan tidak ada triple dalam hasil
    function ensureNoTriple(number) {
        const digits = number.split('');
        for (let i = 0; i < digits.length - 2; i++) {
            if (digits[i] === digits[i + 1] && digits[i] === digits[i + 2]) {
                // Jika triple ditemukan, ubah angka ketiga menjadi angka yang tidak sama
                const newDigit = ((parseInt(digits[i + 2]) + 1) % 10).toString();
                digits[i + 2] = newDigit === digits[i] ? ((parseInt(newDigit) + 1) % 10).toString() : newDigit;
            }
        }
        return digits.join('');
    }
});
