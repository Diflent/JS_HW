// Задача 1. Печатное издание
class PrintEditionItem {
  constructor(name, releaseDate, pagesCount) {
    this.name = name;
    this.releaseDate = releaseDate;
    this.pagesCount = pagesCount;
    this.state = 100;
    this.type = null;
  }

  fix() {
    this.state = this.state * 1.5;
  }

  set state(newState) {
    if (newState < 0) {
      this._state = 0;
    } else if (newState > 100) {
      this._state = 100;
    } else {
      this._state = newState;
    }
  }

  get state() {
    return this._state;
  }
}

class Magazine extends PrintEditionItem {
  constructor(name, releaseDate, pagesCount) {
    super(name, releaseDate, pagesCount);
    this.type = "magazine";
  }
}

class Book extends PrintEditionItem {
  constructor(author, name, releaseDate, pagesCount) {
    super(name, releaseDate, pagesCount);
    this.author = author;
    this.type = "book";
  }
}

class NovelBook extends Book {
  constructor(author, name, releaseDate, pagesCount) {
    super(author, name, releaseDate, pagesCount);
    this.type = "novel";
  }
}

class FantasticBook extends Book {
  constructor(author, name, releaseDate, pagesCount) {
    super(author, name, releaseDate, pagesCount);
    this.type = "fantastic";
  }
}

class DetectiveBook extends Book {
  constructor(author, name, releaseDate, pagesCount) {
    super(author, name, releaseDate, pagesCount);
    this.type = "detective";
  }
}

// Задача 2. Библиотека
class Library {
  constructor(name) {
    this.name = name;
    this.books = [];
  }

  addBook(book) {
    if (book.state > 30) {
      this.books.push(book);
    }
  }

  findBookBy(type, value) {
    const book = this.books.find((item) => item[type] === value);
    return book || null;
  }

  giveBookByName(bookName) {
    const index = this.books.findIndex((item) => item.name === bookName);

    if (index === -1) {
      return null;
    }

    return this.books.splice(index, 1)[0];
  }
}

// Тестовый сценарий
const library = new Library("Библиотека имени Ленина");

library.addBook(
  new DetectiveBook(
    "Артур Конан Дойл",
    "Полное собрание повестей и рассказов о Шерлоке Холмсе в одном томе",
    2019,
    1008
  )
);
library.addBook(
  new FantasticBook(
    "Аркадий и Борис Стругацкие",
    "Пикник на обочине",
    1972,
    168
  )
);
library.addBook(new NovelBook("Герберт Уэллс", "Машина времени", 1895, 138));
library.addBook(new Magazine("Мурзилка", 1924, 60));

if (library.findBookBy("releaseDate", 1919) === null) {
  library.addBook(new NovelBook("Евгений Замятин", "Мы", 1919, 240));
}
console.log("Книга 1919 года: " + library.findBookBy("releaseDate", 1919).name);

const givenBook = library.giveBookByName("Машина времени");
console.log("Количество книг после выдачи: " + library.books.length);

givenBook.state = 20;
console.log("Состояние повреждённой книги: " + givenBook.state);

givenBook.fix();
console.log("Состояние после первой починки: " + givenBook.state);
library.addBook(givenBook);
console.log("Книга вернулась в библиотеку: " + library.books.includes(givenBook));

givenBook.fix();
console.log("Состояние после второй починки: " + givenBook.state);
library.addBook(givenBook);
console.log("Книга вернулась в библиотеку: " + library.books.includes(givenBook));

// Задача 3. Журнал успеваемости
class Student {
  constructor(name) {
    this.name = name;
    this.marks = {};
  }

  addMark(mark, subject) {
    if (mark < 2 || mark > 5) {
      return;
    }

    if (!this.marks.hasOwnProperty(subject)) {
      this.marks[subject] = [];
    }

    this.marks[subject].push(mark);
  }

  getAverageBySubject(subject) {
    if (!this.marks.hasOwnProperty(subject)) {
      return 0;
    }

    const subjectMarks = this.marks[subject];
    const sum = subjectMarks.reduce((acc, mark) => acc + mark, 0);
    return sum / subjectMarks.length;
  }

  getAverage() {
    const subjects = Object.keys(this.marks);

    if (subjects.length === 0) {
      return 0;
    }

    const sum = subjects.reduce(
      (acc, subject) => acc + this.getAverageBySubject(subject),
      0
    );
    return sum / subjects.length;
  }
}
