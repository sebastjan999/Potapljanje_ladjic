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
    def __init__(self, stIgralcev, sirina, visina, maxStLadij):

        'kok igralcev igra, sirina&visina povesta velkost bojisča'
        'macStLadij je pa kok ladij mormo postaut predn zacnemo z vojno'

        self.stIgralcev = stIgralcev
        self.bojisca = [Bojisce(sirina, visina) for _ in range(self.stIgralcev)]
        self.naVrsti = 0
        self.trenutniIgralci = 1
        self.maxStLadij = maxStLadij

#manjka se: preverba kok je igralcev, pol kko enga igralca dodamo, pol postavlanje ladij,
#pol kko ustrelmo v polje(ladja/morje), kdo je na vrsti, pa kdaj se igra zakljuci in kdo jo zmaga.

    def pridruziIgralca(self):
        
        self.trenutniIgralci += 1

    def vsiIgralci(self):

        return self.trenutniIgralci == self.stIgralcev

    def postaviLadjo(self, igralec, x, y, n, smer):
        'igralec pove kdo je na vrst'
        'x,y koordinati ladje, n velikost ladje'
        'pa se smer al H al V'

        self.bojisca[igralec].postaviLadjo(x, y, n, smer)

    def ustreli(self, igralec, x, y):
        
        'x, y koordinati strela'

        self.naVrsti = self.naVrsti + 1
        if self.naVrsti >= self.stIgralcev:
            self.naVrsti = 0
        
        return self.bojisca[igralec].ustreli(x, y)

    def kotIgralec(self, igralec):
        'kko vidmo bojisce kt plejer...kt neka matrika lol'

        return self.bojisca[igralec].kotIgralec()

    def kotNasprotnik(self, igralec):
        'kko nasprotnik vid'

        return self.bojisca[igralec].kotNasprotnik()

    def vseLadjePostavljene(self):

        for b in self.bojisca:
            if b.stLadij != self.maxStLadij:
                return False
        return True

    def zmagovalec(self):
        'ce je kdo ze zmagu, vrne stevilko unga k zmaga, drgac da pa None'

        z = None
        for i, b in enumerate(self.bojisca):
            if b.jeZivo():
                if z is not None:
                    return None
                else:
                    z = i
        return z

    def jeNaVrsti(self, igralec):

        return self.naVrsti == igralec