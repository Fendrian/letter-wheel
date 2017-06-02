"""

Converts the YAWL list from a raw word list into a Javascript friendly object.

Due to the specific application of this word list,
it also strips out words shorter than four characters, or longer than nine.

"""

RAWLIST = open('YAWL.list', 'r')

# RAWSTRING = 'export default {\n'
# OUTLIST = open('dictionary.js', 'w')
RAWSTRINGS = {
    '4': 'export default [\n',
    '5': 'export default [\n',
    '6': 'export default [\n',
    '7': 'export default [\n',
    '8': 'export default [\n',
    '9': 'export default [\n'
}
OUTLISTS = {
    '4': open('dictionary_4.js', 'w'),
    '5': open('dictionary_5.js', 'w'),
    '6': open('dictionary_6.js', 'w'),
    '7': open('dictionary_7.js', 'w'),
    '8': open('dictionary_8.js', 'w'),
    '9': open('dictionary_9.js', 'w')
}


for line in RAWLIST:
    length = len(line.rstrip())
    if length > 3 and length < 10:
        letters = list(line.rstrip())
        output = {'word': line.rstrip()}
        for l in letters:
            if l not in output:
                output[l] = 0
            output[l] += 1
        RAWSTRINGS[str(length)] += "  %s,\n" % str(output)

# RAWSTRING += "}"
# OUTLIST.write(RAWSTRING)
RAWSTRINGS['4'] += "]"
RAWSTRINGS['5'] += "]"
RAWSTRINGS['6'] += "]"
RAWSTRINGS['7'] += "]"
RAWSTRINGS['8'] += "]"
RAWSTRINGS['9'] += "]"
OUTLISTS['4'].write(RAWSTRINGS['4'])
OUTLISTS['5'].write(RAWSTRINGS['5'])
OUTLISTS['6'].write(RAWSTRINGS['6'])
OUTLISTS['7'].write(RAWSTRINGS['7'])
OUTLISTS['8'].write(RAWSTRINGS['8'])
OUTLISTS['9'].write(RAWSTRINGS['9'])

RAWLIST.close()
# OUTLIST.close()
OUTLISTS['4'].close()
OUTLISTS['5'].close()
OUTLISTS['6'].close()
OUTLISTS['7'].close()
OUTLISTS['8'].close()
OUTLISTS['9'].close()
