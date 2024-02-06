#! /usr/bin/env -S vala workbench.vala --pkg gtk4 --pkg libadwaita-1

public void main () {
    var button_confirmation = workbench.builder.get_object ("button_confirmation") as Gtk.Button;
    var button_error = workbench.builder.get_object ("button_error") as Gtk.Button;
    var button_advanced = workbench.builder.get_object ("button_advanced") as Gtk.Button;

    button_confirmation.clicked.connect (create_confirmation_dialog.begin);
    button_error.clicked.connect (create_error_dialog.begin);
    button_advanced.clicked.connect (create_advanced_dialog.begin);
}

private async void create_confirmation_dialog (Gtk.Button button) {
    Adw.AlertDialog dialog = new Adw.AlertDialog (
                                                  "Replace File?",
                                                  """A file named "example.png" already exists. Do you want to replace it?"""
    );

    dialog.close_response = "cancel";

    dialog.add_response ("cancel", "Cancel");
    dialog.add_response ("replace", "Replace");

    // Use DESTRUCTIVE to draw attention to the potentially damaging consequences of using response.
    dialog.set_response_appearance ("replace", Adw.ResponseAppearance.DESTRUCTIVE);

    var response = yield dialog.choose (workbench.window, null);

    message ("Selected \"%s\" response.\n", response);
}

private async void create_error_dialog (Gtk.Button button) {
    Adw.AlertDialog dialog = new Adw.AlertDialog (
                                                  "Critical Error",
                                                  "You did something you should not have"
    );

    dialog.close_response = "okay";

    dialog.add_response ("okay", "Okay");


    var response = yield dialog.choose (workbench.window, null);

    message ("Selected \"%s\" response.\n", response);
}

private async void create_advanced_dialog (Gtk.Button button) {
    Adw.AlertDialog dialog = new Adw.AlertDialog (
                                                  "Login",
                                                  "A valid password is needed to continue"
    );

    dialog.close_response = "cancel";
    dialog.add_response ("cancel", "Cancel");
    dialog.add_response ("login", "Login");
    dialog.set_response_appearance ("login", Adw.ResponseAppearance.SUGGESTED);

    var entry = new Gtk.PasswordEntry () {
        show_peek_icon = true
    };

    dialog.set_extra_child (entry);

    var response = yield dialog.choose (workbench.window, null);


    if (dialog.get_response_label (response) == "Login") {
        message ("Selected \"%s\" response with password \"%s\".", response, entry.get_text ());
    } else {
        message ("Selected \"%s\" response.", response);
    }
}
