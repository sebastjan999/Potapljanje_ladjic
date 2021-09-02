/**
 * Funkcija ki caka da se nekaj zgodi na strezniku in potem nekaj izvede
 * @param  {String}             url         Povezava ki se preverja z preveri_f
 * @param  {(String|function)}  callback    Lokacija preusmeritve ce String oz callback funkcija
 * @param  {function}           [preveri_f = (el) => el =='true']   Funkcija za preverjanje konec cakanja (privzeto odgovor == 'true')
 */
function zacniCakanje(url, callback, preveri_f = (el) => el =='true') {
    let interval;
    // Definiraj funkcijo za preverjanje
    let preveri = async () => {
        let odgovor = await $.ajax({
            url: url,
            type: 'POST',
            onerror: {}
        });
        if(preveri_f(odgovor)) {
            if (typeof callback == 'string')
                location.replace(callback);
            else {
                callback();
                clearInterval(interval);
            }
        }
    };
    // Takoj na zacetku prever
    preveri();
    // In potem se vsake pol sekunde
    interval = setInterval(async ()=> {
        preveri();
    }, 500);
}

/**
 * Ustvari tabelo za igranje ladic
 * @param  {HTMLElement} parent Stars kateremu se pripne ustvarjena tabela
 * @return {HTMLElement}        Ustvarjena tabela
 */
function ustvariTabelo(parent) {
    // Ustvari strukturo tabele
    let t = document.createElement("table");
    let the = document.createElement("thead");
    let tb = document.createElement("tbody");
    t.classList = "table table-bordered border-secondary";
    t.appendChild(the);
    t.appendChild(tb);

    // Ustvari prvo vrstico 1...15
    let tr = document.createElement("tr");
    for(let i = 0; i < 16; i++) {
        let th = document.createElement("th");
        th.classList = "bg-secondary";
        th.scope = "col";
        th.innerText = (i) ? i : "";
        tr.appendChild(th);
    }
    the.appendChild(tr);

    // Ustvari crko in polja za igro A..O
    const crke = "ABCDEFGHIJKLMNO";
    for(let i = 0; i < 15; i++) {
        tr = document.createElement("tr");
        let th = document.createElement("th");
        th.classList = "bg-secondary";
        th.scope = "row";
        th.innerText = crke[i];
        tr.appendChild(th);
        for(let j = 0; j < 15; j++) {
            let td = document.createElement("td");
            td.classList = "bg-info";
            td.x = j;
            td.y = i;
            tr.appendChild(td);
        }
        tb.appendChild(tr);
    }
    parent.appendChild(t);
    return t;
}

let id_igre;
let igralec;
/**
 * Ob nalozitvi okna
 */
$(() => {
    // Preveri id_igre in igralca
    id_igre = localStorage.getItem('id_igre');
    igralec = localStorage.getItem('igralec');
    if(!id_igre) {
        alert("Ni id_igre");
        location.replace('/');
    }
    if(!igralec) {
        alert("Ni igralec");
        location.replace('/');
    }
    // Ce obstaja main metoda jo poklici
    if(typeof main != 'undefined') main();
});

/**
 * Vrne element tabele na x, y koordinati
 * @param  {HTMLElement}    tabela  Tabela v kateri iscemo
 * @param  {number}         x       X koordinata
 * @param  {number}         y       Y koordinata
 * @return {?HTMLElement}
 */
function at(tabela, x, y) {
    if(x < 0 || y < 0) return undefined;
    try {
        return tabela.children[1].children[y].children[1 + x];
    } catch(e) {
        return undefined;
    }
}