// const inputname = document.querySelector('input[name=name]');
// const altname = document.querySelector('#alt-name');

// inputname.addEventListener('focus', () => altname.classList.add('hide'));
// inputname.addEventListener('blur', event => {
//   if (event.target.value) altname.classList.add('hide');
//   else altname.classList.remove('hide');
// });

// window.addEventListener('keyup', event => {
//   let aside = document.querySelector('aside');
//   let name = document.querySelector('span#name');
//   if (event.keyCode === 13 && inputname.value) {
//     event.preventDefault();
//     name.textContent = inputname.value.toLowerCase();
//     document.querySelector('body').removeChild(aside);
//   }
// });

let library = {};

const storage = document.querySelector('#storage');
const shelves = document.querySelector('#shelves');
const form = document.querySelector('form');

function makebtn(text) {
  let btn = document.createElement('button');
  btn.textContent = text;
  return btn;
}

if (!localStorage.length) {
  storage.textContent = 'your shelves are empty';
} else {
  let clear = makebtn('Delete All Books');
  let remove = makebtn('Remove Books');
  let close = makebtn('Close');

  storage.textContent = '';
  storage.appendChild(clear);
  storage.appendChild(remove);

  clear.addEventListener('click', () => {
    localStorage.clear();
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

  let keys = Object.keys(localStorage);
  for (let key of keys) {
    let book = JSON.parse(localStorage.getItem(key));
    shelve(book)
  }
}

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
  let key = `book${localStorage.length}`;
  library.key = book;
  localStorage.setItem(JSON.stringify(key), JSON.stringify(library));
  form.reset();
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

function shelve(book) {
  for (let element in book) {
    let key = book[element];
    let item = catalogue('div', 'item',
    catalogue('div', 'item-top',
      catalogue('div', 'book-info',
        catalogue('div', 'book-by',
          catalogue('div', 'title', key.title),
          catalogue('div', 'author', `by ${key.author}`)
          ),
        catalogue('div', 'book-ex', 
          catalogue('div', '', 
            catalogue('b', '', 'Status: '), key.status)))));

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

  let l;
  if (key.review) l = 1;
  else l = 0;
  let lines = item.childNodes[0].childNodes[l].childNodes[1];

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
      catalogue('b', '', 'Rating: '),
      document.createTextNode(star));
      lines.appendChild(line);
  }

  let remove = catalogue('div', 'remove',
    catalogue('button', 'remove-btn', 'Delete'));

  item.appendChild(remove);
  shelves.appendChild(item);
  }
}

