/*jshint esversion: 8 */ 

/**
 * Ustvari novo igro
 */
 async function ustvari() {
    let id_igre = await $.ajax({
        url: '/igra/ustvari',
        type: "POST"
    });
    localStorage.setItem('id_igre', id_igre);
    localStorage.setItem('igralec', 0);
    location.replace('/igra/cakaj');
}

