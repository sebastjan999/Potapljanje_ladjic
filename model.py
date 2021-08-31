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

    def jeZivo(self):

        'a so se kksne ladje na bojišču?'

        for v in self.polja:
            for s in v:
                if s == Polje.Ladja:
                    return True
        return False

    def kotIgralec(self):

        'kko js kt plejer vidm bojišče'

        return [[str(s) for s in vr] for vr in self.polja]

    def kotNasprotnik(self):

        'kko vid bojišče moj nasprotnik'

        bojisce = []
        for v in self.polja:
            vr = []
            for s in v:
                if s == Polje.Ladja:
                    vr.append(str(Polje.Morje))
                else:
                    vr.append(str(s))
            bojisce.append(vr)
        return bojisce

    def __str__(self):

        out = ''
        for v in self.polja:
            for s in v:
                out += str(s)
            out += '\n'
        return out

    class Vojna: