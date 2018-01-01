import { action, computed, observable, runInAction, useStrict } from 'mobx';
import { Alert, Dimensions } from 'react-native';
import { NavigationActions } from 'react-navigation';
import SQLite from 'react-native-sqlite-storage';

useStrict(true);

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
export default class AppState {
  @observable aboutModal = {};
  @action loadAboutModal = (modal) => {
    this.aboutModal = modal;
  }

  @observable gameModal = {};
  @action loadGameModal = (modal) => {
    this.gameModal = modal;
  }

  @observable instructionsModal = {};
  @action loadInstructionsModal = (modal) => {
    this.instructionsModal = modal;
  }

  @observable letters = '         ';
  @observable loading = false;
  @action setLoading = (bool) => {
    this.loading = bool;
  };
  @observable navigator = {};
  @observable newGameOptions = observable.map({
    timed: false,
    wordRange: {
      min: 10,
      max: 49,
    },
  });
  @action setNewGameOptions = (key, val) => {
    this.newGameOptions.set(key, val);
  }
  @observable orientation = 0;
  @observable scored = false;
  @observable statusText = '';
  @observable timer = -1;
  @action setTimer = (seconds) => {
    this.timer = seconds;
  }
  @observable tried = [];
  @observable width = 0;
  @observable words = [];

  @observable selected = [];
  @action toggleSelected = (letterIndex) => {
    const copy = this.selected.slice();
    const loc = this.selected.indexOf(letterIndex);
    if (loc === -1) {
      this.selected.replace([...copy, letterIndex]);
    } else {
      this.selected.remove(letterIndex);
    }
  }

  // Given a string, this function will randomly rearrange the string then return it.
  shuffle = (string) => {
    const a = string.split('');
    const n = a.length;

    for (let i = n - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a.join('');
  };

  // Given a word and the SQLite database containing dictionary words, this will return
  // all words which can be made via permutations or sub-permutations of the starting word.
  getPermutatedWords = (word, db) =>
    new Promise((resolve) => {
      db.transaction((tx) => {
        const uniqueLettersInWord = Array.from(new Set(word.split(''))).join('');

        const sqlQuery = `SELECT word FROM words WHERE ${[
          '(length(word) >= 4)',
          '(length(word) <= 9)',
          `(word GLOB '*[${uniqueLettersInWord}]*')`, // INCLUDE words with any of our letters
          ...alphabet.map((letter) => { // EXCLUDE words containing too many of any letter
            const occurrencesInWord = word.split(letter).length - 1;
            return `(word NOT LIKE '${(`%${letter}`).repeat(occurrencesInWord + 1)}%')`;
          }),
        ].join(' AND ')}`;

        new Promise((wordsResolve) => {
          tx.executeSql(sqlQuery, [], (tx1, results2) => {
            wordsResolve(results2.rows.raw().map(row => row.word));
          });
        })
          .then(resolve);
      });
    });

  // Formatting logic for the game word list display
  @computed get triedWordList() {
    if (this.tried.length === 0 && this.scored !== true) {
      return [{ word: 'No words', style: 'neutral' }];
    }
    const triedWords = this.tried.sort().map(word => (
      { word, style: this.words.indexOf(word) !== -1 ? 'correct' : 'incorrect' }
    ));

    // If the game has been scored, display all words
    if (this.scored === true) {
      const notFound = this.words.sort().filter(word => (
        (typeof (this.tried.find(w => (w === word))) === 'undefined')
      )).map(word => (
        ({ word, style: 'neutral' })
      ));
      const yourWords = this.tried.length !== 0 ?
        [
          { word: ' ', style: 'neutral' },
          { word: 'Your words:', style: 'neutral' },
          ...triedWords,
        ]
        :
        [];
      return [
        { word: 'Not found:', style: 'neutral' },
        ...notFound,
        ...yourWords,
      ];
    }

    // ...Otherwise just show words that have been tried
    return triedWords;
  }

  constructor() {
    const { width, height } = Dimensions.get('window');
    Dimensions.addEventListener('change', (data) => {
      runInAction(() => {
        this.orientation = (data.window.width < data.window.height) ? 0 : 1;
        this.width = data.window.width;
      });
    });
    this.orientation = (width < height) ? 0 : 1;
    this.width = Dimensions.get('window').width;

    // Add game score levels
    this.scores = [
      { percent: 0, text: '' },
      { percent: 40, text: 'Good' },
      { percent: 65, text: 'Very Good' },
      { percent: 85, text: 'Excellent' },
      { percent: 100, text: 'Exceptional' },
    ];

    // Open the word database
    const ok = () => {};
    const err = () => {
      Alert.alert('Word database failed to open. Please re-install the app.');
    };
    this.db = SQLite.openDatabase({ name: 'main.db', createFromLocation: 1 }, ok, err);
  }

  nav = {
    goto: (screen) => {
      if (typeof (this.navigator.dispatch) === 'undefined') {
        return false;
      }
      return this.navigator.dispatch({ type: 'Navigation/NAVIGATE', routeName: screen });
    },
    resetto: (screen) => {
      if (typeof (this.navigator.dispatch) === 'undefined') {
        return false;
      }
      return this.navigator.dispatch(NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: screen }),
        ],
      }));
    },
  }

  async newGame({
    letters,
    timer,
    tried,
    wordsMax,
    wordsMin,
  }) {
    const onlyWordsContaining = ((letter, words) =>
      words.filter(w => w.indexOf(letter) !== -1)
    );

    let cancel = false;
    let newLetters = '';
    let newWords = [];
    let permutations = [];

    // If we've been passed letters explicitly,
    // use the provided letters and just get word list
    if (typeof (letters) === 'string') {
      newLetters = letters;
      permutations = await this.getPermutatedWords(letters, this.db);
      newWords = onlyWordsContaining(letters.substr(4, 1), permutations);

    // If no letters are provided, find a new word that
    // is suitable for the selected word match range
    // and get word list for it
    } else {
      const queryString = 'SELECT * FROM words WHERE ' +
        'length(word)=9 AND' +
        `${
          alphabet.map((
            char => `(${char} >= ${wordsMin} AND ${char} <= ${wordsMax})`
          ))
            .join(' OR ')
          }` +
        'ORDER BY RANDOM() ' +
        'LIMIT 1';

      await new Promise((resolve) => {
        this.db.transaction((tx) => {
          tx.executeSql(
            queryString,
            [],
            async (x, { rows }) => {
              const row = rows.item(0);

              if (!row) {
                Alert.alert('No suitable words found. Please expand search parameters.');
                cancel = true;
              } else {
                const centerLetter = this.shuffle(alphabet.join(''))
                  .split('')
                  .find(key => row[key] >= wordsMin && row[key] <= wordsMax);

                const jumble = this.shuffle(row.word).replace(centerLetter, '');
                newLetters = `${jumble.substr(0, 4)}${centerLetter}${jumble.substr(4)}`;

                permutations = await this.getPermutatedWords(newLetters, this.db);
                newWords = onlyWordsContaining(centerLetter, permutations);
              }
              resolve();
            },
          );
        });
      });
    }

    // Load up the data store with the results
    if (!cancel) {
      runInAction(() => {
        this.letters = newLetters;
        this.words.replace(newWords);
        this.tried.replace(Array.isArray(tried) ? tried : []);
        this.selected.replace([]);
        this.scored = false;
        this.statusText = 'Welcome!';

        if (typeof (timer) === 'number') {
          this.timer = timer === -1 ? ((newWords.length - 1) * 4) : timer;
        } else {
          this.timer = -1;
        }
        console.log(newWords);
      });
    }
  }

  @action submitWord = () => {
    // If game has already been scored, fail
    if (this.scored === true) {
      this.setStatus('Game already scored');
      return false;
    }

    // If word too short, fail
    if (this.selected.length < 4) {
      this.setStatus('Too short');
      return false;
    }

    const word = this.selected.map(i => (
      this.letters.substr(i, 1)
    )).join('');

    // If the middle letter isn't selected, fail
    if (word.indexOf(this.letters.substr(4, 1)) === -1) {
      this.setStatus('Missing middle letter');
      return false;
    }

    // If word already guessed, fail
    if (this.tried.find(w => (w === word))) {
      this.setStatus('Already tried');
      return null;
    }

    // If the word is correct, report to user and add time if relevant
    if (this.words.indexOf(word) !== -1) {
      this.tried.push(word);
      this.selected.replace([]);
      if (this.timer > -1) {
        const addTime = (word.length * 5);
        this.setStatus(`Nice! +${addTime} seconds.`);
        this.timer = (this.timer + addTime);
      } else {
        this.setStatus('Nice!');
      }
      return true;
    }

    // Finally, just fail
    this.tried.push(word);
    this.selected.replace([]);
    this.setStatus('Unrecognized word.');
    return false;
  }

  @action setStatus = (message) => {
    this.statusText = message;
    setTimeout(action(() => {
      if (this.statusText === message) {
        if (this.scored === false) {
          this.statusText = '';
        } else {
          this.statusText = this.getScore();
        }
      }
    }), 3000);
  }

  getScore = () => {
    const correct = this.tried.filter(tryEntry => (
      this.words.indexOf(tryEntry) !== -1
    )).length;
    const adjustedScores = this.scores.map(scoreObj => (
      {
        ...scoreObj,
        numWords: (Math.floor((scoreObj.percent / 100) * this.words.length)),
      }
    ));
    const currentScore = adjustedScores
      .filter(a => (a.numWords <= correct))
      .sort((a, b) => b.numWords - a.numWords)[0];
    const nextScore = adjustedScores
      .filter(a => (a.numWords > correct))
      .sort((a, b) => a.numWords - b.numWords)[0];
    return ({
      text: currentScore.text,
      toNext: (typeof (nextScore) !== 'undefined') ?
        (nextScore.numWords - correct)
        :
        0,
    });
  }

  @action scoreGame = () => {
    this.scored = true;
    this.statusText = 'Game scored';
  }
}
