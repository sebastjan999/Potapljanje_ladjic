
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