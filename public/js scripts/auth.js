document.addEventListener('DOMContentLoaded', function() {
    const authButton = document.querySelector('.auth-button');
    const authStatus = document.querySelector('.auth-status');
    
    const urlParams = new URLSearchParams(window.location.search);
    const authParam = urlParams.get('auth');
    const usernameParam = urlParams.get('username');
    
    function setCookie(name, value, days = 7) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
    }
    
    function getCookie(name) {
        const value = '; ' + document.cookie;
        const parts = value.split('; ' + name + '=');
        if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    }
    
    function deleteCookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    
    function saveAnimalsForUser(username) {
        if (!username) return;
        
        const animals = JSON.parse(localStorage.getItem('animals') || '[]');
        if (animals.length > 0) {
            localStorage.setItem(`animals_${username}`, JSON.stringify(animals));
            localStorage.setItem('animals', JSON.stringify([]));
        }
    }
    
    const previouslyAuthenticated = getCookie('isAuthenticated') === 'true';
    const previousUsername = getCookie('username');
    
    if (authParam === 'true' && usernameParam) {
        setCookie('isAuthenticated', 'true');
        setCookie('username', usernameParam);
        
        const savedAnimals = localStorage.getItem(`animals_${usernameParam}`);
        if (savedAnimals) {
            localStorage.setItem('animals', savedAnimals);
        }
    } else if (authParam === 'false') {
        if (previouslyAuthenticated && previousUsername) {
            saveAnimalsForUser(previousUsername);
        }
        
        deleteCookie('isAuthenticated');
        deleteCookie('username');
    }
    
    const isLoggedIn = getCookie('isAuthenticated') === 'true';
    const username = getCookie('username') || 'Пользователь';
    
    updateAuthUI(isLoggedIn, username);
    
    if (authButton) {
        authButton.addEventListener('click', function() {
            if (isLoggedIn) {
                const currentUser = getCookie('username');
                
                deleteCookie('isAuthenticated');
                deleteCookie('username');
                
                saveAnimalsForUser(currentUser);
                
                updateAuthUI(false, '');
                window.location.reload();
            } else {
                const newUsername = prompt('Введите ваше имя:') || 'Пользователь';
                setCookie('isAuthenticated', 'true');
                setCookie('username', newUsername);
                
                const savedAnimals = localStorage.getItem(`animals_${newUsername}`);
                if (savedAnimals) {
                    localStorage.setItem('animals', savedAnimals);
                }
                
                updateAuthUI(true, newUsername);
                window.location.reload();
            }
        });
    }
    
    function updateAuthUI(isLoggedIn, userName) {
        if (!authButton) return;
        
        if (isLoggedIn) {
            authButton.textContent = 'Выйти';
            if (authStatus) {
                authStatus.textContent = `Вы вошли как ${userName}`;
                authStatus.style.display = 'block';
            }
            document.body.classList.add('is-authenticated');
            document.body.dataset.username = userName;
        } else {
            authButton.textContent = 'Войти';
            if (authStatus) {
                authStatus.style.display = 'none';
            }
            document.body.classList.remove('is-authenticated');
            document.body.removeAttribute('data-username');
        }
    }
});