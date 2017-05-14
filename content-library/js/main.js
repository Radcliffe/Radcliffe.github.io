$(document).ready(() => {
  "use strict";

  // Declare state variables.
  let data = {readings: []},
      readings = [],
      currentReading,
      readingIndex,
      sections,
      currentSection,
      sectionIndex,
      vocab,
      currentVocab,
      vocabIndex,
      comps,
      currentComp,
      compIndex,
      currentUID

  // jQuery DOM selectors.
  const $container = $('.container'),
        $signInButton = $('#sign-in-button'),
        $signOutButton = $('#sign-out-button'),
        $pages = $('.page'),
            // Reading list
        $readingList = $('#reading-list'),
        $addReading = $('#add-reading'),
        $readingListItems = $('#reading-list-items'),
            // Reading details
        $readingDetails = $('#reading-details'),
        $saveReadingDetails = $('#save-reading-details, #save-reading-details-2'),
        $addSection = $('#add-section, #add-section-2'),
        $selectSection = $('#select-section'),
        $readingTitle = $('#reading-title'),
        $readingAuthor = $('#reading-author'),
        $readingCoverImage = $('#reading-cover-image'),
        $readingLexileRange = $('#reading-lexile-range'),
        $readingCasasRange = $('#reading-casas-range'),
        $readingGoalAlign = $('#reading-goal-align'),
        $readingGenre = $('#reading-genre'),
        $readingLicense = $('#reading-license'),
        $readingLicenseExpires = $('#reading-license-expires'),
        $readingSynopsis = $('#reading-synopsis'),
        $readingNotes = $('#reading-notes'),
        $readingLinks = $('#reading-links'),
            // Section details
        $sectionDetails = $('#section-details'),
        $addVocab = $('#add-vocab'),
        $addComprehension = $('#add-comprehension'),
        $selectVocab = $('#select-vocab'),
        $selectComprehension = $('#select-comprehension'),
        $sectionReadingTitle = $('#section-reading-title'),
        $sectionTitle = $('#section-title'),
        $sectionBlocktext = $('#section-blocktext'),
        $saveSectionDetails = $('#save-section-details'),
        $deleteSection = $('#delete-section'),
            // Vocabulary
        $vocabulary = $('#vocabulary'),
        $vocabReadingTitle = $('#vocab-reading-title'),
        $vocabSectionTitle = $('#vocab-section-title'),
        $vocabParagraph = $('#vocab-paragraph'),
        $vocabWord = $('#vocab-word'),
        $vocabDefinition = $('#vocab-definition'),
        $vocabDistractors = $('#vocab-distractors'),
        $vocabPurpose = $('#vocab-purpose'),
        $vocabSchoolClass = $('#vocab-school-class'),
        $vocabStudentName = $('#vocab-student-name'),
        $vocabIncludeName = $('#vocab-include-name'),
        $saveVocab = $('#save-vocab'),
        $deleteVocab = $('#delete-vocab'),
            // comprehension
        $comprehension = $('#comprehension'),
        $compReadingTitle = $('#comp-reading-title'),
        $compSectionTitle = $('#comp-section-title'),
        $compParagraph = $('#comp-paragraph'),
        $compQuestion = $('#comp-question'),
        $compType = $('#comp-type'),
        $compAnswer = $('#comp-answer'),
        $compDistractors = $('#comp-distractors'),
        $compSchoolClass = $('#comp-school-class'),
        $compStudentName = $('#comp-student-name'),
        $compIncludeName = $('#comp-include-name'),
        $saveComprehension = $('#save-comprehension'),
        $deleteComprehension = $('#delete-comprehension');

  /*****************************************
   *    Authentication
   *****************************************/

  $signInButton.click((event) => {
    event.preventDefault();
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  });

  $signOutButton.click((event) => {
    event.preventDefault();
    firebase.auth().signOut();
  });

  firebase.auth().onAuthStateChanged(onAuthStateChanged);

  function onAuthStateChanged(user) {
    // We ignore token refresh events.
    if (user && currentUID === user.uid) {
      return;
    }
    if (user) {
      currentUID = user.uid;
      firebase.database().ref().once('value')
        .then(snapshot => {return snapshot.val();})
        .then(d => {
          data = d;
          data.readings = data.readings || [];
          readings = data.readings;
          currentReading = undefined;
          currentSection = undefined;
          redrawReadingList(0);
        });
    } else {
      currentUID = null;
    }
    $pages.css('visibility', 'visible');
  }

/*****************************************
 *    Reading list
 *****************************************/

  function redrawReadingList(delay) {
    if (delay === undefined) delay = 250;
    $pages.hide(delay);
    // console.log('redrawReadingList');
    $readingListItems.empty();
    readings.forEach((r, index) => {
      $readingListItems.append(makeCard(r, index));
    });
    $readingList.show(delay);
  }

  function makeCard(reading, index) {
    return $(`
      <div class="item item-${index+1}" >
        <div class="hover-btn">
          <button type="button" class="close" data-dismiss="alert">
            <span aria-hidden="true">×</span>
            <span class="sr-only">Close</span>
          </button>
        </div>
        <div class="card">
          <img class="card-img-top" src="${reading.coverImage}"
            alt="${reading.title}" height="150" />
          <div class="text">
            <h4 class="card-title">${reading.title}</h4>
            <p class="card-text">${reading.author} </p>
          </div>
        </div>
      </div>`);
    };

  $readingListItems.on('click', '.hover-btn', (event) => {
    const index = event.target.closest('.item').className.split('-')[1];
    readings.splice(index-1, 1);
    redrawReadingList();
  });

  $readingListItems.on('click', '.card', (event) => {
    readingIndex = event.target.closest('.item').className.split('-')[1] - 1;
    currentReading = readings[readingIndex];
    if (currentUID) firebase.database().ref().update(data);
    redrawReadingDetails();
  });

  $addReading.click((event) => {
    // console.log('$addReading');
    currentReading = {
      id: Date.now(),
      title: 'New reading',
      author: '',
      sections: [],
      src: 'logo1.png'
    };
    readings.push(currentReading);
    redrawReadingDetails();
  });

  // ******************************************************
  // Manage and display an individual story.

  function redrawReadingDetails() {
    // console.log('redrawReadingDetails');
    currentReading.sections = currentReading.sections || [];
    sections = currentReading.sections;
    $selectSection
      .html($('<option value="-1">Choose Reading Section</option>'));
    sections.forEach((s, index) => {
      $selectSection.append(`<option value="${index}">${s.title}</option>`);
    });
    $readingTitle.val(currentReading.title);
    $readingAuthor.val(currentReading.author);
    $readingCoverImage.val(currentReading.coverImage);
    $readingLexileRange.val(currentReading.lexileRange);
    $readingCasasRange.val(currentReading.casasRange);
    $readingGoalAlign.val(currentReading.goalAlign);
    $readingGenre.val(currentReading.genre);
    $readingLicense.val(currentReading.license);
    $readingLicenseExpires.val(currentReading.licenseExpires);
    $readingSynopsis.val(currentReading.synopsis);
    $readingNotes.val(currentReading.notes);
    $readingLinks.val(currentReading.links);
    $pages.hide(250);
    $readingDetails.show(250);
  }

  function saveReadingDetails() {
    // console.log('saveReadingDetails');
    currentReading.title = $readingTitle.val();
    currentReading.author = $readingAuthor.val();
    currentReading.coverImage = $readingCoverImage.val();
    currentReading.lexileAverage = $readingLexileRange.val();
    currentReading.casasAverage = $readingCasasRange.val();
    currentReading.goalAlign = $readingGoalAlign.val();
    currentReading.genre = $readingGenre.val();
    currentReading.license = $readingLicense.val();
    currentReading.licenseExpires = $readingLicenseExpires.val();
    currentReading.synopsis = $readingSynopsis.val();
    currentReading.notes = $readingNotes.val();
    currentReading.links = $readingLinks.val();
    if (currentUID) firebase.database().ref().update(data);
  };

  $saveReadingDetails.click((event) => {
    saveReadingDetails();
    redrawReadingList();
  });


  // ******************************************************
  // Manage and display an individual section of a reading.

  $selectSection.change((event) => {
    // console.log('$selectSection');
    sectionIndex = $selectSection.val();
    if (sectionIndex !== '-1') {
      currentSection = sections[sectionIndex];
      redrawSectionDetails();
    }
  });

  function redrawSectionDetails() {
    // console.log('redrawSectionDetails');
    $selectVocab.html('<option value="-1">Select word</option>');
    currentSection.vocab = currentSection.vocab || [];
    vocab = currentSection.vocab;
    vocab.forEach((v, index) => {
        $selectVocab.append(`<option value="${index}">${v.word}</option>`);
    });

    $selectComprehension.html('<option value="-1">Select comprehension question</option>');
    currentSection.comps = currentSection.comps || [];
    comps = currentSection.comps;
    comps.forEach((c, index) => {
      $selectComprehension.append(`<option value=${index}>${c.question}<option>`);
    });

    $sectionReadingTitle.val(currentReading.title);
    $sectionTitle.val(currentSection.title);
    $sectionBlocktext.val(currentSection.blocktext);
    $pages.hide(250);
    $sectionDetails.show(250);
  }

  $saveSectionDetails.click((event) => {
    // console.log('saveSectionDetails');
    currentSection.title = $sectionTitle.val();
    currentSection.blocktext = $sectionBlocktext.val();
    redrawReadingDetails();
  });

  $addSection.click((event) => {
    // console.log('$addSection');
    currentSection = {
      id: Date.now(),
      title: 'New section'
    };
    sectionIndex = sections.length;
    sections.push(currentSection);
    saveReadingDetails();
    redrawSectionDetails();
  });

  $deleteSection.click((event) => {
    // console.log('$deleteSection');
    sections.splice(sectionIndex, 1);
    sectionIndex = null;
    redrawReadingDetails();
  });

  $selectComprehension.change((event) => {
    // console.log('$selectComprehension');
    compIndex = $selectComprehension.val();
    if (compIndex !== '-1') {
      currentComp = comps[compIndex];
      redrawComprehension();
    }
  });

  $selectVocab.change((event) => {
    // console.log('$selectVocab');
    vocabIndex = $selectVocab.val();
    if (vocabIndex !== '-1') {
      currentVocab = vocab[vocabIndex];
      redrawVocabulary();
    }
  });

  function redrawVocabulary() {
    // console.log('$redrawVocabulary');
    $pages.hide(250);
    $vocabReadingTitle.val(currentReading.title);
    $vocabSectionTitle.val(currentSection.title);
    $vocabParagraph.val(currentVocab.paragraph);
    $vocabWord.val(currentVocab.word);
    $vocabDefinition.val(currentVocab.definition);
    $vocabDistractors.val(currentVocab.distractors);
    $vocabPurpose.val(currentVocab.purpose);
    $vocabSchoolClass.val(currentVocab.schoolClass);
    $vocabStudentName.val(currentVocab.studentName);
    $vocabIncludeName.val(currentVocab.includeName);
    $vocabulary.show(250);
  };

  $saveVocab.click((event) => {
    // console.log('$saveVocab');
    event.preventDefault();
    currentVocab.paragraph = Number($vocabParagraph.val());
    currentVocab.word = $vocabWord.val();
    currentVocab.definition = $vocabDefinition.val();
    currentVocab.distractors = $vocabDistractors.val();
    currentVocab.purpose = $vocabPurpose.val();
    currentVocab.schoolClass = $vocabSchoolClass.val();
    currentVocab.studentName = $vocabStudentName.val();
    currentVocab.includeName = $vocabIncludeName.val();
    redrawSectionDetails();
  });

  $addVocab.click((event) => {
    // console.log('$addVocab');
    event.preventDefault();
    vocabIndex = vocab.length;
    currentVocab = {};
    vocab.push(currentVocab);
    redrawVocabulary();
  });

  function redrawComprehension() {
    // console.log('redrawComprehension');
    $pages.hide(250);
    $compReadingTitle.val(currentReading.title);
    $compSectionTitle.val(currentSection.title);
    $compParagraph.val(currentComp.paragraph);
    $compQuestion.val(currentComp.question);
    $compType.val(currentComp.type);
    $compAnswer.val(currentComp.answer);
    $compDistractors.val(currentComp.distractors);
    $compSchoolClass.val(currentComp.schoolClass);
    $compStudentName.val(currentComp.studentName);
    $compIncludeName.val(currentComp.includeName);
    $comprehension.show(250);
  };

  $addComprehension.click((event) => {
      compIndex = comps.length;
      currentComp = {};
      comps.push(currentComp);
      redrawComprehension();
  });

  $saveComprehension.click((event) => {
    // console.log('$saveComprehension');
    currentComp.paragraph = $compParagraph.val();
    currentComp.question = $compQuestion.val();
    currentComp.type = $compType.val();
    currentComp.answer = $compAnswer.val();
    currentComp.distractors = $compDistractors.val();
    currentComp.schoolClass = $compSchoolClass.val();
    currentComp.studentName = $compStudentName.val();
    currentComp.includeName = $compIncludeName.val();
    redrawSectionDetails();
  });

});
