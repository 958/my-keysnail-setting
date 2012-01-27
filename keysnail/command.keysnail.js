
// exit command
shell.add(['exit', 'q[uit]'], 'exit', function() goQuitApplication(), {});

// Firefox Sync command
shell.add('sync', 'Sync', function() window.gSyncUI.doSync(), {});
