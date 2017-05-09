$(document).ready(() => {
  $('.page').hide();
  let data = {books: []};
  let books = [], book, section, signedIn = false

  function init(d) {
    data = d;
    books = data.books;
    book = undefined;
    section = undefined;
  }

  const bookRack = $('#book-rack');
  const bookRackItems = $('#book-rack-items');
  const readingDetails = $('#reading-details');
  const selectSection = $('#select-section');
  const sectionDetails = $('#section-details');
  const pages = $('.page');
  const signInButton = $('#sign-in-button');
  const signOutButton = $('#sign-out-button');

  redrawBookRack();

  signInButton.click((event) => {
    event.preventDefault();
    signedIn = true;
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
    firebase.database().ref().once('value')
      .then(function(snapshot) {return snapshot.val();})
      .then(function(data) {init(data);})
      .then(redrawBookRack);
  });

  signOutButton.click((event) => {
    event.preventDefault();
    signedIn = false;
    firebase.auth().signOut();
  });

  function redrawBookRack() {
    bookRackItems.empty();
    books.forEach((book, index) => {
      bookRackItems.append(makeCard(book, index));
    });
    pages.hide();
    bookRack.show();
  }

  function redrawReadingDetails() {
    let sections = book.sections || [];
    selectSection.empty();
    selectSection
      .append($('<option></option')
      .text('Choose Reading Section')
      .attr('value', -1));
    sections
      .forEach((section, index) => {
        let option = $('<option></option>')
          .text(section.title)
          .attr('value', index);
        selectSection.append(option);
      });
    $('#reading-title').val(book.title);
    $('#author').val(book.author);
    $('#cover-image').val(book.src);
    $('#lexile-average').val(book.lexileAverage);
    $('#casas-average').val(book.casasAverage);
    $('#goal-align').val(book.goalAlign);
    $('#genre').val(book.genre);
    $('#license').val(book.license);
    $('#license-expires').val(book.licenseExpires);
    $('#notes').val(book.notes);
    $('#links').val(book.links);
    pages.hide();
    readingDetails.show();
  }

  function redrawSectionDetails() {
    $('#reading-title-2').val(book.title);
    $('#section-title').val(section.title);
    $('#blocktext').val(section.blocktext);
    pages.hide();
    sectionDetails.show();
  }

  function makeCard(book, index) {
    return $(`
      <div class="item item-${index+1}" >
        <div class="hover-btn">
          <button type="button" class="close" data-dismiss="alert">
            <span aria-hidden="true">×</span>
            <span class="sr-only">Close</span>
          </button>
        </div>
        <div class="card">
          <img class="card-img-top" src=${book.src} alt=${book.title} height="150" />
          <div class="text">
            <h4 class="card-title">${book.title}</h4>
            <p class="card-text">${book.author} </p>
          </div>
        </div>
      </div>`);
    };

  $('.grid').on('click', '.hover-btn', (event) => {
    const bookIndex = event.target.closest('.item').className.split('-')[1];
    books.splice(bookIndex-1, 1);
    redrawBookRack();
  });

  $('.grid').on('click', '.card', (event) => {
    const bookIndex = event.target.closest('.item').className.split('-')[1];
    book = books[bookIndex-1];
    if (signedIn) firebase.database().ref().update(data);
    redrawReadingDetails();
  });

  function saveReadingDetails() {
    book.title = $('#reading-title').val();
    book.author = $('#author').val();
    book.src = $('#cover-image').val();
    book.lexileAverage = $('#lexile-average').val();
    book.casasAverage = $('#casas-average').val();
    book.goalAlign = $('#goal-align').val();
    book.genre = $('#genre').val();
    book.license = $('#license').val();
    book.licenseExpires = $('#license-expires').val();
    book.notes = $('#notes').val();
    book.links = $('#links').val();
    if (signedIn) firebase.database().ref().update(data);
  };

  $('#save-reading-details, #save-reading-details-2').click((event) => {
    saveReadingDetails();
    redrawBookRack();
  });

  $('#select-section').change((event) => {
    let sectionIndex = $('#select-section').val();
    if (sectionIndex == '-1') return false;
    section = book.sections[sectionIndex];
    redrawSectionDetails();
  });

  $('#save-section-details').click((event) => {
    section.title = $('#section-title').val();
    section.blocktext = $('#blocktext').val();
    redrawReadingDetails();
  });

  $('#add-reading').click((event) => {
    book = {
      id: Date.now(),
      title: 'New reading',
      author: '',
      sections: [],
      src: 'logo1.png'
    };
    books.unshift(book);
    redrawReadingDetails();
  });

  $('#add-section, #add-section-2').click((event) => {
    saveReadingDetails();
    section = {
      id: Date.now(),
      title: 'New section'
    };
    book.sections.push(section);
    redrawSectionDetails();
  });
});
