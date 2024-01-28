#! /usr/bin/env -S vala workbench.vala --pkg libadwaita-1

private Adw.Avatar avatar_image;

var file_filter = new Gtk.FileFilter ();
file_filter.add_pixbuf_formats ();

public void main () {
    avatar_image = (Adw.Avatar) workbench.builder.get_object ("avatar_image");
    var button = (Gtk.Button) workbench.builder.get_object ("button");
    button.clicked.connect (select_image.begin);
}

private async void select_image () {
    var file_dialog = new Gtk.FileDialog () {
        title = "Select an Avatar",
        modal = true,
        default_filter = file_filter
    };

    try {
        File file = yield file_dialog.open (workbench.window, null);

        avatar_image.custom_image = Gdk.Texture.from_file (file);
    } catch (Error e) {
        critical (e.message);
    }
}

