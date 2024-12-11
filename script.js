document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input[type="text"]');
    const resultElement = document.getElementById('predicted-numbers');
    const resetButton = document.getElementById('reset-button');

    // Event listener untuk tombol Reset
    resetButton.addEventListener('click', () => {
        // Kosongkan semua input
        inputs.forEach(input => {
            input.value = '';
        });

        // Kosongkan hasil prediksi
        resultElement.textContent = 'Belum ada hasil';

        // Fokus kembali ke input pertama
        inputs[0].focus();
    });

    // Logika untuk memindahkan fokus secara otomatis
    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.length === 4 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
    });

    document.getElementById('number-form').addEventListener('submit', function (e) {
        e.preventDefault();

        // Ambil nilai input dari form untuk semua 7 pasangan
        const pair1 = splitInput(document.getElementById('pair1').value);
        const pair2 = splitInput(document.getElementById('pair2').value);
        const pair3 = splitInput(document.getElementById('pair3').value);
        const pair4 = splitInput(document.getElementById('pair4').value);
        const pair5 = splitInput(document.getElementById('pair5').value);
        const pair6 = splitInput(document.getElementById('pair6').value);
        const pair7 = splitInput(document.getElementById('pair7').value);

        // Gabungkan semua angka menjadi satu array
        const allNumbers = [...pair1, ...pair2, ...pair3, ...pair4, ...pair5, ...pair6, ...pair7];

        // Logika prediksi angka baru
        const predictedNumber = generateNumber(allNumbers);

        // Tampilkan hasil
        resultElement.textContent = predictedNumber;
    });

    // Fungsi untuk membagi input menjadi dua angka
    function splitInput(input) {
        if (input.length !== 4) {
            alert('Setiap kolom harus memiliki tepat 4 angka!');
            throw new Error('Input harus 4 digit angka.');
        }
        return [parseInt(input.slice(0, 2)), parseInt(input.slice(2, 4))];
    }

    // Fungsi untuk menghitung angka baru (6 digit sebagai 1 angka)
    function generateNumber(numbers) {
        let predictedNumber = '';
        for (let i = 1; i <= 6; i++) {
            const prediction = (numbers[numbers.length - 1] + i * 7) % 10;
            predictedNumber += prediction.toString();
        }
        return predictedNumber;
    }
});
