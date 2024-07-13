public void main () {
    Gtk.init ();

    var button = (Gtk.Button) workbench.builder.get_object ("button");
    var spinner = (Gtk.Spinner) workbench.builder.get_object ("spinner");

    button.clicked.connect (() => {
        if (spinner.visible) {
            button.icon_name = "media-playback-start";
            spinner.visible = false;
        } else {
            button.icon_name = "media-playback-stop";
            spinner.visible = true;
        }
    });
}
