# Dictionary Generation

The target format for the dictionary is an SQLite database containing one `words` table, which in turn contains two columns: `word` and `max_count`. `word` is the full dictionary word in all lowercase with no whitespace or special characters (a-z only, no diacriticals), and `max_count` is the number of words (including itself) that can be made using by rearranging (and removing) its letters. (In practice the number of words that can be matched for the purpose of the game will generally be fewer than the max count due to the requirement to always use one of the letters.) Only 9-letter words have a `max_count` integer value. For all other word lengths, this field should be `null`.

## Database creation

Any method of creating this database is acceptable, however the recommended method is to generate a plain text file with one word per line (using the python scripts in this folder where needed), then import that test file into [DB Browser for SQLite](http://sqlitebrowser.org/), add the `max_count` column using the management interface, then run the included `count_max_word_matches.txt` to add count totals to each 9-letter row of the database.

Note that running the `count_max_word_matches.txt` query will likely take at least three hours with any decently sized databse.

## Database updating

Any update to the database should be considered to invalidate the `max_count` column totals. To regenerate them, null the count for all values with `UPDATE words SET max_count = null;`, then use the `count_max_word_matches.txt` query to regenerate them. As above, this will be very slow.