export const wordnik_URL = `https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=noun%2Cadjective%2Cverb%2Cadverb%2Cverb-intransitive%2Cverb-transitive%2Cpast-participle&minCorpusCount=1000&maxCorpusCount=-1&minDictionaryCount=5&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=${process.env.REACT_APP_WORDNIK_API}`;

export const translateUrl = `https://translation.googleapis.com/language/translate/v2?target=zh-TW&key=${process.env.REACT_APP_GOOGLE_API}`;

export const definitionUrl = (eng) => {
  return `https://api.wordnik.com/v4/word.json/${eng}/definitions?limit=3&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=${process.env.REACT_APP_WORDNIK_API}`;
};

export const exampleUrl = (eng) => {
  return `https://api.wordnik.com/v4/word.json/${eng}/topExample?useCanonical=false&api_key=${process.env.REACT_APP_WORDNIK_API}`;
};

export const dailyUrl =
  "https://vocab-memorizer-backend.onrender.com/api/v1/public/daily-vocabularies/";

export const loginUrl =
  "https://vocab-memorizer-backend.onrender.com/api/v1/auth/local/";

export const registerUrl =
  "https://vocab-memorizer-backend.onrender.com/api/v1/users/";

export const vocUrl =
  "https://vocab-memorizer-backend.onrender.com/api/v1/vocabularies/";

export const backendHome =
  "https://vocab-memorizer-backend.onrender.com/api/v1/users/stats/";
