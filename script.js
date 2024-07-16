document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded');

    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const moonIcon = darkModeToggle.querySelector('.feather-moon');
    const sunIcon = darkModeToggle.querySelector('.feather-sun');

    function setDarkMode(isDark) {
        body.classList.toggle('dark-mode', isDark);
        moonIcon.style.display = isDark ? 'none' : 'block';
        sunIcon.style.display = isDark ? 'block' : 'none';
    }

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        setDarkMode(true);
    }

    darkModeToggle.addEventListener('click', function() {
        const isDark = body.classList.toggle('dark-mode');
        setDarkMode(isDark);

        // Save dark mode preference
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
        
        console.log('Dark mode toggled:', isDark);
    });
});