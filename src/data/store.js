import { action, configure, observable, runInAction } from 'mobx';
import { Alert, Dimensions } from 'react-native';
import { NavigationActions } from 'react-navigation';
import SQLite from 'react-native-sqlite-storage';
import simpleStore from 'react-native-simple-store';

configure({
  enforceActions: true,
});

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const appSaveKey = '0318C041EFF1ADFE8DA8';

export default class store {
  @observable isAboutModalOpen = false;
  @action openAboutModal = () => {
    if (!this.isAboutModalOpen) {
      this.closeAllModals();
      this.isAboutModalOpen = true;
    }
  }
  @action closeAboutModal = () => {
    this.isAboutModalOpen = false;
  }

  @observable isMenuModalOpen = false;
  @action openMenuModal = () => {
    if (!this.isMenuModalOpen) {
      this.closeAllModals();
      this.isMenuModalOpen = true;
    }
  }
  @action closeMenuModal = () => {
    this.isMenuModalOpen = false;
  }

  @observable isInstructionsModalOpen = false;
  @action openInstructionsModal = () => {
    if (!this.isInstructionsModalOpen) {
      this.closeAllModals();
      this.isInstructionsModalOpen = true;
    }
  }
  @action closeInstructionsModal = () => {
    this.isInstructionsModalOpen = false;
  }
  closeAllModals = () => {
    this.closeAboutModal();
    this.closeInstructionsModal();
    this.closeMenuModal();
  }

  @observable letters = '         ';
  @observable loading = false;
  @action setLoading = (bool) => {
    this.loading = !!bool;
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
    simpleStore.update(appSaveKey, { timer: seconds });
  }
  @observable tried = observable.map();
  @observable width = 0;
  @observable words = observable.map();

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
  @action clearSelected = (num = 1) => {
    const rangeEnd = this.selected.length - num;
    this.selected.replace(this.selected.filter((s, i) => i < rangeEnd));
  }

  scores = [
    { percent: 100, text: 'Exceptional!' },
    { percent: 85, text: 'Excellent!' },
    { percent: 65, text: 'Very Good!' },
    { percent: 40, text: 'Good!' },
    { percent: 0, text: '' },
  ];

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

    // Open the word database
    const ok = () => {};
    const err = () => {
      Alert.alert('Word database failed to open. Please re-install the app.');
    };
    this.db = SQLite.openDatabase({ name: 'main.db', createFromLocation: 1 }, ok, err);
  }

  nav = {
    get: () => {
      if (
        this.navigator &&
        this.navigator.state &&
        this.navigator.state.nav.routes.length > 0
      ) {
        return this.navigator.state.nav.routes[this.navigator.state.nav.index].routeName;
      }
      return 'none';
    },
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
    timed,
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

    // Load up the data store with the new game state
    if (!cancel) {
      runInAction(() => {
        this.letters = newLetters;
        this.words.clear();
        newWords.forEach((word) => {
          this.words.set(word, true);
        });
        this.tried.clear();
        this.selected.replace([]);
        this.scored = false;
        this.statusText = 'Welcome!';
        this.timer = timed ? ((newWords.length - 1) * 4) : -1;
        // console.log(newWords);

        this.saveGame();
      });
    }
  }

  async saveGame() {
    const gameState = {
      letters: this.letters,
      timer: this.timer,
      tried: this.tried.toJSON(),
      newGameOptions: {
        timed: this.newGameOptions.get('timed'),
        wordRange: this.newGameOptions.get('wordRange'),
      },
      scored: this.scored,
      words: [...this.words].map(([key]) => key),
    }
    await simpleStore.save(appSaveKey, gameState);
    return true;
  }

  async loadGame() {
    const gameState = await simpleStore.get(appSaveKey);
    if (gameState) {
      runInAction(() => {
        this.letters = gameState.letters;
        this.words.clear();
        gameState.words.forEach((word) => {
          this.words.set(word, true);
        });
        this.tried.replace(gameState.tried);
        this.selected.replace([]);
        this.scored = gameState.scored;
        this.statusText = '';
        this.timer = gameState.timer;
        this.newGameOptions.replace(gameState.newGameOptions);
      });
      return true;
    }
    return false;
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
    if (this.tried.has(word)) {
      this.setStatus('Already tried');
      return null;
    }

    // If the word is correct, report to user and add time if relevant
    if (this.words.has(word)) {
      this.tried.set(word, true);
      simpleStore.update(appSaveKey, { tried: this.tried.toJSON() });
      this.selected.replace([]);
      if (this.timer > -1) {
        const addTime = (word.length * 5);
        this.setStatus(`Nice! +${addTime} seconds.`);
        this.setTimer(this.timer + addTime);
      } else {
        this.setStatus('Nice!');
      }
      return true;
    }

    // Finally, just fail
    this.tried.set(word, false);
    this.selected.replace([]);
    this.setStatus('Unrecognized word.');
    simpleStore.update(appSaveKey, { tried: this.tried.toJSON() });
    return false;
  }

  @action setStatus = (message) => {
    this.statusText = message;
    setTimeout(action(() => {
      if (this.statusText === message) {
        if (this.scored === false) {
          this.statusText = '';
        } else {
          this.statusText = 'Game scored';
        }
      }
    }), 3000);
  }

  getScore = () => {
    const correct = Array.from(this.tried).filter(([, t]) => t).length;
    const absoluteScores = this.scores.map(scoreObj => ({
      ...scoreObj,
      numWords: (Math.floor((scoreObj.percent / 100) * this.words.size)),
    }));
    const currentScore = absoluteScores.find(({ numWords }) => (numWords <= correct));
    const nextScore = absoluteScores[(absoluteScores.indexOf(currentScore) || 1) - 1];
    return ({
      text: currentScore.text,
      toNext: nextScore.numWords - correct,
    });
  }

  @action scoreGame = () => {
    this.scored = true;
    this.statusText = 'Game scored';
    simpleStore.update(appSaveKey, { scored: true });
  }
}
