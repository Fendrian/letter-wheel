"""

Converts the YAWL list from a raw word list into a Javascript friendly object.

Due to the specific application of this word list,
it also strips out words shorter than four characters, or longer than nine.

"""

RAWLIST = open('YAWL.list', 'r')

RAWSTRINGS = {
    '4': '[',
    '5': '[',
    '6': '[',
    '7': '[',
    '8': '[',
    '9': '['
}
OUTLISTS = {
    '4': open('dictionary_4.json', 'w'),
    '5': open('dictionary_5.json', 'w'),
    '6': open('dictionary_6.json', 'w'),
    '7': open('dictionary_7.json', 'w'),
    '8': open('dictionary_8.json', 'w'),
    '9': open('dictionary_9.json', 'w')
}


for line in RAWLIST:
    length = len(line.rstrip())
    if length > 3 and length < 10:
        RAWSTRINGS[str(length)] += "\"%s\"," % line.rstrip()

RAWSTRINGS['4'] = RAWSTRINGS['4'][:-1] + "]"
RAWSTRINGS['5'] = RAWSTRINGS['5'][:-1] + "]"
RAWSTRINGS['6'] = RAWSTRINGS['6'][:-1] + "]"
RAWSTRINGS['7'] = RAWSTRINGS['7'][:-1] + "]"
RAWSTRINGS['8'] = RAWSTRINGS['8'][:-1] + "]"
RAWSTRINGS['9'] = RAWSTRINGS['9'][:-1] + "]"
OUTLISTS['4'].write(RAWSTRINGS['4'])
OUTLISTS['5'].write(RAWSTRINGS['5'])
OUTLISTS['6'].write(RAWSTRINGS['6'])
OUTLISTS['7'].write(RAWSTRINGS['7'])
OUTLISTS['8'].write(RAWSTRINGS['8'])
OUTLISTS['9'].write(RAWSTRINGS['9'])

RAWLIST.close()
OUTLISTS['4'].close()
OUTLISTS['5'].close()
OUTLISTS['6'].close()
OUTLISTS['7'].close()
OUTLISTS['8'].close()
OUTLISTS['9'].close()
