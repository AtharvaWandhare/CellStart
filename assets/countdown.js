document.addEventListener('DOMContentLoaded', () => {
    const countdownElements = document.querySelectorAll('[data-countdown]');
    countdownElements.forEach(countdownElement => {
        const saleEndDate = countdownElement.dataset.countdown;
        if (!saleEndDate) return;

        const targetDate = new Date(saleEndDate).getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(interval);
                countdownElement.innerHTML = '<p>Sale has ended!</p>';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElement.querySelector('[data-days]').innerText = days;
            countdownElement.querySelector('[data-hours]').innerText = hours;
            countdownElement.querySelector('[data-minutes]').innerText = minutes;
            countdownElement.querySelector('[data-seconds]').innerText = seconds;
        }, 1000);
    });
});
