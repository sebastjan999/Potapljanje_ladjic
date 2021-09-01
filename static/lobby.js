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

/**
 * Pridruzi se igri ce obstaja
 */
 async function pridruzi() {
    const id_igre = prompt("Vnesi id igre");

    let obstaja = await $.ajax({
        url: `/igra/obstaja/${id_igre}`,
        type: "POST",
        onerror: {}
    });
    if(obstaja != "true") {
        alert("Igra ne obstaja");
        return;
    }
    localStorage.setItem('id_igre', id_igre);
    localStorage.setItem('igralec', 1);
    await $.ajax({
        url: `/igra/pridruzi/${id_igre}`,
        type: "POST",
        onerror: {}
    });
    location.replace('/igra/zgradi');
}