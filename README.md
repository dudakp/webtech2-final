# WEBTEC2 - final

## setup

### first time
* `python3 -m venv .venv`

Príkaz vytvorí virtual enviroment pre python - toto preto treba spravil len prvý krat na svojom PC.

### pri kazdom pull-e
1. `source ./venv/bin/activate`
2. `pip install -r requirements.txt`

Pri každom pull-e z GitHub-u je dobré sputiť druhý príkaz. Ten stiahne všetky nové dependencie ktoré sú v requirements.txt

## run

1. `source ./venv/bin/activate`
2. `python ./run.py`

Spúštanie appky pre local vývoj. Prvý príkaz sputiť len prvý krát pri otvorení projektu (a vždy ked znova otváram projekt) aby sme boli v termináli v pythonovom virtuálnom enviromente.

## server

Appka sa uploaduje na server Peťa Hajduka info o logine si pýtajte od neho.

Po nasadení na server (v našom prípade len nahranie novej verzie) je treba appku resetnúť príkazom `sudo supervisorctl restart flask_app`

Ak by bolo nutné resotovať python server tak príkaz je: `sudo supervisorctl reload`


## config

Pre konfiguráciu premenných potrebných na chod flask aplikácie je potrebné si vytvoriť __config.json__ súbor v priečinku flask_app, ktorý sa nenachádza v aplikácii z bezpočnostných dôvodov. Pre bližšie otázky ohľadom atribútov a hodnôt kontokatovať: Peter Hajduk alebo Pavol Ďuďák

## octave

Aplikácia využíva na pozadí octave a preto je potrebné si na localnej mašine stiahnuť octave a package menom `control` cez octave-cli alebo klasicky z webu

## dependencies

Nové dependencie sa pridávajú VÝHRADNE do requirements.txt ideálne aj z verziou (nech vsetci vyvýjame na tom istom). 
Je možné inštalovať aj cez pip install ale môže sa stať že niekto zabudne freeznuť venv a dependencia sa nedostane do requirements.txt.

## things to do so we can stay friends

Prosím vás každú feature si dávajte do svojej branche

* `git checkout -b nazov-tvojej-branche`

Keď budeš mať svoju vec implementovanú tak ju mergni do master-a (samozrejme ešte predtým si potiahni zmeny ktoré v master-i mohli nastať)

* `git checkout master`
* `git pull origin master`

Teraz merge:

* `git merge nazov-tvojej-branche`

Prípadne opravit nejaké conflikty, otestovať či zmena nerozbíja appku a nakoniec:

* `git push -u origin master`

Ešte posledná vec, uprac si po sebe. Zmazať tvoju branch-u (ak si ju pushoval na remote)

* `git push origin --delete nazov-tvojej-branche`
