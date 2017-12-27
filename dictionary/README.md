# Dictionary Generation

The target format for the dictionary is an SQLite database containing one `words` table, which in turn contains twenty seven columns: `word` containing the full word in lowercase using only standard characters (no whitespace, punctuation, or diacriticals), and twenty six additional columns named for the (lowercase) characters of the English alphabet a-z. For words of a length other than 9, the a-z columns should be null. For nine-letter words, each column a-z contains an `INT` with the total number of words that can be made if the column's letter was the one in the center. Note that letters not contained in the word will always be zero, and that the word match total includes the word itself.

## Database creation

Any method of creating this database is acceptable, however the recommended method is to generate a plain text file with one word per line (using the python scripts in this folder where needed), then import that test file into [DB Browser for SQLite](http://sqlitebrowser.org/) making sure to name the table `words` and the column `word`. With the word list now in an SQLite3 database, run the `add columns` query to add the required alphabet columns, then run `add_word_counts.txt` to add count totals to each 9-letter row of the database.

Note that running the `add_word_counts.txt` query will likely take at least three hours with any decently sized word list.

## Database updating

Any update to the database should be considered to invalidate column counts. To regenerate them, null the count for all values with `UPDATE words SET (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z) = null;`, then use the `add_word_counts.txt` query to regenerate them. As above, this will be very slow.