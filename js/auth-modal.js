// Открытие и закрытие модалок
const modalBg = document.getElementById('modal-auth-bg');
const loginModal = document.getElementById('modal-auth-login');
const registerModal = document.getElementById('modal-auth-register');

const openLoginBtn = document.getElementById('open-login-modal');
const openRegisterBtn = document.getElementById('open-register-modal');
const closeLoginBtn = document.getElementById('close-login-modal');
const closeRegisterBtn = document.getElementById('close-register-modal');
const switchToRegister = document.getElementById('switch-to-register');
const switchToLogin = document.getElementById('switch-to-login');

function openModal(type) {
    modalBg.classList.add('active');
    if (type === 'login') {
        loginModal.style.display = '';
        registerModal.style.display = 'none';
    } else {
        loginModal.style.display = 'none';
        registerModal.style.display = '';
    }
    document.body.classList.add('modal-open');

    // --- ВАЖНО: навесить обработчик после появления формы ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = async function(e) {
            e.preventDefault();
            loginError.textContent = '';
            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries());
            try {
                const resp = await fetch('http://127.0.0.1:3000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(data),
                    credentials: 'include'
                });
                const text = await resp.text();
                if (resp.ok) {
                    closeModal();
                    setTimeout(renderUserPanel, 150);
                } else {
                    loginError.textContent = text;
                }
            } catch (err) {
                loginError.textContent = 'Ошибка соединения с сервером';
            }
        };
    }
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.onsubmit = async function(e) {
            e.preventDefault();
            registerError.textContent = '';
            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());
            try {
                const resp = await fetch('http://127.0.0.1:3000/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(data)
                });
                const text = await resp.text();
                if (resp.redirected) {
                    openModal('login');
                    registerForm.reset();
                } else {
                    registerError.textContent = text;
                }
            } catch (err) {
                registerError.textContent = 'Ошибка соединения с сервером';
            }
        };
    }
}
function closeModal() {
    modalBg.classList.remove('active');
    document.body.classList.remove('modal-open');
}
openLoginBtn.onclick = (e) => { e.preventDefault(); openModal('login'); };
openRegisterBtn.onclick = (e) => { e.preventDefault(); openModal('register'); };
closeLoginBtn.onclick = closeRegisterBtn.onclick = closeModal;
modalBg.onclick = function(e) { if (e.target === modalBg) closeModal(); };
switchToRegister.onclick = () => openModal('register');
switchToLogin.onclick = () => openModal('login');

// --- AJAX авторизация ---
const loginError = document.getElementById('login-error');

// --- AJAX регистрация ---
const registerError = document.getElementById('register-error');

// --- Проверка авторизации и отображение профиля ---
async function renderUserPanel() {
    console.log('renderUserPanel called');
    const userPanel = document.querySelector('.user-panel');
    if (!userPanel) return;
    try {
        const resp = await fetch('http://127.0.0.1:3000/api/user', { credentials: 'include' });
        console.log('fetch /api/user done', resp);
        const data = await resp.json();
        console.log('user data:', data);
        if (data.user) {
            userPanel.innerHTML = `
                <div class="user-profile" id="user-profile-btn">
                    <img src="${data.user.avatar_url ? 'http://127.0.0.1:3000' + data.user.avatar_url : 'img/default-avatar.png'}" alt="avatar" />
                    <span>${data.user.username}</span>
                </div>
            `;
            document.getElementById('user-profile-btn').onclick = function() {
                openProfileModal(data.user);
            };
        } else {
            userPanel.innerHTML = `
                <a href="#" class="login-btn" id="open-login-modal"><i class="fa fa-sign-in-alt"></i> Войти</a>
                <a href="#" class="register-btn" id="open-register-modal"><i class="fa fa-user-plus"></i> Регистрация</a>
            `;
            document.getElementById('open-login-modal').onclick = (e) => { e.preventDefault(); openModal('login'); };
            document.getElementById('open-register-modal').onclick = (e) => { e.preventDefault(); openModal('register'); };
        }
        userPanel.classList.add('ready');
    } catch (e) {
        console.log('fetch error', e);
        userPanel.innerHTML = `
            <a href="#" class="login-btn" id="open-login-modal"><i class="fa fa-sign-in-alt"></i> Войти</a>
            <a href="#" class="register-btn" id="open-register-modal"><i class="fa fa-user-plus"></i> Регистрация</a>
        `;
        document.getElementById('open-login-modal').onclick = (e) => { e.preventDefault(); openModal('login'); };
        document.getElementById('open-register-modal').onclick = (e) => { e.preventDefault(); openModal('register'); };
        userPanel.classList.add('ready');
    }
}
renderUserPanel();

// --- Модальное окно профиля ---
function openProfileModal(user) {
    let modal = document.getElementById('profile-modal-bg');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'profile-modal-bg';
        modal.className = 'modal-auth-bg active';
        modal.innerHTML = `
            <div class="modal-auth" id="profile-modal">
                <button class="close-modal-auth" id="close-profile-modal">&times;</button>
                <h2 style="text-align:center;color:#5a5ad6;margin-bottom:18px;">Профиль</h2>
                <div class="profile-avatar-wrap">
                    <img id="profile-avatar-preview" class="profile-avatar-preview" src="${user.avatar_url ? 'http://127.0.0.1:3000' + user.avatar_url : 'img/default-avatar.png'}" alt="avatar" />
                    <form id="avatar-upload-form" enctype="multipart/form-data" style="display:flex;flex-direction:column;align-items:center;gap:0;">
                      <label class="avatar-upload-label">
                        <input type="file" name="avatar" accept="image/*" class="avatar-upload-input" id="avatar-upload-input" required>
                        Выбрать аватар
                      </label>
                      <button type="submit" class="avatar-upload-btn">Загрузить аватар</button>
                    </form>
                    <div id="avatar-upload-error" class="modal-error"></div>
                </div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:12px;">
                    <div><b>Имя:</b> <span id="profile-username">${user.username}</span></div>
                    <div><b>Email:</b> <span id="profile-email">${user.email}</span></div>
                </div>
                <form id="change-password-form" style="margin-top:18px;display:flex;flex-direction:column;gap:10px;">
                    <input type="password" name="oldPassword" placeholder="Старый пароль" required class="change-password-input" />
                    <input type="password" name="newPassword" placeholder="Новый пароль" required class="change-password-input" />
                    <div class="modal-error" id="change-pass-error"></div>
                    <button type="submit" class="change-password-btn">Сменить пароль</button>
                </form>
                <button id="logout-btn" class="logout-btn">Выйти из аккаунта</button>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        modal.classList.add('active');
    }
    document.body.classList.add('modal-open');
    document.getElementById('close-profile-modal').onclick = () => {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    };
    modal.onclick = function(e) { if (e.target === modal) { modal.classList.remove('active'); document.body.classList.remove('modal-open'); } };
    // Обработчик превью аватара
    const avatarInput = document.getElementById('avatar-upload-input');
    if (avatarInput) {
      avatarInput.onchange = function(e) {
        const file = this.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(ev) {
            document.getElementById('profile-avatar-preview').src = ev.target.result;
          };
          reader.readAsDataURL(file);
        }
      };
    }
    // Обработчик загрузки аватара
    const avatarForm = document.getElementById('avatar-upload-form');
    if (avatarForm) {
      avatarForm.onsubmit = async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        try {
          const resp = await fetch('http://127.0.0.1:3000/api/upload-avatar', {
            method: 'POST',
            body: formData,
            credentials: 'include'
          });
          const data = await resp.json();
          if (data.avatar_url) {
            document.getElementById('profile-avatar-preview').src = 'http://127.0.0.1:3000' + data.avatar_url;
            renderUserPanel();
            document.getElementById('avatar-upload-error').textContent = '';
          } else {
            document.getElementById('avatar-upload-error').textContent = 'Ошибка загрузки';
          }
        } catch {
          document.getElementById('avatar-upload-error').textContent = 'Ошибка соединения с сервером';
        }
      };
    }
    // Смена пароля
    document.getElementById('change-password-form').onsubmit = async function(e) {
        e.preventDefault();
        const errDiv = document.getElementById('change-pass-error');
        errDiv.textContent = '';
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        try {
            const resp = await fetch('http://127.0.0.1:3000/api/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const text = await resp.text();
            if (resp.ok) {
                errDiv.style.color = '#43a047';
                errDiv.textContent = 'Пароль успешно изменён!';
                this.reset();
            } else {
                errDiv.style.color = '#e53935';
                errDiv.textContent = text;
            }
        } catch (err) {
            errDiv.style.color = '#e53935';
            errDiv.textContent = 'Ошибка соединения с сервером';
        }
    };
    // Обработчик выхода
    document.getElementById('logout-btn').onclick = async function() {
        await fetch('http://127.0.0.1:3000/logout', { credentials: 'include' });
        window.location.reload();
    };
} 