#! /usr/bin/env -S vala workbench.vala --pkg libadwaita-1

public void main () {
    var button_single = (Gtk.Button) workbench.builder.get_object ("button_single");
    var button_image = (Gtk.Button) workbench.builder.get_object ("button_image");
    var button_multiple = (Gtk.Button) workbench.builder.get_object ("button_multiple");

    button_single.clicked.connect (open_single.begin);
    button_image.clicked.connect (open_image.begin);
    button_multiple.clicked.connect (open_multiple.begin);
}

private async void open_single () {
    var file_dialog = new Gtk.FileDialog () {
    };

    try {
        File file = yield file_dialog.open (workbench.window, null);

        FileInfo info = file.query_info ("standard::name", NONE, null);

        message (@"Selected file: $(info.get_name ())");
    } catch (Error e) {
        critical (e.message);
    }
}

private async void open_image () {
    var image_filter = new Gtk.FileFilter ();

    image_filter.add_mime_type ("image/*");

    var file_dialog = new Gtk.FileDialog () {
        default_filter = image_filter
    };

    try {
        File file = yield file_dialog.open (workbench.window, null);

        FileInfo info = file.query_info ("standard::name", NONE, null);
        message (@"Selected file: $(info.get_name ())");
    } catch (Error e) {
        critical (e.message);
    }
}

private async void open_multiple () {
    var file_dialog = new Gtk.FileDialog ();
    try {
        ListModel files = yield file_dialog.open_multiple (workbench.window, null);

        message (@"Number of selected files: $(files.get_n_items ())");
    } catch (Error e) {
        critical (e.message);
    }
}
