# Dictionary Generation

The target format for the dictionary is an SQLite database containing one `words` table, which in turn contains two columns: `word` and `count`. `word` is the full dictionary word in all lowercase with no whitespace or special characters (a-z only, no diacriticals), and `count` is the number of words (including itself) that can be made using by rearranging (and removing) its letters. Only 9-letter words have a `count` integer value. For all other word lengths, this field should be `null`.

## Database creation

Any method of creating this database is acceptable, however the recommended method is to generate a plain text file with one word per line (using the python scripts in this folder where needed), then import that test file into [DB Browser for SQLite](http://sqlitebrowser.org/), add the 'count' column using the management interface, then run the included `count_word_matches_query.txt` to add count totals to each 9-letter row of the database.

Note that running the `count_word_matches_query.txt` query will likely take at least three hours with any decently sized databse.

## Database updating

Any update to the database should be considered to invalidate the 'count' column totals. To regenerate them, null the count for all values with `UPDATE words SET count = null;`, then use the `count_word_matches_query.txt` query to regenerate them. As above, this will be very slow.