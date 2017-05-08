$(document).ready(() => {
  var book;
  var section;
  const bookRack = $('#book-rack');
  const bookRackItems = $('#book-rack-items');
  const readingDetails = $('#reading-details');
  const selectSection = $('#select-section');
  const sectionDetails = $('#section-details');

  readingDetails.hide();
  sectionDetails.hide();

  const books = data.books;

  function redraw() {
    bookRackItems.empty();
    books.forEach((book, index) => {
      bookRackItems.append(makeCard(book, index));
    });
  }

  redraw();

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
    let sections = book.sections || [];
    selectSection.empty();
    selectSection.append($('<option></option').text('Choose Reading Section').attr('value', -1));
    sections.forEach((section, index) => {
        let option = $('<option></option>').text(section.title).attr('value', index);
        selectSection.append(option);
    });
    readingDetails.show();
    bookRack.hide();
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
  });

  $('#save-detail').click((event) => {
    console.log('saveDetail');
    bookRack.show();
    readingDetails.hide();
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
  });

  $('#select-section').change((event) => {
    let sectionIndex = $('#select-section').val();
    if (sectionIndex == '-1') return false;
    console.log('section', sectionIndex);
    section = book.sections[sectionIndex];
    console.log(section);
    $('#reading-title-2').val(book.title);
    $('#section-title').val(section.title);
    $('#blocktext').val(section.blocktext);
    readingDetails.hide();
    sectionDetails.show();
  });
  // addNewBook = () => {
  //   let books = this.state.books;
  //   books.unshift({
  //     id: Date.now(),
  //     title: 'New reading',
  //     src: '/logo1.png'
  //   });
  //   this.setState({books});

  $('#add-reading').click((event) => {
    books.unshift({
      id: Date.now(),
      title: 'New reading',
      author: '',
      src: 'logo1.png'
    });
    redraw();
  });
});
