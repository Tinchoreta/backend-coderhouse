const loginBtnModal = document.getElementById('loginBtnModal');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

function loginUser(emailId, passwordId) {
    const email = document.getElementById(emailId).value;
    const pass = document.getElementById(passwordId).value;

    fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            mail: email,
            pass: pass
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                sessionStorage.setItem('username', email);
                updateUI();
                console.log("Login Success");
            } else {
                alert("Invalid Credentials");
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

loginBtnModal.addEventListener('click', (event) => {
    event.preventDefault();
    loginUser('inputEmail', 'inputPassword');
});

loginBtn.addEventListener('click', (event) => {
    event.preventDefault();
    // loginUser('inputEmail', 'inputPassword');
});

logoutBtn.addEventListener('click', function (event) {
    event.preventDefault();

    fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
    })
        .then(response => {
            if (response.ok) {
                sessionStorage.removeItem('username');
                updateUI();
            } else {
                console.error('Failed to logout');
            }
        })
        .catch(error => console.error('Error:', error));
});

document.addEventListener("DOMContentLoaded", () => {
    const sortSelect = document.getElementById('sortSelect');
    const titleFilterInput = document.getElementById('titleFilter');
    const filterText = document.getElementById('filterText');
    const clearFilterButton = document.getElementById('clearFilterButton');

    updateUI();

    sortSelect.addEventListener('change', () => {
        const selectedOption = sortSelect.value;
        updateQueryString('sort', selectedOption);
    });

    titleFilterInput.addEventListener('input', () => {
        const titleValue = titleFilterInput.value;
        updateQueryString('title', titleValue);
    });

    clearFilterButton.addEventListener('click', () => {
        clearFilter();
    });

    function updateQueryString(param, value) {
        const updatedParams = new URLSearchParams(window.location.search);
        if (value) {
            updatedParams.set(param, value);
            filterText.textContent = `Filtered by: ${value}`;
            clearFilterButton.style.display = 'inline-block';
        } else {
            updatedParams.delete(param);
            filterText.textContent = '';
            clearFilterButton.style.display = 'none';
        }
        const updatedQueryString = updatedParams.toString();
        const url = `${window.location.pathname}?${updatedQueryString}`;
        window.location.href = url;
    }

    function clearFilter() {
        titleFilterInput.value = '';
        updateQueryString('title', null);
    }

});

function updateUI() {
    const username = sessionStorage.getItem('username');
    const loginLi = document.getElementById('loginLi');
    const logoutLi = document.getElementById('logoutLi');
    const welcomeMessage = document.getElementById('welcomeMessage');

    if (username) {
        welcomeMessage.innerHTML = `Welcome! <strong>${username}</strong>`;
        loginLi.style.display = 'none';
        logoutLi.style.display = 'block';
    } else {
        welcomeMessage.innerHTML = 'Welcome! Please log in.';
        loginLi.style.display = 'block';
        logoutLi.style.display = 'none';
    }
}
