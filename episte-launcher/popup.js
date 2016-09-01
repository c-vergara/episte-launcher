document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('command').focus();


  var DOMAIN = '';
  var EPISTE_DOMAIN = 'www.epistemonikos.org';
  load_custom_domain()

  function OpenInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
  }

  function toggleMessage(mid, show) {
    var show = show || false;
    if (show) {
      document.getElementById(mid).style.display = 'block';
    } else {
      document.getElementById(mid).style.display = 'none';
    }
  }

  var run_command = function (event) {
    toggleMessage('error-msg');
    toggleMessage('local-unset-msg');
    event.preventDefault();

    var command = (document.getElementById('command').value || '').trim();
    var epid_regex = /^\w{40}$/;
    var epid_comm_regex = /^([lms])-(.*)$/;

    if (epid_regex.test(command)) {
      OpenInNewTab('http://'+DOMAIN+'/en/documents/'+command)
    } else if (command == 'd') {
      OpenInNewTab('http://'+DOMAIN+'/en/documents')
    } else if (command == 'u') {
      OpenInNewTab('http://'+DOMAIN+'/en/documents/upload_document')
    } else if (command == 'm') {
      OpenInNewTab('http://'+DOMAIN+'/en/matrixes')
    } else if (command == 'l') {
        chrome.tabs.getSelected(null, function(tab) {
          var _match = tab.url.match(/documents\/(\w{40})/);
          var current_eid = _match.length == 2 ? _match[1] : null;
          if ( current_eid ) {
            OpenInNewTab('http://'+DOMAIN+'/en/documents/'+current_eid+'/linker')
          }
        });
    } else if (command == 'tp' || command == 'tl') {
        chrome.storage.local.get(['epla_local_domain'], function(val) {

          if (val['epla_local_domain']) {
              chrome.tabs.getSelected(null, function(tab) {
                  var new_url = '';
                  if (command == 'tl') {
                    new_url = tab.url.replace(EPISTE_DOMAIN, val['epla_local_domain']);
                  } else {
                    new_url = tab.url.replace(val['epla_local_domain'], EPISTE_DOMAIN);
                  }
                  OpenInNewTab(new_url)
              });
          }
          else {
            toggleMessage('local-unset-msg', true);
          }
        });

    } else if (epid_comm_regex.test(command)) {
      try {
        var match = epid_comm_regex.exec(command);
        var comm = match[1];
        var eid = match[2];
        if (comm == 'l') {
          if (! epid_regex.test(eid)) { throw 'Invalid Episte ID'}
          OpenInNewTab('http://'+DOMAIN+'/en/documents/'+eid+'/linker')
        } else if (comm == 'm') {
          if (! epid_regex.test(eid)) { throw 'Invalid Episte ID'}
          OpenInNewTab('http://'+DOMAIN+'/en/documents/'+eid+'/matrix')
        } else if (comm == 's') {
          OpenInNewTab('http://'+DOMAIN+'/en/search?q='+eid)
        }
      } catch (e) {
        toggleMessage('error-msg', true);
      }
    } else {
      toggleMessage('error-msg', true);
    }
  };

  function load_custom_domain() {
    chrome.storage.local.get(['epla_use_local_domain', 'epla_local_domain'], function(val) {

        document.getElementById('domain').value = (val['epla_local_domain']|| '');
        if (val['epla_use_local_domain']) {
            document.getElementById('use_local_domain').checked = true;
            DOMAIN = (val['epla_local_domain']|| EPISTE_DOMAIN);
        }
        else {
          DOMAIN = EPISTE_DOMAIN;
        }

    });
  };

  var set_domain = function (event) {
    toggleMessage('local-domain-msg');
    var dom = document.getElementById('domain').value.trim();
    if (dom.length > 0) {
      chrome.storage.local.set({'epla_local_domain': dom}, function (result) {
        load_custom_domain();
        toggleMessage('local-domain-msg', true);
      })
    }
  };

  var clear_domain = function (event) {
    toggleMessage('local-domain-msg');
    chrome.storage.local.remove('epla_local_domain', function (result) {
      document.getElementById('domain').value = '';
      load_custom_domain()
      toggleMessage('local-domain-msg', true);
    })
  };

  var use_local_domain = function (event) {
    toggleMessage('local-domain-msg');
    var do_use = document.getElementById('use_local_domain').checked;
    if (do_use) {
      chrome.storage.local.set({'epla_use_local_domain': do_use}, function (result) {
        load_custom_domain();
      });
    } else {
      chrome.storage.local.remove('epla_use_local_domain', function (result) {
        load_custom_domain();
      });
    }
  };

  document.getElementById('epla-form').addEventListener('submit', run_command, false);
  document.getElementById('set_domain').addEventListener('click', set_domain, false);
  document.getElementById('clear_domain').addEventListener('click', clear_domain, false);
  document.getElementById('use_local_domain').addEventListener('click', use_local_domain, false);

}, false);