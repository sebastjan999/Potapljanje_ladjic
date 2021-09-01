from bottle import *
import tekstovni_vmesnik

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

#dokoncaj se danes nujnoooo!!!!!!!!!(drgac bo cajt sou pol bos pa spet joku XD)
#se za postavt ladjice, pa kko cilat, pa kdo zmagfa/zgubi pa te force treba nardit!!!

##run(host='127.0.0.1', port=5002)