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