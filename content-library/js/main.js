$(document).ready(() => {
  const books = data.books;
  var book;
  var section;
  const bookRack = $('#book-rack');
  const bookRackItems = $('#book-rack-items');
  const readingDetails = $('#reading-details');
  const selectSection = $('#select-section');
  const sectionDetails = $('#section-details');
  const pages = $('.page');

  redrawBookRack();

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
    selectSection.append($('<option></option').text('Choose Reading Section').attr('value', -1));
    sections.forEach((section, index) => {
        let option = $('<option></option>').text(section.title).attr('value', index);
        selectSection.append(option);
    });
    $('#reading-title').val(book.title);
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
    console.log('makeCard');
    return $(`
      <div class="item item-${index+1}" >
        <div class="card">
          <img class="card-img-top" src=${book.src} alt=${book.title} height="150" />
          <div class="text">
            <h4 class="card-title">${book.title}</h4>
            <p class="card-text">${book.author} </p>
          </div>
        </div>
      </div>`);
    };

  $('.grid').click((event) => {
    console.log('clickGrid');
    const bookIndex = event.target.closest('.item').className.split('-')[1];
    book = books[bookIndex-1];
    redrawReadingDetails();
  });

  $('#save-reading-details').click((event) => {
    console.log('save-reading-details');
    book.title = $('#reading-title').val();
    book.src = $('#cover-image').val();
    book.lexileAverage = $('#lexile-average').val();
    book.casasAverage = $('#casas-average').val();
    book.goalAlign = $('#goal-align').val();
    book.genre = $('#genre').val();
    book.license = $('#license').val();
    book.licenseExpires = $('#license-expires').val();
    book.notes = $('#notes').val();
    book.links = $('#links').val();
    redrawBookRack();
  });

  $('#select-section').change((event) => {
    let sectionIndex = $('#select-section').val();
    if (sectionIndex == '-1') return false;
    console.log('section', sectionIndex);
    section = book.sections[sectionIndex];
    redrawSectionDetails();
  });

  $('#save-section-details').click((event) => {
    console.log('#save-section-details');
    section.title = $('#section-title').val();
    section.blocktext = $('#blocktext').val();
    redrawReadingDetails();
  });

  $('#add-reading').click((event) => {
    console.log('add-reading');
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

  $('#add-section').click((event) => {
    console.log('add-section');
    section = {
      id: Date.now(),
      title: 'New section'
    };
    book.sections.push(section);
    redrawSectionDetails();
  });
});
