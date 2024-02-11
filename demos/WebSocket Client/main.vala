#! /usr/bin/env -S vala workbench.vala --pkg gtk4 --pkg libadwaita-1 --pkg libsoup-3.0

private Gtk.Button button_connect;
private Gtk.Button button_disconnect;
private Gtk.Button button_send;
private Soup.WebsocketConnection connection;

public void main () {
    button_connect = workbench.builder.get_object ("button_connect") as Gtk.Button;
    button_disconnect = workbench.builder.get_object ("button_disconnect") as Gtk.Button;
    button_send = workbench.builder.get_object ("button_send") as Gtk.Button;
    var entry_message = workbench.builder.get_object ("entry_message") as Gtk.Entry;

    button_connect.clicked.connect (connect.begin);

    button_disconnect.clicked.connect (() => {
        connection.close (Soup.WebsocketCloseCode.NORMAL, null);
    });

    button_send.clicked.connect (() => {
        var text = entry_message.get_text ();
        send (text);
    });
}

private async void connect () {
    var entry_url = workbench.builder.get_object ("entry_url") as Gtk.Entry;

    try {
        var uri = GLib.Uri.parse (entry_url.get_text (), GLib.UriFlags.NONE).to_string ();
        var session = new Soup.Session ();
        var message = new Soup.Message ("GET", uri);

        // https://valadoc.org/libsoup-3.0/Soup.Session.websocket_connect_async.html
        connection = yield session.websocket_connect_async (message,
            null,
            null,
            1,
            null);
    } catch (Error err) {
        stderr.printf ("error: " + err.message + "\n");
        return;
    }

    connection.closed.connect (onClosed);
    connection.error.connect (onError);
    connection.message.connect (onMessage);

    onOpen ();
}

private void onOpen () {
    stdout.printf ("open\n");
    button_connect.set_sensitive (false);
    button_disconnect.set_sensitive (true);
    button_send.set_sensitive (true);
}

private void onClosed () {
    stdout.printf ("closed\n");
    connection = null;
    button_connect.set_sensitive (true);
    button_disconnect.set_sensitive (false);
    button_send.set_sensitive (false);
}

private void onError (Error err) {
    stdout.printf ("error\n");
    stderr.printf (err.message);
}

private void onMessage (int type, Bytes message) {
    if (type != Soup.WebsocketDataType.TEXT)return;
    string text = (string) message.get_data ();
    stdout.printf ("received: " + text + "\n");
}

private void send (string text) {
    stdout.printf ("sent: " + text + "\n");
    connection.send_text (text);
}
