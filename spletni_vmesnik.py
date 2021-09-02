from bottle import *
import tekstovni_vmesnik
import json

igra = tekstovni_vmesnik.Igra()

@route('/static/<filename>')
def server_static(filename):
    return static_file(filename, root='./static')

@route('/')
def lobby():
    return server_static('lobby.html')

@route('/igra/cakaj')
def cakaj():
    return server_static('cakaj.html')

@route('/igra/zgradi')
def zgradi():
    return server_static('zgradi.html')

@route('/igra/vojna')
def vojna():
    return server_static('vojna.html')

@route('/igra/zmaga')
def zmaga():
    return server_static('zmaga.html')
    
@route('/igra/zguba')
def zguba():
    return server_static('zguba.html')

@post('/igra/ustvari')
def ustvari():
    return str(igra.ustvariVojno(2, 15, 15, 7))

@post('/igra/pridruzi/<id_igre>')
def pridruzi(id_igre):
    if igra.igraObstaja(id_igre):
        igra.pridruziIgralca(id_igre)
        return 'true'
    return 'Igra ne obstaja!'

@post('/igra/obstaja/<id_igre>')
def obstaja(id_igre):
    if igra.igraObstaja(id_igre):
        return 'true'
    return 'false'

@post('/igra/vsiIgralci/<id_igre>')
def vsiIgralci(id_igre):
    if igra.igraObstaja(id_igre) and igra.vrniVojno(id_igre).vsiIgralci():
        return 'true'
    return 'false'


@post('/igra/postaviLadjo/<id_igre>')
def postaviLadjo(id_igre):
    if igra.igraObstaja(id_igre):
        igralec = int(request.forms['igralec'])
        x       = int(request.forms['x'])
        y       = int(request.forms['y'])
        n       = int(request.forms['n'])
        s       = request.forms['s']
        igra.vrniVojno(id_igre).postaviLadjo(igralec, x, y, n, s)
        return 'true'
    return 'Igra ne obstaja!'

@post('/igra/ustreli/<id_igre>')
def ustreli(id_igre):
    if igra.igraObstaja(id_igre):
        igralec = int(request.forms['igralec'])
        x       = int(request.forms['x'])
        y       = int(request.forms['y'])
        return str(igra.vrniVojno(id_igre).ustreli(igralec, x, y))
    return 'Igra ne obstaja!'

@post('/igra/vseLadje/<id_igre>')
def vseLadje(id_igre):
    if igra.igraObstaja(id_igre) and igra.vrniVojno(id_igre).vseLadjePostavljene():
        return 'true'
    return 'false'


@post('/igra/bojisca/<id_igre>/<igralec:int>')
def bojisca(id_igre, igralec):
    """Zapakiraj vsa bojisca igre v pogledu igralca

       vrne pogled na bitko v json obliki
    """
    if igra.igraObstaja(id_igre):
        out = {
            "domace" : None,
            "tuje" : []
        }
        v = igra.vrniVojno(id_igre)
        for i in range(v.stIgralcev):
            if i != igralec:
                out["tuje"].append( v.kotNasprotnik(i) )
            else:
                out["domace"] = v.kotIgralec(i)

        return json.dumps(out)
    return 'Igra ne obstaja!'

@post('/igra/naVrsti/<id_igre>/<igralec:int>')
def naVrsti(id_igre, igralec):
    if igra.igraObstaja(id_igre):
        if igra.vrniVojno(id_igre).jeNaVrsti(igralec) or igra.vrniVojno(id_igre).zmagovalec() is not None:
            return 'true'    
        else:
            return 'false'    
    return 'Igra ne obstaja!'

@post('/igra/zmagovalec/<id_igre>')
def zmagovalec(id_igre):
    if igra.igraObstaja(id_igre):
        # Ce obstaja zmagovalec vrni njegovo stevilko, drugace 'undefined'
        zmagovalec = igra.vrniVojno(id_igre).zmagovalec()
        if zmagovalec is not None:
            return str(zmagovalec)
        return 'undefined'
    return 'Igra ne obstaja!'

run(host='127.0.0.1', port=5002)