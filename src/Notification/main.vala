#! /usr/bin/env -S vala workbench.vala --pkg libadwaita-1 --pkg gio-2.0

// private Gtk.Application application;

public class Application : Gtk.Application {
    public Application () {
        Object (application_id: "testing.my.application",
                flags: ApplicationFlags.FLAGS_NONE);
    }
}

public void main () {
    Application application = new Application ();

    // https://gjs-docs.gnome.org/gio20/gio.notification
    Notification notification = new Notification ("Lunch is ready");
    notification.set_body ("Today we have pancakes and salad, and fruit and cake for dessert");
    notification.set_default_action ("app.notification-reply");
    notification.add_button ("Accept", "app.notification-accept");
    notification.add_button ("Decline", "app.notification-decline");

    var icon = new ThemedIcon ("object-rotate-right-symbolic");
    notification.set_icon (icon);

    var button_simple = (Gtk.Button) workbench.builder.get_object ("button_simple");
    button_simple.clicked.connect (() => {
        application.send_notification ("lunch-is-ready", notification);
    });

    SimpleAction action_reply = new SimpleAction ("notification-reply", null);
    action_reply.activate.connect (() => {
        message (@"Reply");
    });
    application.add_action (action_reply);

    SimpleAction action_accept = new SimpleAction ("notification-accept", null);
    action_accept.activate.connect (() => {
        message (@"Accept");
    });
    application.add_action (action_accept);

    SimpleAction action_decline = new SimpleAction ("notification-decline", null);
    action_decline.activate.connect (() => {
        message (@"Decline");
    });
    application.add_action (action_decline);
}
