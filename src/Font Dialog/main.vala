#! /usr/bin/env -S vala workbench.vala --pkg gtk4

private Gtk.FontDialog dialog_custom;

async void on_clicked () {
    try {
        var family = yield dialog_custom.choose_family (workbench.window, null, null);

        message (@"Font Family: $(family.get_name())");
    } catch (Error err) {
        warning ("Error: %s\n", err.message);
    }
}

public void main () {
    var font_dialog_button = (Gtk.FontDialogButton) workbench.builder.get_object ("font_dialog_button");
    var custom_button = (Gtk.Button) workbench.builder.get_object ("custom_button");

    var dialog_standard = new Gtk.FontDialog () {
        title = "Select a Font",
        modal = true
    };

    font_dialog_button.dialog = dialog_standard;

    font_dialog_button.notify["font-desc"].connect (() => {
        var font_name = font_dialog_button.get_font_desc ().to_string ();
        message (@"Font: $(font_name)");
    });

    dialog_custom = new Gtk.FontDialog () {
        title = "Select a Font Family",
        modal = true
    };

    custom_button.clicked.connect (on_clicked);
}
