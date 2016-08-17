


document.addEventListener('DOMContentLoaded', function() {
  console.log('asdf');
  document.getElementById('episte_id').focus();
  var checkPageButton = document.getElementById('checkPage');

  function OpenInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
  }
  var open_document = function() {
    var eid = '';
    var eid = document.getElementById('episte_id').value;
    if (true || /\w{40}/.test(eid)) {
      OpenInNewTab('http://www.epistemonikos.org/en/documents/'+eid)
    }
  }
  // function _open(e) {
  //   console.log('asdfadsf');
  //   if (e.keyCode == 13) {
  //     open_document();
  //   }
  //   return false;
  // }
  checkPageButton.addEventListener('click', open_document, false);

  $('#episte-form').submit(function(e){
    e.preventDefault();
    open_document();
    return false; // just to be sure.
});

}, false);