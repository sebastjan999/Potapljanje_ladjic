/**
 * Funkcija ki caka da se nekaj zgodi na strezniku in potem nekaj izvede
 * @param  {String}             url         Povezava ki se preverja z preveri_f
 * @param  {(String|function)}  callback    Lokacija preusmeritve ce String oz callback funkcija
 * @param  {function}           [preveri_f = (el) => el =='true']   Funkcija za preverjanje konec cakanja (privzeto odgovor == 'true')
 */
function zacniCakanje(url, callback, preveri_f = (el) => el == 'true') {
    let interval;
    // Definiraj funkcijo za preverjanje
    let preveri = async () => {
        let odgovor = await $.ajax({
            url: url,
            type: 'POST',
            onerror: {}
        });
        if (preveri_f(odgovor)) {
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
    interval = setInterval(async () => {
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
    for (let i = 0; i < 16; i++) {
        let th = document.createElement("th");
        th.classList = "bg-secondary";
        th.scope = "col";
        th.innerText = (i) ? i : "";
        tr.appendChild(th);
    }
    the.appendChild(tr);

    // Ustvari crko in polja za igro A..O
    const crke = "ABCDEFGHIJKLMNO";
    for (let i = 0; i < 15; i++) {
        tr = document.createElement("tr");
        let th = document.createElement("th");
        th.classList = "bg-secondary";
        th.scope = "row";
        th.innerText = crke[i];
        tr.appendChild(th);
        for (let j = 0; j < 15; j++) {
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
    if (!id_igre) {
        alert("Ni id_igre");
        location.replace('/');
    }
    if (!igralec) {
        alert("Ni igralec");
        location.replace('/');
    }
    // Ce obstaja main metoda jo poklici
    if (typeof main != 'undefined') main();
});

/**
 * Vrne element tabele na x, y koordinati
 * @param  {HTMLElement}    tabela  Tabela v kateri iscemo
 * @param  {number}         x       X koordinata
 * @param  {number}         y       Y koordinata
 * @return {?HTMLElement}
 */
function at(tabela, x, y) {
    if (x < 0 || y < 0) return undefined;
    try {
        return tabela.children[1].children[y].children[1 + x];
    } catch (e) {
        return undefined;
    }
}

/**
 * Ali tabela v pravokotniku na x, y sirine w, h vsebuje ladjo
 * @param  {HTMLElement} tabela Tabela v katerem iscemo
 * @param  {number} x           X koordinata
 * @param  {number} y           Y koordinata
 * @param  {number} [w=1]       Sirina pravokotnika
 * @param  {number} [h=1]       Visina pravokotnika
 * @return {bool}            Ali pravokotnik vsebuje ladjo
 */
function vsebujeLadjo(tabela, x, y, w = 1, h = 1) {
    for (let i = x; i < x + w; i++) {
        for (let j = y; j < y + h; j++) {
            let el = at(tabela, i, j);
            if (el && el.classList != "bg-info")
                return true;
        }
    }
    return false;
}

/**
 * Koda, ki skrbi za vstavljanje elementov v tabelo (zgradi.html) 
 * @param  {HTMLElement} tabela Tabela v katero vstavljamo ladje
 */
function postavljanjeZaTabelo(tabela) {
    /**
     * Ali se lahko postavi ladijca
     * @param  {number} x       X koordinata ladje
     * @param  {number} y       Y koordinata ladje
     * @param  {number} n       Velikost ladje
     * @param  {String} smer    Smer ladje ("V" ali "H")
     * @return {boolean} Lahko se postavi
     */
    function lahkoPostavi(x, y, n, smer) {
        if (x > 15 - n && smer == "H" || y > 15 - n && smer == "V") return false;
        if (vsebujeLadjo(tabela, x - 1, y - 1, (smer == "H") ? n + 2 : 3, (smer == "V") ? n + 2 : 3)) return false;
        return true;
    }


    /**
     * Postavi ladijco na strezniku
     * @param  {number} x       X koordinata ladje
     * @param  {number} y       Y koordinata ladje
     * @param  {number} n       Velikost ladje
     * @param  {String} smer    Smer ladje ("V" ali "H")
     * @return {Promise<String>}Obljuba odgovora
     */
    function postaviLadjo(x, y, n, smer) {
        return $.ajax({
            url: `/igra/postaviLadjo/${id_igre}`,
            type: 'POST',
            enctype: 'multipart/form-data',
            data: {
                igralec: igralec,
                x: x,
                y: y,
                n: n,
                s: smer
            },
            onerror: {}
        });
    }


    /**
     * @return {number} Velikost izbrane ladijce ali 0 ce ni izbrana
     */
    function ladijca() {
        const input = document.querySelector('input[name="ladijcaVelikost"]:checked');
        if (input)
            return Number(input.attributes.velikost.value);
        return 0;
    }

    /**
     * @returns {String} Izbrana smer postavitve 
     */
    function smer() {
        return document.querySelector('input[name="ladijcaSmer"]:checked').attributes.smer.value;
    }

    // Za vsako celico
    Array.from(tabela.querySelectorAll("td")).forEach(td => {
        // Prehod z misko
        // Dodaj predogled ladijce ce lahko postavi
        td.addEventListener("mouseover", (ev) => {
            ev.target.style.outline = 'solid 2px red';
            let n = ladijca();
            if (n == 0) return;
            let x = ev.target.x;
            let y = ev.target.y;
            let s = smer();
            if (lahkoPostavi(x, y, n, s)) {
                let dx = Number(s == "H");
                let dy = Number(s == "V");
                ev.target.style.outline = 'solid 2px yellow';
                for (let i = 1; i < n; i++) {
                    x += dx;
                    y += dy;
                    at(tabela, x, y).style.outline = 'solid 2px yellow';
                }
            }
        });
        // Izhod z misko
        // Odstrani predogled
        td.addEventListener("mouseleave", (ev) => {
            ev.target.style.outline = '';
            let n = ladijca();
            let s = smer();
            let x = ev.target.x;
            let y = ev.target.y;
            if (n == 0 || !lahkoPostavi(x, y, n, s)) return;
            let dx = Number(s == "H");
            let dy = Number(s == "V");
            for (let i = 1; i < n; i++) {
                x += dx;
                y += dy;
                at(tabela, x, y).style.outline = '';
            }
        });
        // Ob kliku
        td.addEventListener("click", async (ev) => {
            let n = ladijca();
            if (n == 0) return;
            let x = ev.target.x;
            let y = ev.target.y;
            let s = smer();
            // Ce lahko postavi
            if (lahkoPostavi(x, y, n, s)) {
                // Dodaj ladijco na streznik
                await postaviLadjo(x, y, n, s);

                // Narisi ladijco
                let dx = Number(s == "H");
                let dy = Number(s == "V");
                ev.target.classList = 'bg-secondary';
                ev.target.innerText = '#';
                ev.target.style.outline = '';
                for (let i = 1; i < n; i++) {
                    x += dx;
                    y += dy;
                    let el = at(tabela, x, y);
                    el.classList = 'bg-secondary';
                    el.innerText = '#';
                    el.style.outline = '';
                }

                // Izklopi izbiro za postavljeno ladijco 
                const input = document.querySelector('input[name="ladijcaVelikost"]:checked');
                input.disabled = true;
                input.checked = false;

                // Izberi naslednjo ladijco oziroma zacni cakati za zacetek vojne ce ni vec ladijc za postaviti
                let next = document.querySelector('input[name="ladijcaVelikost"]:not(:disabled)');
                if (next == null) {
                    zacniCakanje(`/igra/vseLadje/${id_igre}`, '/igra/vojna');
                    document.getElementById("naslov").innerText = 'Cakaj ostale igralce...';
                } else {
                    next.checked = true;
                }
            }
        });
    });
}

/**
 * Koda, ki skrbi za bitko (vojna.html) 
 * @param  {HTMLElement} napadalnaTabela Tabela v katero napadamo ladje
 * @param  {HTMLElement} domacaTabela Tabela v kateri prikazemo nase ladje
 */
async function zacniVojno(napadalnaTabela, domacaTabela) {
    // Sprem. ki hrani ali smo na vrsti za napad
    let lahkoNapada;

    /**
     * Zapolni obe tabeli z podatki iz streznika
     */
    async function zapolniTabelo() {
        /**
         * Funkcija ki pobarva celico
         * @param {HTMLElement} el Element celice ki jo barvamo
         * @param {String} tip Tip celice ki nam pove kako naj pobarvamo
         */
        function pobarvajPolje(el, tip) {
            switch (tip) {
                case ".": el.classList = "bg-info"; el.innerText = ""; break;
                case "#": el.classList = "bg-secondary"; el.innerText = "#"; break;
                case "X": el.classList = "bg-danger"; el.innerText = "X"; break;
                case "O": el.classList = "bg-info"; el.innerText = "O"; break;
            }
        }

        // Pridobi podatke iz streznika in jih preberi
        const sb = JSON.parse(await stanjeBojisca());
        const domace = sb.domace;
        const tuje = sb.tuje[0];

        // Ustrezno pobarvaj obe tabeli
        for (let y = 0; y < 15; y++) {
            for (let x = 0; x < 15; x++) {
                let el_napad = at(napadalnaTabela, x, y);
                let el_domace = at(domacaTabela, x, y);

                pobarvajPolje(el_napad, tuje[y][x]);
                pobarvajPolje(el_domace, domace[y][x]);
            }
        }
    }

    /**
     * Vrne stanje bojisca
     * @returns {Promise<String>} obljuba bojisca zapisav v JSON string
     */
    function stanjeBojisca() {
        return $.ajax({
            url: `/igra/bojisca/${id_igre}/${igralec}`,
            type: 'POST',
            onerror: {}
        });
    }

    /**
     * @returns {Promise<?String>} Vrne obljubo za stevilko zmagovalca ali 'undefined'
     */
    function zmagovalec() {
        return $.ajax({
            url: `/igra/zmagovalec/${id_igre}`,
            type: 'POST',
            onerror: {}
        });
    }

    /**
     * Ustreli drugega igralca na strezniku
     * @param {number} x X koordinata strela
     * @param {number} y Y koordinata strela
     * @returns {Promise<String>} Vrne tip zadetka
     */
    function ustreli(x, y) {
        let tarca = (igralec == 0) ? 1 : 0;
        return $.ajax({
            url: `/igra/ustreli/${id_igre}`,
            type: 'POST',
            enctype: 'multipart/form-data',
            data: {
                igralec: tarca,
                x: x,
                y: y,
            },
            onerror: {}
        });
    }

    /**
     * Funkcija, ki se izvede ko je igralec na vrsti
     */
    async function naVrsti() {
        // Preveri za konec igre
        let zm = await zmagovalec();
        if (zm != "undefined") {
            if (Number(zm) == igralec) {
                location.replace('/igra/zmaga');
            } else {
                location.replace('/igra/zguba');
            }
            return;
        }

        // Posodobi stanje bitke
        await zapolniTabelo();

        lahkoNapada = true;

        document.getElementById("besedilo").innerText = "Tunkaj ladje!";
        document.getElementById("hnapad").classList.add("border-info");
        document.getElementById("hdomace").classList.remove("border-info");
    }

    /**
     * Funkcija, ki se izvede ko igralec caka
     */
    async function naCakanju() {
        lahkoNapada = false;
        document.getElementById("besedilo").innerText = "Cakaj nasprotnika!";
        document.getElementById("hdomace").classList.add("border-info");
        document.getElementById("hnapad").classList.remove("border-info");

        // Zacni cakanje da je igralec na vrsti
        zacniCakanje(`/igra/naVrsti/${id_igre}/${igralec}`, naVrsti, (el) => el != 'false');
    }

    /**
     * Funkcija, ki se izvede ob kliku
     * @param {Event} ev Dogodek klika
     */
    async function napadKlik(ev) {
        // Preklici klik ce ni na vrsti
        if (!lahkoNapada) return;

        // Ustreli
        let strel = await ustreli(ev.target.x, ev.target.y);

        // Nastavi celico glede na odgovor
        ev.target.innerText = strel;
        if (strel == "X") ev.target.classList = "bg-danger";

        // Odstrani poslusalec 
        ev.target.removeEventListener("click", napadKlik);

        // Zacni cakati
        naCakanju();
    }

    // Dodaj napadKlik vsem celicam v napadalni tabeli
    Array.from(napadalnaTabela.querySelectorAll("td")).forEach(
        td => td.addEventListener("click", napadKlik)
    );

    // Za zacetek preveri ali je na vrsti ali naj caka
    let odgovor = await $.ajax({
        url: `/igra/naVrsti/${id_igre}/${igralec}`,
        type: 'POST',
        onerror: {}
    });
    if (odgovor == 'true') {
        naVrsti();
    } else {
        zapolniTabelo();
        naCakanju();
    }
}