document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('episte_id').focus();
  var checkPageButton = document.getElementById('checkPage');

  function OpenInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
  }

  var open_document = function() {
    var eid = '';
    var eid = document.getElementById('episte_id').value;
    if (/\w{40}/.test(eid)) {
      OpenInNewTab('http://www.epistemonikos.org/en/documents/'+eid)
    } else if (eid == 'd') {
      OpenInNewTab('http://www.epistemonikos.org/en/documents')

    } else if (eid == 'l') {
      chrome.tabs.getSelected(null, function(tab) {
        var _match = tab.url.match(/documents\/(\w{40})/);
        var current_eid = _match.length == 2 ? _match[1] : null;
        if ( current_eid ) {
          OpenInNewTab('http://www.epistemonikos.org/en/documents/'+current_eid+'/linker')
        }

      });
    };
  }

  checkPageButton.addEventListener('click', open_document, false);

  $('#episte-form').submit(function(e){
    e.preventDefault();
    open_document();
    return false; // just to be sure.
  });

}, false);