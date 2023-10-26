/* eslint-disable */
const d = new Date();
const year = d.getFullYear();
const pageNumbering = (divName, pageNumber) => {
  const numberElement = $(`#${divName} .num-page`);
  numberElement.text('Pag: ' + pageNumber);
  if (pageNumber > 9) {
    numberElement.addClass('num-page-double');
    numberElement.removeClass('num-page');
  }
  return pageNumber + 1;
};

const pager = (divName, pageNumber, title) => {
  const headerHeight = 165;
  const safeBottomArea = 100;
  // @ts-ignore
  const pageLength = $('#cover-page').innerHeight() - headerHeight - safeBottomArea;
  const margin = 16;
  const pages = [];
  let page = 0;
  let pageCumulatedLength = 0;
  pages.push([]);

  const listParagraph = $(`#${divName}-content > .break-elem`).toArray();

  console.log(listParagraph);

  listParagraph.forEach((el) => {
    if (pageCumulatedLength + el.offsetHeight + margin <= pageLength) {
      pageCumulatedLength += el.offsetHeight + margin;
      pages[page].push(el);
    } else {
      page += 1;
      pageCumulatedLength = el.offsetHeight + margin;
      pages.push([]);
      pages[page].push(el);
    }
  });

  if (pages.length > 1) {
    pages.forEach((page, index) => {
      $(`#${divName}`).before(
        '' +
          `<div id="${divName}-${index}" class="container container-height page-spacer" style="position: relative;">` +
          `<div class="row no-gutters">` +
          '<div class="col">' +
          `<div id="${divName}-content-${index}" class="p-2">` +
          '</div>' +
          '</div>' +
          '</div>' +
          '<div class="footer">' +
          ' <div class="container-name">' +
          ` <span class="name">PERSONA PROTETTA</span>` +
          `<span class="${pageNumber + index > 9 ? 'num-page-double' : 'num-page'}">Pag: ${pageNumber + index}</span>` +
          '</div>' +
          `<span class="year">${year}</span>` +
          '</div>' +
          '<div style="page-break-after:always;"></div>' +
          '</div>' +
          '',
      );

      $(`#${divName}-${index}`).prepend($('#header-div').clone());
      page.forEach((paragraph) => {
        $(`#${divName}-content-${index}`).append(paragraph);
      });
    });

    $(`#${divName}`).remove();
  }

  return pageNumber + pages.length;
};

$(() => {
  let pageNumber = 2;
  pageNumber = pager('sections-page', pageNumber, '');
  pageNumber = pageNumbering('last-page', pageNumber);
});
