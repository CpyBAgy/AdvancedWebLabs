document.addEventListener('DOMContentLoaded', function() {
    const authButton = document.querySelector('.auth-button');
    const authStatus = document.querySelector('.auth-status');

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    if (authButton) {
        authButton.addEventListener('click', function() {
            if (userId) {
                // Пользователь авторизован - выходим
                window.location.href = '/logout';
            } else {
                // Пользователь не авторизован - переходим на страницу входа
                window.location.href = '/';
            }
        });
    }
});