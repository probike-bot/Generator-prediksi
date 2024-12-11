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
        input.addEventListener('input', () => {
            // Hapus karakter non-numeric
            input.value = input.value.replace(/[^0-9]/g, '');

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

    // Generate button functionality
    document.getElementById('number-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const allNumbers = Array.from(inputs).map(input => input.value);
        if (allNumbers.some(num => num.length !== 4)) {
            alert('Setiap kolom harus memiliki tepat 4 angka!');
            return;
        }

        const predictedNumber = generateNumber(allNumbers.flatMap(num => num.split('')));
        resultElement.textContent = predictedNumber;
    });

    function generateNumber(numbers) {
        return numbers.slice(0, 6).join('');
    }
});
