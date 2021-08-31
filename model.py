import enum
from typing import List

class Polje(enum.Enum):
    Morje    = b'.'
    Ladja    = b'#'
    Zadeto   = b'X'
    Zgreseno = b'O'

    def __str__(self):
        return self.value.decode('utf-8')

class Bojisce:
    polja: List[List[Polje]]

    def __init__(self, sirina, visina):
        self.sirina = visina
        self.visina = sirina
        self.stLadij = 0
        self.polja = [ [Polje.Morje] * self.sirina for _ in range(self.visina) ]
    
    def postaviLadjo(self, x, y, n, smer):
        'x in y sta koordinati ladje'
        'n je velikost ladje'
        'smer je pa lahko vertikalna(V) ali pa horizontalna(H), odvisn kam se ladjica širi'

        self.stLadij += 1
        dx = int(smer == 'H')
        dy = int(smer == 'V') 
        for _ in range(n): # z zanko lepo nalimamo ladjico po 1 delcek naenkrat(velikost ladje n)
            self.polja[y][x] = Polje.Ladja
            x += dx
            y += dy
    
    def ustreli(self, x, y):
        'x, y koordinati kam ustrelmo'
        'return je pa a smo zadel ladjo al pa ne'
        polje = self.polja[y][x]
        if polje == Polje.Morje:
            self.polja[y][x] = Polje.Zgreseno
            return Polje.Zgreseno
        elif polje == Polje.Ladja:
            self.polja[y][x] = Polje.Zadeto
            return Polje.Zadeto
        return polje
