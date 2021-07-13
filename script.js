const inputname = document.querySelector('input[name=name]');
const altname = document.querySelector('#alt-name');

inputname.addEventListener('focus', () => altname.classList.add('hide'));
inputname.addEventListener('blur', event => {
  if (event.target.value) altname.classList.add('hide');
  else altname.classList.remove('hide');
});

let aside = document.querySelector('aside');
let name = document.querySelector('span#name');

window.addEventListener('keyup', event => {
  if (event.keyCode === 13 && inputname.value) {
    event.preventDefault();
    name.textContent = inputname.value.toLowerCase();
    localStorage.setItem('name', JSON.stringify(name.textContent));
    document.querySelector('body').removeChild(aside);
  }
});

if (localStorage.getItem('name')) {
  name.textContent = JSON.parse(localStorage.getItem('name'));
  document.querySelector('body').removeChild(aside);
}

let library = localStorage.getItem('books')
              ? JSON.parse(localStorage.getItem('books'))
              : [];

const storage = document.querySelector('#storage');
const shelves = document.querySelector('#shelves');
const form = document.querySelector('form');

const Book = function(rating, title, author, pages, status, genre, cover, start, end, review) {
  this.rating = rating;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.status = status;
  this.genre = genre;
  this.cover = cover;
  this.start = start;
  this.end = end;
  this.review = review;
}

function makebtn(text) {
  let btn = document.createElement('button');
  btn.textContent = text;
  return btn;
}

if (!localStorage.getItem('books')) {
  storage.textContent = 'your shelves are empty';
} else {
  let clear = makebtn('Delete All Books');
  let remove = makebtn('Edit');
  let close = makebtn('Close');

  storage.textContent = '';
  storage.appendChild(clear);
  storage.appendChild(remove);

  clear.addEventListener('click', () => {
    localStorage.removeItem('books');
    localStorage.setItem('old', 'true');
    location.reload();
  });

  remove.addEventListener('click', () => {
    document.querySelectorAll('.remove').forEach(btn => btn.classList.add('move'));
    storage.removeChild(remove);
    storage.appendChild(close);
  });

  close.addEventListener('click', () => {
    document.querySelectorAll('.remove').forEach(btn => btn.classList.remove('move'));
    storage.removeChild(close);
    storage.appendChild(remove);
  });

  let books = JSON.parse(localStorage.getItem('books'));
  shelve(books);
}

form.addEventListener('submit', e => {
  let fields = document.querySelectorAll('input[name]');
  let review = document.querySelector('textarea');
  let fieldvalues = [];
  fields.forEach(field => {
    let type = field['name'];
    if (type === 'rating') {
      if (field.checked === true) {
        fieldvalues.push(field.value);
      }
    } else {
      fieldvalues.push(field.value);
    }
  });
  fieldvalues.push(review.value);
  let book = new Book(...fieldvalues);
  library.push(book);
  localStorage.setItem('books', JSON.stringify(library));
  e.preventDefault();
  form.reset();
  location.reload();
});

function catalogue(type, classvalue, ...children) {
  let card = document.createElement(type);
  if (classvalue) card.className = classvalue;
  for (let child of children) {
    if (typeof child != 'string') card.appendChild(child);
    else card.appendChild(document.createTextNode(child));
  }
  return card;
}

function shelve(books) {
  for (let book in books) {
    let key = books[book];
    let item = catalogue('div', 'item',
    catalogue('div', 'item-top',
      catalogue('div', 'book-info',
        catalogue('div', 'book-by',
          catalogue('div', 'title', key.title),
          catalogue('div', 'author', `by ${key.author}`)),
        catalogue('div', 'book-ex', 
          catalogue('div', '', 
            catalogue('b', '', 'Status: '), key.status)))));
    
    shelves.appendChild(item);
  
    if (key.review) {
      let line = catalogue('div', 'item-bottom',
      catalogue('div', 'book-review', 
        catalogue('div', '',
          catalogue('b', '', 'Review: '), key.review)));
      item.appendChild(line);
    }

    if (key.cover) {
      let parent = item.childNodes[0];
      let sibling = item.childNodes[0].childNodes[0];
      let cover = catalogue('div', 'cover', 
        catalogue('img', ''));
      cover.childNodes[0].setAttribute('src', key.cover);
      parent.insertBefore(cover, sibling);
    }

    let lines = item.firstChild.lastChild.lastChild;

    addLine(key.pages, 'Page Count: ');
    addLine(key.genre, 'Genre: ');
    addLine(key.start, 'Date Started: ');
    addLine(key.end, 'Date Finished: ');

    function addLine(value, header) {
      if (value) {
        let line = catalogue('div', '',
          catalogue('b', '', header), value);
        lines.appendChild(line);
      }
    }

    if (key.rating > 0) {
      let star = '';
      for (let i = 0; i < Number(key.rating); i++) star += '⭐';
      let line = catalogue('div', 'star', 
        catalogue('b', '', 'Rating: '), star);
        lines.appendChild(line);
    }

    let remove = catalogue('div', 'remove',
      catalogue('button', 'remove-btn', 'Delete Book'),
      catalogue('button', 'edit-btn', 'Change Status'));

    remove.firstChild.addEventListener('click', () => {
      let temp = library.slice(0, book).concat(library.slice(book + 1));
      library = temp;
      localStorage.setItem('books', JSON.stringify(library));
      if (!library.length) {
        localStorage.removeItem('books');
        localStorage.setItem('old', 'true');
      }
      location.reload();
    });

    remove.childNodes[1].addEventListener('click', () => {
      let change = catalogue('div', 'change', 
        inputStatus('Finished'),
        inputStatus('Reading'),
        inputStatus('To Read'));
      remove.appendChild(change);

    }, {once: true});

    function inputStatus(label) {
      let btn = document.createElement('button');
      btn.textContent = label;
      btn.addEventListener('click', () => {
        library[book].status = label;
        localStorage.setItem('books', JSON.stringify(library));
        location.reload();
      });
      return btn;
    }
  item.appendChild(remove);
  }
}

let start = [
  { rating: 5, title: "Battle Royale", author: "Koushun Takami", pages: "647", status: "Finished", genre: "Horror", cover: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1397576215l/18280791.jpg", start: "", end: "", review: "" },
  { rating: 5, title: "Circe", author: "Madeline Miller", pages: "336", status: "Finished", genre: "Fantasy", cover: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1544457476l/32993458._SY475_.jpg", start: "2021-07-11", end: "2021-07-12", review: "So good." }
]

if (!localStorage.getItem('books') && !localStorage.getItem('old')) {
  localStorage.setItem('examples', JSON.stringify(start));
  let books = JSON.parse(localStorage.getItem('examples'));
  shelve(books);
}
