export function showMenu(user) {
    const login1 = document.getElementById('login1');
    const login2 = document.getElementById('login2');
    const login3 = document.getElementById('login3');
    const login4 = document.getElementById('login4');

    if (user) {
        // User is signed in.
        login1.classList.remove("visually-hidden");
        login2.classList.remove("visually-hidden");
        login3.classList.add("visually-hidden");
        login4.classList.add("visually-hidden");
    } else {
        // No user is signed in.
        login1.classList.add("visually-hidden");
        login2.classList.add("visually-hidden");
        login3.classList.remove("visually-hidden");
        login4.classList.remove("visually-hidden");
    }
}
